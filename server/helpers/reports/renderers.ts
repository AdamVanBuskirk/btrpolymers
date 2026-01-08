// reports/renderers.ts
import { rowsToCsv, CsvColumn } from "../../helpers/csv";
import { buildLeadershipDashboardReport } from "../../services/reports/buildLeadershipDashboardReport";
import { buildLeadershipDashboardData } from "./buildLeadershipDashboardData";

// NOTE: replace these with your real reportType union if you have one
export type ReportType = "actions_leaderboard" | string;

type RenderArgs = {
  companyId: string;
  reportConfig: any;
  timezone: string;
  // optionally add: timezone, etc.
};

export type RenderResult = {
  filename: string;
  contentType: string;
  buffer: Buffer;
};

function safeFilePart(s: string) {
  return String(s || "")
    .trim()
    .replace(/[\/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

function weekLabel(weekChoice: string) {
    return weekChoice === "last" ? "Last Week" : "This Week";
  }
  


  function sumSectionRows(
    rows: Array<Record<string, any>>,
    actionCols: Array<{ id: string }>,
    amountCols: Array<{ id: string }>
  ) {
    const totals: Record<string, any> = {
      email: "",
      fullName: "Total",
      teamName: "",
      goal: "",
    };
  
    let totalActions = 0;
    let submissions = 0;
    let successOfWeek = 0;
  
    // dynamic sums
    for (const c of actionCols) totals[`a:${c.id}`] = 0;
    for (const c of amountCols) totals[`m:${c.id}`] = 0;
  
    for (const r of rows) {
      totalActions += Number(r.totalActions || 0);
      submissions += Number(r.submissions || 0);
      successOfWeek += Number(r.successOfWeek || 0);
  
      for (const c of actionCols) {
        totals[`a:${c.id}`] += Number(r[`a:${c.id}`] || 0);
      }
      for (const c of amountCols) {
        totals[`m:${c.id}`] += Number(r[`m:${c.id}`] || 0);
      }
    }
  
    totals.totalActions = totalActions;
    totals.submissions = submissions;
    totals.avgActionsPerSubmission = submissions > 0 ? totalActions / submissions : 0;
    totals.successOfWeek = successOfWeek;
  
    return totals;
  }
  
  function buildSectionCsv(
    sectionTitle: string,
    columns: CsvColumn[],
    sectionRows: Record<string, any>[],
    actionCols: Array<{ id: string }>,
    amountCols: Array<{ id: string }>
  ) {
    const totalRow = sumSectionRows(sectionRows, actionCols, amountCols);
  
    const csv = rowsToCsv(columns, [...sectionRows, totalRow]);
  
    return `${sectionTitle}\r\n${csv}`;
  }
  
  async function renderActionsLeaderboardCsv(args: RenderArgs): Promise<RenderResult> {
    const { companyId, reportConfig, timezone } = args;
  
    const teamId = String(reportConfig?.teamId ?? "99");
    const weekChoice = reportConfig?.weekChoice === "last" ? "last" : "this";
  
    // returns: [ { actionColumns, amountColumns, shortRange, longRange, teamId, weekChoice } ]
    const result = await buildLeadershipDashboardData({
      companyId,
      teamId,
      weekChoice,
      timezone,
    });
/*
    console.log("RANGE COUNTS", {
        short: result[0].shortRange?.length,
        long: result[0].longRange?.length,
    });
    
    console.log("RANGE SAMPLE", {
    short0: result[0].shortRange?.[0],
    long0: result[0].longRange?.[0],
    });
    
    // quick fingerprint so you can see if they’re identical
    const shortFp = JSON.stringify(result[0].shortRange?.[0] ?? {});
    const longFp = JSON.stringify(result[0].longRange?.[0] ?? {});
    console.log("RANGE FP EQUAL?", shortFp === longFp);
  */
    const report = Array.isArray(result) ? result[0] : result;
    if (!report) {
      return {
        filename: `actions-leaderboard-${safeFilePart(teamId)}-${safeFilePart(weekChoice)}.csv`,
        contentType: "text/csv",
        buffer: Buffer.from("No data", "utf8"),
      };
    }
  
    // Match UI: filter out "Call Type" if present
    const actionCols = (report.actionColumns || []).filter((c: any) => {
      const lbl = String(c?.label || "").trim().toLowerCase();
      return lbl !== "call type";
    });
  
    const amountCols = (report.amountColumns || []).filter((c: any) => {
      const lbl = String(c?.label || "").trim().toLowerCase();
      return lbl !== "call type";
    });
  
    // Columns must match download CSV
    const columns: CsvColumn[] = [
      { id: "email", label: "Email" },
      { id: "fullName", label: "Name" },
      { id: "teamName", label: "Team" },
      { id: "goal", label: "Goal" },
  
      ...actionCols.map((c: any) => ({ id: `a:${c.id}`, label: c.label || c.id })),
  
      { id: "totalActions", label: "Total Actions" },
      { id: "submissions", label: "# Submissions" },
      { id: "avgActionsPerSubmission", label: "Avg Actions / Submission" },
      { id: "successOfWeek", label: "Success of Week" },
  
      ...amountCols.map((c: any) => ({ id: `m:${c.id}`, label: c.label || c.id })),
    ];
  
    const mapRow = (m: any) => {
      const out: Record<string, any> = {
        email: m.email ?? "",
        fullName: m.fullName ?? "",
        teamName: m.teamName ?? "",
        goal: m.goal ?? m.actionGoal ?? "",
  
        totalActions: Number(m.totalActions || 0),
        submissions: Number(m.submissions || 0),
        avgActionsPerSubmission: Number(m.avgActionsPerSubmission || 0),
        successOfWeek: Number(m.successOfWeek || 0),
      };
  
      for (const c of actionCols) out[`a:${c.id}`] = Number(m.actionsById?.[c.id] || 0);
      for (const c of amountCols) out[`m:${c.id}`] = Number(m.amountsById?.[c.id] || 0);
  
      return out;
    };
  
    const shortRows = (report.shortRange || []).map(mapRow);
    const longRows = (report.longRange || []).map(mapRow);
  
    // ---- Match the download-button CSV structure ----
    const teamLabel = teamId === "99" ? "Entire Company" : teamId;
  
    const headerBlock =
      `Actions Leaderboard - ${teamLabel}\r\n` +
      `Week: ${weekLabel(weekChoice)}\r\n\r\n`;
  
    //const shortBlock = buildSectionCsv("This Week", columns, shortRows, actionCols, amountCols);
    
    const periodTitle = weekChoice === "last" ? "Last Week" : "This Week";
    const shortBlock = buildSectionCsv(periodTitle, columns, shortRows, actionCols, amountCols);

    const longBlock = buildSectionCsv("Past 12 Weeks", columns, longRows, actionCols, amountCols);
  
    const finalCsv = `${headerBlock}${shortBlock}\r\n\r\n\r\n${longBlock}`;
  
    const buf = Buffer.from(finalCsv, "utf8");
  
    return {
      filename: `actions-leaderboard-${safeFilePart(teamLabel)}-${safeFilePart(weekLabel(weekChoice))}.csv`,
      contentType: "text/csv",
      buffer: buf,
    };
  }
  

/**
 * ✅ Your existing report builder for the leaderboard.
 * Replace this with your current function/import.
 */
async function buildActionsLeaderboardReport(companyId: string, reportConfig: any): Promise<any> {
  // TODO: call your existing report service/controller logic here.
  // Return something that includes rows/members + optional teamLabel/weekLabel.
  
  //throw new Error("buildActionsLeaderboardReport not wired up");

  return await buildLeadershipDashboardReport({
    companyId: companyId,
    teamId: reportConfig?.teamId ?? "99",
    weekChoice: reportConfig?.weekChoice === "last" ? "last" : "this",
    timezone: reportConfig?.timezone,
  });
  
/*
  return await buildLeadershipDashboardData({
    companyId: companyId,
    teamId: reportConfig.teamId,
    weekChoice: reportConfig.weekChoice,
  });
*/
}

export async function renderCsvForSubscription(
  reportType: ReportType,
  args: RenderArgs
): Promise<RenderResult> {
  switch (reportType) {
    case "actions_leaderboard":
      return renderActionsLeaderboardCsv(args);
    default:
      throw new Error(`CSV rendering not implemented for reportType: ${reportType}`);
  }
}
