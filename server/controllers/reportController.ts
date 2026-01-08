// controllers/reportController.ts
import { Request, Response } from "express";
import { getUser } from "../helpers/getUser";
import { buildLeadershipDashboardDataService } from "../services/reports/buildLeadershipDashboardDataService";
import mongoose from "mongoose";
import { agenda } from "../helpers/agenda";

// ✅ Your schema model export
import { ReportSubscription } from "../models/domain/ReportSubscription";

// ✅ Your helper that schedules the next run (and cancels old schedule for subscriptionId)
import { upsertSubscriptionJob } from "../helpers/scheduleSubscription";

// ✅ Job names by report type (adjust to your actual job names)
import { JOB_NAME as LEADERSHIP_JOB_NAME } from "../jobs/actionsLeaderboardJob";


export const getActionsLeaderboardReport = async (req: Request, res: Response) => {
  const { companyId, teamId, weekChoice } = req.params as {
    companyId: string;
    teamId: string;
    weekChoice: "this" | "last";
  };

  const timezone = String(req.query.timezone || "America/New_York");

  const foundUser = await getUser(req.cookies, "company", companyId);
  if (!foundUser) return res.status(403).json({ message: "Not authorized." });

  try {
    const payload = await buildLeadershipDashboardDataService({
      companyId,
      teamId,
      weekChoice: weekChoice === "last" ? "last" : "this",
      timezone
    });

    return res.status(200).json(payload);
  } catch (err: any) {
    console.log(err?.message || err);
    const msg = String(err?.message || "Server error.");

    // keep your existing semantics, but make invalid IDs clearer
    if (msg.toLowerCase().includes("invalid companyid") || msg.toLowerCase().includes("invalid teamid")) {
      return res.status(400).json({ message: msg });
    }

    if (msg.toLowerCase().includes("team not found")) {
      return res.status(404).json({ message: msg });
    }

    return res.status(500).json({ message: "Server error." });
  }
};

const JOB_NAME_BY_REPORT_TYPE: Record<string, string> = {
  leadership_dashboard: LEADERSHIP_JOB_NAME,
  actions_leaderboard: LEADERSHIP_JOB_NAME, // swap to ACTIONS_JOB_NAME if you add one
};

const isValidObjectId = (id: any) => mongoose.Types.ObjectId.isValid(String(id));

const normalizeEmail = (s: any) => String(s || "").trim().toLowerCase();

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function jobNameFor(reportType: string) {
  const job = JOB_NAME_BY_REPORT_TYPE[String(reportType || "").trim()];
  if (!job) throw new Error(`Unknown reportType: ${reportType}`);
  return job;
}

async function assertCompanyAuth(req: Request, companyId: string) {
  const foundUser = await getUser(req.cookies, "company", companyId);
  return foundUser || null;
}

function sanitizeRecipients(recipients: any[]) {
  const cleaned: any[] = [];

  for (const r of recipients || []) {
    if (r?.type === "email") {
      const email = normalizeEmail(r.email);
      if (!email) continue;
      cleaned.push({ type: "email", email, name: String(r.name || "").trim() || undefined });
      continue;
    }

    if (r?.type === "user") {
      const userId = String(r.userId || "").trim();
      if (!userId || !isValidObjectId(userId)) continue;
      cleaned.push({ type: "user", userId, name: String(r.name || "").trim() || undefined });
      continue;
    }
  }

  const emails = uniq(cleaned.filter((x) => x.type === "email").map((x) => x.email));
  const userIds = uniq(cleaned.filter((x) => x.type === "user").map((x) => String(x.userId)));

  return [
    ...emails.map((email) => ({ type: "email", email })),
    ...userIds.map((userId) => ({ type: "user", userId })),
  ];
}

function sanitizeSchedule(schedule: any) {
  const frequency = String(schedule?.frequency || "").trim();
  const timeOfDay = String(schedule?.timeOfDay || "09:00").trim(); // "HH:mm"

  if (!["daily", "weekly", "monthly"].includes(frequency)) {
    throw new Error("Invalid schedule.frequency. Expected daily, weekly, monthly.");
  }

  if (!/^\d{2}:\d{2}$/.test(timeOfDay)) {
    throw new Error('Invalid schedule.timeOfDay. Expected "HH:mm".');
  }

  const [hh, mm] = timeOfDay.split(":").map((x) => Number(x));
  if (!Number.isFinite(hh) || !Number.isFinite(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
    throw new Error('Invalid schedule.timeOfDay. Expected "HH:mm".');
  }

  const daysOfWeekRaw = Array.isArray(schedule?.daysOfWeek) ? schedule.daysOfWeek : [];
  const daysOfWeek = uniq(
    daysOfWeekRaw
      .map((n: any) => Number(n))
      .filter((n: number) => Number.isFinite(n) && n >= 0 && n <= 6)
  );

  const dayOfMonthRaw = Number(schedule?.dayOfMonth);
  const dayOfMonth =
    Number.isFinite(dayOfMonthRaw) ? Math.max(1, Math.min(31, dayOfMonthRaw)) : undefined;

  return {
    frequency,
    timeOfDay,
    daysOfWeek: frequency === "weekly" ? (daysOfWeek.length ? daysOfWeek : [1]) : [],
    dayOfMonth: frequency === "monthly" ? (dayOfMonth ?? 1) : undefined,
  };
}

function sanitizeDelivery(delivery: any) {
  const format = String(delivery?.format || "email_html").trim();

  // ✅ IMPORTANT: matches your schema enums
  if (!["email_html", "pdf", "both", "csv", "email_csv"].includes(format)) {
    throw new Error("Invalid delivery.format. Expected email_html, pdf, both.");
  }

  const subject = String(delivery?.subject || "").trim();
  const message = String(delivery?.message || "").trim();

  return { format, subject, message };
}

// ------------------------------------------------------------
// POST /subscriptions  (create)
// ------------------------------------------------------------
export const createSubscription = async (req: Request, res: Response) => {
  try {
    const {
      companyId,
      name,
      reportType,
      reportConfig,
      recipients,
      timezone,
      schedule,
      delivery,
      isEnabled,
    } = req.body || {};

    if (!companyId || !isValidObjectId(companyId)) {
      return res.status(400).json({ message: "Invalid companyId." });
    }

    const authed = await assertCompanyAuth(req, String(companyId));
    if (!authed) return res.status(403).json({ message: "Not authorized." });

    if (!String(name || "").trim()) return res.status(400).json({ message: "Name is required." });
    if (!String(reportType || "").trim()) return res.status(400).json({ message: "reportType is required." });

    // validate reportType
    jobNameFor(String(reportType));

    const safeRecipients = sanitizeRecipients(recipients);
    if (!safeRecipients.length) return res.status(400).json({ message: "At least one recipient is required." });

    const safeSchedule = sanitizeSchedule(schedule);
    const safeDelivery = sanitizeDelivery(delivery);

    const doc = await ReportSubscription.create({
      companyId,
      createdByUserId: authed._id,

      name: String(name).trim(),
      reportType: String(reportType).trim(),
      reportConfig: reportConfig || {},

      recipients: safeRecipients,

      timezone: String(timezone || "America/New_York").trim() || "America/New_York",

      schedule: safeSchedule,
      delivery: safeDelivery,

      isEnabled: isEnabled !== false,

      lastRunAt: undefined,
      lastStatus: "never ran",
      lastError: "",
    });

    if (doc.isEnabled !== false) {
      await upsertSubscriptionJob(String(doc._id));
    }

    return res.status(201).json(doc);
  } catch (err: any) {
    console.log(err?.message || err);
    return res.status(500).json({ message: String(err?.message || "Server error.") });
  }
};

// ------------------------------------------------------------
// PUT /subscriptions/:id  (update)
// ------------------------------------------------------------
export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "");
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid subscription id." });

    const existing = await ReportSubscription.findById(id).lean();
    if (!existing) return res.status(404).json({ message: "Subscription not found." });

    const authed = await assertCompanyAuth(req, String(existing.companyId));
    if (!authed) return res.status(403).json({ message: "Not authorized." });

    const patch = req.body || {};
    const update: any = {};

    if (patch.name !== undefined) {
      const n = String(patch.name || "").trim();
      if (!n) return res.status(400).json({ message: "Name cannot be blank." });
      update.name = n;
    }

    if (patch.reportConfig !== undefined) update.reportConfig = patch.reportConfig || {};

    if (patch.recipients !== undefined) {
      const safeRecipients = sanitizeRecipients(patch.recipients);
      if (!safeRecipients.length) return res.status(400).json({ message: "At least one recipient is required." });
      update.recipients = safeRecipients;
    }

    if (patch.timezone !== undefined) {
      update.timezone = String(patch.timezone || "America/New_York").trim() || "America/New_York";
    }

    if (patch.schedule !== undefined) {
      update.schedule = sanitizeSchedule(patch.schedule);
    }

    if (patch.delivery !== undefined) {
      update.delivery = sanitizeDelivery(patch.delivery);
    }

    if (patch.isEnabled !== undefined) {
      update.isEnabled = patch.isEnabled !== false;
    }

    const updated = await ReportSubscription.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    ).lean();

    // reschedule/cancel
    if (updated?.isEnabled === false) {
      const jobName = jobNameFor(String(updated.reportType));
      await agenda.cancel({ name: jobName, "data.subscriptionId": id });
    } else {
      await upsertSubscriptionJob(id);
    }

    return res.status(200).json(updated);
  } catch (err: any) {
    console.log(err?.message || err);
    return res.status(500).json({ message: String(err?.message || "Server error.") });
  }
};

// ------------------------------------------------------------
// POST /subscriptions/:id/enable
// ------------------------------------------------------------
export const enableSubscription = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "");
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid subscription id." });

    const existing = await ReportSubscription.findById(id).lean();
    if (!existing) return res.status(404).json({ message: "Subscription not found." });

    const authed = await assertCompanyAuth(req, String(existing.companyId));
    if (!authed) return res.status(403).json({ message: "Not authorized." });

    const updated = await ReportSubscription.findByIdAndUpdate(
      id,
      { $set: { isEnabled: true } },
      { new: true }
    ).lean();

    await upsertSubscriptionJob(id);

    return res.status(200).json(updated);
  } catch (err: any) {
    console.log(err?.message || err);
    return res.status(500).json({ message: String(err?.message || "Server error.") });
  }
};

// ------------------------------------------------------------
// POST /subscriptions/:id/disable
// ------------------------------------------------------------
export const disableSubscription = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "");
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid subscription id." });

    const existing = await ReportSubscription.findById(id).lean();
    if (!existing) return res.status(404).json({ message: "Subscription not found." });

    const authed = await assertCompanyAuth(req, String(existing.companyId));
    if (!authed) return res.status(403).json({ message: "Not authorized." });

    const updated = await ReportSubscription.findByIdAndUpdate(
      id,
      { $set: { isEnabled: false } },
      { new: true }
    ).lean();

    const jobName = jobNameFor(String(existing.reportType));
    await agenda.cancel({ name: jobName, "data.subscriptionId": id });

    return res.status(200).json(updated);
  } catch (err: any) {
    console.log(err?.message || err);
    return res.status(500).json({ message: String(err?.message || "Server error.") });
  }
};

// ------------------------------------------------------------
// POST /subscriptions/:id/run-now
// ------------------------------------------------------------
export const runNow = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id || "");
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid subscription id." });

    const sub = await ReportSubscription.findById(id).lean();
    if (!sub) return res.status(404).json({ message: "Subscription not found." });

    const authed = await assertCompanyAuth(req, String(sub.companyId));
    if (!authed) return res.status(403).json({ message: "Not authorized." });

    const jobName = jobNameFor(String(sub.reportType));
    await agenda.now(jobName, { subscriptionId: id });

    // optional: return the subscription (unchanged)
    const fresh = await ReportSubscription.findById(id).lean();
    return res.status(200).json(fresh);
  } catch (err: any) {
    console.log(err?.message || err);
    return res.status(500).json({ message: String(err?.message || "Server error.") });
  }
};

// ------------------------------------------------------------
// GET /company/:companyId/subscriptions/:reportType
// ------------------------------------------------------------
export const getSubscriptionsByReportType = async (req: Request, res: Response) => {
  try {
    const { companyId, reportType } = req.params as { companyId: string; reportType: string };

    if (!companyId || !isValidObjectId(companyId)) {
      return res.status(400).json({ message: "Invalid companyId." });
    }

    if (!reportType || !String(reportType).trim()) {
      return res.status(400).json({ message: "reportType is required." });
    }

    // validate known report type
    jobNameFor(String(reportType));

    const authed = await assertCompanyAuth(req, String(companyId));
    if (!authed) return res.status(403).json({ message: "Not authorized." });

    const subs = await ReportSubscription.find({
      companyId,
      reportType: String(reportType).trim(),
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(subs);
  } catch (err: any) {
    console.log(err?.message || err);
    return res.status(500).json({ message: String(err?.message || "Server error.") });
  }
};

// controllers/reportController.ts
const deleteSubscription = async (req: Request, res: Response) => {
  try {
    const { id, companyId } = req.params;
    const foundUser = await getUser(req.cookies, "company", companyId);
    if (!foundUser) return res.status(403).json({ message: "Not authorized." });
  
    const deleted = await ReportSubscription.findOneAndDelete({ _id: id });

    if (!deleted) return res.status(404).json({ message: "Subscription not found." });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Failed to delete subscription." });
  }
};



module.exports = { 
  getActionsLeaderboardReport,
  createSubscription,
  updateSubscription,
  enableSubscription,
  disableSubscription,
  runNow,
  getSubscriptionsByReportType,
  deleteSubscription
};
