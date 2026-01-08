import { Types } from 'mongoose';
import { IBaseModel } from './IBaseModel';
export interface ICompanyUserInvite {
    companyId: Types.ObjectId;
    shareLink: string;
    firstName: string;
    lastName: string;
    email: string;
    actionGoal?: number;
    includeInReports?: boolean;
    roleId: Types.ObjectId;
    teams: string[];
    created: Date;
}
