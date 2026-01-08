//import { userType } from "../../Helpers/types";
export interface StripePlan {
    _id: string; 
    productId: string;
    priceId: string;
    name: string;
    description: string;
    features: Array<string>;
    price: number;
    billingCycle: string;
    sort: number;
}