import { Request, Response } from 'express';
import { getUser } from '../helpers/getUser';
import { Types } from 'mongoose';
import { ICompany } from '../models/domain/Company';
import { ICompanyUser } from '../models/domain/CompanyUser';
import { IProspect } from '../models/domain/Prospect';
import { IIndustry } from '../models/domain/Industry';
import { ICompanyAction } from '../models/domain/CompanyAction';
import { ICompanyAmount } from '../models/domain/CompanyAmount';
import { IOutreach } from '../models/domain/Outreach';
import { ITeam } from '../models/domain/Team';
import { IMember } from '../models/domain/interfaces/IMember';
import { Role as role, isUserType } from '../helpers/types';
import { IRole } from '../models/domain/Role';
import { isValidEmail } from '../helpers/isValidEmail';
import { IUser } from '../models/domain/User';
import { ICompanyUserInvite } from '../models/domain/CompanyUserInvite';
import { randomUUID } from 'crypto';
import { retrieveMembers } from '../helpers/handleMembers';
import { ITeamUser } from '../models/domain/TeamUser';
import { getRoleName } from '../helpers/getRoleName';
import { cleanPhone } from '../helpers/cleanPhone';

const TeamUser = require('../models/domain/TeamUser');
const User = require('../models/domain/User');
const Company = require('../models/domain/Company');
const Team = require('../models/domain/Team');
const CompanyUser = require('../models/domain/CompanyUser');
const CompanyUserInvite = require('../models/domain/CompanyUserInvite');
const Prospect = require('../models/domain/Prospect');
const Outreach = require('../models/domain/Outreach');
const ProspectType = require('../models/domain/ProspectType');
const Action = require('../models/domain/Action');
const Amount = require('../models/domain/Amount');
const CompanyAction = require('../models/domain/CompanyAction');
const CompanyAmount = require('../models/domain/CompanyAmount');
const Industry = require('../models/domain/Industry');
const Role = require('../models/domain/Role');
const UserRole = require('../models/domain/UserRole');
const activityController = require('../controllers/ActivityController');
const MailController = require('../controllers/MailController');
const stripeController = require('../controllers/stripeController');
const fns = require('date-fns'); 

const getMembers = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies, 'company', req.params.companyId);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not Authorized.' });
    try {
        let members = await retrieveMembers(new Types.ObjectId(req.params.companyId), new Types.ObjectId(foundUser._id));
        return res.status(200).json(members);
    } catch (err: any) {
        console.log(err.message);
    }
}

// Weeks run Sun -> Sat.
// This returns Sunday 00:00:00.000 local time for the week containing `d`.
function startOfWeekSunday(d: Date) {
    const dow = fns.getDay(d); // Sun=0 ... Sat=6
    //console.log(dow);
    return fns.startOfDay(fns.subDays(d, dow));
}
    
function endOfWeekSaturday(d: Date) {
    const start = startOfWeekSunday(d);
    return fns.endOfDay(fns.subDays(start, -6)); // start + 6 days
}

const getSuccessStories = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies, 'company', req.params.companyId);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not Authorized.' });
    try {
        
        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        const thisWeekStart = startOfWeekSunday(now);
        const thisWeekEnd = endOfWeekSaturday(now);
        const lastWeekStart = fns.subDays(thisWeekStart, 7);
        
        let allowedProspectIds: Types.ObjectId[] = [];
        // get all prospect Ids for the company  
        allowedProspectIds = await Prospect.find({ companyId: req.params.companyId, active: true }).distinct("_id");
        // pull success for the last week and this week
        const successfulOutreach = await Outreach.find({
            prospectId: { $in: allowedProspectIds },
            active: true,
            success: true,
            created: { $gte: lastWeekStart, $lte: thisWeekEnd },
          }).lean();

        // group outreachs by prospect
        const outreachByProspectId = new Map<string, any[]>();
        for (const o of successfulOutreach) {
            const key = String(o.prospectId);
            if (!outreachByProspectId.has(key)) {
                outreachByProspectId.set(key, []);
            }
            outreachByProspectId.get(key)!.push(o);
        }

        // fetch only prospects that have a successful outreach
        const prospectIdsWithSuccess = Array.from(outreachByProspectId.keys()).map(
            (id) => new Types.ObjectId(id)
        );  
        const prospects = await Prospect.find({
            _id: { $in: prospectIdsWithSuccess },
            active: true,
        }).lean();
          
        // bundle prospect with successful outreaches 
        const result = prospects.map((p: IProspect) => ({
            prospect: p,
            outreaches: outreachByProspectId.get(String(p._id)) ?? [],
        }));

        return res.status(200).json(result);

    } catch (err: any) {
        console.log(err.message);
    }
}

const inviteUser = async (req: Request, res: Response) => {

    const { companyId, user } = req.body as 
    { 
        companyId: string; user: 
        {
            firstName: string,
            lastName: string,
            email: string,
            role: string,
            teams: string[],
            actionGoal: number,
            includeInReports: boolean,
        }
    };

    const foundUser = await getUser(req.cookies, 'company', companyId);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not Authorized.' });
    try {

        if (!user.firstName || !user.lastName || !isValidEmail(user.email) || !isUserType(user.role as role))
            return res.status(403).json({ 'message': 'Invalid payload.' }); 

        let role = await getRoleName(companyId, foundUser._id);		
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });		

        /* Make sure the user doesn't already have access. */
        let eUser: IUser = await User.findOne({ email: user.email });
        if (eUser) {
            let eCompanyUser = await CompanyUser.findOne({ userId: eUser._id, companyId: companyId });
            if (eCompanyUser) return res.status(403).json({ 'message': 'User already has access.' }); 
        }
         /* Make sure the user doesn't already have an invite. */
        let eInvite: ICompanyUserInvite = await CompanyUserInvite.findOne({ companyId: companyId, email: user.email });
        if (eInvite) {
            if (eInvite) return res.status(403).json({ 'message': 'User already has been invited.' }); 
        }

        const foundRole = await Role.findOne({ name: user.role });
        if (!foundRole) {
          return res.status(400).json({ message: `Invalid role: ${user.role}` });
        }

        let company: ICompany = await Company.findOne({ companyId: companyId });
        if (company) {

            /* Add the new CompanyUserInvite doc and email an invite */

            const shareLinkShort = randomUUID();
            const shareLink = "invite/" + companyId + "/" + shareLinkShort;
            const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");

            let invite: ICompanyUserInvite = {
                companyId: new Types.ObjectId(companyId),
                shareLink: shareLinkShort,
                firstName: user.firstName,
                lastName: user.lastName,
                roleId: new Types.ObjectId(foundRole._id),
                email: user.email,
                created: now,
                teams: user.teams,
                ...(user.actionGoal && { actionGoal: user.actionGoal }),
                ...(user.includeInReports && { includeInReports: user.includeInReports }),
            };
        
            const companyUserInvite = await CompanyUserInvite.create(invite);

            // Send an invite to each email address
            MailController.sendInvitedUserEmail(user.email, shareLink, foundUser.firstName, foundUser.lastName, company.name);

            /* Log activity */
            activityController.register({
                userId: foundUser._id,
                section: "settings.users",
                object: "CompanyUserInvite",
                objectId: companyUserInvite._id,
                action: "invited user",
                description: `${foundUser.firstName} ${foundUser.lastName} invited "${user.firstName} ${user.lastName} ${user.email}" to their SalesDoing instance.`,
                created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
            });

            let members = await retrieveMembers(new Types.ObjectId(companyId), new Types.ObjectId(foundUser._id));
            return res.status(200).json(members);

        } else {
            res.status(403).json({ 'message': 'Invalid company.' }); 
        }
    } catch (err: any) {
        console.log(err.message);
    }
}

const reInviteUser = async (req: Request, res: Response) => {

    const { companyId, email } = req.body;

    const foundUser = await getUser(req.cookies, 'company', companyId);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not Authorized.' });
    try {

        let role = await getRoleName(companyId, foundUser._id);		
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });

        if (!isValidEmail(email)) return res.status(403).json({ 'message': 'Invalid payload.' }); 
    
        let company: ICompany = await Company.findOne({ companyId });
        if (!company) return res.status(403).json({ 'message': 'Invalid payload.' }); 

        let invite = await CompanyUserInvite.findOne({ companyId, email });
        if (!invite) return res.status(403).json({ 'message': 'Invalid payload.' }); 

        // Send an invite to each email address
        MailController.sendInvitedUserEmail(email, invite.shareLink, foundUser.firstName, foundUser.lastName, company.name);

        /* Log activity */
        activityController.register({
            userId: foundUser._id,
            section: "settings.users",
            object: "CompanyUserInvite",
            objectId: invite._id,
            action: "resent the invite to the user",
            description: `${foundUser.firstName} ${foundUser.lastName} resent the invite to "${invite.firstName} ${invite.lastName} ${email}".`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

    } catch (err: any) {
        console.log(err.message);
    }
}

const getTeams = async (req: Request, res: Response) => {
    
    let { companyId } = req.params;
    let teams: ITeam[] = [];

    const foundUser = await getUser(req.cookies, 'company', companyId);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not Authorized.' });
    try {

        let thisUserRole = await getRoleName(companyId, foundUser._id);
        
        if (thisUserRole === "member") {
            teams = [];
        } else if (thisUserRole === "manager") {
            const teamIds = await TeamUser.find({ userId: foundUser._id }).distinct('teamId');
            teams = await Team.find({ _id: { $in: teamIds }, companyId: companyId, active: true });
        } else {
            /* owner, admin, advisor can access all teams */
            teams = await Team.find({ companyId, active: true });
        }  

        return res.status(200).json(teams);
    
    } catch (err: any) {
        console.log(err.message);
    }
}

const getProspectTypes = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    try {
        let prospectTypes = await ProspectType.find({ active: true });
        return res.status(200).json(prospectTypes);
    } catch (err: any) {
        console.log(err.message);
    }
}

const getActions = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    try {
        let actions = await Action.find({ active: true });
        return res.status(200).json(actions);
    } catch (err: any) {
        console.log(err.message);
    }
}

const getIndustries = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    try {
        let industries: IIndustry[] = await Industry.find({ active: true });
        return res.status(200).json(
            industries.sort((a, b) => a.name.localeCompare(b.name))
        );
    } catch (err: any) {
        console.log(err.message);
    }
}

const getRoles = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    try {
        let roles: IRole[] = await Role.find({ active: true });
        return res.status(200).json(
            roles.sort((a, b) => a.name.localeCompare(b.name))
        );
    } catch (err: any) {
        console.log(err.message);
    }
}

const getAmounts = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    try {
        let amounts = await Amount.find({ active: true });
        return res.status(200).json(amounts);
    } catch (err: any) {
        console.log(err.message);
    }
}

const getCompanyInfoById = async (req: Request, res: Response) => {
    
    const { companyId } = req.params;
    if (!companyId) return res.status(403).json({ 'message': 'Company not found.' });

    const foundUser = await getUser(req.cookies, 'company', companyId);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    
    try {
        let company = await Company.findOne({ _id: companyId });
        return res.status(200).json(company);
    } catch (err: any) {
        console.log(err.message);
    }
}

const saveCompany = async (req: Request, res: Response) => {

    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
    const foundUser = await getUser(req.cookies);
    const { _id, name, logo, industryId, timezone } = req.body;
    
    if (foundUser === null) return res.status(403).json({ 'message': 'User not found.' });
    if (_id === null || name === null || logo === null) return res.status(403).json({ 'message': 'Invalid payload.' });
    
    try {

        let role = await getRoleName(_id, foundUser._id);		
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });		

        const updateFields: any = {
            name: name,
            logo: logo,
            modified: now,
            ...(industryId && industryId !== "") ? { industryId: industryId } : { industryId: null },
            ...(timezone && timezone !== "") ? { timezone: timezone } : { timezone: null }
        };

        let company: ICompany = await Company.findOneAndUpdate(
            { _id: _id },
            { $set: updateFields },
            { new: true }
        ).exec();

        /* Log activity */
        activityController.register({
            userId: foundUser._id,
            section: "settings",
            object: "company",
            objectId: _id,
            action: "save company settings",
            description: `${foundUser.firstName} ${foundUser.lastName} saved their company's settings.`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        res.status(200).json(company);

    } catch (err: any) {
        //console.error(err);
        res.status(400).send({ error: { message: err.message } });
    }
  }

  const saveOutreach = async (req: Request, res: Response) => {

    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");

    // Destructure with safe defaults
    const {
        companyId,
        prospectId,
        amounts = {},
        checkboxes = {},
        values = {},
        company,
        firstName,
        lastName,
        phone,
        email,
        notes,
        success,
        type,
        outreachId,
    } = req.body ?? {};

    const cleanedPhone = cleanPhone(phone);
    //console.log(cleanedPhone);
    
    const foundUser = await getUser(req.cookies, "company", companyId);
    if (foundUser === null) return res.status(403).json({ 'message': 'User not found.' });

    let role = await getRoleName(companyId, foundUser._id);		
    /* Advisors cannot create or update prosopects or outreach */
    if (role === "advisor") return res.status(403).json({ 'message': 'Unathorized.' });		


    if (prospectId !== "") { 
        /* we're saving an outreach to an existing prospect, so for member and manager, make
            sure they own the prospect - they can only alter their own prospects and outreach.
        */
        let existingProspect = await Prospect.findOne({ _id: prospectId });
        if (existingProspect) {
            //console.log(existingProspect);
            //console.log(role);
            //console.log(foundUser._id);
            if (role === "manager" || role === "member") {
                if (!helperAuthorizedToProspect(existingProspect.companyId.toString(), foundUser._id.toString(), existingProspect))
                    return res.status(403).json({ 'message': 'Unathorized.' });	
                //if (!existingProspect.userId?.equals?.(foundUser._id)) return res.status(403).json({ 'message': 'Unathorized.' });	
            }
        }
    }

    if (!outreachId) {
        if (!companyId || 
            !company?.trim() || 
            !firstName?.trim() || 
            !lastName?.trim() || 
            !cleanedPhone || 
            !email?.trim() || 
            !notes?.trim() || 
            !type?.trim()
        ) {
            return res.status(403).json({ 'message': 'Invalid payload' });
        } 
    } else {
        if (!notes?.trim()) {
            return res.status(403).json({ 'message': 'Invalid payload' });
        } 
    }
    
    try {

        // If any of these came in as non-objects (e.g., a string), normalize:
        const safeAmounts = (amounts && typeof amounts === "object" && !Array.isArray(amounts)) ? amounts : {};
        const safeCheckboxes = (checkboxes && typeof checkboxes === "object" && !Array.isArray(checkboxes)) ? checkboxes : {};
        const safeValues = (values && typeof values === "object" && !Array.isArray(values)) ? values : {};

        // Convert booleans to strings for checkboxes
        const checkboxStrings = Object.fromEntries(
            Object.entries(safeCheckboxes).map(([k, v]) => [k, String(v)])
        );

        // Clean amounts: strip $ and , and save numeric strings only
        const formattedAmounts = Object.entries(safeAmounts).reduce<{ name: string; value: string }[]>(
            (acc, [name, value]) => {
                const cleaned = String(value).replace(/[$,]/g, "");
                if (cleaned !== "") acc.push({ name, value: cleaned });
                return acc;
            },
            []
        );

        // Merge actions (checkbox strings + values) into {name, value}[]
        const formattedActions = Object.entries({
            ...checkboxStrings,
            ...safeValues,
        }).map(([name, value]) => ({ name, value: String(value) }));

        let outreach;

        if (!outreachId) {
            let prospect;

            if (prospectId && prospectId !== "") {
                prospect = await Prospect.findByIdAndUpdate(
                    prospectId,
                    {
                        company,
                        firstName,
                        lastName,
                        phone: cleanedPhone,
                        email,
                        typeId: type,
                        updated: now
                    },
                    { new: true } // return the updated document
                );
            } else {
                prospect = await Prospect.create({
                    userId: foundUser._id,
                    companyId,
                    company,
                    firstName,
                    lastName,
                    phone: cleanedPhone,
                    email,
                    typeId: type,
                    created: now,
                    active: true
                });
            }

            // Build payload conditionally (only include if present)
            const outreachData: any = {
                userId: foundUser._id,
                prospectId: prospect._id,
                notes,
                created: now,
                active: true,
            };

            if (typeof success !== "undefined") outreachData.success = success;
            if (formattedAmounts.length > 0) outreachData.amounts = formattedAmounts;
            if (formattedActions.length > 0) outreachData.actions = formattedActions;

            outreach = await Outreach.create(outreachData);

        } else {

            // Build payload conditionally (only include if present)
            const outreachData: any = {
                notes,
                modified: now 
            };

            if (typeof success !== "undefined") outreachData.success = success;
            if (formattedAmounts.length > 0) outreachData.amounts = formattedAmounts;
            if (formattedActions.length > 0) outreachData.actions = formattedActions;

            outreach = await Outreach.findByIdAndUpdate(
                outreachId,
                outreachData,
                { new: true } // returns the updated doc instead of the old one
            );
        }

        /* Log activity */
        activityController.register({
            userId: foundUser._id,
            section: "work",
            object: "outreach",
            objectId: outreach._id,
            action: "saved an outreach",
            description: `${foundUser.firstName} ${foundUser.lastName} saved an outreach.`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        res.sendStatus(200);

    } catch (err: any) {
        res.status(400).send({ error: { message: err.message } });
    }
}


const helperGetProspects = async (companyId: string, currentUserId: string) => {

    let prospects: IProspect[] = [];

    let role = await getRoleName(companyId, currentUserId);	
    let company: ICompany = await Company.findOne({ _id: companyId });
    if (!company) return prospects;

    const teamIds = await Team.find({ companyId, active: true })
        .where('_id')
        .in(await TeamUser.find({ userId: currentUserId, active: true }).distinct('teamId'))
        .distinct('_id');

    const userIds = await TeamUser.find({
        teamId: { $in: teamIds },
        active: true,
    }).distinct('userId');

    if (role === "member") {
        if (company.prospectVisibility) {
            if (company.prospectVisibility === "company") {
                prospects = await Prospect.find({ companyId: companyId, active: true });
            } else if (company.prospectVisibility === "team") {
                if (!teamIds.length) {
                    prospects = await Prospect.find({ companyId: companyId, userId: currentUserId, active: true });
                } else {
                    prospects = await Prospect.find({ companyId, userId: { $in: userIds }, active: true, });
                }
            } else {
                prospects = await Prospect.find({ companyId: companyId, userId: currentUserId, active: true });
            }
        } else {
            prospects = await Prospect.find({ companyId: companyId, userId: currentUserId, active: true });
        }
    } else if (role === "manager") {
        if (company.prospectVisibility) {
            if (company.prospectVisibility === "company") {
                prospects = await Prospect.find({ companyId: companyId, active: true });
            } else {
                if (!teamIds.length) {
                    prospects = await Prospect.find({ companyId: companyId, userId: currentUserId, active: true });
                } else {
                    prospects = await Prospect.find({ companyId, userId: { $in: userIds }, active: true, });
                }
            }
        } 

    } else {
        /* owner, admin, advisor can access all */
        prospects = await Prospect.find({ companyId: companyId, active: true });
    }
    return prospects;
}

const getProspects = async (req: Request, res: Response) => {
    let { companyId } = req.params;
    const foundUser = await getUser(req.cookies, 'company', companyId);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    try {
        let prospects: IProspect[] = await helperGetProspects(companyId, foundUser._id.toString());        
        return res.status(200).json(prospects);
    } catch (err: any) {
        console.log(err.message);
    }
}

const getOutreach = async (req: Request, res: Response) => {
    let { companyId } = req.params;
    const foundUser = await getUser(req.cookies, 'company', companyId);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    try {
        let prospects: IProspect[] = await helperGetProspects(companyId, foundUser._id.toString()); 
        // Step 1: get all prospects for this company & user 
        /*
        let prospects: IProspect[] = [];
        let role = await getRoleName(companyId, foundUser._id);	
        if (role === "member") {
            prospects = await Prospect.find({ companyId: companyId, userId: foundUser._id, active: true }).select("_id");
        } else if (role === "manager") {
            const teamIds = await Team.find({ companyId, active: true })
                .where('_id')
                .in(await TeamUser.find({ userId: foundUser._id, active: true }).distinct('teamId'))
                .distinct('_id');
            if (!teamIds.length) {
                // not on a team, simply return themselves - i.e. a manager that doesn't manage a team
                prospects = await Prospect.find({ companyId: companyId, userId: foundUser._id, active: true }).select("_id");
            } else {
                const userIds = await TeamUser.find({
                    teamId: { $in: teamIds },
                    active: true,
                }).distinct('userId');
                prospects = await Prospect.find({
                    companyId,
                    userId: { $in: userIds },
                    active: true,
                }).select("_id");
            }
        } else {
            // owner, admin, advisor can access all
            prospects = await Prospect.find({ companyId: companyId, active: true }).select("_id");
        }
        */

        const prospectIds = prospects.map((p: IProspect) => p._id);
    
        // Step 2: get all outreach docs linked to those prospects
        const outreach = await Outreach.find({
          prospectId: { $in: prospectIds },
          active: true
        }).lean();
    
        return res.status(200).json(outreach);

    } catch (err: any) {
        console.error(err.message);
        return res.status(500).json({ message: "Server error" });
    }
}

const getCompanyActions = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies, 'company', req.params.companyId);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    try {
        const companyActions = await CompanyAction.find({
          companyId: req.params.companyId,
          active: true
        }).lean();
    
        return res.status(200).json(companyActions);

    } catch (err: any) {
        console.error(err.message);
        return res.status(500).json({ message: "Server error" });
    }
}

const getCompanyAmounts = async (req: Request, res: Response) => {
    const foundUser = await getUser(req.cookies, 'company', req.params.companyId);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
    try {
        const companyAmounts = await CompanyAmount.find({
          companyId: req.params.companyId,
          active: true
        }).lean();
    
        return res.status(200).json(companyAmounts);

    } catch (err: any) {
        console.error(err.message);
        return res.status(500).json({ message: "Server error" });
    }
}

const saveGoal = async (req: Request, res: Response) => {
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
    const { companyId, goal, prospectVisibility } = req.body;
  
    const foundUser = await getUser(req.cookies, "company", companyId);
    if (foundUser === null) {
      return res.status(403).json({ message: "User not found." });
    }
  
    if (!companyId) {
      return res.status(403).json({ message: "Invalid payload" });
    }

    const hasProspectVisibility = prospectVisibility !== undefined && prospectVisibility !== null && prospectVisibility !== "";

    if (hasProspectVisibility) {  
        if (prospectVisibility !== "me" && prospectVisibility !== "team" && prospectVisibility !== "company" ) {
            return res.status(403).json({ message: "Invalid Prospect Visibility." });
        }
    }

    // Normalize / validate goal
    const hasGoal =
      goal !== undefined &&
      goal !== null &&
      goal !== "";
  
    let normalizedGoal: number | null = null;
  
    if (hasGoal) {
      const n = Number(goal);
      if (!Number.isInteger(n)) {
        return res.status(403).json({ message: "Goal must be an integer." });
      }
      normalizedGoal = n;
    }
  
    let role = await getRoleName(companyId, foundUser._id);
    if (role !== "owner" && role !== "admin") {
      return res.status(403).json({ message: "Unathorized." });
    }
  
    try {
      const update: any = {
        $set: {
          modified: now,
        },
      };
  
      if (hasGoal) {
        update.$set.actionGoal = normalizedGoal;
      } else {
        update.$unset = { actionGoal: "" };
      }
  
      if (hasProspectVisibility) {
        update.$set.prospectVisibility = prospectVisibility;
      } else {
        update.$unset = { prospectVisibility: "" };
      }

      // Update and return the updated company doc
      const company = await Company.findByIdAndUpdate(
        companyId,
        update,
        { new: true, runValidators: true }
      );
  
      /* Log activity */
      activityController.register({
        userId: foundUser._id,
        section: "settings.config",
        object: "company",
        objectId: companyId,
        action: "saved company config settings",
        description: `${foundUser.firstName} ${foundUser.lastName} saved the config settings for the company.`,
        created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
      });
  
      return res.status(200).json(company);
    } catch (err: any) {
      res.status(400).send({ error: { message: err.message } });
    }
};
  

const helperAuthorizedToProspect = async (companyId: string, currentUserId: string, prospect: IProspect) => {

    let prospects: IProspect[] = [];
    let role = await getRoleName(companyId, currentUserId);	
    let company: ICompany = await Company.findOne({ _id: companyId });
    if (!company) return false;

    const teamIds = await Team.find({ companyId, active: true })
        .where('_id')
        .in(await TeamUser.find({ userId: currentUserId, active: true }).distinct('teamId'))
        .distinct('_id');

    const userIds = await TeamUser.find({
        teamId: { $in: teamIds },
        active: true,
    }).distinct('userId');

    if (role === "member") {
        if (company.prospectVisibility) {
            if (company.prospectVisibility === "company") {
                prospects = await Prospect.find({ companyId: companyId, active: true });
            } else if (company.prospectVisibility === "team") {
                if (!teamIds.length) {
                    prospects = await Prospect.find({ companyId: companyId, userId: currentUserId, active: true });
                } else {
                    prospects = await Prospect.find({ companyId, userId: { $in: userIds }, active: true, });
                }
            } else {
                prospects = await Prospect.find({ companyId: companyId, userId: currentUserId, active: true });
            }
        } else {
            prospects = await Prospect.find({ companyId: companyId, userId: currentUserId, active: true });
        }
    } else if (role === "manager") {
        if (company.prospectVisibility) {
            if (company.prospectVisibility === "company") {
                prospects = await Prospect.find({ companyId: companyId, active: true });
            } else {
                if (!teamIds.length) {
                    prospects = await Prospect.find({ companyId: companyId, userId: currentUserId, active: true });
                } else {
                    prospects = await Prospect.find({ companyId, userId: { $in: userIds }, active: true, });
                }
            }
        } 

    } else {
        /* owner, admin, advisor can access all */
        prospects = await Prospect.find({ companyId: companyId, active: true });
    }

    if (prospects.length && prospects.includes(prospect)) {
        return true;
    } else {
        return false;
    }

}


const saveProspect = async (req: Request, res: Response) => {

    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
    const prospect = req.body as IProspect;
    //console.log(prospect);
    if (!prospect) return res.status(403).json({ 'message': 'Not authorized.' });

    const foundUser = await getUser(req.cookies, "company", prospect.companyId.toString());
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });

    let role = await getRoleName(prospect.companyId, foundUser._id);
    if (role === "manager" || role === "member") {
        if (!helperAuthorizedToProspect(prospect.companyId.toString(), foundUser._id.toString(), prospect))
            return res.status(403).json({ 'message': 'Unathorized.' });	
        //if (!prospect.userId?.equals?.(foundUser._id))  return res.status(403).json({ 'message': 'Unathorized.' });	
    }
    
    try {

        // Update the prospect
        const updatedProspect = await Prospect.findByIdAndUpdate(
            prospect._id,
            { $set: { 
                typeId: prospect.typeId,
                company: prospect.company,
                firstName: prospect.firstName,
                lastName: prospect.lastName,
                phone: cleanPhone(prospect.phone),
                email: prospect.email,
                modified: now 
            }},
            { new: true, runValidators: true }
        );
      
        // Log activity
        activityController.register({
            userId: foundUser._id,
            section: "lists",
            object: "prospect",
            objectId: prospect._id,
            action: "saved prospect",
            description: `${foundUser.firstName} ${foundUser.lastName} updated the prospect.`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        return res.sendStatus(200);

    } catch (err: any) {
        res.status(400).send({ error: { message: err.message } });
    }
}

const deleteProspect = async (req: Request, res: Response) => {
    try {
        let prospect: IProspect = await Prospect.findOne({ _id: req.params.prospectId });
        if (!prospect) return res.status(403).json({ 'message': 'Not authorized.' });

        const foundUser = await getUser(req.cookies, 'company', prospect.companyId.toString());
        if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });

        let role = await getRoleName(prospect.companyId, foundUser._id);		

        /* Advisors cannot create or update prosopects or outreach */
        if (role === "advisor") return res.status(403).json({ 'message': 'Unathorized.' });	

        if (role === "manager" || role === "member") {
            if (!helperAuthorizedToProspect(prospect.companyId.toString(), foundUser._id.toString(), prospect))
                return res.status(403).json({ 'message': 'Unathorized.' });	
            //if (!prospect.userId?.equals?.(foundUser._id))  return res.status(403).json({ 'message': 'Unathorized.' });	
        }

        
        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        
        // Delete the prospect
        const updatedProspect = await Prospect.findByIdAndUpdate(
            prospect._id,
            { $set: { 
                active: false,
                deleted: now,
                modified: now 
            }},
            { new: true, runValidators: true }
        );

        // Delete the outreach docs
        const result = await Outreach.updateMany(
            { prospectId: req.params.prospectId }, 
            { $set: {
                active: false,
                deleted: now,
                modified: now 
            }}
        );
    
        // Log activity
        activityController.register({
            userId: foundUser._id,
            section: "lists",
            object: "prospect",
            objectId: prospect._id,
            action: "deleted prospect",
            description: `${foundUser.firstName} ${foundUser.lastName} deleted the prospect.`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        return res.sendStatus(200);
    
    } catch (err: any) {
        console.error(err.message);
        return res.status(500).json({ message: "Server error" });
    }
}

const deleteTeam = async (req: Request, res: Response) => {
    try {
        let team: ITeam = await Team.findOne({ _id: req.params.teamId });
        if (!team) return res.status(403).json({ 'message': 'Not authorized.' });

        const foundUser = await getUser(req.cookies, 'company', team.companyId.toString());
        if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });

        let role = await getRoleName(team.companyId, foundUser._id);		
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });		
        
        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        
        // Delete the prospect
        const updatedTeam = await Team.findByIdAndUpdate(
            team._id,
            { $set: { 
                active: false,
                deleted: now,
                modified: now 
            }},
            { new: true, runValidators: true }
        );

        // Log activity
        activityController.register({
            userId: foundUser._id,
            section: "settings.teams",
            object: "team",
            objectId: team._id,
            action: "deleted team",
            description: `${foundUser.firstName} ${foundUser.lastName} deleted team "${team.name}".`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        return res.sendStatus(200);
    
    } catch (err: any) {
        console.error(err.message);
        return res.status(500).json({ message: "Server error" });
    }
}

const deleteOutreach = async (req: Request, res: Response) => {
    try {
        let outreach: IOutreach = await Outreach.findOne({ _id: req.params.outreachId });
        if (!outreach) return res.status(403).json({ 'message': 'Not authorized.' });

        let prospect: IProspect = await Prospect.findOne({ _id: outreach.prospectId });
        if (!prospect) return res.status(403).json({ 'message': 'Not authorized.' });

        const foundUser = await getUser(req.cookies, 'company', prospect.companyId.toString());
        if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });

        let role = await getRoleName(prospect.companyId, foundUser._id);		
        if (role === "advisor") return res.status(403).json({ 'message': 'Unathorized.' });		

        if (role === "manager" || role === "member") {
            if (!helperAuthorizedToProspect(prospect.companyId.toString(), foundUser._id.toString(), prospect))
                return res.status(403).json({ 'message': 'Unathorized.' });	
            //if (!prospect.userId?.equals?.(foundUser._id)) return res.status(403).json({ 'message': 'Unathorized.' });	
        }
        
        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        
        // Delete the outreach
        const updatedOutreach = await Outreach.findByIdAndUpdate(
            outreach._id,
            { $set: { 
                active: false,
                deleted: now,
                modified: now 
            }},
            { new: true, runValidators: true }
        );
    
        // Log activity
        activityController.register({
            userId: foundUser._id,
            section: "lists",
            object: "outreach",
            objectId: outreach._id,
            action: "deleted outreach",
            description: `${foundUser.firstName} ${foundUser.lastName} deleted the outreach.`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        return res.sendStatus(200);
    
    } catch (err: any) {
        console.error(err.message);
        return res.status(500).json({ message: "Server error" });
    }
}

/* Save custom actions and amounts for customizing the frontend */
const saveCustomActionsAndAmounts = async (req: Request, res: Response) => {

    try {
        let { companyId } = req.body;
        const foundUser = await getUser(req.cookies, "company", companyId);
        if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });

        let role = await getRoleName(companyId, foundUser._id);		
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });		

        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        const actions = req.body.actions as ICompanyAction[];
        const amounts = req.body.amounts as ICompanyAmount[];
        
        // Update the companies custom actions and amounts

        // Step 1: Delete all existing docs for this company
        await CompanyAction.deleteMany({ companyId });
        await CompanyAmount.deleteMany({ companyId });

        // Step 2: Add metadata and bulk insert
        const actionsToInsert = actions
            .filter(a => a.name && a.name.trim() !== "")
            .map(a => ({
                ...a,
                companyId,
                active: true,
                updated: now,
                created: now,
        }));
    
        const amountsToInsert = amounts
            .filter(a => a.label && a.label.trim() !== "" && a.placeholder && a.placeholder.trim() !== "")
            .map((a) => ({
                ...a,
                companyId,
                active: true,
                updated: now,
                created: now,
        }));

        await CompanyAction.insertMany(actionsToInsert);
        await CompanyAmount.insertMany(amountsToInsert);
  
        // no activity log because saveGoal gets called at the same time and logs it.
              
        return res.sendStatus(200);

    } catch (err: any) {
        res.status(400).send({ error: { message: err.message } });
    }
}

const createTeam = async (req: Request, res: Response) => {

    try {
        let { companyId, name, actionGoal } = req.body;
        const foundUser = await getUser(req.cookies, "company", companyId);
        if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
        if (name === null || name === "") return res.status(403).json({ 'message': 'Invalid payload.' });
        //console.log(actionGoal);
        const isValidInteger = !actionGoal || actionGoal === "" || /^[0-9]+$/.test(actionGoal);
        if (!isValidInteger) {
            return res.status(403).json({ 'message': 'Action Goal must be a number.' });
        }

        let role = await getRoleName(companyId, foundUser._id);		
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });		

        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        
        // Create the team
        const team = await Team.create({
            companyId,
            name,
            ...(actionGoal && { actionGoal: actionGoal }),
            created: now,
            active: true
        });

        // Log activity
        activityController.register({
            userId: foundUser._id,
            section: "settings.teams",
            object: "team",
            objectId: team._id,
            action: "team created",
            description: `${foundUser.firstName} ${foundUser.lastName} created team "${team.name}".`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        let teams = await Team.find({ companyId, active: true });
        return res.status(200).json(teams);

    } catch (err: any) {
        res.status(400).send({ error: { message: err.message } });
    }
}

const saveTeam = async (req: Request, res: Response) => {

    try {
        let { teamId, name, actionGoal } = req.body;
        
        let team: ITeam = await Team.findOne({ _id: teamId });
        if (!team) return res.status(403).json({ 'message': 'Not authorized.' });

        const foundUser = await getUser(req.cookies, 'company', team.companyId.toString());
        if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
        
        if (name === null || name === "") return res.status(403).json({ 'message': 'Invalid payload.' });

        const isValidInteger = !actionGoal || actionGoal === "" || /^[0-9]+$/.test(actionGoal);
        if (!isValidInteger) {
            return res.status(403).json({ 'message': 'Action Goal must be a number.' });
        }

        let role = await getRoleName(team.companyId, foundUser._id);		
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });		

        
        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        /*
        // Create the team
        const result = await Team.updateOne(
            { _id: teamId },
            { $set: { 
                name, 
                ...(actionGoal && { actionGoal: actionGoal }),
                modified: now
            }},
            { runValidators: true }
        );
        */

        const update: any = {
            $set: {
              name,
              modified: now,
            },
        };
          
        // If actionGoal is empty / missing => remove it from the doc
        if (actionGoal === undefined || actionGoal === null || actionGoal === "") {
            update.$unset = { actionGoal: "" };
        } else {
            // safe: we already validated it's numeric above
            update.$set.actionGoal = parseInt(actionGoal, 10);
        }
          
        const result = await Team.updateOne(
            { _id: teamId },
            update,
            { runValidators: true }
        );


        // Log activity
        activityController.register({
            userId: foundUser._id,
            section: "settings.teams",
            object: "team",
            objectId: team._id,
            action: "team saved",
            description: `${foundUser.firstName} ${foundUser.lastName} saved team "${team.name}".`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        return res.sendStatus(200);

    } catch (err: any) {
        res.status(400).send({ error: { message: err.message } });
    }
}
/*
const saveUser = async (req: Request, res: Response) => {

    try {
        let { companyId, user } = req.body as { companyId: string; user: IMember };
        const foundUser = await getUser(req.cookies, 'company', companyId);
        if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
        
        let role = await getRoleName(companyId, foundUser._id);		
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });		

        if (
            !user ||
            !user.firstName ||
            !user.lastName ||
            !user.role ||
            !isUserType(user.role)
        ) {
            return res.status(400).json({ message: "Invalid payload." });
        }

        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        
        // --- Normalize & validate actionGoal (shared for invite + user) ---
        const hasActionGoal =
            user.actionGoal !== undefined &&
            user.actionGoal !== null

        let normalizedActionGoal: number | null = null;

        if (hasActionGoal) {
            const n = Number(user.actionGoal);
            if (Number.isNaN(n) || !Number.isFinite(n)) {
                return res
                .status(400)
                .json({ message: "Action Goal must be a number." });
            }
            normalizedActionGoal = n;
        }

        // If the user is still invited, update CompanyUserInvite instead of User
        if (user.status === 'invited') {

            const existingInvite = await CompanyUserInvite.findOne({
                companyId: companyId,
                email: user.email,
            });
    
            if (!existingInvite) {
                return res.status(404).json({ message: 'Invite not found for user.' });
            }

            // Find Role by name (since user.role is the name)
            const foundRole = await Role.findOne({ name: user.role });
            if (!foundRole) {
                return res.status(400).json({ message: `Invalid role name: ${user.role}` });
            }

            // Update invite details
            const inviteUpdate: any = {
                $set: {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  roleId: new Types.ObjectId(foundRole._id),
                  teams: user.teams || [],
                  modified: now,
                  includeInReports: user.includeInReports,
                },
            };
        
            if (hasActionGoal) {
                inviteUpdate.$set.actionGoal = normalizedActionGoal;
            } else {
                inviteUpdate.$unset = { actionGoal: "" };
            }
        
            await CompanyUserInvite.updateOne(
                { _id: existingInvite._id },
                inviteUpdate
            );
    
            // Log activity
            activityController.register({
                userId: foundUser._id,
                section: 'settings.users',
                object: 'CompanyUserInvite',
                objectId: existingInvite._id,
                action: 'invite updated',
                description: `${foundUser.firstName} ${foundUser.lastName} updated invite for "${user.email}".`,
                created: now,
            });
    
            return res.sendStatus(200);
        }

        // Otherwise, update the User

        const targetUserId = user.userId;
        
        // Update CompanyUser (actionGoal lives here)
        const companyUserUpdate: any = {
          $set: {
            modified: now,
            includeInReports: user.includeInReports,
          },
        };
        
        if (hasActionGoal) {
          companyUserUpdate.$set.actionGoal = normalizedActionGoal;
        } else {
          companyUserUpdate.$unset = { actionGoal: "" };
        }
        
        await CompanyUser.updateOne(
          { companyId, userId: targetUserId, active: true },
          companyUserUpdate,
          { runValidators: true }
        );

        await User.updateOne(
            { _id: targetUserId },
            {
              $set: {
                firstName: user.firstName,
                lastName: user.lastName,
                modified: now,
              },
            },
            { runValidators: true }
        );

        // Find Role by name (since user.role is the name)
        const foundRole = await Role.findOne({ name: user.role });
        if (!foundRole) {
            return res.status(400).json({ message: `Invalid role name: ${user.role}` });
        }

        // Update or insert into UserRole
        const existingUserRole = await UserRole.findOne({
            userId: user.userId,
            companyId,
        });

        if (existingUserRole) {
            // update role
            await UserRole.updateOne(
                { _id: existingUserRole._id },
                {
                $set: {
                    roleId: foundRole._id,
                    modified: now,
                },
                }
            );
        }

        // update the teams for the user and company

        if (Array.isArray(user.teams)) {
            // Find all team IDs for this company (safety filter)
            const teamIdsForCompany = await Team.find({ companyId }).distinct('_id');
      
            // Delete only existing team-user links within this company
            await TeamUser.deleteMany({
              userId: user.userId,
              teamId: { $in: teamIdsForCompany },
            });
      
            // Insert new team-user records
            if (user.teams.length > 0) {
              const teamUserDocs = user.teams.map((teamId: string) => ({
                teamId: new Types.ObjectId(teamId),
                userId: new Types.ObjectId(user.userId),
                created: now,
                active: true,
              }));
      
              await TeamUser.insertMany(teamUserDocs);
            }
        }

        // Log activity
        activityController.register({
            userId: foundUser._id,
            section: "settings.users",
            object: "user",
            objectId: foundUser._id,
            action: "user saved",
            description: `${foundUser.firstName} ${foundUser.lastName} saved user "${user.firstName} ${user.lastName}".`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        return res.sendStatus(200);

    } catch (err: any) {
        res.status(400).send({ error: { message: err.message } });
    }
}
*/

const saveUser = async (req: Request, res: Response) => {
    try {
      let { companyId, user } = req.body as { companyId: string; user: IMember };
      const foundUser = await getUser(req.cookies, "company", companyId);
      if (foundUser === null) return res.status(403).json({ message: "Not authorized." });
  
      let role = await getRoleName(companyId, foundUser._id);
      if (role !== "owner" && role !== "admin") return res.status(403).json({ message: "Unathorized." });
  
      if (!user || !user.firstName || !user.lastName || !user.role || !isUserType(user.role)) {
        return res.status(400).json({ message: "Invalid payload." });
      }
  
      const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
  
      // --- Normalize & validate actionGoal (shared for invite + user) ---
      const hasActionGoal = user.actionGoal !== undefined && user.actionGoal !== null;
  
      let normalizedActionGoal: number | null = null;
  
      if (hasActionGoal) {
        const n = Number(user.actionGoal);
        if (Number.isNaN(n) || !Number.isFinite(n)) {
          return res.status(400).json({ message: "Action Goal must be a number." });
        }
        normalizedActionGoal = n;
      }
  
      // If the user is still invited, update CompanyUserInvite instead of User
      if (user.status === "invited") {
        const existingInvite = await CompanyUserInvite.findOne({
          companyId: companyId,
          email: user.email,
        });
  
        if (!existingInvite) {
          return res.status(404).json({ message: "Invite not found for user." });
        }
  
        // Find Role by name (since user.role is the name)
        const foundRole = await Role.findOne({ name: user.role });
        if (!foundRole) {
          return res.status(400).json({ message: `Invalid role name: ${user.role}` });
        }
  
        const inviteUpdate: any = {
          $set: {
            firstName: user.firstName,
            lastName: user.lastName,
            roleId: new Types.ObjectId(foundRole._id),
            teams: user.teams || [],
            modified: now,
            includeInReports: user.includeInReports,
          },
        };
  
        if (hasActionGoal) {
          inviteUpdate.$set.actionGoal = normalizedActionGoal;
        } else {
          inviteUpdate.$unset = { actionGoal: "" };
        }
  
        await CompanyUserInvite.updateOne({ _id: existingInvite._id }, inviteUpdate);
  
        // Log activity
        activityController.register({
          userId: foundUser._id,
          section: "settings.users",
          object: "CompanyUserInvite",
          objectId: existingInvite._id,
          action: "invite updated",
          description: `${foundUser.firstName} ${foundUser.lastName} updated invite for "${user.email}".`,
          created: now,
        });
  
        return res.sendStatus(200);
      }
  
      // -------------------------
      // Otherwise, update the User + CompanyUser
      // -------------------------
      const targetUserId = user.userId;
  
      // ✅ Fetch existing CompanyUser (needed to detect active toggle)
      const existingCompanyUser = await CompanyUser.findOne({
        companyId,
        userId: targetUserId,
      }).lean();
  
      if (!existingCompanyUser) {
        return res.status(404).json({ message: "CompanyUser not found." });
      }
  
      // Normalize incoming active:
      // - If UI doesn't send it, treat as true
      const incomingActive = user.active !== false; // true if missing/true, false if explicitly false
  
      // Existing active (missing => true)
      const existingActive = (existingCompanyUser as any).active !== false;
  
      const activeToggled = existingActive !== incomingActive;
  
      // ✅ Build CompanyUser update
      const companyUserUpdate: any = {
        $set: {
          modified: now,
          includeInReports: user.includeInReports,
          active: incomingActive,
        },
      };
  
      if (hasActionGoal) {
        companyUserUpdate.$set.actionGoal = normalizedActionGoal;
      } else {
        companyUserUpdate.$unset = { ...(companyUserUpdate.$unset || {}), actionGoal: "" };
      }
  
      // ✅ Handle delete/reactivate semantics ONLY if toggled
      if (activeToggled) {
        if (incomingActive === false) {
          // deactivate
          companyUserUpdate.$set.deleted = now;
        } else {
          // reactivate
          companyUserUpdate.$unset = { ...(companyUserUpdate.$unset || {}), deleted: "" };
        }
      }
  
      await CompanyUser.updateOne(
        { companyId, userId: targetUserId },
        companyUserUpdate,
        { runValidators: true }
      );
  
      // Update User core fields
      await User.updateOne(
        { _id: targetUserId },
        {
          $set: {
            firstName: user.firstName,
            lastName: user.lastName,
            modified: now,
          },
        },
        { runValidators: true }
      );
  
      // Find Role by name (since user.role is the name)
      const foundRole = await Role.findOne({ name: user.role });
      if (!foundRole) {
        return res.status(400).json({ message: `Invalid role name: ${user.role}` });
      }
  
      // Update or insert into UserRole
      const existingUserRole = await UserRole.findOne({
        userId: user.userId,
        companyId,
      });
  
      if (existingUserRole) {
        await UserRole.updateOne(
          { _id: existingUserRole._id },
          {
            $set: {
              roleId: foundRole._id,
              modified: now,
            },
          }
        );
      }
  
      // Update the teams for the user and company
      if (Array.isArray(user.teams)) {
        const teamIdsForCompany = await Team.find({ companyId }).distinct("_id");
  
        await TeamUser.deleteMany({
          userId: user.userId,
          teamId: { $in: teamIdsForCompany },
        });
  
        if (user.teams.length > 0) {
          const teamUserDocs = user.teams.map((teamId: string) => ({
            teamId: new Types.ObjectId(teamId),
            userId: new Types.ObjectId(user.userId),
            created: now,
            active: true,
          }));
  
          await TeamUser.insertMany(teamUserDocs);
        }
      }
  
      // ✅ If active status toggled, adjust Stripe + log toggle activity
      if (activeToggled) {
        await stripeController.adjustSubscription(companyId);
  
        activityController.register({
          userId: foundUser._id,
          section: "settings.users",
          object: "user",
          objectId: targetUserId,
          action: incomingActive ? "reactivated user" : "deactivated user",
          description: `${foundUser.firstName} ${foundUser.lastName} ${
            incomingActive ? "reactivated" : "deactivated"
          } the user for the company.`,
          created: now,
        });
      }
  
      // Log general save activity (always)
      activityController.register({
        userId: foundUser._id,
        section: "settings.users",
        object: "user",
        objectId: foundUser._id,
        action: "user saved",
        description: `${foundUser.firstName} ${foundUser.lastName} saved user "${user.firstName} ${user.lastName}".`,
        created: now,
      });
  
      return res.sendStatus(200);
    } catch (err: any) {
      res.status(400).send({ error: { message: err.message } });
    }
  };
  

const deleteUser = async (req: Request, res: Response) => {
    try {
        let { companyId, userId } = req.params;
        const foundUser = await getUser(req.cookies, 'company', companyId.toString());
        if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
        
        let role = await getRoleName(companyId, foundUser._id);		
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });		

        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        
        // Delete the prospect
        const updatedUser = await CompanyUser.findOneAndUpdate(
            { companyId: companyId, userId: userId },
            { $set: { 
                active: false,
                deleted: now,
                modified: now 
            }},
            { new: true, runValidators: true }
        );

        /* Adjust stripe licenses / billing */
        await stripeController.adjustSubscription(companyId);

        // Log activity
        activityController.register({
            userId: foundUser._id,
            section: "settings.users",
            object: "user",
            objectId: userId,
            action: "deleted user",
            description: `${foundUser.firstName} ${foundUser.lastName} deleted the user for the company.`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        return res.sendStatus(200);
    
    } catch (err: any) {
        console.error(err.message);
        return res.status(500).json({ message: "Server error" });
    }
}

const deleteUserInvite = async (req: Request, res: Response) => {
    try {
        let { companyId, email } = req.params;
        const foundUser = await getUser(req.cookies, 'company', companyId.toString());
        if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });

        let role = await getRoleName(companyId, foundUser._id);		
        if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });		
        
        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        
        // Delete the prospect
        const deletedInvite = await CompanyUserInvite.deleteOne({
            companyId: companyId,
            email: email
        });
          
        // Log activity
        activityController.register({
            userId: foundUser._id,
            section: "settings.users",
            object: "company",
            objectId: companyId,
            action: "deleted invite",
            description: `${foundUser.firstName} ${foundUser.lastName} deleted the invite for email "${email}" and company "${companyId}".`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        return res.sendStatus(200);
    
    } catch (err: any) {
        console.error(err.message);
        return res.status(500).json({ message: "Server error" });
    }
}


export const saveTeamMembers = async (req: Request, res: Response) => {
  try {
    const { teamId, userIds } = req.body; // members: string[] of userIds

    if (!teamId || !Array.isArray(userIds)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const company = await Company.findOne({ _id: team.companyId });
    if (!company) return res.status(404).json({ message: "Company not found" });
    //console.log(company);
    const foundUser = await getUser(req.cookies, 'company', company._id.toString());
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });

    let role = await getRoleName(company._id, foundUser._id);		
    if (role !== "owner" && role !== "admin") return res.status(403).json({ 'message': 'Unathorized.' });		
    
    // Get current team-user links
    const existingTeamUsers: ITeamUser[] = await TeamUser.find({ teamId }).lean();

    const existingUserIds = existingTeamUsers.map((tu) => tu.userId.toString());

    // Determine adds/removes
    const toAdd = userIds.filter((id) => !existingUserIds.includes(id));
    const toRemove = existingUserIds.filter((id) => !userIds.includes(id));

    // Add new users
    if (toAdd.length > 0) {
      const teamUsersToAdd = toAdd.map((userId) => ({
        teamId: teamId,
        userId: userId,
        created: now,
        active: true,
      }));
      await TeamUser.insertMany(teamUsersToAdd);
    }

    // Remove old users
    if (toRemove.length > 0) {
      await TeamUser.deleteMany({
        teamId: teamId,
        userId: { $in: toRemove },
      });
    }

    // Log activity
    activityController.register({
        userId: foundUser._id,
        section: "settings.teams",
        object: "team",
        objectId: team._id,
        action: "added or removed users from a team",
        description: `${foundUser.firstName} ${foundUser.lastName} added or removed members from team "${team.name}".`,
        created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
    });

    return res.sendStatus(200);

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const archiveSuccess = async (req: Request, res: Response) => {

    try {
        let { archive, companyId, outreachId } = req.body;
        
        const foundUser = await getUser(req.cookies, 'company', companyId);
        if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });
        
        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");

        const result = await Outreach.updateOne(
            { _id: outreachId },
            { $set: { successArchived: archive, modified: now } }
        );
      //console.log(result);
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Outreach not found." });
        }

        // Log activity
        activityController.register({
            userId: foundUser._id,
            section: "success stories",
            object: "outreach",
            objectId: outreachId,
            action: "success story (outreach) archived",
            description: `${foundUser.firstName} ${foundUser.lastName} archived a success story".`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        return res.status(200).json(outreachId);

    } catch (err: any) {
        res.status(400).send({ error: { message: err.message } });
    }
}


module.exports = {
    getMembers,
    saveCompany,
    getCompanyInfoById,
    getProspectTypes,
    getActions,
    getAmounts,
    getIndustries,
    getRoles,
    saveOutreach,
    getOutreach,
    getProspects,
    saveGoal,
    saveProspect,
    deleteProspect,
    deleteTeam,
    getCompanyActions,
    getCompanyAmounts,
    saveCustomActionsAndAmounts,
    deleteOutreach,
    getTeams,
    createTeam,
    saveTeam,
    saveUser,
    inviteUser,
    reInviteUser,
    deleteUser,
    deleteUserInvite,
    saveTeamMembers,
    getSuccessStories,
    archiveSuccess
};