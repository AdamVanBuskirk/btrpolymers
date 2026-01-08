import { agenda } from "../helpers/agenda";
import { ReportSubscription } from "../models/domain/ReportSubscription";
import { JOB_NAME } from "../jobs/actionsLeaderboardJob";

import { addDays, addMonths, getDaysInMonth, isBefore, set } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export async function upsertSubscriptionJob(subscriptionId: string) {
  const sub = await ReportSubscription.findById(subscriptionId).lean();
  if (!sub) return;

  // remove old job(s) for this subscription
  await agenda.cancel({ name: JOB_NAME, "data.subscriptionId": subscriptionId });

  if (sub.isEnabled === false) return;

  const nextRun = computeNextRunAt(sub);
  if (!nextRun) return;

  // schedule a single-run job at nextRun
  await agenda.schedule(nextRun, JOB_NAME, { subscriptionId });
}

/**
 * After a run completes, we re-schedule the next one.
 * Easiest: in the job itself, call upsertSubscriptionJob() at the end.
 * Or use an Agenda "complete" hook.
 *
 * Returns a UTC Date suitable for Agenda.schedule(...)
 */
export function computeNextRunAt(sub: any): Date | null {
  const tz = sub.timezone || "America/New_York";

  const [hh, mm] = String(sub.schedule?.timeOfDay || "09:00")
    .split(":")
    .map((n: string) => Number(n));

  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;

  const nowUtc = new Date();
  const nowZoned = toZonedTime(nowUtc, tz);

  // base time: today at hh:mm in timezone
  let candidateZoned = set(nowZoned, {
    hours: hh,
    minutes: mm,
    seconds: 0,
    milliseconds: 0,
  });

  // ensure in future
  if (!isBefore(nowZoned, candidateZoned)) {
    candidateZoned = addDays(candidateZoned, 1);
  }

  const freq = sub.schedule?.frequency;

  // --------------------
  // Daily
  // --------------------
  if (freq === "daily") {
    return fromZonedTime(candidateZoned, tz);
  }

  // --------------------
  // Weekly
  // daysOfWeek uses JS convention: 0(Sun) ... 6(Sat)
  // --------------------
  if (freq === "weekly") {
    const days: number[] = Array.isArray(sub.schedule?.daysOfWeek)
      ? sub.schedule.daysOfWeek.map((d: any) => Number(d)).filter((d: any) => Number.isFinite(d))
      : [];

    const allowed = days.length ? days : [1]; // default Monday

    for (let i = 0; i < 14; i++) {
      const d = addDays(candidateZoned, i);
      const dow = d.getDay();

      if (allowed.includes(dow) && isBefore(nowZoned, d)) {
        return fromZonedTime(d, tz);
      }
    }

    // fallback (should rarely hit)
    return fromZonedTime(candidateZoned, tz);
  }

  // --------------------
  // Monthly
  // --------------------
  if (freq === "monthly") {
    const domRaw = Number(sub.schedule?.dayOfMonth || 1);
    const dom = Number.isFinite(domRaw) ? domRaw : 1;

    // clamp day-of-month to the current month
    let d = candidateZoned;
    d = set(d, { date: Math.min(dom, getDaysInMonth(d)) });

    // if candidate already passed, move to next month
    if (!isBefore(nowZoned, d)) {
      const nextMonth = addMonths(d, 1);
      d = set(nextMonth, { date: Math.min(dom, getDaysInMonth(nextMonth)) });
    }

    return fromZonedTime(d, tz);
  }

  return null;
}
