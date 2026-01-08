import { Request, Response } from 'express';

const User = require('../models/domain/User');
//const InviteToProject = require('../models/domain/InviteToProject');
const Session = require('../models/domain/Session');
const Company = require('../models/domain/Company');
const CompanyUser = require('../models/domain/CompanyUser');
const CompanyUserInvite = require('../models/domain/CompanyUserInvite');
const UserRole = require('../models/domain/UserRole');
const TeamUser = require('../models/domain/TeamUser');
const UserSetting = require('../models/domain/UserSetting');
const Role = require('../models/domain/Role');
const StripePayment = require('../models/domain/StripePayment');
import { IUser } from '../models/domain/User';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fns = require('date-fns');
const { v4: uuidv4 } = require('uuid');
import { isValidEmail } from '../helpers/isValidEmail';
const mailController = require('../controllers/mailController');
const activityController = require("../controllers/ActivityController");
const stripeController = require("../controllers/stripeController");
import { IColor, getRandomColor } from '../helpers/getRandomColor';
import { getUser } from '../helpers/getUser';
import { ICompany } from '../models/domain/Company';
import { ICompanyUser } from '../models/domain/CompanyUser';
import { IUserRole } from '../models/domain/UserRole';
import { ISession } from '../models/domain/Session';
import { ICompanyUserInvite } from '../models/domain/CompanyUserInvite';
import { IUserSetting } from '../models/domain/UserSetting';
import { IRole } from '../models/domain/Role';

const handleLogin = async (req: Request, res: Response) => {

    const cookies = req.cookies;
    const { email, password, companyId, link, device } = req.body;
    let now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");

    if (!isValidEmail(email) || !password) return res.status(400).json({ 'message': 'Email and password are required.' });

    const foundUser = await User.findOne({ "email": email, "active": true, "platform": "native" }).exec();

    if (!foundUser) return res.status(401).json({ 'message': 'Invalid credentials' }); //Unauthorized 
    if (foundUser.activationToken != "") return res.status(401).json({ 'message': 'Your account needs activated.' }); 

    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            {
                _id: foundUser._id,
                email: foundUser.email,
                given_name: foundUser.firstName,
                family_name: foundUser.lastName
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            {     
                _id: foundUser._id,           
                email: foundUser.email,
                given_name: foundUser.firstName,
                family_name: foundUser.lastName
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        const session: ISession = await Session.create({
            userId: foundUser._id,
            device: device,
            refreshToken: refreshToken,
            created: now
        })

        //foundUser.refreshToken = refreshToken;
        foundUser.lastLoginDate = now;
        const result = await foundUser.save();

        let isInvite = false;
       
        try {
            let company = await Company.findOne({ _id: companyId });
            if (company) {
                isInvite = true;
            }
        } catch(err) {
            // means cast of companyId to ObjectId failed, so not an invite
        }

        if (companyId && link && isInvite) {

            let company = await Company.findOne({ _id: companyId });
            let invite: ICompanyUserInvite = await CompanyUserInvite.findOne({ companyId, email });
            
            // Set user's loaded company to this one
            //await UserSetting.updateOne({ userId: foundUser._id }, { $set: { sidebarExpanded: value, modified: now } }).exec();

            // update company to load to this one 
            await UserSetting.updateOne({ userId: foundUser._id }, { $set: { 
                loadedCompanyId: companyId, 
                modified: now 
            }}).exec();

            // Create company user
            const companyUser: ICompanyUser = await CompanyUser.create({
                companyId: companyId,
                userId: foundUser._id,
                created: now,
                active: true,
                ...(invite.actionGoal) && { actionGoal: invite.actionGoal },
                ...(invite.includeInReports) && { includeInReports: invite.includeInReports },
            });

            // Create User role
            let role = await Role.findOne({ _id: invite!.roleId });
            if (role) {
                const userRole: IUserRole = await UserRole.create({
                    companyId: company._id,
                    userId: foundUser._id,
                    roleId: role._id,
                    created: now,
                    active: true
                });
            }
            // Add TeamUser records if invite had team assignments
            if (invite!.teams && invite!.teams.length > 0) {
                for (const teamId of invite!.teams) {
                    try {
                        await TeamUser.create({
                            teamId: teamId,
                            userId: foundUser._id,
                            companyId: company._id,
                            created: now,
                            active: true
                        });
                    } catch (err: any) {
                        console.warn(`Failed to create TeamUser for team ${teamId}: ${err.message}`);
                    }
                }
            }
            activityController.register({
                userId: foundUser._id,
                section: "authentication",
                object: "user",
                objectId: foundUser._id,
                action: "accepted invite",
                description: `${foundUser.firstName} ${foundUser.lastName} accept an invite to "${company.name}" company`,
                created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
            });
            await CompanyUserInvite.deleteOne({ companyId: companyId, shareLink: link }).exec();
        } else {

            const userSetting: IUserSetting = await UserSetting.findOne({ userId: foundUser._id }).exec();
            if (!userSetting) return res.status(401).json({ 'message': 'Invalid credentials' }); //Unauthorized 
//console.log(userSetting);
            const userRole: IUserRole = await UserRole.findOne({ userId: foundUser._id, companyId: userSetting.loadedCompanyId, active: true }).exec();
            if (!userRole) return res.status(401).json({ 'message': 'Invalid credentials' }); //Unauthorized 
//console.log(userRole);
            const role: IRole = await Role.findOne({ _id: userRole.roleId, active: true }).exec();
            if (!role) return res.status(401).json({ 'message': 'Invalid credentials' }); //Unauthorized 
//console.log(role);
            if (role.name !== "owner" && role.name !== "admin" && userSetting.loadedComponentType === "settings") {
                // the user was in another company and now signing into a different with less authority */
                await UserSetting.updateOne({ userId: foundUser._id }, { $set: { 
                    loadedComponentType: (role.name === "advisor") ? "lists" : "work",
                    loadedSubComponentType:  (role.name === "advisor") ? "lists_customer" : "",
                    modified: now 
                }}).exec();
            }

            activityController.register({
                userId: foundUser._id,
                section: "authentication",
                object: "user",
                objectId: foundUser._id,
                action: "login (native)",
                description: `${foundUser.firstName} ${foundUser.lastName} logged in with email ${foundUser.email}`,
                created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
            });
        }

        let isHttps = (process.env.COOKIE_SECURE === 'true');
        let sameSite = process.env.COOKIE_SAME_SITE!;
  
        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: isHttps, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 });
        // Send authorization roles and access token to user
        res.json({ sessionId: session._id, accessToken, loggingIn: false, isInvite: isInvite, companyId: companyId });

        if (companyId && link && isInvite) {
            /* Adjust stripe licenses / billing */
            process.nextTick(() => {
                stripeController.adjustSubscription(companyId).catch(console.error);
            });
        }

    } else {
        res.status(401).json({ 'message': 'Invalid credentials' });
    }
}

const handleNewUser = async (req: Request, res: Response) => {

    if (req.body.email === undefined || req.body.password === undefined || req.body.firstName === undefined, 
        req.body.lastName === undefined || req.body.device === "") 
        return res.status(400).json({ 'message' : 'Missing required fields  ' });

    const { email, password, firstName, lastName, link, device, companyId } = req.body;

    if (!isValidEmail(email))
        return res.status(400).json({ 'message' : 'Please enter a valid email address' });

    let isInvite = false;
    
    try {
        let company = await Company.findOne({ _id: companyId });
        if (company) {
            isInvite = true;
        }
    } catch(err) {
        // means cast of roadmapId to ObjectId failed, so not an invite
    }

    if (isInvite) {
        const dUser: IUser = await User.findOne({ email, active: true });
        if (dUser) {
            const duplicate = await CompanyUser.findOne({ companyId: companyId, userId: dUser._id, active: true });
            if (duplicate) return res.status(409).json({ 'message' : 'Email is already registered' }); //Conflict
        }
    } else {
        const dUser = await User.findOne({ email, active: true });
        if (dUser) {
            const duplicate = await CompanyUser.findOne({ userId: dUser._id, active: true });
            if (duplicate) return res.status(409).json({ 'message' : 'Email is already registered' }); //Conflict
        }
    }

    try {
        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        const hashed = await bcrypt.hash(password, 10);
        const created = now;
        const modified = now;
        const activationToken = uuidv4();
        let avatarColor: IColor = getRandomColor();
        
        let company: ICompany;
        let invite: ICompanyUserInvite | null = null;
        if (isInvite) {
            company = await Company.findOne({ _id: companyId });
            invite = await CompanyUserInvite.findOne({ companyId, email });
        } else {
            // Create a new company
            company = await Company.create({
                created: created,
                active: true
            });
        }

        // Create new user
        const user: IUser = await User.create({
            email: email,
            password: hashed,
            created: created,
            modified: modified,
            platform: "native",
            lastName: lastName,
            firstName: firstName,
            avatar: "",
            defaultAvatarColor: avatarColor.hex,
            defaultAvatarFontColor: avatarColor.font,
            activationToken: "",
            activationDate: now,
            lastLoginDate: now,
        });

        // Create company user
        const companyUser: ICompanyUser = await CompanyUser.create({
            companyId: company._id,
            userId: user._id,
            created: created,
            active: true,
            ...(isInvite && invite?.actionGoal != null) && { actionGoal: invite.actionGoal },
            ...(isInvite && invite?.includeInReports != null) && { includeInReports: invite.includeInReports }
        });

        if (isInvite) {
            // Create User role
            let role = await Role.findOne({ _id: invite!.roleId });
            if (role) {
                const userRole: IUserRole = await UserRole.create({
                    companyId: company._id,
                    userId: user._id,
                    roleId: role._id,
                    created: created,
                    active: true
                });
            }

            // ✅ Add TeamUser records if invite had team assignments
            if (invite!.teams && invite!.teams.length > 0) {
                for (const teamId of invite!.teams) {
                    try {
                        await TeamUser.create({
                            teamId: teamId,
                            userId: user._id,
                            companyId: company._id,
                            created: created,
                            active: true
                        });
                    } catch (err: any) {
                        console.warn(`Failed to create TeamUser for team ${teamId}: ${err.message}`);
                    }
                }
            }

        } else {
            // Create User role
            let role = await Role.findOne({ name: "owner" });
            if (role) {
                const userRole: IUserRole = await UserRole.create({
                    companyId: company._id,
                    userId: user._id,
                    roleId: role._id,
                    created: created,
                    active: true
                });
            }
        }

        if (companyId && link && isInvite) {
            activityController.register({
                userId: user._id,
                section: "authentication",
                object: "user",
                objectId: user._id,
                action: "accepted invite",
                description: `${user.firstName} ${user.lastName} accept an invite to "${company.name}" company`,
                created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
            });
            await CompanyUserInvite.deleteOne({ companyId: companyId, shareLink: link }).exec();
        } else {
            
            activityController.register({
                userId: user._id,
                section: "authentication",
                object: "user",
                objectId: user._id,
                action: "registered (native)",
                description: `${firstName} ${lastName} registered with email ${email}`,
                created: now,
            });
        }

        const accessToken = jwt.sign(
            {
                _id: user._id,
                email: email,
                given_name: firstName,
                family_name: lastName
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            {          
                _id: user._id,      
                email: email,
                given_name: firstName,
                family_name: lastName
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Create user session
        const session = await Session.create({
            userId: user._id,
            device: device,
            refreshToken: refreshToken,
            created, now
        })

        let isHttps = (process.env.COOKIE_SECURE === 'true');
        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: isHttps, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 });
        res.json({
            sessionId: session._id,
            accessToken, 
            loggingIn: false, 
            isInvite: isInvite, 
            companyId: companyId
        });

        if (companyId && link && isInvite) {
            /* Adjust stripe licenses / billing */
            process.nextTick(() => {
                stripeController.adjustSubscription(companyId).catch(console.error);
            });
        }

    } catch (err: any) {
        res.status(500).json({ 'message' : err.message });
    }
}

const handleSocialLogin = async (req: Request, res: Response) => {

    const cookies = req.cookies;
    const { email, firstName, lastName, platform, method, token, picture, companyId, device, link } = req.body;
    let now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");

    if (platform !== "google" && platform !== "microsoft") return res.status(400).json({ 'message': 'Invalid social login.' });
    if (method !== "login" && method != "registration") return res.status(400).json({ 'message': 'Invalid social login.' });

    //if (platform === "microsoft") {
        //var decoded = jwt.decode(token, {complete: true});
        //console.log(decoded);
        //console.log(email);
        //console.log(firstName);
        //console.log(lastName);
        //console.log(platform);
        //console.log(method);
        //console.log(token);
        //console.log(picture);
        //console.log(companyId)
        //console.log(device);
        //console.log(link);
        //return res.sendStatus(500);
    //}

    if (method === "login") {

        /**************************
         * Existing Google Login
         **************************/

        const foundUser = await User.findOne({ "email": email, "active": true, "token": token, "platform": platform }).exec();
        if (!foundUser) return res.status(401).json({ 'message': 'Invalid credentials' }); //Unauthorized 

        const accessToken = jwt.sign(
            {
                _id: foundUser._id,
                email: foundUser.email,
                given_name: foundUser.firstName,
                family_name: foundUser.lastName
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            {               
                _id: foundUser._id, 
                email: foundUser.email,
                given_name: foundUser.firstName,
                family_name: foundUser.lastName
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        const session: ISession = await Session.create({
            userId: foundUser._id,
            device: device,
            refreshToken: refreshToken,
            created: now,
        });

        //foundUser.refreshToken = refreshToken;
        foundUser.lastLoginDate = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        const result = await foundUser.save();

        let isInvite = false;

        try {
            let company = await Company.findOne({ _id: companyId });
            if (company) {
                isInvite = true;
            }
        } catch(err) {
            // means cast of roadmapId to ObjectId failed, so not an invite
        }

        if (companyId && link && isInvite) {
            let company = await Company.findOne({ _id: companyId });
            let invite = await CompanyUserInvite.findOne({ companyId, email });
            
            // update company to load to this one 
            await UserSetting.updateOne({ userId: foundUser._id }, { $set: { 
                loadedCompanyId: companyId, 
                modified: now 
            }}).exec();

            // Create company user
            const companyUser: ICompanyUser = await CompanyUser.create({
                companyId: companyId,
                userId: foundUser._id,
                created: now,
                active: true,
                ...(invite.actionGoal) && { actionGoal: invite.actionGoal },
                ...(invite.includeInReports) && { includeInReports: invite.includeInReports }
            });

            // Create User role
            let role = await Role.findOne({ _id: invite!.roleId });
            if (role) {
                const userRole: IUserRole = await UserRole.create({
                    companyId: company._id,
                    userId: foundUser._id,
                    roleId: role._id,
                    created: now,
                    active: true
                });
            }
            // Add TeamUser records if invite had team assignments
            if (invite!.teams && invite!.teams.length > 0) {
                for (const teamId of invite!.teams) {
                    try {
                        await TeamUser.create({
                            teamId: teamId,
                            userId: foundUser._id,
                            companyId: company._id,
                            created: now,
                            active: true
                        });
                    } catch (err: any) {
                        console.warn(`Failed to create TeamUser for team ${teamId}: ${err.message}`);
                    }
                }
            }
            activityController.register({
                userId: foundUser._id,
                section: "authentication",
                object: "user",
                objectId: foundUser._id,
                action: "accepted invite",
                description: `${foundUser.firstName} ${foundUser.lastName} accept an invite to "${company.name}" company`,
                created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
            });
            await CompanyUserInvite.deleteOne({ companyId: companyId, shareLink: link }).exec();

        } else {

            const userSetting: IUserSetting = await UserSetting.findOne({ userId: foundUser._id }).exec();
            if (!userSetting) return res.status(401).json({ 'message': 'Invalid credentials' }); //Unauthorized 

            const userRole: IUserRole = await UserRole.findOne({ userId: foundUser._id, companyId: userSetting.loadedCompanyId, active: true }).exec();
            if (!userRole) return res.status(401).json({ 'message': 'Invalid credentials' }); //Unauthorized 

            const role: IRole = await Role.findOne({ _id: userRole.roleId, active: true }).exec();
            if (!role) return res.status(401).json({ 'message': 'Invalid credentials' }); //Unauthorized 

            if (role.name !== "owner" && role.name !== "admin" && userSetting.loadedComponentType === "settings") {
                // the user was in another company and now signing into a different with less authority */
                await UserSetting.updateOne({ userId: foundUser._id }, { $set: { 
                    loadedComponentType: (role.name === "advisor") ? "lists" : "work",
                    loadedSubComponentType:  (role.name === "advisor") ? "lists_customer" : "",
                    modified: now 
                }}).exec();
            }

            activityController.register({
                userId: foundUser._id,
                section: "authentication",
                object: "user",
                objectId: foundUser._id,
                action: "login (google)",
                description: `${foundUser.firstName} ${foundUser.lastName} logged in with email ${foundUser.email}`,
                created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
            });
        }

        let isHttps = (process.env.COOKIE_SECURE === 'true');



        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: isHttps, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 });
        res.json({ sessionId: session._id, accessToken, loggingIn: false, isInvite: isInvite, companyId: companyId });

        if (companyId && link && isInvite) {
            /* Adjust stripe licenses / billing */
            process.nextTick(() => {
                stripeController.adjustSubscription(companyId).catch(console.error);
            })
        }

    } else if (method === "registration") {

        /**************************
         * New Google Registration
         **************************/

        let isInvite = false;
        try {
            let company = await Company.findOne({ _id: companyId });
            if (company) {
                isInvite = true;
            }
        } catch(err) {
            // means cast of roadmapId to ObjectId failed, so not an invite
        }

        if (isInvite) {
            const dUser: IUser = await User.findOne({ email, active: true });
            if (dUser) {
                const duplicate = await CompanyUser.findOne({ companyId: companyId, userId: dUser._id, active: true });
                if (duplicate) return res.status(409).json({ 'message' : 'Email is already registered' }); //Conflict
            }
        } else {
            const dUser = await User.findOne({ email, active: true });
            if (dUser) {
                const duplicate = await CompanyUser.findOne({ userId: dUser._id, active: true });
                if (duplicate) return res.status(409).json({ 'message' : 'Email is already registered' }); //Conflict
            }
        }

        try {
            const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
            const created = now;
            const modified = now;
            let avatarColor: IColor = getRandomColor();  

            let company: ICompany;
            let invite: ICompanyUserInvite | null = null;
            if (isInvite) {
                company = await Company.findOne({ _id: companyId });
                invite = await CompanyUserInvite.findOne({ companyId, email });
            } else {
                // Create a new company
                company = await Company.create({
                    created: created,
                    active: true
                });
            } 
                    
            // Create new user
            const user: IUser = await User.create({
                //"id": id,
                email: email,
                password: uuidv4(),
                created: created,
                modified: modified,
                firstName: firstName,
                lastName: lastName,
                platform: platform,
                socialToken: token,
                lastLoginDate: now,
                avatar: (picture !== null) ? picture : "",
                defaultAvatarColor: avatarColor.hex,
                defaultAvatarFontColor: avatarColor.font
            });


            // Create company user
            const companyUser: ICompanyUser = await CompanyUser.create({
                companyId: company._id,
                userId: user._id,
                created: created,
                active: true,
                ...(isInvite && invite?.actionGoal != null) && { actionGoal: invite.actionGoal },
                ...(isInvite && invite?.includeInReports != null) && { includeInReports: invite.includeInReports }
            });

            if (isInvite) {
                // Create User role
                let role = await Role.findOne({ _id: invite!.roleId });
                if (role) {
                    const userRole: IUserRole = await UserRole.create({
                        companyId: company._id,
                        userId: user._id,
                        roleId: role._id,
                        created: created,
                        active: true
                    });
                }
    
                // ✅ Add TeamUser records if invite had team assignments
                if (invite!.teams && invite!.teams.length > 0) {
                    for (const teamId of invite!.teams) {
                        try {
                            await TeamUser.create({
                                teamId: teamId,
                                userId: user._id,
                                companyId: company._id,
                                created: created,
                                active: true
                            });
                        } catch (err: any) {
                            console.warn(`Failed to create TeamUser for team ${teamId}: ${err.message}`);
                        }
                    }
                }
    
            } else {
                // Create User role
                let role = await Role.findOne({ name: "owner" }).exec();
                if (role) {
                    const userRole: IUserRole = await UserRole.create({
                        companyId: company._id,
                        userId: user._id,
                        roleId: role._id,
                        created: created,
                        active: true
                    });
                }
            }

            if (companyId && link && isInvite) {
                activityController.register({
                    userId: user._id,
                    section: "authentication",
                    object: "user",
                    objectId: user._id,
                    action: "accepted invite",
                    description: `${user.firstName} ${user.lastName} accept an invite to "${company.name}" company`,
                    created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                });
                await CompanyUserInvite.deleteOne({ companyId: companyId, shareLink: link }).exec();
            } else {
                
                activityController.register({
                    userId: user._id,
                    section: "authentication",
                    object: "user",
                    objectId: user._id,
                    action: "registered (" + platform + ")",
                    description: `${firstName} ${lastName} registered with email ${email}`,
                    created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                });
            }

            const accessToken = jwt.sign(
                {
                    _id: user._id,
                    email: email,
                    given_name: firstName,
                    family_name: lastName
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );
            const refreshToken = jwt.sign(
                {          
                    _id: user._id,      
                    email: email,
                    given_name: firstName,
                    family_name: lastName
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            // Create user session
            const session = await Session.create({
                userId: user._id,
                device: device,
                refreshToken: refreshToken,
                created, now
            });
    
            let isHttps = (process.env.COOKIE_SECURE === 'true');
            // Creates Secure Cookie with refresh token
            res.cookie('jwt', refreshToken, { httpOnly: true, secure: isHttps, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 });
            res.json({
                sessionId: session._id,
                accessToken: accessToken,
                loggingIn: false,
                isInvite: isInvite,
                companyId: companyId
            });

            if (companyId && link && isInvite) {
                /* Adjust stripe licenses / billing */
                process.nextTick(() => {
                    stripeController.adjustSubscription(companyId).catch(console.error);
                });
            }
    
        } catch (err: any) {
            res.status(500).json({ 'message' : err.message });
        }

    } else {
        res.status(401).json({ 'message': 'Invalid credentials' });
    }
}

const handleRefreshToken = async (req: Request, res: Response) => {

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;
    let isHttps = (process.env.COOKIE_SECURE === 'true');

    res.clearCookie('jwt', { httpOnly: true, sameSite: "strict", secure: isHttps });

    const foundSession = await Session.findOne({ refreshToken }).exec();
    if(foundSession === null) return res.sendStatus(403);

    const foundUser = await User.findOne({ _id: foundSession.userId }).exec();
    if(foundUser === null) return res.sendStatus(403);

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err: any, decoded: any) => {
            if (err) {
                foundUser.refreshToken = "";
                const result = await foundUser.save();
            }

            if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

            // Refresh token was still valid
            const accessToken = jwt.sign(
                {
                    _id: foundUser._id,
                    email: decoded.email,
                    given_name: foundUser.firstName,
                    family_name: foundUser.lastName
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            const refreshToken = jwt.sign(
                {
                    _id: foundUser._id,
                    email: decoded.email,
                    given_name: foundUser.firstName,
                    family_name: foundUser.lastName
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            // Saving refreshToken to current session
            foundSession.refreshToken = refreshToken;
            const result = await foundSession.save();

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', refreshToken, { httpOnly: true, secure: isHttps, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken: accessToken});        
        }
    );
}

const handleLogout = async (req: Request, res: Response) => {
    
    // On client, also delete the accessToken
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;
    let isHttps = (process.env.COOKIE_SECURE === 'true');

    // Is refreshToken in db?
    const foundSession = await Session.findOne({ refreshToken }).exec();
    if (!foundSession) { 
        res.clearCookie('jwt', { httpOnly: true, sameSite: "strict", secure: isHttps });
        return res.sendStatus(204);
    }

    const foundUser = await User.findOne({ _id: foundSession.userId }).exec();
    if (!foundUser) { 
        res.clearCookie('jwt', { httpOnly: true, sameSite: "strict", secure: isHttps });
        return res.sendStatus(204);
    }

    activityController.register({
        userId: foundUser._id,
        section: "authentication",
        object: "user",
        objectId: foundUser._id,
        action: "logout",
        description: `${foundUser.firstName} ${foundUser.lastName} with email ${foundUser.email} logged out`,
        created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
    });

    // Delete the session
    await foundSession.deleteOne();

    res.clearCookie('jwt', { httpOnly: true, sameSite: "strict", secure: isHttps });
    res.sendStatus(204);
}

const activateUser = async (req: Request, res: Response) => {

    if (req.body.activationCode === undefined) 
        return res.status(400).json({ 'message' : 'Activate Code missing from request' });

    const { activationCode } = req.body;
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");

    try {

        const foundUser = await User.findOne({ activationToken: activationCode }).exec();
        if (!foundUser) { 
            return res.status(404).json({ 'message' : 'User not found with matching activation code' });
        }

        activityController.register({
            userId: foundUser._id,
            section: "authentication",
            object: "user",
            objectId: foundUser._id,
            action: "activated account",
            description: `${foundUser.firstName} ${foundUser.lastName} activated their account with email ${foundUser.email}`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        foundUser.activationToken = "";
        foundUser.activationDate = now;
        const result = await foundUser.save();
        res.sendStatus(204);

    } catch (err: any) {
        res.status(500).json({ 'message' : err.message });
    }
}

const resendActivationCode = async (req: Request, res: Response) => {

    if (req.body.email === undefined) 
        return res.status(400).json({ 'message' : 'Please enter your email so we can resend the code' });

    const { email } = req.body;

    try {

        const foundUser = await User.findOne({ email: email, active: true }).exec();
        if (!foundUser) { 
            return res.status(404).json({ 'message' : 'Email account doesn\'t exist' });
        }

        activityController.register({
            userId: foundUser._id,
            section: "authentication",
            object: "user",
            objectId: foundUser._id,
            action: "resent activation code",
            description: `${foundUser.firstName} ${foundUser.lastName} with email ${email} requested their activation code be resent.`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        mailController.sendActivationEmail(email, foundUser.activationToken);
        res.sendStatus(200);

    } catch (err: any) {
        res.status(500).json({ 'message' : err.message });
    }
}

const sendRecoveryLink = async (req: Request, res: Response) => {

    if (req.body.email === undefined) 
        return res.status(400).json({ 'message' : 'Please enter your email so we can send a recovery link' });

    const { email } = req.body;

    try {

        const foundUser = await User.findOne({ email: email, active: true }).exec();

        if (!foundUser) { 
            return res.status(404).json({ 'message' : 'Email account doesn\'t exist' });
        }

        if (foundUser.platform !== "native") { 
            return res.status(404).json({ 'message' : 'You have a Google login, please login using it' });
        }

        activityController.register({
            userId: foundUser._id,
            section: "authentication",
            object: "user",
            objectId: foundUser._id,
            action: "sent recovery link",
            description: `${foundUser.firstName} ${foundUser.lastName} with email ${email} was sent a password recovery link`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
        foundUser.passwordRecoveryToken = uuidv4();
        foundUser.modified = now;
        const result = await foundUser.save();
        mailController.sendRecoveryEmail(email, foundUser.passwordRecoveryToken);
        res.sendStatus(200);

    } catch (err: any) {
        res.status(500).json({ 'message' : err.message });
    }
}

const changePassword = async (req: Request, res: Response) => {

    if (req.body.password === undefined || req.body.recoveryCode === undefined) 
        return res.status(400).json({ 'message' : 'Bad request' });

    const { password, recoveryCode } = req.body;
    const now = fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS");
    const hashed = await bcrypt.hash(password, 10);

    try {

        const foundUser = await User.findOne({ passwordRecoveryToken: recoveryCode }).exec();
        if (!foundUser) { 
            return res.status(404).json({ 'message' : 'User not found with matching recovery code' });
        }

        activityController.register({
            userId: foundUser._id,
            section: "authentication",
            object: "user",
            objectId: foundUser._id,
            action: "changed password",
            description: `${foundUser.firstName} ${foundUser.lastName} with email ${foundUser.email} changed their password.`,
            created: fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
        });

        foundUser.modified = now;
        foundUser.passwordRecoveryToken = "";
        foundUser.password = hashed;
        const result = await foundUser.save();
        res.sendStatus(204);

    } catch (err: any) {
        res.status(500).json({ 'message' : err.message });
    }
}

const getAvatar = async (req: Request, res: Response) => {

    const foundUser = await getUser(req.cookies);
    if (foundUser === null) return res.status(403).json({ 'message': 'Not authorized.' });

    res.status(200).json({
        earlyAdopter: (foundUser.earlyAdopter) ? foundUser.earlyAdopter : false,
        created: foundUser.created,
        avatar: foundUser.avatar,
        defaultAvatarColor: foundUser.defaultAvatarColor,
        defaultAvatarFontColor: foundUser.defaultAvatarFontColor
    });
}

module.exports = {
    handleLogin, 
    handleRefreshToken, 
    handleLogout, 
    handleNewUser, 
    activateUser, 
    handleSocialLogin, 
    resendActivationCode,
    sendRecoveryLink, 
    changePassword,
    getAvatar,
};