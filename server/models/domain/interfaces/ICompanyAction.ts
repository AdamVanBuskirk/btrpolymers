import { Types } from "mongoose";
import { IBaseModel } from "./IBaseModel";
export interface ICompanyAction extends IBaseModel {
    companyId: Types.ObjectId;
    actionId: Types.ObjectId;
    type: string;
    name: string;
    sort: number;
    values: Array<string>;
}
