import { IBaseModel } from "./IBaseModel";
//import { userType } from "../../../helpers/types";
//import { Types } from "mongoose";
export interface IStripePlan extends IBaseModel {
    productId: string;
    priceId: string;
    name: string;
    description: string;
    features: Array<string>;
    price: number;
    billingCycle: string;
    sort: number;
}

