import { Request, Response } from 'express';
import { getUser } from '../helpers/getUser';
import { IUserSetting } from '../models/domain/UserSetting';
import { IActivity } from '../models/domain/Activity';
import { ICompanyUser } from '../models/domain/CompanyUser';
import { IUserRole } from '../models/domain/UserRole';
import { IRole } from '../models/domain/Role';
import { IProspect } from '../models/domain/Prospect';
import mongoose from 'mongoose';

const Role = require('../models/domain/Role');
const UserRole = require('../models/domain/UserRole');
const UserSetting = require('../models/domain/UserSetting');
const CompanyUser = require('../models/domain/CompanyUser');
const Company = require('../models/domain/Company');
const fns = require('date-fns');
const Settings = require('../models/domain/Setting');
const activityController = require('./ActivityController');

const Prospect = require("../models/domain/Prospect");
const Outreach = require("../models/domain/Outreach");
const Team = require("../models/domain/Team");
const TeamUser = require("../models/domain/TeamUser");
const Action = require("../models/domain/Action");
const Amount = require("../models/domain/Amount");


type Scope = "me" | "team" | "company";
type Timeframe = "week" | "month" | "year" | "all";

// when we get our first "real" live customer, I will increment below to 2.0 to represent live with customers */
const currentVersion = "1.0.66";

const heartbeat = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not logged in' });
    res.status(200).json({ 'version': currentVersion });
}


const getSettings = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies);
    if (foundUser === null)
      return res.status(403).json({ message: "Settings not found" });
  
    try {
      const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
      const settings = await UserSetting.findOne({
        userId: foundUser._id,
      }).exec();
  
      if (settings) {
        /* statsTeam was added later and not always present */
        settings.statsTeam = settings.statsTeam ?? "";
        return res.status(200).json(settings);
      } else {
        /* retrieve companyId */
        const company: ICompanyUser = await CompanyUser.findOne({
          userId: foundUser._id,
        });
  
        let loadedComponentType = "settings";
  
        // NEW: instead of a string, must be an object
        // default for an owner/admin:
        // loadedSubComponentType = { settings: "company" }
        // default for worker:
        // loadedSubComponentType = { work: "" }
  
        let loadedSubComponentType: Record<string, unknown> = {
          settings: "company",
        };
  
        const userRole: IUserRole = await UserRole.findOne({
          userId: foundUser._id,
          companydId: company.companyId,
          active: true,
        }).exec();
  
        if (!userRole)
          return res.status(401).json({ message: "Invalid UserRole" });
  
        const role: IRole = await Role.findOne({
          _id: userRole.roleId,
          active: true,
        }).exec();
  
        if (!role) return res.status(401).json({ message: "Invalid Role" });
  
        // If not admin or owner, default them to work mode
        if (role.name !== "owner" && role.name !== "admin") {
          loadedComponentType = "work";
          loadedSubComponentType = { work: "" };
        }

        // For advisors, load the data tab
        if (role.name === "advisor") { 
          loadedComponentType = "data";
          loadedSubComponentType = { data: "scorecards" };
        }
  
        const newSettings = {
          userId: foundUser._id,
          sidebarExpanded: true,
          loadedCompanyId: company.companyId,
          loadedComponentType: loadedComponentType,
          loadedSubComponentType: loadedSubComponentType, // <-- JSON object now
          created: now,
          modified: now,
          otherCompanies: [],
          statsScope: "me",
          statsTimeframe: "week",
          statsTeam: ""
        };
  
        await UserSetting.create(newSettings);
  
        return res.status(200).json(newSettings);
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };
  

/*
const getSettings = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies);
    if (foundUser === null) return res.status(403).json({ 'message': 'Settings not found' });
    try {
        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        const settings = await UserSetting.findOne({ userId: foundUser._id }).exec();       
        if (settings) {
            return res.status(200).json(settings);
        } else {
            // retrieve companyId
            let company: ICompanyUser = await CompanyUser.findOne({ userId: foundUser._id });

            let loadedComponentType = "settings";
            let loadedSubComponentType = "company";

            const userRole: IUserRole = await UserRole.findOne({ userId: foundUser._id, companydId: company.companyId, active: true }).exec();
            if (!userRole) return res.status(401).json({ 'message': 'Invalid UserRole' }); //Unauthorized 

            const role: IRole = await Role.findOne({ _id: userRole.roleId, active: true }).exec();
            if (!role) return res.status(401).json({ 'message': 'Invalid Role' }); //Unauthorized 

            if (role.name !== "owner" && role.name !== "admin") {
                loadedComponentType = "work";
                loadedSubComponentType = "";
            }
            
            const settings = {
                userId: foundUser._id,
                sidebarExpanded: true, 
                loadedCompanyId: company.companyId,
                loadedComponentType: loadedComponentType,
                loadedSubComponentType: loadedSubComponentType,
                created: now,
                modified: now,
                otherCompanies: []
            };

            UserSetting.create(settings);
            return res.status(200).json(settings);
        }
    } catch (err: any) {
        res.status(500).json({ 'message': err.message });
    }
}
*/
const getOtherCompanies = async (req: Request, res: Response) => {
    
    const { companyId } = req.params;
    if (!companyId) return res.status(403).json({ 'message': 'Invalid payload' });
    
    const foundUser = await getUser(req.cookies);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized' });

    try {
        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");

        // Find all CompanyUser records for this user other than the loaded company
        const companyUsers: ICompanyUser[] = await CompanyUser.find({
            userId: foundUser._id,
            companyId: { $ne: companyId }
          }).exec();
          
          // Extract all company IDs
          const companyIds = companyUsers.map(cu => cu.companyId);
          
          // 3Fetch full company records for those IDs
          const otherCompanies = await Company.find({
            _id: { $in: companyIds }
          }).exec();

        return res.status(200).json(otherCompanies);
        
    } catch (err: any) {
        res.status(500).json({ 'message': err.message });
    }
}

const loadComponent = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    if (req.body.type === undefined) return res.status(400).json({ 'message' : 'Invalid call body' });
    const { type } = req.body;
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
    try {
        const updateFields: any = {
          loadedComponentType: type,
          modified: now
        };

        await UserSetting.updateOne(
          { userId: foundUser._id },
          { $set: updateFields }
        ).exec();

        res.status(200).json({
            loadedComponentType: type
        });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

const loadSubComponent = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies);
    if (foundUser === null)
      return res.status(403).json({ message: "Not authorized." });
  
    if (!req.body.parent || !req.body.child)
      return res.status(400).json({ message: "Invalid call body" });
  
    const { parent, child } = req.body;
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
  
    try {
      // Build the dynamic update path:
      const updatePath = `loadedSubComponentType.${parent}`;
  
      await UserSetting.updateOne(
        { userId: foundUser._id },
        {
          $set: {
            [updatePath]: child, // <--- dynamic key update
            modified: now,
          },
        }
      ).exec();
  
      await activityController.register({
        userId: foundUser._id,
        section: "sidebar",
        object: "user",
        objectId: foundUser._id,
        action: "Tab loaded",
        description: `${foundUser.firstName} ${foundUser.lastName} loaded tab ${child}.`,
        created: now,
      });
  
      res.status(200).json({
        loadedSubComponentType: { [parent]: child },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
  

/*
const loadSubComponent = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    if (req.body.parent === undefined || req.body.child === undefined) return res.status(400).json({ 'message' : 'Invalid call body' });
    const { parent, child } = req.body;
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
    try {
        const updateFields: any = {
          loadedSubComponentType: type,
          modified: now,
        };

        await UserSetting.updateOne(
          { userId: foundUser._id },
          { $set: updateFields }
        ).exec();

        activityController.register({
            userId: foundUser._id,
            section: "sidebar",
            object: "user",
            objectId: foundUser._id,
            action: "Tab loaded",
            description: `${foundUser.firstName} ${foundUser.lastName} loaded tab ${type}.`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        res.status(200).json({
            loadedSubComponentType: type
        });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}
*/
const savePreviousComponent = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    if (req.body.type === undefined) return res.status(400).json({ 'message' : 'Invalid call body' });
    const { type } = req.body;
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
    
    try {
        await UserSetting.updateOne({ userId: foundUser._id }, { $set: { 
            previousComponentType: type, 
            modified: now 
        }}).exec();

        activityController.register({
            userId: foundUser._id,
            section: "sidebar",
            object: "user",
            objectId: foundUser._id,
            action: "Subtab loaded",
            description: `${foundUser.firstName} ${foundUser.lastName} loaded subtab ${type}.`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });
        
        res.status(200).json({ previousComponentType: type });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

const expandSidebar = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    if (req.body.value === undefined) return res.status(400).json({ 'message' : 'Invalid call body' });
    
    const { value } = req.body;
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
    
    try {
        await UserSetting.updateOne({ userId: foundUser._id }, { $set: { sidebarExpanded: value, modified: now } }).exec();

        let action = (value) ? "maximize" : "minimize";
        activityController.register({
            userId: foundUser._id,
            section: "sidebar",
            object: "user",
            objectId: foundUser._id,
            action: action,
            description: `${foundUser.firstName} ${foundUser.lastName} ${action}d the sidebar.`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        res.status(200).json(value);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

const updateLoadedCompanyId = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    if (req.body.companyId=== undefined) return res.status(400).json({ 'message' : 'Invalid call body' });
    
    const { companyId } = req.body;
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
    
    try {
        await UserSetting.updateOne({ userId: foundUser._id }, { $set: { loadedCompanyId: companyId, modified: now } }).exec();
        activityController.register({
            userId: foundUser._id,
            section: "topnav",
            object: "company",
            objectId: companyId,
            action: "User switched companies",
            description: `${foundUser.firstName} ${foundUser.lastName} switched companies.`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        res.status(200).json(companyId);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

const setStatsScope = async (req: Request, res: Response) => {
  const foundUser = await getUser(req.cookies);
  if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
  if (req.body.scope=== undefined) return res.status(400).json({ 'message' : 'Invalid call body' });
  
  const { scope } = req.body;
  const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
  
  try {
      await UserSetting.updateOne({ userId: foundUser._id }, { $set: { statsScope: scope, modified: now } }).exec();
      activityController.register({
          userId: foundUser._id,
          section: "leftnav",
          object: "user",
          objectId: foundUser._id,
          action: "User switched stats scope",
          description: `${foundUser.firstName} ${foundUser.lastName} changed their stats scope to ${scope}.`,
          created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
      });

      res.status(200).json(scope);
  } catch (err: any) {
      res.status(500).json({ error: err.message });
  }
}

const setStatsTimeframe = async (req: Request, res: Response) => {
  const foundUser = await getUser(req.cookies);
  if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
  if (req.body.timeframe === undefined) return res.status(400).json({ 'message' : 'Invalid call body' });
  
  const { timeframe } = req.body;
  const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
  
  try {
      await UserSetting.updateOne({ userId: foundUser._id }, { $set: { statsTimeframe: timeframe, modified: now } }).exec();
      activityController.register({
          userId: foundUser._id,
          section: "leftnav",
          object: "user",
          objectId: foundUser._id,
          action: "User switched stats timeframe",
          description: `${foundUser.firstName} ${foundUser.lastName} changed their stats timeframe to ${timeframe}.`,
          created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
      });

      res.status(200).json(timeframe);
  } catch (err: any) {
      res.status(500).json({ error: err.message });
  }
}

export const getQuickStats = async (req: Request, res: Response) => {
  const { companyId, scope, timeframe, teamId } = req.params as {
    companyId: string;
    scope: Scope;
    timeframe: Timeframe;
    teamId: string;
  };

  if (!scope || !timeframe || !companyId || !teamId)
    return res.status(403).json({ message: "Invalid payload" });

  const foundUser = await getUser(req.cookies, "company", companyId);
  if (!foundUser) return res.status(403).json({ message: "Not authorized" });

  try {
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");

    const userRole: IUserRole = await UserRole.findOne({
      userId: foundUser._id,
      companyId: companyId,
      active: true,
    }).exec();

    if (!userRole) return res.status(401).json({ message: "Invalid UserRole" });

    const role: IRole = await Role.findOne({
      _id: userRole.roleId,
      active: true,
    }).exec();

    if (!role) return res.status(401).json({ message: "Invalid Role" });

    // ----------------------------
    // 1) Users in scope
    //    ✅ Only include users where includeInReports !== false
    //       (treat missing field as "true" for backward compatibility)
    // ----------------------------
    let userIdsInScope: string[] = [];

    // helper: given candidate userIds, keep only those with includeInReports !== false
    const filterUserIdsByIncludeInReports = async (candidateUserIds: string[]) => {
      if (!candidateUserIds?.length) return [];
      const allowed = await CompanyUser.find({
        companyId,
        active: true,
        userId: { $in: candidateUserIds },
        includeInReports: { $ne: false }, // ✅ missing => allowed
      }).distinct("userId");
      return allowed.map((id: any) => id.toString());
    };

    if (scope === "me") {
      // me must have includeInReports !== false
      const meAllowed = await CompanyUser.findOne({
        companyId,
        active: true,
        userId: foundUser._id,
        includeInReports: { $ne: false },
      }).select("userId");

      if (!meAllowed) {
        return res.status(200).json({
          quickStatsActions: 0,
          quickStatsNewOpps: 0,
          quickStatsNewOppAnnualized: 0,
          quickStatsQuoted: 0,
          quickStatsClosed: 0,
          quickStatsActionGoal: 0,
        });
      }

      userIdsInScope = [foundUser._id.toString()];
    } else if (scope === "team") {
      const normalizedTeamId = typeof teamId === "string" ? teamId.trim() : "";

      // treat "", "undefined", "null" as not provided
      const hasExplicitTeamId =
        !!normalizedTeamId &&
        normalizedTeamId !== "undefined" &&
        normalizedTeamId !== "null" &&
        mongoose.Types.ObjectId.isValid(normalizedTeamId);

      let teamIds: any[];

      if (role.name !== "member") {
        if (hasExplicitTeamId) {
          teamIds = [new mongoose.Types.ObjectId(normalizedTeamId)];
        } else {
          teamIds = await Team.find({ companyId, active: true })
            .where("_id")
            .in(await TeamUser.find({ userId: foundUser._id, active: true }).distinct("teamId"))
            .distinct("_id");
        }
      } else {
        teamIds = await Team.find({ companyId, active: true })
          .where("_id")
          .in(await TeamUser.find({ userId: foundUser._id, active: true }).distinct("teamId"))
          .distinct("_id");
      }

      if (!teamIds.length) {
        // fall back to "me" (but still require includeInReports)
        const meAllowed = await CompanyUser.findOne({
          companyId,
          active: true,
          userId: foundUser._id,
          includeInReports: { $ne: false },
        }).select("userId");

        if (!meAllowed) {
          return res.status(200).json({
            quickStatsActions: 0,
            quickStatsNewOpps: 0,
            quickStatsNewOppAnnualized: 0,
            quickStatsQuoted: 0,
            quickStatsClosed: 0,
            quickStatsActionGoal: 0,
          });
        }

        userIdsInScope = [foundUser._id.toString()];
      } else {
        // users in those teams
        const candidateUserIds = (
          await TeamUser.find({
            teamId: { $in: teamIds },
            active: true,
          }).distinct("userId")
        ).map((id: any) => id.toString());

        // ✅ filter to includeInReports
        userIdsInScope = await filterUserIdsByIncludeInReports(candidateUserIds);

        if (!userIdsInScope.length) {
          return res.status(200).json({
            quickStatsActions: 0,
            quickStatsNewOpps: 0,
            quickStatsNewOppAnnualized: 0,
            quickStatsQuoted: 0,
            quickStatsClosed: 0,
            quickStatsActionGoal: 0,
          });
        }
      }
    } else {
      // company scope: all active company users with includeInReports !== false
      const companyUsers = await CompanyUser.find({
        companyId,
        active: true,
        includeInReports: { $ne: false }, // ✅
      }).select("userId");

      userIdsInScope = companyUsers.map((cu: any) => cu.userId.toString());

      if (!userIdsInScope.length) {
        return res.status(200).json({
          quickStatsActions: 0,
          quickStatsNewOpps: 0,
          quickStatsNewOppAnnualized: 0,
          quickStatsQuoted: 0,
          quickStatsClosed: 0,
          quickStatsActionGoal: 0,
        });
      }
    }

    if (!userIdsInScope.length) {
      return res.status(200).json({
        quickStatsActions: 0,
        quickStatsNewOpps: 0,
        quickStatsNewOppAnnualized: 0,
        quickStatsQuoted: 0,
        quickStatsClosed: 0,
        quickStatsActionGoal: 0,
      });
    }

    // ----------------------------
    // 2) Date range (Sun–Sat weekly, current month, YTD, all-time)
    // ----------------------------
    const { start, end } = getDateRange(timeframe, now);

    // ----------------------------
    // 3) Load definitions so we can interpret GUIDs
    // ----------------------------
    const [actionDefs, amountDefs] = await Promise.all([
      Action.find({ companyId, active: true }).select("_id type name"),
      Amount.find({ companyId, active: true }).select("_id label"),
    ]);

    const actionTypeById = new Map<string, string>();
    for (const a of actionDefs) actionTypeById.set(a._id.toString(), (a as any).type);

    const callTypeActionId =
      actionDefs.find((a: any) => String(a?.name || "").trim().toLowerCase() === "call type")
        ?._id?.toString() || "";

    const amountIdByKey = {
      newOpp: findAmountId(amountDefs, "New Opportunity $ Value"),
      annualized: findAmountId(amountDefs, "Annualized Value"),
      quoted: findAmountId(amountDefs, "Quote or Proposal Amount"),
      closed: findAmountId(amountDefs, "Closed Amount"),
    };

    // ----------------------------
    // 4) Query outreach rows in scope + timeframe
    //    ✅ scope by outreach.userId (NOT prospect.userId)
    // ----------------------------
    const outreachFilter: any = {
      companyId,
      active: true,
      deleted: { $exists: false },
      userId: { $in: userIdsInScope },
    };

    if (timeframe !== "all") {
      outreachFilter.created = { $gte: start, $lte: end };
    }

    const outreachRecords = await Outreach.find(outreachFilter).select("created actions amounts");

    // ----------------------------
    // 5) Roll up stats
    //    ✅ exclude Call Type from actions total
    // ----------------------------
    let actions = 0;
    let newOpp = 0;
    let annualized = 0;
    let quoted = 0;
    let closed = 0;

    for (const o of outreachRecords) {
      // Actions
      if (Array.isArray(o.actions)) {
        for (const act of o.actions) {
          const actionId = String(act?.name ?? "");
          if (!actionId) continue;

          if (callTypeActionId && actionId === callTypeActionId) continue;

          const actionType = actionTypeById.get(actionId);
          const raw = act?.value;

          if (actionType === "integer") {
            const valStr = String(raw ?? "").trim();
            if (valStr === "") continue;
            const n = Number(valStr);
            if (!Number.isNaN(n)) actions += n;
          } else if (actionType === "boolean") {
            const v = String(raw ?? "").toLowerCase().trim();
            if (v === "true" || v === "1" || v === "yes") actions += 1;
          } else {
            const v = String(raw ?? "").toLowerCase().trim();
            if (v === "") continue;
            const n = Number(v);
            if (!Number.isNaN(n)) actions += n;
            else if (v === "true") actions += 1;
          }
        }
      }

      // Amounts
      if (Array.isArray(o.amounts)) {
        for (const amt of o.amounts) {
          const amountId = String(amt?.name ?? "");
          if (!amountId) continue;

          const cleanedStr = String(amt?.value ?? "").replace(/[$,]/g, "");
          const num = Number(cleanedStr);
          const safeNum = Number.isNaN(num) ? 0 : num;

          if (amountIdByKey.newOpp && amountId === amountIdByKey.newOpp) newOpp += safeNum;
          else if (amountIdByKey.annualized && amountId === amountIdByKey.annualized)
            annualized += safeNum;
          else if (amountIdByKey.quoted && amountId === amountIdByKey.quoted) quoted += safeNum;
          else if (amountIdByKey.closed && amountId === amountIdByKey.closed) closed += safeNum;
        }
      }
    }

    // ----------------------------
    // Action Goal (sum across users in scope)
    // ----------------------------
    const DEFAULT_GOAL = 15;

    const companyDoc = await Company.findOne({ _id: companyId, active: true }).select("actionGoal");
    const companyGoal =
      typeof companyDoc?.actionGoal === "number" ? companyDoc.actionGoal : DEFAULT_GOAL;

    // ✅ only pull CompanyUser docs for users in scope (already includeInReports-filtered above)
    const companyUserDocs = await CompanyUser.find({
      companyId,
      userId: { $in: userIdsInScope },
      active: true,
    }).select("userId actionGoal");

    const userGoalByUserId = new Map<string, number>();
    for (const cu of companyUserDocs) {
      const uid = cu.userId.toString();
      if (typeof cu.actionGoal === "number") userGoalByUserId.set(uid, cu.actionGoal);
    }

    const memberships = await TeamUser.find({
      userId: { $in: userIdsInScope },
      active: true,
    }).select("userId teamId");

    const teamIdsForLookup = [...new Set(memberships.map((m: any) => m.teamId.toString()))];

    const teamDocs = await Team.find({
      companyId,
      _id: { $in: teamIdsForLookup },
      active: true,
    }).select("_id actionGoal");

    const teamGoalByTeamId = new Map<string, number>();
    for (const t of teamDocs) {
      if (typeof t.actionGoal === "number") teamGoalByTeamId.set(t._id.toString(), t.actionGoal);
    }

    let actionGoal = 0;

    for (const uid of userIdsInScope) {
      const userOverride = userGoalByUserId.get(uid);
      if (typeof userOverride === "number") {
        actionGoal += userOverride;
        continue;
      }

      const teamIdsForUser = memberships
        .filter((m: any) => m.userId.toString() === uid)
        .map((m: any) => m.teamId.toString());

      let teamGoal: number | undefined = undefined;
      for (const tid of teamIdsForUser) {
        const g = teamGoalByTeamId.get(tid);
        if (typeof g === "number") {
          teamGoal = g;
          break;
        }
      }

      actionGoal += typeof teamGoal === "number" ? teamGoal : companyGoal;
    }

    const weeks = weeksInTimeframe(timeframe, start, end);
    actionGoal = actionGoal * weeks;

    return res.status(200).json({
      quickStatsActions: actions,
      quickStatsNewOpps: newOpp,
      quickStatsNewOppAnnualized: annualized,
      quickStatsQuoted: quoted,
      quickStatsClosed: closed,
      quickStatsActionGoal: actionGoal,
    });
  } catch (err: any) {
    console.error("getQuickStats error", err);
    return res.status(500).json({ message: err.message });
  }
};




// ----------------------------
// Helpers
// ----------------------------

function weeksInTimeframe(timeframe: Timeframe, start: Date, end: Date): number {
  if (timeframe === "week") return 1;

  if (timeframe === "month") {
    // weeks that intersect the current month (Sun–Sat)
    const monthStart = start; // startOfMonth(now)
    const monthEnd = end;     // endOfMonth(now)
    const ws = fns.startOfWeek(monthStart, { weekStartsOn: 0 });
    const we = fns.endOfWeek(monthEnd, { weekStartsOn: 0 });
    return Math.max(1, fns.differenceInCalendarWeeks(we, ws, { weekStartsOn: 0 }) + 1);
  }

  if (timeframe === "year") {
    // YTD weeks (Sun–Sat), based on startOfYear -> now
    const ys = fns.startOfWeek(start, { weekStartsOn: 0 });
    const ye = fns.endOfWeek(end, { weekStartsOn: 0 });
    return Math.max(1, fns.differenceInCalendarWeeks(ye, ys, { weekStartsOn: 0 }) + 1);
  }

  // "all" – without a defined start in your API, use 52 as a sane default
  // (alternatively, compute weeks from company.created or earliest outreach date)
  return 52;
}


function getDateRange(timeframe: Timeframe, now: Date) {
  if (timeframe === "week") {
    // Sun–Sat
    const start = fns.startOfWeek(now, { weekStartsOn: 0 });
    const end = fns.endOfWeek(now, { weekStartsOn: 0 });
    return { start, end };
  }
  if (timeframe === "month") {
    return { start: fns.startOfMonth(now), end: fns.endOfMonth(now) };
  }
  if (timeframe === "year") {
    return { start: fns.startOfYear(now), end: now }; // YTD
  }
  return { start: new Date(2000, 0, 1), end: now }; // all
}

function findAmountId(amountDefs: any[], labelToFind: string): string | null {
  // exact match first
  const exact = amountDefs.find((a) => String(a.label ?? "") === labelToFind);
  if (exact) return exact._id.toString();

  // fallback: case-insensitive contains
  const needle = labelToFind.toLowerCase();
  const loose = amountDefs.find((a) => String(a.label ?? "").toLowerCase().includes(needle));
  return loose ? loose._id.toString() : null;
}

const setStatsTeam = async (req: Request, res: Response) => {
  const foundUser = await getUser(req.cookies);
  if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
  if (req.body.teamId === undefined) return res.status(400).json({ 'message' : 'Invalid call body' });
  
  const { teamId } = req.body;
  const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
  
  try {
      await UserSetting.updateOne({ userId: foundUser._id }, { $set: { statsTeam: teamId, modified: now } }).exec();
      activityController.register({
          userId: foundUser._id,
          section: "leftnav",
          object: "user",
          objectId: foundUser._id,
          action: "User selected a team for their quick stats",
          description: `${foundUser.firstName} ${foundUser.lastName} changed their stats team to ${teamId}.`,
          created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
      });

      res.status(200).json(teamId);
  } catch (err: any) {
      res.status(500).json({ error: err.message });
  }
}


module.exports = {
    getSettings,
    heartbeat,
    loadComponent,
    loadSubComponent,
    savePreviousComponent,
    expandSidebar,
    getOtherCompanies,
    getQuickStats,
    updateLoadedCompanyId,
    setStatsScope,
    setStatsTimeframe,
    setStatsTeam,
};