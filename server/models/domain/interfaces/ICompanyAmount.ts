import { Types } from "mongoose";
import { IBaseModel } from "./IBaseModel";
export interface ICompanyAmount extends IBaseModel {
    companyId: Types.ObjectId;
    actionId: Types.ObjectId;
    label: string;
    placeholder: string;
    sort: number;
}
