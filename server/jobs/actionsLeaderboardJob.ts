// jobs/actionsLeaderboardJob.ts
import { agenda } from "../helpers/agenda";
import { ReportSubscription } from "../models/domain/ReportSubscription";
import { buildLeadershipDashboardReport } from "../services/reports/buildLeadershipDashboardReport";
import { emailReport } from "../controllers/MailController";
import { renderCsvForSubscription } from "../helpers/reports/renderers";

import puppeteer from "puppeteer";

export const JOB_NAME = "send_leadership_dashboard_report";

agenda.define(JOB_NAME, { concurrency: 5 }, async (job: any) => {
  const { subscriptionId } = job.attrs.data as { subscriptionId: string };

  const sub = await ReportSubscription.findById(subscriptionId).lean();
  if (!sub || sub.isEnabled === false) return;

  try {
    const format = sub.delivery?.format;

    const wantsInline =
      format === "email_html" ||
      format === "both" ||
      format === "email_csv";

    const wantsPdf = format === "pdf" || format === "both";

    const wantsCsv = format === "csv" || format === "email_csv";

    // 1) generate report data + html
    const report = await buildLeadershipDashboardReport({
      companyId: String(sub.companyId),
      teamId: String(sub.reportConfig?.teamId ?? "99"),
      weekChoice: sub.reportConfig?.weekChoice === "last" ? "last" : "this",
      timezone: sub.timezone,
    });

    const subject = sub.delivery?.subject?.trim() || report.subject || sub.name;

    // 2) resolve recipients
    const toEmails = await resolveRecipientEmails(sub.recipients);
    if (!toEmails.length) return;

    // 3) build CSV attachment (if requested)
    let csvBuffer: Buffer | undefined;
    let csvFilename: string | undefined;

    if (wantsCsv) {
      const csv = await renderCsvForSubscription(sub.reportType as any, {
        companyId: String(sub.companyId),
        reportConfig: sub.reportConfig,
        timezone: sub.timezone,
      } as any);

      csvBuffer = csv.buffer;
      csvFilename = csv.filename;
    }

    // 4) build PDF buffer (if requested) — GENERATED HERE
    let pdfBuffer: Buffer | undefined;

    if (wantsPdf) {
      // Use the same wrapped HTML so the PDF matches what you'd see in email
      const pdfHtml = wrapEmail(sub, report.html);
      pdfBuffer = await htmlToPdfBuffer(pdfHtml);
    }

    // 5) email body
    const html = wantsInline
      ? wrapEmail(sub, report.html)
      : wrapEmail(sub, `<p>Your report is attached.</p>`);

    // 6) send email (SendGrid via your MailController)
    await emailReport({
      to: toEmails,
      subject,
      html,
      pdfBuffer,
      csvBuffer,
      csvFilename,
      companyId: String(sub.companyId)
    });

    await ReportSubscription.updateOne(
      { _id: sub._id },
      {
        $set: {
          lastRunAt: new Date(),
          lastStatus: "success",
          lastError: "",
        },
      }
    );
  } catch (err: any) {
    await ReportSubscription.updateOne(
      { _id: sub._id },
      {
        $set: {
          lastRunAt: new Date(),
          lastStatus: "error",
          lastError: String(err?.message || err),
        },
      }
    );

    throw err; // allow Agenda to record failure / retry if configured
  }
});

async function htmlToPdfBuffer(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

async function resolveRecipientEmails(recipients: any[]) {
  const emails: string[] = [];

  for (const r of recipients || []) {
    if (r.type === "email" && r.email) {
      emails.push(r.email);
    }

    if (r.type === "user" && r.userId) {
      const user = await require("../models/domain/User")
        .findById(r.userId)
        .select("email")
        .lean();

      if (user?.email) emails.push(user.email);
    }
  }

  return Array.from(new Set(emails.map((e) => e.trim().toLowerCase()))).filter(Boolean);
}

function wrapEmail(sub: any, bodyHtml: string) {
  const msg = sub.delivery?.message?.trim();

  return `
    <div style="font-family: Arial, sans-serif; line-height:1.4;">
      ${msg ? `<p>${escapeHtml(msg)}</p>` : ""}
      ${bodyHtml}
      <hr />
      <p style="font-size:12px;color:#666">
        Manage this subscription in SalesDoing → Leadership Dashboard → Scheduled Reports
      </p>
    </div>
  `;
}

function escapeHtml(s: string) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      } as any)[c]
  );
}
