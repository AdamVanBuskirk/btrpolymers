import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../Core/hooks";
import {
  createSubscription,
  updateSubscription,
  type ReportType,
  type ReportSubscriptionDto,
  getSubscriptionsByReportType, // ✅ add
} from "../Store/ReportSubscriptions";

type Frequency = "daily" | "weekly" | "monthly";
//type Format = "email_html" | "pdf" | "both";
type Format = "email_html" | "pdf" | "both" | "csv" | "email_csv";


type Recipient =
  | { type: "email"; email: string }
  | { type: "user"; userId: string; label?: string };

export type EmailReportModalValue = {
  recipients: Recipient[];
  schedule: {
    frequency: Frequency;
    timeOfDay: string; // "HH:mm"
    timezone: string; // IANA
    daysOfWeek?: number[]; // 0-6 Sun-Sat (weekly)
    dayOfMonth?: number; // 1-31 (monthly)
  };
  delivery: {
    format: Format;
    subject: string;
    message?: string;
  };
};

type Props = {
  isOpen: boolean;
  onClose: () => void;

  reportName: string;
  teamLabel: string;
  weekLabel: string;
  defaultTimezone?: string;

  companyId: string;
  reportType: ReportType;
  reportConfig: any;
  subscriptionId?: string;

  // ✅ NEW: when editing
  initialSubscription?: ReportSubscriptionDto | null;

  users?: Array<{ userId: string; firstName?: string; lastName?: string; email?: string }>;
};

const DEFAULT_TZ = "America/New_York";

const escapeHtml = (s: string) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c]);

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());

const uniqLower = (arr: string[]) =>
  Array.from(new Set(arr.map((x) => x.trim().toLowerCase()))).filter(Boolean);

const US_TIMEZONES = [
  { value: "America/New_York", label: "Eastern - America/New_York" },
  { value: "America/Chicago", label: "Central - America/Chicago" },
  { value: "America/Denver", label: "Mountain - America/Denver" },
  { value: "America/Phoenix", label: "Arizona - America/Phoenix" },
  { value: "America/Los_Angeles", label: "Pacific - America/Los_Angeles" },
  { value: "America/Anchorage", label: "Alaska - America/Anchorage" },
  { value: "Pacific/Honolulu", label: "Hawaii - Pacific/Honolulu" },
];

export default function EmailReportModal({
  isOpen,
  onClose,
  reportName,
  teamLabel,
  weekLabel,
  defaultTimezone,
  companyId,
  reportType,
  reportConfig,
  subscriptionId,
  initialSubscription = null,
  users = [],
}: Props) {
  const dispatch = useAppDispatch();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  // ---- recipients ----
  const [emailInput, setEmailInput] = useState("");
  const [externalEmails, setExternalEmails] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // ---- schedule ----
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [timeOfDay, setTimeOfDay] = useState("09:00");
  const [timezone, setTimezone] = useState(defaultTimezone || DEFAULT_TZ);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1]);
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);

  // ---- delivery ----
  const [format, setFormat] = useState<Format>("email_html");
  const [subject, setSubject] = useState(`${reportName} - ${weekLabel}`);
  const [message, setMessage] = useState("");

  const userOptions = useMemo(() => {
    return (users || []).map((u) => ({
      userId: u.userId,
      label:
        `${(u.firstName || "").trim()} ${(u.lastName || "").trim()}`.trim() ||
        u.email ||
        u.userId,
      email: u.email || "",
    }));
  }, [users]);

// ✅ Prepopulate when editing / Reset when creating
useEffect(() => {
    if (!isOpen) return;
  
    setError("");
    setEmailInput("");
  
    const isEdit = Boolean(subscriptionId && initialSubscription?._id);
  
    // ✅ NEW / CREATE: always hard reset
    if (!isEdit) {
      setExternalEmails([]);
      setSelectedUserIds([]);
      setFrequency("weekly");
      setTimeOfDay("09:00");
      setTimezone(defaultTimezone || DEFAULT_TZ);
      setDaysOfWeek([1]);
      setDayOfMonth(1);
      setFormat("email_html");
      setSubject(`${reportName} - ${weekLabel}`);
      setMessage("");
      return;
    }
  
    // ✅ EDIT: prepopulate from subscription
    const sub = initialSubscription as any;
  
    // recipients
    const recips: Recipient[] = Array.isArray(sub.recipients) ? sub.recipients : [];
    const emails = recips
      .filter((r: any) => r?.type === "email" && r?.email && isValidEmail(r.email))
      .map((r: any) => String(r.email).trim().toLowerCase());
    const userIds = recips
      .filter((r: any) => r?.type === "user" && r?.userId)
      .map((r: any) => String(r.userId));
  
    setExternalEmails(uniqLower(emails));
    setSelectedUserIds(Array.from(new Set(userIds)));
  
    // schedule
    const sched = sub.schedule || {};
    const f = (sched.frequency || "weekly") as Frequency;
    setFrequency(f);
  
    setTimeOfDay(sched.timeOfDay ? String(sched.timeOfDay) : "09:00");
    setTimezone(String(sched.timezone || sub.timezone || defaultTimezone || DEFAULT_TZ));
  
    if (f === "weekly") {
      const dows = Array.isArray(sched.daysOfWeek) ? sched.daysOfWeek : [1];
      setDaysOfWeek(dows.length ? dows : [1]);
    } else {
      setDaysOfWeek([1]);
    }
  
    if (f === "monthly") {
      const dom = Number(sched.dayOfMonth || 1);
      setDayOfMonth(Number.isFinite(dom) && dom >= 1 && dom <= 31 ? dom : 1);
    } else {
      setDayOfMonth(1);
    }
  
    // delivery
    const del = sub.delivery || {};
    setFormat(del.format ? (del.format as Format) : "email_html");
    setSubject(del.subject ? String(del.subject) : `${reportName} - ${weekLabel}`);
    setMessage(String(del.message || ""));
  }, [
    isOpen,
    subscriptionId,
    initialSubscription?._id, // ✅ key on id, not object identity
    reportName,
    weekLabel,
    defaultTimezone,
  ]);
  

  const addExternalEmail = () => {
    const raw = emailInput.trim();
    if (!raw) return;

    const parts = raw.split(/[,\s]+/).map((x) => x.trim()).filter(Boolean);
    const good = parts.filter(isValidEmail);
    if (!good.length) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setExternalEmails((prev) => uniqLower([...prev, ...good]));
    setEmailInput("");
  };

  const removeExternalEmail = (email: string) => {
    setExternalEmails((prev) => prev.filter((e) => e !== email));
  };

  const toggleDow = (dow: number) => {
    setDaysOfWeek((prev) => {
      const has = prev.includes(dow);
      const next = has ? prev.filter((x) => x !== dow) : [...prev, dow];
      return next.length ? next : [1];
    });
  };

  const buildPayload = (): EmailReportModalValue => {
    const recipients: Recipient[] = [
      ...externalEmails.map((email) => ({ type: "email" as const, email })),
      ...selectedUserIds.map((userId) => ({ type: "user" as const, userId })),
    ];

    return {
      recipients,
      schedule: {
        frequency,
        timeOfDay,
        timezone,
        daysOfWeek: frequency === "weekly" ? daysOfWeek : undefined,
        dayOfMonth: frequency === "monthly" ? dayOfMonth : undefined,
      },
      delivery: {
        format,
        subject: subject.trim() || `${reportName} - ${weekLabel}`,
        message: message.trim() || undefined,
      },
    };
  };

  const handleSave = async () => {
    setError("");

    const payload = buildPayload();

    if (!payload.recipients.length) {
      setError("Please add at least one recipient.");
      return;
    }

    if (frequency === "weekly" && (!payload.schedule.daysOfWeek || !payload.schedule.daysOfWeek.length)) {
      setError("Please select at least one day of the week.");
      return;
    }

    if (frequency === "monthly" && (!payload.schedule.dayOfMonth || payload.schedule.dayOfMonth < 1 || payload.schedule.dayOfMonth > 31)) {
      setError("Please select a valid day of month.");
      return;
    }

    try {
      setSaving(true);

      if (subscriptionId) {
        await dispatch(
          updateSubscription({
            id: subscriptionId,
            patch: {
              name: `${teamLabel} - ${weekLabel}`,
              reportConfig,
              recipients: payload.recipients,
              schedule: payload.schedule,
              delivery: payload.delivery,
              isEnabled: true,
            },
          })
        ).unwrap();
      } else {
        await dispatch(
          createSubscription({
            companyId,
            name: `${teamLabel} - ${weekLabel}`,
            reportType,
            reportConfig,
            recipients: payload.recipients,
            schedule: payload.schedule,
            delivery: payload.delivery,
            isEnabled: true,
          })
        ).unwrap();
      }

        // ✅ force refresh so ReportSubscriptionsModal updates behind it
        await dispatch(getSubscriptionsByReportType({ companyId, reportType })).unwrap();

      onClose();
    } catch (e: any) {
      setError(String(e?.message || e || "Failed to save scheduled report."));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  // ---- Styles ----
  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(17,24,39,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    zIndex: 20001,
  };

  const modal: React.CSSProperties = {
    width: "100%",
    maxWidth: 520,
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    overflow: "hidden",
  };

  const header: React.CSSProperties = {
    padding: "14px 14px 10px",
    borderBottom: "1px solid #eef2f7",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  };

  const title: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  };

  const sub: React.CSSProperties = {
    marginTop: 6,
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 1.4,
  };

  const closeBtn: React.CSSProperties = {
    border: "1px solid #fff",
    background: "#fff",
    borderRadius: 10,
    width: 34,
    height: 34,
    cursor: "pointer",
    color: "#000",
  };

  const body: React.CSSProperties = {
    padding: 14,
    maxHeight: "72vh",
    overflowY: "auto",
  };

  const section: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    background: "#fff",
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    color: "#000",
    margin: "0 0 10px 0",
  };

  const label: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    color: "#6b7280",
    marginBottom: 6,
  };

  const row: React.CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap" };

  const input: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: 14,
  };

  const select: React.CSSProperties = { ...input, background: "#fff" };

  const chipWrap: React.CSSProperties = { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 };

  const chip: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    color: "#111827",
    fontWeight: 700,
  };

  const chipX: React.CSSProperties = {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 900,
    color: "#6b7280",
  };

  const smallBtn: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 900,
  };

  const dowBtn = (active: boolean): React.CSSProperties => ({
    padding: "8px 10px",
    borderRadius: 12,
    border: `1px solid ${active ? "#ef4444" : "#e5e7eb"}`,
    background: active ? "rgba(239,68,68,0.08)" : "#fff",
    cursor: "pointer",
    fontWeight: 600,
    color: "#111827",
    fontSize: 12,
  });

  const footer: React.CSSProperties = {
    padding: 14,
    borderTop: "1px solid #eef2f7",
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    background: "#fff",
  };

  const cancelBtn: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 500,
    color: "#111827",
  };

  const saveBtn: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    background: "#ef4444",
    cursor: "pointer",
    fontWeight: 500,
    color: "#fff",
    opacity: saving ? 0.7 : 1,
  };

  return (
    <div style={overlay} onMouseDown={onClose}>
      <div style={modal} onMouseDown={(e) => e.stopPropagation()}>
        <div style={header}>
          <div>
            <h3 style={title}>Schedule email</h3>
            <div style={sub}>
              <div>
                <b>{escapeHtml(reportName)}</b>
              </div>
              <div>Team: {escapeHtml(teamLabel)}</div>
              <div>Week: {escapeHtml(weekLabel)}</div>
            </div>
          </div>

          <button type="button" style={closeBtn} onClick={onClose} aria-label="Close">
            x
          </button>
        </div>

        <div style={body}>
          {error ? (
            <div style={{ marginBottom: 12, color: "#b91c1c", fontWeight: 900, fontSize: 13 }}>
              {error}
            </div>
          ) : null}

          {/* Recipients */}
          <div style={section}>
            <div style={sectionTitle}>Recipients</div>

            {userOptions.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={label}>Internal users</div>
                <select
                  style={select}
                  value=""
                  onChange={(e) => {
                    const id = e.target.value;
                    if (!id) return;
                    setSelectedUserIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
                    e.currentTarget.value = "";
                  }}
                >
                  <option value="">Add a user…</option>
                  {userOptions.map((u) => (
                    <option key={u.userId} value={u.userId}>
                      {u.label}
                    </option>
                  ))}
                </select>

                {selectedUserIds.length > 0 && (
                  <div style={chipWrap}>
                    {selectedUserIds.map((id) => {
                      const u = userOptions.find((x) => x.userId === id);
                      return (
                        <span key={id} style={chip}>
                          {u?.label || id}
                          <button
                            type="button"
                            style={chipX}
                            onClick={() => setSelectedUserIds((p) => p.filter((x) => x !== id))}
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div>
              <div style={label}>External emails</div>
              <div style={row}>
                <div style={{ flex: "1 1 260px" }}>
                  <input
                    style={input}
                    value={emailInput}
                    placeholder="name@company.com (comma/space separated)"
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addExternalEmail();
                      }
                    }}
                  />
                </div>
                <button type="button" style={smallBtn} onClick={addExternalEmail}>
                  Add
                </button>
              </div>

              {externalEmails.length > 0 && (
                <div style={chipWrap}>
                  {externalEmails.map((e) => (
                    <span key={e} style={chip}>
                      {e}
                      <button type="button" style={chipX} onClick={() => removeExternalEmail(e)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div style={section}>
            <div style={sectionTitle}>Schedule</div>

            <div style={row}>
              <div style={{ flex: "1 1 180px" }}>
                <div style={label}>Frequency</div>
                <select style={select} value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div style={{ flex: "1 1 140px" }}>
                <div style={label}>Time</div>
                <input style={input} type="time" value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)} />
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={label}>Timezone</div>
              <select style={select} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                {US_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            {frequency === "weekly" && (
              <div style={{ marginTop: 10 }}>
                <div style={label}>Days of week</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { d: 0, t: "Sun" },
                    { d: 1, t: "Mon" },
                    { d: 2, t: "Tue" },
                    { d: 3, t: "Wed" },
                    { d: 4, t: "Thu" },
                    { d: 5, t: "Fri" },
                    { d: 6, t: "Sat" },
                  ].map(({ d, t }) => (
                    <button key={d} type="button" style={dowBtn(daysOfWeek.includes(d))} onClick={() => toggleDow(d)}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {frequency === "monthly" && (
              <div style={{ marginTop: 10 }}>
                <div style={label}>Day of month</div>
                <select style={select} value={dayOfMonth} onChange={(e) => setDayOfMonth(Number(e.target.value))}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Delivery */}
          <div style={section}>
            <div style={sectionTitle}>Delivery</div>

            <div style={row}>
              <div style={{ flex: "1 1 180px" }}>
                <div style={label}>Format</div>
                <select style={select} value={format} onChange={(e) => setFormat(e.target.value as Format)}>
                    <option value="email_html">Inline email</option>
                    <option value="pdf">PDF attachment</option>
                    <option value="csv">CSV attachment</option>         {/* ✅ new */}
                    <option value="both">Inline + PDF</option>
                    <option value="email_csv">Inline + CSV</option>     {/* ✅ new */}
                </select>

              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={label}>Subject</div>
              <input style={input} value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={label}>Optional message</div>
              <textarea
                style={{ ...input, minHeight: 90, resize: "vertical" }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a short note to recipients…"
              />
            </div>
          </div>
        </div>

        <div style={footer}>
          <button type="button" style={cancelBtn} onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="button" style={saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : subscriptionId ? "Update schedule" : "Save schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
