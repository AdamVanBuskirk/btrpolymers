import { Role } from "../../Helpers/types";
//import { Team } from "../Team";
export interface Member {
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
    userId?: string;
    active: boolean;
    lastLogin: Date | undefined;
    stripePlan: string;
    created: Date;
    platform: string;
    teams?: Array<string>;
    actionGoal?: number;
    includeInReports?: boolean;
}