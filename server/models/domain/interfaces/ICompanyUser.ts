import { Types } from 'mongoose';
import { IBaseModel } from './IBaseModel';
export interface ICompanyUser extends IBaseModel{
    companyId: Types.ObjectId;
    userId: Types.ObjectId;
    actionGoal?: number;
    includeInReports?: boolean;
}
