import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Core/hooks";
import {
  getSubscriptionsByReportType,
  enableSubscription,
  disableSubscription,
  runNowSubscription,
  getReportSubscriptions,
  type ReportSubscriptionDto,
  type ReportType,
  deleteSubscription,
} from "../Store/ReportSubscriptions";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  reportType: ReportType;
  onEdit: (sub: ReportSubscriptionDto) => void;
};

export default function ReportSubscriptionsModal({
  isOpen,
  onClose,
  companyId,
  reportType,
  onEdit,
}: Props) {
  const dispatch = useAppDispatch();
  const subsState = useAppSelector(getReportSubscriptions);

  const subs = subsState.byReportType[reportType] || [];

  const hasData = subs.length > 0;
  const showBlockingLoading = subsState.status === "loading" && !hasData;
  //const showRefreshing = subsState.status === "loading" && hasData;

  const [err, setErr] = useState("");

  const [busy, setBusy] = useState<Record<string, { toggle?: boolean; run?: boolean }>>({});
  const setBusyFlag = (id: string, patch: Partial<{ toggle: boolean; run: boolean }>) =>
    setBusy((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), ...patch } }));

  useEffect(() => {
    if (!isOpen) return;
    if (!companyId) return;
    dispatch(getSubscriptionsByReportType({ companyId, reportType }));
  }, [dispatch, isOpen, companyId, reportType]);

  useEffect(() => {
    if (isOpen) return;
    setErr("");
    setBusy({});
  }, [isOpen]);

  const close = () => {
    setErr("");
    setBusy({});
    onClose();
  };

  const toggleEnabled = async (sub: ReportSubscriptionDto) => {
    const id = sub._id;
    setErr("");
    setBusyFlag(id, { toggle: true });

    try {
      if (sub.isEnabled) {
        await dispatch(disableSubscription({ id })).unwrap();
      } else {
        await dispatch(enableSubscription({ id })).unwrap();
      }
      dispatch(getSubscriptionsByReportType({ companyId, reportType }));
    } catch (e: any) {
      setErr(String(e?.message || e || "Failed to toggle subscription."));
    } finally {
      setBusyFlag(id, { toggle: false });
    }
  };

  const runNow = async (sub: ReportSubscriptionDto) => {
    const id = sub._id;
    setErr("");
    setBusyFlag(id, { run: true });

    try {
      await dispatch(runNowSubscription({ id })).unwrap();
      dispatch(getSubscriptionsByReportType({ companyId, reportType }));
    } catch (e: any) {
      setErr(String(e?.message || e || "Failed to run now."));
    } finally {
      setBusyFlag(id, { run: false });
    }
  };

  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(17,24,39,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    zIndex: 20000,
  };

  const modal: React.CSSProperties = {
    width: "100%",
    maxWidth: 720,
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

  const title: React.CSSProperties = { fontSize: 16, fontWeight: 900, margin: 0 };
  const body: React.CSSProperties = { padding: 14, maxHeight: "72vh", overflowY: "auto" };

  // ✅ Button sizing lock to stop layout shifts/jumps
  const btnBase: React.CSSProperties = {
    height: 34,                 // ✅ fixed height
    minHeight: 34,
    lineHeight: "34px",         // ✅ consistent vertical metrics
    padding: "0 10px",          // ✅ no vertical padding changes
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 12,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    whiteSpace: "nowrap",
  };

  const btnDisabled: React.CSSProperties = { opacity: 0.6, cursor: "not-allowed" };

  // ✅ Stable widths per button (so "…" doesn't shrink the column)
  const btnEdit: React.CSSProperties = { ...btnBase, minWidth: 66 };
  const btnToggle: React.CSSProperties = { ...btnBase, minWidth: 78 };
  const btnDelete: React.CSSProperties = {
    ...btnBase,
    minWidth: 86,
    border: "none",
    background: "#ef4444",
    color: "#fff",
  };
  const btnRun: React.CSSProperties = {
    ...btnBase,
    minWidth: 86,
    border: "none",
    background: "green",
    color: "#fff",
  };

  const btnClose: React.CSSProperties = { ...btnBase, minWidth: 70, background: "#fff", border: "1px solid #fff", };

  const row: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  };

  const rowTop: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    columnGap: 12,
    alignItems: "start",
  };

  const leftCol: React.CSSProperties = { minWidth: 0 };

  const actionsCol: React.CSSProperties = {
    display: "inline-flex",
    gap: 8,
    flexWrap: "nowrap",
    whiteSpace: "nowrap",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  };

  const line: React.CSSProperties = {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  };

  // Tiny spinner (no layout shift)
  const SpinnerDots = () => (
    <span style={{ display: "inline-flex", gap: 3, lineHeight: 1 }}>
      <span style={{ width: 4, height: 4, borderRadius: 99, background: "currentColor", opacity: 0.9 }} />
      <span style={{ width: 4, height: 4, borderRadius: 99, background: "currentColor", opacity: 0.6 }} />
      <span style={{ width: 4, height: 4, borderRadius: 99, background: "currentColor", opacity: 0.3 }} />
    </span>
  );

  if (!isOpen) return null;

  return (
    <div style={overlay} onMouseDown={close}>
      <div style={modal} onMouseDown={(e) => e.stopPropagation()}>
        <div style={header}>
          <div>
            <h3 style={title}>Scheduled reports</h3>
            <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>
              Manage subscriptions for: <b>{reportType}</b>
            </div>
          </div>

          <button style={btnClose} onClick={close}>
            X
          </button>
        </div>

        <div style={body}>
          {err ? <div style={{ color: "#b91c1c", fontWeight: 900, marginBottom: 10 }}>{err}</div> : null}

          {showBlockingLoading ? (
            <div style={{ fontWeight: 800, color: "#6b7280" }}>Loading…</div>
          ) : subs.length === 0 ? (
            <div style={{ fontWeight: 800, color: "#6b7280" }}>No scheduled reports yet.</div>
          ) : (
            <>
              {subs.map((s) => {
                const isEnabled = !!s.isEnabled;
                const isBusyToggle = !!busy[s._id]?.toggle;
                const isBusyRun = !!busy[s._id]?.run;

                return (
                  <div key={s._id} style={row}>
                    <div style={rowTop}>
                      <div style={leftCol}>
                        <div style={{ fontWeight: 900, color: "#111827" }}>{s.delivery.subject}</div>

                        <div style={line}>
                          {s.schedule?.frequency} @ {s.schedule?.timeOfDay} ({s.timezone})
                          {s.schedule?.frequency === "weekly" && s.schedule?.daysOfWeek?.length
                            ? ` • days: ${s.schedule.daysOfWeek.join(",")}`
                            : null}
                          {s.schedule?.frequency === "monthly" && (s.schedule as any)?.dayOfMonth
                            ? ` • day: ${(s.schedule as any).dayOfMonth}`
                            : null}
                        </div>

                        <div style={line}>
                          Status:{" "}
                          <b style={{ color: isEnabled ? "#059669" : "#9ca3af" }}>
                            {isEnabled ? "Enabled" : "Disabled"}
                          </b>
                          {s.lastRunAt ? ` • Last run: ${new Date(s.lastRunAt as any).toLocaleString()}` : ""}
                          {s.lastStatus ? ` • Last result: ${s.lastStatus}` : ""}
                          {s.lastError ? ` • Error: ${s.lastError}` : ""}
                        </div>
                      </div>

                      <div style={actionsCol}>
                        <button
                          style={{ ...btnEdit, ...(isBusyToggle || isBusyRun ? btnDisabled : {}) }}
                          onClick={() => onEdit(s)}
                          disabled={isBusyToggle || isBusyRun}
                        >
                          Edit
                        </button>

                        <button
                          style={{ ...btnToggle, ...(isBusyToggle || isBusyRun ? btnDisabled : {}) }}
                          onClick={() => toggleEnabled(s)}
                          disabled={isBusyToggle || isBusyRun}
                          title={isEnabled ? "Disable this schedule" : "Enable this schedule"}
                        >
                          {isBusyToggle ? <SpinnerDots /> : isEnabled ? "Disable" : "Enable"}
                        </button>

                        <button
                            style={btnDelete}
                            onClick={async () => {
                                const ok = window.confirm("Delete this scheduled report? This cannot be undone.");
                                if (!ok) return;

                                try {
                                await dispatch(deleteSubscription({ id: s._id, companyId: companyId, reportType: s.reportType })).unwrap();
                                // no need to close modal; list updates via reducer
                                } catch (e: any) {
                                alert(e?.message || e || "Failed to delete subscription.");
                                }
                            }}
                            >
                            Delete
                        </button>


                        <button
                          style={{ ...btnRun, ...(isBusyRun ? btnDisabled : {}) }}
                          onClick={() => runNow(s)}
                          disabled={isBusyRun}
                          title="Run immediately"
                        >
                          {isBusyRun ? <SpinnerDots /> : "Run now"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
