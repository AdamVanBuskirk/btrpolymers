import { Types } from 'mongoose';
import { IBaseModel } from './IBaseModel';
export interface ICompany extends IBaseModel{
    name: string;
    logo: string;
    actionGoal?: number;
    industryId?: string;
    prospectVisibility?: string;
    timezone?: string;
}
