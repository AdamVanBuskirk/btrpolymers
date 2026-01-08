
export interface dtoStripePlan {   
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