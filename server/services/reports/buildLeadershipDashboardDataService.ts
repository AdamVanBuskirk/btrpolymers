import { buildLeadershipDashboardData } from "../../helpers/reports/buildLeadershipDashboardData";
import type { Leaderboard } from "../../helpers/reports/buildLeadershipDashboardData";

export async function buildLeadershipDashboardDataService(args: {
  companyId: string;
  teamId: string;
  weekChoice: "this" | "last";
  timezone: string;
}): Promise<Leaderboard[]> {
  return buildLeadershipDashboardData(args);
}
