//import { userType } from "../../Helpers/types";
export interface StripePayment {
    _id: string;
    userId: string;
    stripePlanId: string;
    customerId: string;
    subscriptionId: string;
    invoiceId: string;
    payment: Date;
    active: boolean;
    status: string; /* succeeded or failed */
}