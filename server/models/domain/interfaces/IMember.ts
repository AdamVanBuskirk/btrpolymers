import { Role } from "../../../helpers/types";
import { Types } from "mongoose";
export interface IMember {
    me: boolean;
    avatar: string;
    defaultAvatarColor: string;
    defaultAvatarFontColor: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    status: string;
    sort: number;
    userId?: Types.ObjectId
    active: boolean;
    lastLogin: Date | undefined;
    stripePlan: string;
    created: Date;
    platform: string;
    teams?: Array<string>;
    actionGoal?: number;
    includeInReports?: boolean;
}