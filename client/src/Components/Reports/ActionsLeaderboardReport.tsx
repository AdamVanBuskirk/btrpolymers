// src/Components/Tabs/ActionsLeaderboardReport.tsx
import React, { useMemo, useState } from "react";
import { MdPrint, MdDownload, MdEmail } from "react-icons/md";
import { useAppSelector } from "../../Core/hooks";
import { getCompany } from "../../Store/Company";
import EmailReportModal, { EmailReportModalValue } from "../../Modals/EmailReportModal";
import ReportSubscriptionsModal from "../../Modals/ReportSubscriptions";
import { ReportSubscriptionDto } from "../../Store/ReportSubscriptions";
import { BsGear, BsGearFill } from "react-icons/bs";

type ColumnDef = { id: string; label: string };

type LeaderboardDetail = {
  rank: number;
  userId: string;

  fullName: string;
  email: string;
  teamName: string;

  totalActions: number;
  submissions: number;
  avgActionsPerSubmission: number;
  successOfWeek: number;

  actionsById: Record<string, number>;
  amountsById: Record<string, number>;
};

type ActionLeaderboard = {
  teamId: string;
  weekChoice: string;

  actionColumns: ColumnDef[];
  amountColumns: ColumnDef[];

  shortRange: LeaderboardDetail[];
  longRange: LeaderboardDetail[];
};

type Props = {
  teams: any[];

  teamId: string;
  setTeamId: (v: string) => void;

  weekChoice: string;
  setWeekChoice: (v: string) => void;

  weekLabel: string;

  submitted: boolean;
  setSubmitted: (v: boolean) => void;

  onSubmit: () => void;

  loading: boolean;
  failed: boolean;
  errorMessage: string;

  leaderboard: ActionLeaderboard | null;

  onBack: () => void;
};

const escapeHtml = (s: string) =>
  (s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const money = (n: number) =>
  (Number.isFinite(n) ? n : 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const csvEscape = (v: any) => {
  const s = v == null ? "" : String(v);
  const needs = /[",\n\r]/.test(s);
  const escaped = s.replace(/"/g, '""');
  return needs ? `"${escaped}"` : escaped;
};

const cleanLabel = (c: ColumnDef) => {
  const raw = (c?.label || "").trim();
  if (!raw || raw === "-" || raw === "—") return c.id;
  return raw;
};

// ---- Goal resolution helpers ----
const DEFAULT_GOAL = 15;

const asGoalNumber = (v: any): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "string" ? Number(v) : Number(v);
  if (!Number.isFinite(n)) return null;
  return n;
};

const pickGoalFrom = (obj: any): number | null => {
  if (!obj) return null;
  // try a few common field names without assuming your schema
  return (
    asGoalNumber(obj.goal) ??
    asGoalNumber(obj.actionGoal) ??
    asGoalNumber(obj.weeklyActionGoal) ??
    asGoalNumber(obj.proactiveActionsGoal) ??
    null
  );
};

/*********************************************
 * component start
 *********************************************/

function ActionsLeaderboardReport(props: Props) {

  const companyState = useAppSelector(getCompany);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [editSub, setEditSub] = useState<ReportSubscriptionDto | null>(null);
  const [emailModalKey, setEmailModalKey] = useState(0); // ✅ add
  
  // open create
  const openCreate = () => {
    // ✅ hard reset all edit state
    setEditSub(null);

    // ✅ header should match current selections when creating
    setModalTeamLabel(teamLabel);
    setModalWeekLabel(weekLabel);

    // ✅ force clean mount each time
    setEmailModalKey((k) => k + 1);
    setEmailModalOpen(true);
  };

  // open edit
  const openEdit = (sub: ReportSubscriptionDto) => {
    setEditSub(sub);

    // ✅ header should reflect the subscription's saved config
    setModalTeamLabel(getTeamLabelFromConfig((sub as any).reportConfig));
    setModalWeekLabel(getWeekLabelFromConfig((sub as any).reportConfig));
  
    setEmailModalKey((k) => k + 1);
    setEmailModalOpen(true);
  };


  const openEmailModal = () => openCreate();
  //const closeEmailModal = () => setEmailModalOpen(false);

  const closeEmailModal = () => {
    setEmailModalOpen(false);
    setEditSub(null);              // ✅ important: don’t leave edit state hanging around
    setEmailModalKey((k) => k + 1);
  };

  const {
    teams,
    teamId,
    setTeamId,
    weekChoice,
    setWeekChoice,
    weekLabel,
    submitted,
    setSubmitted,
    onSubmit,
    loading,
    failed,
    errorMessage,
    leaderboard: lb,
    onBack,
  } = props;

// ✅ Effective config: edit uses subscription's saved config, create uses current UI selection
const effectiveConfig = editSub?.reportConfig ?? { teamId, weekChoice };

const effectiveTeamId = effectiveConfig?.teamId ?? "";
const effectiveWeekChoice = effectiveConfig?.weekChoice ?? "this";

const effectiveTeamLabel =
  effectiveTeamId === "99"
    ? "Entire Company"
    : teams.find((t: any) => t._id === effectiveTeamId)?.name || "—";

const effectiveWeekLabel =
  effectiveWeekChoice === "last" ? "Last Week" : "This Week";

  const teamLabel =
    teamId === "99"
      ? "Entire Company"
      : teams.find((t: any) => t._id === teamId)?.name || "—";

  // ✅ NEW: labels shown inside the modal header
  const [modalTeamLabel, setModalTeamLabel] = useState(teamLabel);
  const [modalWeekLabel, setModalWeekLabel] = useState(weekLabel);
  
  // helper (adjust to your real team list + week options)
  const getTeamLabelFromConfig = (cfg: any) => {
    if (!cfg?.teamId) return "Entire Company";
    const t = companyState.teams?.find((x) => x._id === cfg.teamId);
    return t?.name || "Team";
  };
  
  const getWeekLabelFromConfig = (cfg: any) => {
    // If you store weekChoice like "this_week", "last_week", etc.
    // map it here to display text
    switch (cfg?.weekChoice) {
      case "this_week": return "This Week";
      case "last_week": return "Last Week";
      default: return weekLabel; // fallback
    }
  };

  // OPTIONAL: provide internal users list (if your companyState.members has user names/emails)
  const modalUsers = (companyState.members || []).map((m: any) => ({
    userId: String(m.userId),
    firstName: m.firstName,
    lastName: m.lastName,
    email: m.email,
  }));

  // ✅ member lookup for userGoal: members[].actionGoal
  const memberByUserId = useMemo(() => {
    const map = new Map<string, any>();
    (companyState.members || []).forEach((m: any) => {
      if (m?.userId) map.set(String(m.userId), m);
    });
    return map;
  }, [companyState.members]);

  // Remove "Call Type" column (if it ever appears) + fix labels
  const actionCols = useMemo(
    () =>
      (lb?.actionColumns || [])
        .filter((c) => cleanLabel(c).toLowerCase() !== "call type")
        .map((c) => ({ ...c, label: cleanLabel(c) })),
    [lb]
  );

  const amountCols = useMemo(
    () =>
      (lb?.amountColumns || [])
        .filter((c) => cleanLabel(c).toLowerCase() !== "call type")
        .map((c) => ({ ...c, label: cleanLabel(c) })),
    [lb]
  );

  // Raw rows
  const weeklyRowsRaw = useMemo(() => lb?.shortRange || [], [lb]);
  const cumulativeRowsRaw = useMemo(() => lb?.longRange || [], [lb]);

  // ✅ Build a master user list from union of both ranges (so “zero-users” still appear)
  const allUsers = useMemo(() => {
    const map = new Map<string, LeaderboardDetail>();

    for (const r of cumulativeRowsRaw) {
      if (r?.userId) map.set(r.userId, r);
    }
    for (const r of weeklyRowsRaw) {
      if (r?.userId) map.set(r.userId, r);
    }

    return Array.from(map.values());
  }, [weeklyRowsRaw, cumulativeRowsRaw]);

  const allUserIds = useMemo(() => allUsers.map((u) => u.userId), [allUsers]);

  // ✅ Normalize a range so it contains ALL users, even if missing from that range
  const normalizeRange = useMemo(() => {
    const zeroRowFor = (u: LeaderboardDetail): LeaderboardDetail => ({
      rank: 0, // will recalc below
      userId: u.userId,
      fullName: u.fullName || "",
      email: u.email || "",
      teamName: u.teamName || "",
      totalActions: 0,
      submissions: 0,
      avgActionsPerSubmission: 0,
      successOfWeek: 0,
      actionsById: {},
      amountsById: {},
    });

    const ensureKeys = (r: LeaderboardDetail): LeaderboardDetail => {
      const actionsById: Record<string, number> = {};
      for (const c of actionCols) actionsById[c.id] = Number(r.actionsById?.[c.id] || 0);

      const amountsById: Record<string, number> = {};
      for (const c of amountCols) amountsById[c.id] = Number(r.amountsById?.[c.id] || 0);

      return {
        ...r,
        totalActions: Number(r.totalActions || 0),
        submissions: Number(r.submissions || 0),
        successOfWeek: Number(r.successOfWeek || 0),
        avgActionsPerSubmission: Number(r.avgActionsPerSubmission || 0),
        actionsById,
        amountsById,
      };
    };

    const addRanks = (rows: LeaderboardDetail[]) => {
      // Keep ALL rows; sort by totalActions desc, then name for stability
      const sorted = [...rows].sort((a, b) => {
        const d = Number(b.totalActions || 0) - Number(a.totalActions || 0);
        if (d !== 0) return d;
        return (a.fullName || "").localeCompare(b.fullName || "");
      });

      let lastTotal: number | null = null;
      let lastRank = 0;

      return sorted.map((r, idx) => {
        const t = Number(r.totalActions || 0);
        const rank = lastTotal === t ? lastRank : idx + 1;
        lastTotal = t;
        lastRank = rank;
        return { ...r, rank };
      });
    };

    return (rows: LeaderboardDetail[]) => {
      const byId = new Map<string, LeaderboardDetail>();
      for (const r of rows || []) if (r?.userId) byId.set(r.userId, r);

      const out: LeaderboardDetail[] = [];

      for (const uid of allUserIds) {
        const baseUser = allUsers.find((u) => u.userId === uid);
        if (!baseUser) continue;

        const r = byId.get(uid) || zeroRowFor(baseUser);
        out.push(ensureKeys(r));
      }

      return addRanks(out);
    };
  }, [allUserIds, allUsers, actionCols, amountCols]);

  const weeklyRows = useMemo(
    () => normalizeRange(weeklyRowsRaw),
    [normalizeRange, weeklyRowsRaw]
  );
  const cumulativeRows = useMemo(
    () => normalizeRange(cumulativeRowsRaw),
    [normalizeRange, cumulativeRowsRaw]
  );

  // ---- Goal column: user → team → company → default(15) ----
  const resolveGoalForRow = useMemo(() => {
    // Company goal (if included on leaderboard payload)
    const companyGoal =
      pickGoalFrom(lb as any) ??
      pickGoalFrom((lb as any)?.settings) ??
      pickGoalFrom((lb as any)?.company) ??
      null;

    // quick lookup: team name → team object
    const teamByName = new Map<string, any>();
    for (const t of teams || []) {
      if (t?.name) teamByName.set(String(t.name), t);
    }

    return (r: LeaderboardDetail) => {
      // ✅ 1) user goal from members[].actionGoal
      const member = memberByUserId.get(String(r.userId));
      const userGoal = asGoalNumber(member?.actionGoal);

      // 2) team goal (match by displayed teamName)
      const teamObj = r?.teamName ? teamByName.get(String(r.teamName)) : null;
      const teamGoal = pickGoalFrom(teamObj);

      // 3) company goal
      const g = userGoal ?? teamGoal ?? companyGoal ?? DEFAULT_GOAL;
      return Number.isFinite(g) ? (g as number) : DEFAULT_GOAL;
    };
  }, [lb, teams, memberByUserId]);

  const weeklyTotals = useMemo(() => {
    const totalActions = weeklyRows.reduce((s, r) => s + (r.totalActions || 0), 0);
    const totalSubs = weeklyRows.reduce((s, r) => s + (r.submissions || 0), 0);
    const success = weeklyRows.reduce((s, r) => s + (r.successOfWeek || 0), 0);

    const actionsById: Record<string, number> = {};
    for (const c of actionCols) actionsById[c.id] = 0;
    for (const r of weeklyRows)
      for (const c of actionCols) actionsById[c.id] += Number(r.actionsById?.[c.id] || 0);

    const amountsById: Record<string, number> = {};
    for (const c of amountCols) amountsById[c.id] = 0;
    for (const r of weeklyRows)
      for (const c of amountCols) amountsById[c.id] += Number(r.amountsById?.[c.id] || 0);

    const avg = totalSubs > 0 ? totalActions / totalSubs : 0;

    return { totalActions, totalSubs, avg, success, actionsById, amountsById };
  }, [weeklyRows, actionCols, amountCols]);

  const cumulativeTotals = useMemo(() => {
    const totalActions = cumulativeRows.reduce((s, r) => s + (r.totalActions || 0), 0);
    const totalSubs = cumulativeRows.reduce((s, r) => s + (r.submissions || 0), 0);
    const success = cumulativeRows.reduce((s, r) => s + (r.successOfWeek || 0), 0);

    const actionsById: Record<string, number> = {};
    for (const c of actionCols) actionsById[c.id] = 0;
    for (const r of cumulativeRows)
      for (const c of actionCols) actionsById[c.id] += Number(r.actionsById?.[c.id] || 0);

    const amountsById: Record<string, number> = {};
    for (const c of amountCols) amountsById[c.id] = 0;
    for (const r of cumulativeRows)
      for (const c of amountCols) amountsById[c.id] += Number(r.amountsById?.[c.id] || 0);

    const avg = totalSubs > 0 ? totalActions / totalSubs : 0;

    return { totalActions, totalSubs, avg, success, actionsById, amountsById };
  }, [cumulativeRows, actionCols, amountCols]);

  const iconBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    color: "#111827",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  };

  const iconBtnHover: React.CSSProperties = { background: "#f9fafb" };

  const emailReportClick = () => {
    openEmailModal();
  };

  // ✅ CSV: ALL UI columns + Email FIRST column + Goal after Team
  const downloadCsv = () => {
    if (!lb) return;

    const teamName =
      teamId === "99"
        ? "Entire Company"
        : teams.find((t: any) => t._id === teamId)?.name || "—";
    const filenameSafe = `actions-leaderboard-${teamName}-${weekLabel}`.replace(
      /[^\w\-]+/g,
      "_"
    );

    const header = [
      "Email",
      "Name",
      "Team",
      "Goal",
      ...actionCols.map((c) => cleanLabel(c)),
      "Total Actions",
      "# Submissions",
      "Avg Actions / Submission",
      "Success of Week",
      ...amountCols.map((c) => cleanLabel(c)),
    ];

    const rowToCsv = (r: LeaderboardDetail) => [
      r.email || "",
      r.fullName || "",
      r.teamName || "",
      resolveGoalForRow(r),
      ...actionCols.map((c) => Number(r.actionsById?.[c.id] || 0)),
      Number(r.totalActions || 0),
      Number(r.submissions || 0),
      Number(r.avgActionsPerSubmission || 0).toFixed(1),
      Number(r.successOfWeek || 0),
      ...amountCols.map((c) => Number(r.amountsById?.[c.id] || 0)),
    ];

    const totalToCsv = (totals: any) => [
      "",
      "Total",
      "",
      "",
      ...actionCols.map((c) => Number(totals.actionsById?.[c.id] || 0)),
      Number(totals.totalActions || 0),
      Number(totals.totalSubs || 0),
      Number(totals.avg || 0).toFixed(1),
      Number(totals.success || 0),
      ...amountCols.map((c) => Number(totals.amountsById?.[c.id] || 0)),
    ];

    const lines: any[][] = [];

    lines.push([`Actions Leaderboard - ${teamName}`]);
    lines.push([`Week: ${weekLabel}`]);
    lines.push([]);
    lines.push([weekLabel]);
    lines.push(header);
    for (const r of weeklyRows) lines.push(rowToCsv(r));
    lines.push(totalToCsv(weeklyTotals));

    lines.push([]);
    lines.push([]);

    lines.push(["Past 12 Weeks"]);
    lines.push(header);
    for (const r of cumulativeRows) lines.push(rowToCsv(r));
    lines.push(totalToCsv(cumulativeTotals));

    const csv = lines.map((line) => line.map(csvEscape).join(",")).join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${filenameSafe}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  // ✅ PDF: NO email column + Goal after Team
  const downloadPdf = () => {
    if (!lb) return;

    const teamName =
      teamId === "99"
        ? "Entire Company"
        : teams.find((t: any) => t._id === teamId)?.name || "—";
    const title = `Actions Leaderboard - ${teamName} - ${weekLabel}`;
    const today = new Date().toLocaleString();

    const buildHeader = () => {
      const actionTh = actionCols
        .map((c) => `<th class="num col-action">${escapeHtml(cleanLabel(c))}</th>`)
        .join("");
      const amountTh = amountCols
        .map((c) => `<th class="num col-amount">${escapeHtml(cleanLabel(c))}</th>`)
        .join("");
      return `
        <tr>
          <th class="col-name">Name</th>
          <th class="col-team">Team</th>
          <th class="num col-goal">Goal</th>
          ${actionTh}
          <th class="num col-metric">Total Actions</th>
          <th class="num col-metric"># Submissions</th>
          <th class="num col-metric">Avg Actions / Submission</th>
          <th class="num col-metric">Success of Week</th>
          ${amountTh}
        </tr>
      `;
    };

    const buildRows = (rows: LeaderboardDetail[], totals: any) =>
      [
        ...rows.map((r) => {
          const actionTds = actionCols
            .map(
              (c) =>
                `<td class="num col-action">${Number(
                  r.actionsById?.[c.id] || 0
                ).toLocaleString()}</td>`
            )
            .join("");
          const amountTds = amountCols
            .map((c) => `<td class="num col-amount">${money(Number(r.amountsById?.[c.id] || 0))}</td>`)
            .join("");
          return `
            <tr>
              <td class="col-name">${escapeHtml(r.fullName || "")}</td>
              <td class="col-team">${escapeHtml(r.teamName || "")}</td>
              <td class="num col-goal">${Number(resolveGoalForRow(r) || 0).toLocaleString()}</td>
              ${actionTds}
              <td class="num col-metric">${Number(r.totalActions || 0).toLocaleString()}</td>
              <td class="num col-metric">${Number(r.submissions || 0).toLocaleString()}</td>
              <td class="num col-metric">${Number(r.avgActionsPerSubmission || 0).toFixed(1)}</td>
              <td class="num col-metric">${Number(r.successOfWeek || 0).toLocaleString()}</td>
              ${amountTds}
            </tr>
          `;
        }),
        (() => {
          const actionTds = actionCols
            .map(
              (c) =>
                `<td class="num col-action"><b>${Number(
                  totals.actionsById?.[c.id] || 0
                ).toLocaleString()}</b></td>`
            )
            .join("");
          const amountTds = amountCols
            .map(
              (c) =>
                `<td class="num col-amount"><b>${money(
                  Number(totals.amountsById?.[c.id] || 0)
                )}</b></td>`
            )
            .join("");
          return `
            <tr class="total-row">
              <td class="col-name"><b>Total</b></td>
              <td class="col-team"></td>
              <td class="num col-goal"></td>
              ${actionTds}
              <td class="num col-metric"><b>${Number(totals.totalActions || 0).toLocaleString()}</b></td>
              <td class="num col-metric"><b>${Number(totals.totalSubs || 0).toLocaleString()}</b></td>
              <td class="num col-metric"><b>${Number(totals.avg || 0).toFixed(1)}</b></td>
              <td class="num col-metric"><b>${Number(totals.success || 0).toLocaleString()}</b></td>
              ${amountTds}
            </tr>
          `;
        })(),
      ].join("");

    const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: Letter; margin: 0.5in; }
    body { font-family: Arial, Helvetica, sans-serif; color: #111; }
    h1 { font-size: 16px; margin: 0 0 6px 0; }
    .meta { font-size: 11px; color: #444; margin-bottom: 10px; }
    .meta div { margin: 2px 0; }
    h2 { font-size: 13px; margin: 14px 0 6px 0; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th, td { border: 1px solid #ddd; padding: 5px; font-size: 10px; }
    th { background: #f3f4f6; text-align: left; white-space: normal; word-break: break-word; line-height: 1.15; }
    td { vertical-align: top; }
    .num { text-align: right; white-space: nowrap; }
    .total-row td { font-weight: 700; background: #fafafa; }
    .col-name { width: 132px; }
    .col-team { width: 86px; }
    .col-goal { width: 44px; }
    .col-action { width: 52px; }
    .col-metric { width: 66px; }
    .col-amount { width: 74px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>

  <div class="meta">
    <div><b>Generated:</b> ${escapeHtml(today)}</div>
    <div><b>Team:</b> ${escapeHtml(teamName)}</div>
    <div><b>Week:</b> ${escapeHtml(weekLabel)}</div>
  </div>

  <h2>${escapeHtml(weekLabel)}</h2>
  <table>
    <thead>${buildHeader()}</thead>
    <tbody>${buildRows(weeklyRows, weeklyTotals)}</tbody>
  </table>

  <h2>Past 12 Weeks</h2>
  <table>
    <thead>${buildHeader()}</thead>
    <tbody>${buildRows(cumulativeRows, cumulativeTotals)}</tbody>
  </table>

  <script>
    window.onload = () => window.print();
  </script>
</body>
</html>`;

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  // ----------------------------
  // Styles (UI table)
  // ----------------------------
  const pageStyle: React.CSSProperties = {
    padding: "14px 14px 80px",
    background: "#f7f8fa",
    minHeight: "85vh",
    borderRadius: "20px",
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
    padding: "14px",
  };

  const h2: React.CSSProperties = {
    margin: 0,
    fontSize: "18px",
    fontWeight: 800,
    color: "#111827",
  };
  const sub: React.CSSProperties = {
    marginTop: "6px",
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: 1.4,
  };

  const backBtn: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "#6b7280",
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
    marginBottom: "10px",
  };

  const label: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 700,
    color: "#6b7280",
    marginBottom: "6px",
  };

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 12px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    fontSize: "14px",
    outline: "none",
  };

  const primaryBtn: React.CSSProperties = {
    width: "100%",
    marginTop: "10px",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  };

  const sectionTitle: React.CSSProperties = {
    marginTop: "14px",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: 900,
    color: "#111827",
  };

  const tableWrap: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    overflowX: "auto",
  };

  const table: React.CSSProperties = {
    width: "100%",
    minWidth: 1040, // +goal column
    borderCollapse: "collapse",
    tableLayout: "fixed",
  };

  const th: React.CSSProperties = {
    position: "sticky",
    top: 0,
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "12px",
    fontWeight: 900,
    color: "#374151",
    padding: "9px 10px",
    textAlign: "left",
    whiteSpace: "normal",
    wordBreak: "break-word",
    lineHeight: 1.15,
  };

  const td: React.CSSProperties = {
    borderBottom: "1px solid #f1f5f9",
    fontSize: "13px",
    color: "#111827",
    padding: "9px 10px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const colName = { width: 170 };
  const colTeam = { width: 140 };
  const colGoal = { width: 70 };
  const colMetric = { width: 98 };
  const colAction = { width: 78 };
  const colAmount = { width: 126 };

  const renderTable = (rows: LeaderboardDetail[], totals: any) => (
    <div style={tableWrap}>
      <table style={table}>
        <colgroup>
          <col style={colName} />
          <col style={colTeam} />
          <col style={colGoal} />

          {actionCols.map((c) => (
            <col key={`col-a-${c.id}`} style={colAction} />
          ))}

          <col style={colMetric} />
          <col style={colMetric} />
          <col style={colMetric} />
          <col style={colMetric} />

          {amountCols.map((c) => (
            <col key={`col-m-${c.id}`} style={colAmount} />
          ))}
        </colgroup>

        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Team</th>
            <th style={{ ...th, textAlign: "right" }}>Goal</th>

            {actionCols.map((c) => (
              <th key={`a-${c.id}`} style={{ ...th, textAlign: "right" }}>
                {cleanLabel(c)}
              </th>
            ))}

            <th style={{ ...th, textAlign: "right" }}>Total Actions</th>
            <th style={{ ...th, textAlign: "right" }}># Submissions</th>
            <th style={{ ...th, textAlign: "right" }}>Avg Actions / Submission</th>
            <th style={{ ...th, textAlign: "right" }}>Success of Week</th>

            {amountCols.map((c) => (
              <th key={`m-${c.id}`} style={{ ...th, textAlign: "right" }}>
                {cleanLabel(c)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r.userId}>
              <td style={td} title={r.fullName}>
                {r.fullName}
              </td>
              <td style={td} title={r.teamName}>
                {r.teamName}
              </td>
              <td style={{ ...td, textAlign: "right", fontWeight: 800 }}>
                {resolveGoalForRow(r).toLocaleString()}
              </td>

              {actionCols.map((c) => (
                <td
                  key={`ra-${r.userId}-${c.id}`}
                  style={{ ...td, textAlign: "right" }}
                >
                  {Number(r.actionsById?.[c.id] || 0).toLocaleString()}
                </td>
              ))}

              <td style={{ ...td, textAlign: "right", fontWeight: 800 }}>
                {Number(r.totalActions || 0).toLocaleString()}
              </td>
              <td style={{ ...td, textAlign: "right" }}>
                {Number(r.submissions || 0).toLocaleString()}
              </td>
              <td style={{ ...td, textAlign: "right" }}>
                {Number(r.avgActionsPerSubmission || 0).toFixed(1)}
              </td>
              <td style={{ ...td, textAlign: "right" }}>
                {Number(r.successOfWeek || 0).toLocaleString()}
              </td>

              {amountCols.map((c) => (
                <td
                  key={`rm-${r.userId}-${c.id}`}
                  style={{ ...td, textAlign: "right" }}
                >
                  {money(Number(r.amountsById?.[c.id] || 0))}
                </td>
              ))}
            </tr>
          ))}

          <tr>
            <td style={{ ...td, fontWeight: 900 }}>Total</td>
            <td style={td}></td>
            <td style={td}></td>

            {actionCols.map((c) => (
              <td
                key={`ta-${c.id}`}
                style={{ ...td, textAlign: "right", fontWeight: 900 }}
              >
                {Number(totals.actionsById?.[c.id] || 0).toLocaleString()}
              </td>
            ))}

            <td style={{ ...td, textAlign: "right", fontWeight: 900 }}>
              {Number(totals.totalActions || 0).toLocaleString()}
            </td>
            <td style={{ ...td, textAlign: "right", fontWeight: 900 }}>
              {Number(totals.totalSubs || 0).toLocaleString()}
            </td>
            <td style={{ ...td, textAlign: "right", fontWeight: 900 }}>
              {Number(totals.avg || 0).toFixed(1)}
            </td>
            <td style={{ ...td, textAlign: "right", fontWeight: 900 }}>
              {Number(totals.success || 0).toLocaleString()}
            </td>

            {amountCols.map((c) => (
              <td
                key={`tm-${c.id}`}
                style={{ ...td, textAlign: "right", fontWeight: 900 }}
              >
                {money(Number(totals.amountsById?.[c.id] || 0))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  const hasAnyUsers = useMemo(() => {
    return weeklyRows.length > 0 || cumulativeRows.length > 0;
  }, [weeklyRows, cumulativeRows]);

  return (
    <div style={pageStyle}>
      <button type="button" style={backBtn} onClick={onBack}>
        ← Back to Reports
      </button>

      <div style={cardStyle}>
        <div style={h2}>Actions Leaderboard</div>
        <div style={sub}>Choose a team, then submit to generate the leaderboard.</div>

        {/* Filters */}
        <div style={{ marginTop: "12px" }}>
          <div style={label}>Team</div>
          <select
            style={selectStyle}
            value={teamId}
            onChange={(e) => {
              setTeamId(e.target.value);
              setSubmitted(false);
            }}
          >
            <option value="">Select a team…</option>
            {teams.map((t: any) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
            <option value="99">Entire Company</option>
          </select>

          <div style={{ marginTop: "12px" }}>
            <div style={label}>Week</div>
            <select
              style={selectStyle}
              value={weekChoice}
              onChange={(e) => {
                setWeekChoice(e.target.value);
                setSubmitted(false);
              }}
            >
              <option value="this">This Week</option>
              <option value="last">Last Week</option>
            </select>
          </div>

          <button
            type="button"
            style={{
              ...primaryBtn,
              opacity: teamId ? 1 : 0.55,
              cursor: teamId ? "pointer" : "not-allowed",
            }}
            disabled={!teamId || loading}
            onClick={onSubmit}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>

        {/* Report output */}
        {submitted && (
          <div style={{ marginTop: "14px" }}>
            {failed && (
              <div
                style={{
                  marginTop: "10px",
                  color: "#b91c1c",
                  fontSize: "13px",
                  fontWeight: 800,
                }}
              >
                {errorMessage || "Failed to load report."}
              </div>
            )}

            {!loading && !failed && !lb && (
              <div
                style={{
                  marginTop: "10px",
                  color: "#6b7280",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                No data found for this selection.
              </div>
            )}

            {!!lb && !failed && (
              <>
                {!hasAnyUsers && (
                  <div
                    style={{
                      marginTop: "10px",
                      color: "#6b7280",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    No users are currently included in reports for this selection.
                  </div>
                )}

                {hasAnyUsers && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >

                    <button
                      type="button"
                      title="Manage scheduled reports"
                      onClick={() => setManageOpen(true)}
                      style={iconBtn}
                      onMouseEnter={(e) => Object.assign(e.currentTarget.style, iconBtnHover)}
                      onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: "#fff" })}
                    >
                      <BsGearFill size={18} />
                    </button>


                      <button
                        type="button"
                        title="Email / Schedule"
                        onClick={emailReportClick}
                        style={iconBtn}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, iconBtnHover)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: "#fff" })}
                      >
                        <MdEmail size={18} />
                      </button>

                      <button
                        type="button"
                        title="Download CSV"
                        onClick={downloadCsv}
                        style={iconBtn}
                        onMouseEnter={(e) =>
                          Object.assign(e.currentTarget.style, iconBtnHover)
                        }
                        onMouseLeave={(e) =>
                          Object.assign(e.currentTarget.style, { background: "#fff" })
                        }
                      >
                        <MdDownload size={18} />
                      </button>

                      <button
                        type="button"
                        title="Print / Save as PDF"
                        onClick={downloadPdf}
                        style={iconBtn}
                        onMouseEnter={(e) =>
                          Object.assign(e.currentTarget.style, iconBtnHover)
                        }
                        onMouseLeave={(e) =>
                          Object.assign(e.currentTarget.style, { background: "#fff" })
                        }
                      >
                        <MdPrint size={18} />
                      </button>
                    </div>

                    <div style={sectionTitle}>{weekLabel}</div>
                    {renderTable(weeklyRows, weeklyTotals)}

                    <div style={sectionTitle}>Past 12 Weeks</div>
                    {renderTable(cumulativeRows, cumulativeTotals)}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <EmailReportModal
        key={`${emailModalKey}-${editSub?._id || "new"}`}
        isOpen={emailModalOpen}
        onClose={closeEmailModal}
        reportName="Actions Leaderboard"
        teamLabel={effectiveTeamLabel}
        weekLabel={effectiveWeekLabel}
        companyId={companyState.company?._id || ""}
        reportType="actions_leaderboard"
        reportConfig={{ teamId, weekChoice }}
        users={modalUsers}
        subscriptionId={editSub?._id}
        initialSubscription={editSub}
      />

      <ReportSubscriptionsModal
        isOpen={manageOpen}
        onClose={() => setManageOpen(false)}
        companyId={companyState.company?._id || ""}
        reportType="actions_leaderboard"
        onEdit={(sub) => {
          //setManageOpen(false);
          openEdit(sub);
        }}
      />
    </div>
  );
}

export default ActionsLeaderboardReport;
