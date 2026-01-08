import { Types } from "mongoose";
export interface ISession {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    device: string;
    refreshToken: string;
    created: Date;
}
