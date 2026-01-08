import { IBaseModel } from "./IBaseModel";
//import { userType } from "../../../helpers/types";
import { Types } from "mongoose";
export interface IStripePayment extends IBaseModel {
    userId: Types.ObjectId;
    stripePlanId: Types.ObjectId;
    customerId: string;
    subscriptionId: string;
    invoiceId: string;
    payment: Date;
    status: string;
}

