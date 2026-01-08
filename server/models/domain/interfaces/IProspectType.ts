import { Types } from "mongoose";
import { IBaseModel } from "./IBaseModel";
export interface IProspectType extends IBaseModel {
    name: string;
    sort: number;
}
