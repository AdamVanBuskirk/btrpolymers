// src/Components/Tabs/ReportsTab.tsx
import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Core/hooks";
import { getCompany } from "../Store/Company";
import { getReport, getActionsLeaderboardReport } from "../Store/Report";
import ActionsLeaderboardReport from "./Reports/ActionsLeaderboardReport";

type ReportKey = "teamLeaderboard";

function ReportsTab() {
  const dispatch = useAppDispatch();
  const companyState = useAppSelector(getCompany);
  const reportState = useAppSelector(getReport);

  const currentMember = companyState.members.find((m: any) => m.me);

  // ----------------------------
  // Screen state
  // ----------------------------
  const [activeReport, setActiveReport] = useState<ReportKey | null>(null);

  // Team Leaderboard filters
  const teams = companyState.teams || [];
  const [teamId, setTeamId] = useState<string>("");
  const [weekChoice, setWeekChoice] = useState<string>("this");
  const [submitted, setSubmitted] = useState(false);

  const weekLabel = weekChoice === "this" ? "This Week" : "Last Week";

  const onSubmit = () => {
    setSubmitted(true);
    if (companyState.company?._id && teamId) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      dispatch(
        getActionsLeaderboardReport({
          companyId: companyState.company._id,
          teamId,
          weekChoice,
          timezone
        })
      );
    }
  };

  // ----------------------------
  // Styles (light like other tabs)
  // ----------------------------
  const pageStyle: React.CSSProperties = {
    padding: "14px 14px 80px",
    background: "#f7f8fa",
    minHeight: "85vh",
    borderRadius: "20px",
  };

  const pillBtn: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    textAlign: "left",
    cursor: "pointer",
  };

  const h2: React.CSSProperties = {
    margin: 0,
    fontSize: "18px",
    fontWeight: 800,
    color: "#111827",
  };

  // The below counter is to show a generic no reports message if none exist
  let reportCount = 0;

  // count Team Leadersboard
  if (currentMember?.role !== "member") {
    reportCount++;
  }

  if (reportCount === 0) {
    return (
      <div style={pageStyle}>
        <div style={{ margin: "200px auto", fontStyle: "italic", textAlign: "center" }}>
          There are no reports to show at this time.
        </div>
      </div>
    );
  }

  // ----------------------------
  // Render
  // ----------------------------
  if (!activeReport) {
    return (
      <div style={pageStyle}>
        {currentMember?.role !== "member" && (
          <button
            type="button"
            style={pillBtn}
            onClick={() => {
              setActiveReport("teamLeaderboard");
              setSubmitted(false);
              setTeamId("");
              setWeekChoice("this");
            }}
          >
            <div style={h2}>Actions Leaderboard</div>
            <div style={{ marginTop: "4px", fontSize: "13px", color: "#6b7280" }}>
              Rank team members by total actions (weekly + cumulative).
            </div>
          </button>
        )}
      </div>
    );
  }

  // Actions Leaderboard report screen
  return (
    <ActionsLeaderboardReport
      teams={teams}
      teamId={teamId}
      setTeamId={setTeamId}
      weekChoice={weekChoice}
      setWeekChoice={setWeekChoice}
      weekLabel={weekLabel}
      submitted={submitted}
      setSubmitted={setSubmitted}
      onSubmit={onSubmit}
      loading={reportState.status === "loading"}
      failed={reportState.status === "failed"}
      errorMessage={reportState.errorMessage}
      leaderboard={reportState.actionsLeaderboard?.[0] || null}
      onBack={() => setActiveReport(null)}
    />
  );
}

export default ReportsTab;
