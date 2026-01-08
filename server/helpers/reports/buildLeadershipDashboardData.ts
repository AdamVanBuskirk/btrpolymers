// helpers/reports/buildLeadershipDashboardData.ts
import { Types } from "mongoose";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
const mongoose = require("mongoose");
const fns = require("date-fns");

// ---- Models ----
const Team = require("../../models/domain/Team");
const TeamUser = require("../../models/domain/TeamUser");
const CompanyUser = require("../../models/domain/CompanyUser");
const Outreach = require("../../models/domain/Outreach");
const User = require("../../models/domain/User");

const Action = require("../../models/domain/Action");
const CompanyAction = require("../../models/domain/CompanyAction");
const Amount = require("../../models/domain/Amount");
const CompanyAmount = require("../../models/domain/CompanyAmount");




type ColumnDef = { id: string; label: string };

export type LeaderboardDetail = {
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

export type Leaderboard = {
  teamId: string;
  weekChoice: string;

  actionColumns: ColumnDef[];
  amountColumns: ColumnDef[];

  shortRange: LeaderboardDetail[];
  longRange: LeaderboardDetail[];
};

const toObjId = (id: any) => {
  if (!id) return null;
  if (id instanceof mongoose.Types.ObjectId) return id;
  const s = String(id);
  if (!mongoose.Types.ObjectId.isValid(s)) return null;
  return new mongoose.Types.ObjectId(s);
};

const safeNameFromUser = (u: any) => {
  const full = `${(u?.firstName || "").trim()} ${(u?.lastName || "").trim()}`.trim();
  return full || u?.email || "Unknown";
};

const addRanks = (rows: LeaderboardDetail[]) => {
  const sorted = [...rows].sort((a, b) => b.totalActions - a.totalActions);

  let lastTotal: number | null = null;
  let lastRank = 0;

  return sorted.map((r, idx) => {
    const rank = lastTotal === r.totalActions ? lastRank : idx + 1;
    lastTotal = r.totalActions;
    lastRank = rank;
    return { ...r, rank };
  });
};

const sortColumns = (cols: ColumnDef[], sortMap: Map<string, number>) => {
  return [...cols].sort((a, b) => {
    const sa = sortMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const sb = sortMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    if (sa !== sb) return sa - sb;
    return (a.label || "").localeCompare(b.label || "");
  });
};

const mergeCols = (a: ColumnDef[], b: ColumnDef[], sortMap: Map<string, number>) => {
  const m = new Map<string, ColumnDef>();
  for (const c of a || []) m.set(c.id, c);
  for (const c of b || []) if (!m.has(c.id)) m.set(c.id, c);
  return sortColumns(Array.from(m.values()), sortMap);
};

export async function buildLeadershipDashboardData(args: {
  companyId: string;
  teamId: string; // "99" = company scope
  weekChoice: "this" | "last";
  timezone: string;
}): Promise<Leaderboard[]> {
  const { companyId, teamId, weekChoice } = args;

  const companyObjId = toObjId(companyId);
  if (!companyObjId) throw new Error("Invalid companyId.");

  // -------------------------
  // Date ranges
  // -------------------------
  /*
  const weekStartsOn = 0; // Sunday
  const base = weekChoice === "last" ? fns.subWeeks(new Date(), 1) : new Date();

  const shortStart = fns.startOfWeek(base, { weekStartsOn });
  const shortEnd = fns.endOfWeek(base, { weekStartsOn });

  const longStart = fns.startOfWeek(fns.subWeeks(shortStart, 11), { weekStartsOn });
  const longEnd = shortEnd;
*/
// -------------------------
// Date ranges
// -------------------------
// -------------------------
// Date ranges (timezone-aware)
// -------------------------
const tz = args.timezone || "America/New_York";
const weekStartsOn = 0; // Sunday

// "now" in user's timezone
const nowUtc = new Date();
const nowInTz = toZonedTime(nowUtc, tz);

// choose base week in user's timezone
const baseInTz = weekChoice === "last" ? fns.subWeeks(nowInTz, 1) : nowInTz;

// compute week bounds IN the user's timezone
const shortStartInTz = fns.startOfWeek(baseInTz, { weekStartsOn });
const shortEndInTz = fns.endOfWeek(baseInTz, { weekStartsOn });

// convert to UTC for Mongo queries
const shortStart = fromZonedTime(shortStartInTz, tz);
const shortEnd = fromZonedTime(shortEndInTz, tz);

// 12-week window
const longStartInTz = fns.startOfWeek(fns.subWeeks(shortStartInTz, 11), { weekStartsOn });
const longEndInTz = shortEndInTz;

const longStart = fromZonedTime(longStartInTz, tz);
const longEnd = fromZonedTime(longEndInTz, tz);


  // -------------------------
  // Scoped users
  // -------------------------
  let scopedUserIds: Types.ObjectId[] = [];

  const normalizedTeamId = String(teamId ?? "").trim();
  const isCompanyScope = normalizedTeamId === "99";

  if (!isCompanyScope) {
    const teamObjId = toObjId(normalizedTeamId);
    if (!teamObjId) throw new Error("Invalid teamId.");

    const team = await Team.findOne({ _id: teamObjId, companyId: companyObjId, active: true }).lean();
    if (!team) throw new Error("Team not found for this company.");

    // candidate users from TeamUser
    const candidateUserIds = await TeamUser.find({ teamId: teamObjId }).distinct("userId");

    if (!candidateUserIds.length) {
      return [
        {
          teamId: normalizedTeamId,
          weekChoice,
          actionColumns: [],
          amountColumns: [],
          shortRange: [],
          longRange: [],
        },
      ];
    }

    // filter candidates by includeInReports (missing => allowed)
    const allowedUserIds = await CompanyUser.find({
      companyId: companyObjId,
      userId: { $in: candidateUserIds },
      includeInReports: { $ne: false },
    }).distinct("userId");

    scopedUserIds = (allowedUserIds || []).map((id: any) => new mongoose.Types.ObjectId(String(id)));
  } else {
    const allowedUserIds = await CompanyUser.find({
      companyId: companyObjId,
      includeInReports: { $ne: false },
    }).distinct("userId");

    scopedUserIds = (allowedUserIds || []).map((id: any) => new mongoose.Types.ObjectId(String(id)));
  }

  // de-dupe
  scopedUserIds = Array.from(new Set(scopedUserIds.map((x) => String(x)))).map(
    (s) => new mongoose.Types.ObjectId(s)
  );

  if (!scopedUserIds.length) {
    return [
      {
        teamId: normalizedTeamId,
        weekChoice,
        actionColumns: [],
        amountColumns: [],
        shortRange: [],
        longRange: [],
      },
    ];
  }

  // -------------------------
  // Users (name/email)
  // -------------------------
  const users = await User.find({ _id: { $in: scopedUserIds } })
    .select({ firstName: 1, lastName: 1, email: 1 })
    .lean();

  const userMap = new Map<string, any>();
  for (const u of users || []) userMap.set(String(u._id), u);

  // -------------------------
  // CompanyUser active map for "(inactive)"
  // -------------------------
  const companyUsers = await CompanyUser.find({
    companyId: companyObjId,
    userId: { $in: scopedUserIds },
  })
    .select({ userId: 1, active: 1 })
    .lean();

  const companyActiveByUserId = new Map<string, boolean>();
  for (const cu of companyUsers || []) {
    companyActiveByUserId.set(String(cu.userId), cu.active !== false);
  }

  // -------------------------
  // Team name per user (first active TeamUser)
  // -------------------------
  const allTeamUsers = await TeamUser.find({ userId: { $in: scopedUserIds }, active: true }).lean();
  const teamIds = Array.from(new Set((allTeamUsers || []).map((tu: any) => String(tu.teamId)).filter(Boolean))).map(
    (s) => new mongoose.Types.ObjectId(s)
  );

  const teams = await Team.find({ _id: { $in: teamIds }, companyId: companyObjId, active: true }).lean();
  const teamMap = new Map<string, any>();
  for (const t of teams || []) teamMap.set(String(t._id), t);

  const userTeamName = new Map<string, string>();
  for (const tu of allTeamUsers || []) {
    const uid = String(tu.userId);
    if (userTeamName.has(uid)) continue;
    const t = teamMap.get(String(tu.teamId));
    if (t?.name) userTeamName.set(uid, t.name);
  }

  // -------------------------
  // Actions: label + type + sort + Call Type exclusion
  // -------------------------
  const actionDefs = await Action.find({ companyId: companyObjId, active: true })
    .select({ name: 1, type: 1, sort: 1 })
    .lean();

  const companyActions = await CompanyAction.find({ companyId: companyObjId, active: true })
    .select({ actionId: 1, name: 1, sort: 1 })
    .lean();

  const actionLabelById = new Map<string, string>();
  const actionTypeById = new Map<string, string>();
  const actionSortById = new Map<string, number>();

  for (const a of actionDefs || []) {
    const id = String(a._id);
    actionLabelById.set(id, (a as any).name || "—");
    actionTypeById.set(id, (a as any).type || "");
    const s = Number((a as any).sort);
    actionSortById.set(id, Number.isFinite(s) ? s : Number.MAX_SAFE_INTEGER);
  }

  for (const ca of companyActions || []) {
    const id = String((ca as any).actionId || "");
    if (!id) continue;
    if ((ca as any).name) actionLabelById.set(id, (ca as any).name);
    const s = Number((ca as any).sort);
    if (Number.isFinite(s)) actionSortById.set(id, s);
  }

  const callTypeActionIds = new Set<string>();
  for (const [id, label] of actionLabelById.entries()) {
    if (String(label || "").trim().toLowerCase() === "call type") callTypeActionIds.add(id);
  }

  // -------------------------
  // Amounts: label + sort
  // -------------------------
  const amountDefs = await Amount.find({ companyId: companyObjId, active: true })
    .select({ label: 1, sort: 1 })
    .lean();

  const companyAmounts = await CompanyAmount.find({ companyId: companyObjId, active: true })
    .select({ actionId: 1, label: 1, sort: 1 })
    .lean();

  const amountLabelById = new Map<string, string>();
  const amountSortById = new Map<string, number>();

  for (const a of amountDefs || []) {
    const id = String(a._id);
    amountLabelById.set(id, (a as any).label || "—");
    const s = Number((a as any).sort);
    amountSortById.set(id, Number.isFinite(s) ? s : Number.MAX_SAFE_INTEGER);
  }

  for (const ca of companyAmounts || []) {
    const id = String((ca as any).actionId || "");
    if (!id) continue;
    if ((ca as any).label) amountLabelById.set(id, (ca as any).label);
    const s = Number((ca as any).sort);
    if (Number.isFinite(s)) amountSortById.set(id, s);
  }

  // -------------------------
  // Build rows for a date range
  // -------------------------
  const buildForRange = async (rangeStart: Date, rangeEnd: Date) => {
    const docs = await Outreach.aggregate([
      {
        $lookup: {
          from: "prospects",
          localField: "prospectId",
          foreignField: "_id",
          as: "prospectDoc",
        },
      },
      { $unwind: "$prospectDoc" },
      {
        $match: {
          "prospectDoc.companyId": companyObjId,
          created: { $gte: rangeStart, $lte: rangeEnd },
          active: true,
          deleted: { $exists: false },
          userId: { $in: scopedUserIds }, // ✅ outreach owner
        },
      },
      {
        $project: {
          userId: "$userId",
          actions: 1,
          amounts: 1,
          success: 1,
        },
      },
    ]);

    const totalsByUser = new Map<string, { totalActions: number; submissions: number; successOfWeek: number }>();
    const actionsByUser = new Map<string, Record<string, number>>();
    const amountsByUser = new Map<string, Record<string, number>>();

    const actionIdsUsed = new Set<string>();
    const amountIdsUsed = new Set<string>();

    const addTotals = (
      uid: string,
      delta: Partial<{ totalActions: number; submissions: number; successOfWeek: number }>
    ) => {
      const cur = totalsByUser.get(uid) || { totalActions: 0, submissions: 0, successOfWeek: 0 };
      totalsByUser.set(uid, {
        totalActions: cur.totalActions + (delta.totalActions || 0),
        submissions: cur.submissions + (delta.submissions || 0),
        successOfWeek: cur.successOfWeek + (delta.successOfWeek || 0),
      });
    };

    const addToMap = (map: Map<string, Record<string, number>>, uid: string, key: string, val: number) => {
      if (!map.has(uid)) map.set(uid, {});
      map.get(uid)![key] = (map.get(uid)![key] || 0) + val;
    };

    for (const d of docs || []) {
      const uid = String(d.userId);
      let submissionHasAnyAction = false;

      if (d?.success === true) addTotals(uid, { successOfWeek: 1 });

      if (Array.isArray(d.actions)) {
        for (const act of d.actions) {
          const actionId = String(act?.name ?? "");
          if (!actionId) continue;
          if (callTypeActionIds.has(actionId)) continue;

          const type = actionTypeById.get(actionId);
          const raw = act?.value;

          let contribution = 0;

          if (type === "integer") {
            const valStr = String(raw ?? "").trim();
            if (valStr !== "") {
              const n = Number(valStr);
              if (!Number.isNaN(n)) contribution = n;
            }
          } else if (type === "boolean") {
            const v = String(raw ?? "").toLowerCase().trim();
            if (v === "true" || v === "1" || v === "yes") contribution = 1;
          } else {
            const v = String(raw ?? "").toLowerCase().trim();
            if (v !== "") {
              const n = Number(v);
              if (!Number.isNaN(n)) contribution = n;
              else if (v === "true") contribution = 1;
            }
          }

          if (contribution !== 0) {
            submissionHasAnyAction = true;
            addTotals(uid, { totalActions: contribution });
            addToMap(actionsByUser, uid, actionId, contribution);
            actionIdsUsed.add(actionId);
          }
        }
      }

      if (submissionHasAnyAction) addTotals(uid, { submissions: 1 });

      if (Array.isArray(d.amounts)) {
        for (const amt of d.amounts) {
          const amountId = String(amt?.name ?? "");
          if (!amountId) continue;

          const cleanedStr = String(amt?.value ?? "").replace(/[$,]/g, "");
          const num = Number(cleanedStr);
          const safeNum = Number.isNaN(num) ? 0 : num;

          if (safeNum !== 0) {
            addToMap(amountsByUser, uid, amountId, safeNum);
            amountIdsUsed.add(amountId);
          }
        }
      }
    }

    const actionColumnsRaw: ColumnDef[] = Array.from(actionIdsUsed)
      .filter((id) => !callTypeActionIds.has(id))
      .map((id) => ({ id, label: actionLabelById.get(id) || id }));

    const amountColumnsRaw: ColumnDef[] = Array.from(amountIdsUsed).map((id) => ({
      id,
      label: amountLabelById.get(id) || id,
    }));

    const actionColumns = sortColumns(actionColumnsRaw, actionSortById);
    const amountColumns = sortColumns(amountColumnsRaw, amountSortById);

    const rowsAllUsers: LeaderboardDetail[] = scopedUserIds.map((oid) => {
      const userId = String(oid);
      const u = userMap.get(userId);

      const t = totalsByUser.get(userId) || { totalActions: 0, submissions: 0, successOfWeek: 0 };
      const avg = t.submissions > 0 ? t.totalActions / t.submissions : 0;

      const baseName = safeNameFromUser(u);
      const isActive = companyActiveByUserId.get(userId) !== false;
      const fullName = !isActive ? `${baseName} (inactive)` : baseName;

      return {
        rank: 0,
        userId,
        fullName,
        email: u?.email || "",
        teamName: userTeamName.get(userId) || "",
        totalActions: t.totalActions,
        submissions: t.submissions,
        avgActionsPerSubmission: avg,
        successOfWeek: t.successOfWeek,
        actionsById: actionsByUser.get(userId) || {},
        amountsById: amountsByUser.get(userId) || {},
      };
    });

    return { actionColumns, amountColumns, rankedRows: addRanks(rowsAllUsers) };
  };

  const short = await buildForRange(shortStart, shortEnd);
  const long = await buildForRange(longStart, longEnd);

  const actionColumns = mergeCols(short.actionColumns, long.actionColumns, actionSortById);
  const amountColumns = mergeCols(short.amountColumns, long.amountColumns, amountSortById);

  return [
    {
      teamId: normalizedTeamId,
      weekChoice,
      actionColumns,
      amountColumns,
      shortRange: short.rankedRows,
      longRange: long.rankedRows,
    },
  ];
}
