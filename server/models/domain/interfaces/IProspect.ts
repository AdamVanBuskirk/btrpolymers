import { Types } from "mongoose";
import { IBaseModel } from "./IBaseModel";
export interface IProspect extends IBaseModel {
    companyId: Types.ObjectId;
    userId: Types.ObjectId;
    typeId: Types.ObjectId;
    company: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}
