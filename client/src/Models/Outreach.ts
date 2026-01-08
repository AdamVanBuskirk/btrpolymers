import { IBaseModel } from "./IBaseModel";

export interface Outreach extends IBaseModel {
    prospectId: string;
    notes: string;
    success: boolean;
    successArchived: boolean;
    userId: string;
    actions: Array<{
        name: string;
        value: string;
    }>;
    amounts: Array<{
        name: string;
        value: string;
    }>
}
