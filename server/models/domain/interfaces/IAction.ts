import { Types } from "mongoose";
import { IBaseModel } from "./IBaseModel";
export interface IAction extends IBaseModel {
    type: string;
    name: string;
    sort: number;
    values: Array<string>;
}
