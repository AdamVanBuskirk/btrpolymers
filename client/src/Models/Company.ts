import { IBaseModel } from './IBaseModel';
export interface Company extends IBaseModel {
    name: string;
    logo: string;
    industryId?: string;
    actionGoal?: number;
    prospectVisibility?: string;
    timezone?: string;
}