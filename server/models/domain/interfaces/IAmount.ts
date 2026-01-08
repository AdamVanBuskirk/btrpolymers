import { Types } from "mongoose";
import { IBaseModel } from "./IBaseModel";
export interface IAmount extends IBaseModel {
    label: string;
    placeholder: string;
    sort: number;
}
