import { userType } from "../Helpers/types";
export interface InviteToCompany {
    _id: string;
    companyId: string;
    shareLink: string;
    shareLinkPermission: userType;
    email: string;
    created: Date;
}