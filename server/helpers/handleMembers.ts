import { IMember } from "../models/domain/interfaces/IMember";
import { IUser } from "../models/domain/User";

//import { IInviteToProject } from "../models/domain/InviteToProject";

const User = require("../models/domain/User");
const Role = require("../models/domain/Role");
const UserRole = require("../models/domain/UserRole");
const Team = require("../models/domain/Team");
const TeamUser = require("../models/domain/TeamUser");
const CompanyUser = require("../models/domain/CompanyUser");
const CompanyUserInvite = require("../models/domain/CompanyUserInvite");

//const InviteToProject = require("../models/domain/InviteToProject");

import { Types } from "mongoose";
import { addDays } from 'date-fns';
import { IStripePayment } from "../models/domain/StripePayment";
import { IStripePlan } from "../models/domain/StripePlan";
import { ICompanyUser } from "../models/domain/CompanyUser";
import { ICompanyUserInvite } from "../models/domain/CompanyUserInvite";
import { IRole } from "../models/domain/Role";
import { ITeamUser } from "../models/domain/TeamUser";
import { IUserRole } from "../models/domain/UserRole";
import { Role } from "./types";
import { getRoleName } from "./getRoleName";
//const fns = require('date-fns');
const StripePlan = require('../models/domain/StripePlan');
const StripePayment = require('../models/domain/StripePayment');

/* used by other controllers to retrieve company users */
export const retrieveMembers = async (companyId: Types.ObjectId, userId: Types.ObjectId) => {

    let members: ICompanyUser[] = [];
    let dtoMembers: IMember[] = [];


    try { 
        let thisUser: IUser = await User.findOne({ _id: userId }).exec();
        let invites: Array<ICompanyUserInvite> = await CompanyUserInvite.find({ companyId });

        let thisUserRole = await getRoleName(companyId, userId);
        /*
        if (thisUserRole === "member") {
            // have access to themselves
            members = await CompanyUser.find({ companyId, userId: userId, active: true });
        } else if (thisUserRole === "manager") {
            // have access to themselves and the members in their team(s)
            // find all teams the user belongs to
            const teamIds = await Team.find({ companyId, active: true })
                .where('_id')
                .in(await TeamUser.find({ userId, active: true }).distinct('teamId'))
                .distinct('_id');

            if (!teamIds.length) {
                // not on a team, simply return themselves - i.e. a manager that doesn't manage a team
                members = await CompanyUser.find({ companyId, userId: userId, active: true });
            } else {
                // Find all userIds who belong to those teams
                const userIds = await TeamUser.find({
                    teamId: { $in: teamIds },
                    active: true,
                }).distinct('userId');
                // Fetch those users, including current user
                members = await CompanyUser.find({
                    companyId,
                    userId: { $in: userIds },
                    active: true,
                });
            }
        } else {
            */
            /* owner, admin, advisor can access all members */
            members = await CompanyUser.find({ companyId }); /* return inactive users too */
            //members = await CompanyUser.find({ companyId, active: true });
        //}
        
        // fetch all roles once
        const roles: IRole[] = await Role.find({}).lean();
        const roleMap = new Map(roles.map(r => [r._id.toString(), r.name]));

        // Fetch all user roles for this company
        const userRoles: IUserRole[] = await UserRole.find({ companyId }).lean();

        // Build user → role name map
        const userRoleNameMap = new Map<string, string>();

        userRoles.forEach((ur) => {
            const roleName = roleMap.get(ur.roleId.toString()) || "member";
            userRoleNameMap.set(ur.userId.toString(), roleName);
        });
        
        // fetch teams at once
        const teamUsers: ITeamUser[] = await TeamUser.find({ companyId }).lean();
        const teamUserMap = new Map<string, string[]>();

        // Build a map: userId -> [teamIds]
        teamUsers.forEach(tu => {
            const uid = tu.userId.toString();
            if (!teamUserMap.has(uid)) teamUserMap.set(uid, []);
            teamUserMap.get(uid)!.push(tu.teamId.toString());
        });

        // Get invitees
        invites.forEach((invite, index) => {
            let alreadyExists = dtoMembers.filter(m => m.email === invite.email);
            if (alreadyExists.length === 0) {
                dtoMembers.push({
                    me: false,
                    avatar: "",
                    defaultAvatarColor: "",
                    defaultAvatarFontColor: "",
                    email: invite.email,
                    firstName: invite.firstName,
                    lastName: invite.lastName, 
                    role: roleMap.get(invite.roleId.toString()) || "member",
                    status: "invited",
                    sort: 0,
                    active: true,
                    lastLogin: undefined,
                    stripePlan: "",
                    teams: invite.teams,
                    created: invite.created,
                    platform: "",
                    actionGoal: invite.actionGoal,
                    includeInReports: invite.includeInReports,
                });
            }
        });

        // Get members
        await Promise.all(members.map(async (member) => {
            await User.findOne({ _id: member.userId }).then(async(user: IUser) => {
              
                let daysLeft = 0;
                let plan: IStripePlan | null = null;
                
                let lastPayment: IStripePayment = await StripePayment.findOne({ userId: user._id }).sort({ payment: -1 });
                if (lastPayment) {
                    plan = await StripePlan.findOne({ _id: lastPayment.stripePlanId });
                    daysLeft = Math.ceil((addDays(new Date(lastPayment.payment), 30).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                }

                let alreadyExists = dtoMembers.filter(m => m.email === user.email);
                if (alreadyExists.length === 0) {

                    const roleName = userRoleNameMap.get(member.userId.toString()) || "member";
                    const userTeams = teamUserMap.get(member.userId.toString()) || [];

                    dtoMembers.push({
                        me: (thisUser._id.equals(member.userId)) ? true: false,
                        avatar: user.avatar,
                        defaultAvatarColor: user.defaultAvatarColor,
                        defaultAvatarFontColor: user.defaultAvatarFontColor,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: roleName as Role,
                        status: roleName,
                        sort: 0,
                        userId: member.userId,
                        active: member.active,
                        lastLogin: user.lastLoginDate,
                        stripePlan: (daysLeft <= 0) ? "" : (plan) ? plan.name : "",
                        teams: userTeams,
                        created: member.created,
                        platform: user.platform,
                        actionGoal: member.actionGoal,
                        includeInReports: member.includeInReports,
                    });
                }
            });
        }));

        var sortedByName = dtoMembers.sort((a,b) => 
            (a.firstName > b.firstName) ? 1 : ((b.firstName > a.firstName) ? -1 : 0));

        dtoMembers.forEach((member, index) => {
            sortedByName[index].sort = (member.role === "owner") ? -1 : index;
        });

        let sortedBySort = dtoMembers.sort((a,b) => a.sort - b.sort);
        return sortedBySort;

    } catch (err) {
        dtoMembers = [];
        return dtoMembers;
    }  
    
}