import { IBaseModel } from "./IBaseModel";
export interface Team extends IBaseModel {
    companyId: string;
    name: string;
    actionGoal?: number;
}
