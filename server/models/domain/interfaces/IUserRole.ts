import { Types } from 'mongoose';
import { IBaseModel } from './IBaseModel';
export interface IUserRole extends IBaseModel{
    companyId: Types.ObjectId;
    userId: Types.ObjectId;
    roleId: Types.ObjectId;
}
