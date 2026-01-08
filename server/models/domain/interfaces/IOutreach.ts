import { Types } from "mongoose";
import { IBaseModel } from "./IBaseModel";

export interface IOutreach extends IBaseModel {
    prospectId: Types.ObjectId;
    userId: Types.ObjectId;
    notes: string;
    success: boolean;
    successArchived: boolean;
    actions: Types.Array<{
        name: string;
        value: string;
    }>;
    amounts: Types.Array<{
        name: string;
        amount: string;
    }>
}
