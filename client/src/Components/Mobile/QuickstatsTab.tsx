// src/Components/Mobile/QuickStatsMobile.tsx
import React, { useEffect, useMemo, useState } from "react";
import { IoRefresh } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../Core/hooks";
import {
  getQuickStats,
  getSettings,
  setStatsScope,
  setStatsTimeframe,
  setStatsTeam, 
} from "../../Store/Settings";
import { getCompany } from "../../Store/Company";
import { formatDollars } from "../../Helpers/formatDollars";
import ProgressBar from "../Controls/ProgressBar";
import { Team } from "../../Models/Team";

type Scope = "me" | "team" | "company";
type Timeframe = "week" | "month" | "year" | "all";

function QuickStatsTab() {
  const dispatch = useAppDispatch();
  const companyState = useAppSelector(getCompany);
  const settingsState = useAppSelector(getSettings);

  // ✅ dialog state
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [hoverTeamId, setHoverTeamId] = useState<string | null>(null);

  const companyId = companyState.company?._id ?? "";

  // ✅ pull teams from state (same place you used in desktop)
  const teams: Team[] = ((companyState as any).teams ?? []) as Team[];

  // ✅ selected team id (adjust if your store uses a different field name)
  const selectedTeamId =
    (settingsState.settings as any).quickStatsTeamId ??
    (settingsState.settings as any).statsTeam ??
    "";

  const selectedTeamName = useMemo(() => {
    const t = teams.find((x) => x._id === selectedTeamId);
    return t?.name ?? "";
  }, [teams, selectedTeamId]);

  const statsTimeframe = (settingsState.settings.statsTimeframe ?? "week") as Timeframe;
  const statsScope = (settingsState.settings.statsScope ?? "me") as Scope;

  const timeframeLabelMap: Record<Timeframe, string> = {
    week: "Weekly",
    month: "Monthly",
    year: "Year-to-Date",
    all: "All-Time",
  };

  // ✅ if a team is selected, force scope = team (matches desktop behavior)
  useEffect(() => {
    if (selectedTeamId && selectedTeamId !== "") {
      dispatch(setStatsScope("team"));
    }
  }, [dispatch, selectedTeamId]);

  useEffect(() => {
    dispatch(
      getQuickStats({
        companyId,
        scope: statsScope,
        timeframe: statsTimeframe,
        teamId: selectedTeamId, // ✅ include
      })
    );
  }, [
    dispatch,
    companyId,
    statsScope,
    statsTimeframe,
    selectedTeamId,
    companyState.company?.actionGoal,
    companyState.outreach,
  ]);

  const refreshStats = () => {
    dispatch(
      getQuickStats({
        companyId,
        scope: statsScope,
        timeframe: statsTimeframe,
        teamId: selectedTeamId, // ✅ include
      })
    );
  };

  const handlePickTeam = (teamId: string) => {

    dispatch(setStatsTeam(teamId));
    dispatch(setStatsScope("team"));
    setTeamDialogOpen(false);
  };

  // Labels (kept consistent with your existing logic)
  let opportunity_label = "New Opp";
  let quoted_label = "Quoted";
  let closed_label = "Closed";
  let annualized_label = "New Opp (Annualized)";

  const opportunity = companyState.amounts.find((a) => a.label === "New Opportunity $ Value");
  if (opportunity) {
    const companyOpportunity = companyState.companyAmounts.find((a) => a.actionId === opportunity?._id);
    if (companyOpportunity) opportunity_label = companyOpportunity.label;
  }

  const quoted = companyState.amounts.find((a) => a.label === "Quote or Proposal Amount");
  if (quoted) {
    const companyQuoted = companyState.companyAmounts.find((a) => a.actionId === quoted?._id);
    if (companyQuoted) quoted_label = companyQuoted.label;
  }

  const closed = companyState.amounts.find((a) => a.label === "Closed Amount");
  if (closed) {
    const companyClosed = companyState.companyAmounts.find((a) => a.actionId === closed?._id);
    if (companyClosed) closed_label = companyClosed.label;
  }

  const annualized = companyState.amounts.find((a) => a.label === "Annualized Value");
  if (annualized) {
    const companyAnnualized = companyState.companyAmounts.find((a) => a.actionId === annualized?._id);
    if (companyAnnualized) annualized_label = companyAnnualized.label;
  }

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "14px",
    margin: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
    position: "relative",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  };

  const titleStyle: React.CSSProperties = {
    color: "#111827",
    fontSize: "15px",
    fontWeight: 700,
  };

  const refreshStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#6b7280",
    fontSize: "13px",
    cursor: "pointer",
  };

  const pillRowStyle: React.CSSProperties = {
    display: "flex",
    gap: "8px",
    paddingBottom: "6px",
    marginBottom: "10px",
  };

  const pillStyle = (active: boolean): React.CSSProperties => ({
    flex: "0 0 auto",
    padding: "4px 8px",
    borderRadius: "999px",
    border: active ? "1px solid #000" : "1px solid #e5e7eb",
    background: active ? "#000" : "#f9fafb",
    color: active ? "#fff" : "#374151",
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  });

  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderTop: "1px solid #f1f5f9",
  };

  const labelStyle: React.CSSProperties = {
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: 600,
  };

  const valueStyle: React.CSSProperties = {
    color: "#111827",
    fontSize: "14px",
    fontWeight: 700,
  };

  // ✅ team link styles
  const teamLinkStyle: React.CSSProperties = {
    marginTop: "8px",
    fontSize: "12px",
    color: "#6b7280",
    textAlign: "center",
    cursor: "pointer",
    userSelect: "none",
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>{timeframeLabelMap[statsTimeframe]} Stats</div>
        <div style={refreshStyle} onClick={refreshStats}>
          <IoRefresh />
          Refresh
        </div>
      </div>

      {/* Scope pills */}
      <div style={pillRowStyle}>
        {[
          { key: "me" as const, label: "Me" },
          { key: "team" as const, label: "Team" },
          { key: "company" as const, label: "Company" },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            style={pillStyle(statsScope === opt.key)}
            onClick={() => {
              // ✅ same behavior as desktop: selecting Team with no team picked opens dialog
              if (opt.key === "team" && (!selectedTeamId || selectedTeamId === "")) {
                setTeamDialogOpen(true);
                return;
              }
              dispatch(setStatsScope(opt.key));
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Timeframe pills */}
      <div style={pillRowStyle}>
        {[
          { key: "week" as const, label: "Weekly" },
          { key: "month" as const, label: "Monthly" },
          { key: "year" as const, label: "YTD" },
          { key: "all" as const, label: "All-Time" },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            style={pillStyle(statsTimeframe === opt.key)}
            onClick={() => dispatch(setStatsTimeframe(opt.key))}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "6px", marginBottom: "8px" }}>
        <ProgressBar actions={settingsState.quickStatsActions} goal={settingsState.quickStatsActionGoal} />
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>Actions</span>
        <span style={valueStyle}>{(settingsState.quickStatsActions ?? 0).toLocaleString()}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>{opportunity_label}</span>
        <span style={valueStyle}>{formatDollars(settingsState.quickStatsNewOpps)}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>{annualized_label}</span>
        <span style={valueStyle}>{formatDollars(settingsState.quickStatsNewOppAnnualized)}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>{quoted_label}</span>
        <span style={valueStyle}>{formatDollars(settingsState.quickStatsQuoted)}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>{closed_label}</span>
        <span style={valueStyle}>{formatDollars(settingsState.quickStatsClosed)}</span>
      </div>

      {/* ✅ Team selector link (same idea as desktop "change team") */}
      <div
        style={teamLinkStyle}
        onClick={() => setTeamDialogOpen(true)}
      >
        {selectedTeamName ? `${selectedTeamName} (change)` : "select team"}
      </div>

      {/* ✅ Team dialog */}
      {teamDialogOpen && (
        <div
          onClick={() => setTeamDialogOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#0B2230",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          
              // ✅ critical
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div style={{ color: "#D9DADB", fontSize: "12pt", fontWeight: 600 }}>
                Choose a Team
              </div>
              <button
                type="button"
                onClick={() => setTeamDialogOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#bec1c3",
                  fontSize: "16pt",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {(!teams || teams.length === 0) ? (
              <div style={{ color: "#9aa0a6", fontSize: "10pt", padding: "10px 2px" }}>
                No teams exist within the company.
              </div>
            ) : (
              <div  style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: "8px",
            
                // ✅ THESE FIX THE BREAKOUT
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                paddingRight: "6px",
              }}>
                {teams.map((t: Team) => {
                  const isSelected = selectedTeamId === t._id;
                  const isHovered = hoverTeamId === t._id;

                  return (
                    <button
                      key={t._id}
                      type="button"
                      onMouseEnter={() => setHoverTeamId(t._id)}
                      onMouseLeave={() => setHoverTeamId(null)}
                      onClick={() => handlePickTeam(t._id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        borderRadius: "10px",
                        padding: "10px 12px",
                        cursor: "pointer",
                        transition: "transform 0.12s ease, background 0.12s ease, border-color 0.12s ease",
                        background: isSelected ? "#233A47" : isHovered ? "#0E2A3A" : "#051A26",
                        border: isSelected
                          ? "1px solid #FF8A4C"
                          : isHovered
                            ? "1px solid rgba(255,255,255,0.18)"
                            : "1px solid rgba(255,255,255,0.08)",
                        color: isSelected ? "#FF8A4C" : "#D9DADB",
                        transform: isHovered ? "translateY(-1px)" : "translateY(0px)",
                      }}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuickStatsTab;
