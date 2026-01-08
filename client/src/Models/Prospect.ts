import { IBaseModel } from "./IBaseModel";
export interface Prospect extends IBaseModel {
    companyId: string;
    userId: string;
    typeId: string;
    company: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}
