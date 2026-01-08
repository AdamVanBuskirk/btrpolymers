import { buildLeadershipDashboardData } from "../../helpers/reports/buildLeadershipDashboardData";
import type { Leaderboard } from "../../helpers/reports/buildLeadershipDashboardData";

export type LeadershipDashboardReport = {
  subject: string;
  html: string;
  pdfBuffer?: Buffer; // optional later
  data: Leaderboard[];
};

export async function buildLeadershipDashboardReport(args: {
  companyId: string;
  teamId: string;
  weekChoice: "this" | "last";
  timezone: string;
}): Promise<LeadershipDashboardReport> {
  const data = await buildLeadershipDashboardData({
    companyId: args.companyId,
    teamId: args.teamId,
    weekChoice: args.weekChoice,
    timezone: args.timezone,
  });

  const subject = "Leadership Dashboard Report";

  // Minimal HTML for now (you can make this richer later)
  const html = renderLeadershipDashboardEmailHtml({
    data,
    teamId: args.teamId,
    weekChoice: args.weekChoice,
    timezone: args.timezone,
  });

  return { subject, html, data };
}

// Keep rendering isolated so you can improve later without touching job/controller
function renderLeadershipDashboardEmailHtml(opts: {
  data: Leaderboard[];
  teamId: string;
  weekChoice: "this" | "last";
  timezone?: string;
}) {
  const title = `Leadership Dashboard (${opts.weekChoice === "last" ? "Last Week" : "This Week"})`;
  const scope = opts.teamId === "99" ? "Company" : `Team ${opts.teamId}`;

  // super light summary (works today, no PDF needed yet)
  const rows = (opts.data?.[0]?.shortRange || []).slice(0, 10);

  const top10 = rows
    .map(
      (r) => `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">${r.rank}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">${escapeHtml(r.fullName)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;">${r.totalActions}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;">${r.submissions}</td>
      </tr>
    `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.4;">
      <table style="border-collapse:collapse;width:100%;font-size:14px;">
        <thead>
          <tr>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid #ddd;">Rank</th>
            <th style="text-align:left;padding:6px 8px;border-bottom:2px solid #ddd;">Member</th>
            <th style="text-align:right;padding:6px 8px;border-bottom:2px solid #ddd;">Actions</th>
            <th style="text-align:right;padding:6px 8px;border-bottom:2px solid #ddd;">Submissions</th>
          </tr>
        </thead>
        <tbody>
          ${top10 || `<tr><td colspan="4" style="padding:10px;color:#666;">No data for this period.</td></tr>`}
        </tbody>
      </table>

      <div style="margin-top:16px;font-size:12px;color:#666;">
        Open SalesDoing to view the full dashboard.
      </div>
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
