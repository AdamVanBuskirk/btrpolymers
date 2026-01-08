import { Types } from 'mongoose';
export interface IEmailLog {
    _id: Types.ObjectId;
    //id: number;
    to: string;
    from: string;
    subject: string;
    textMessage: string;
    htmlMessage: string;
    sent: Date;
}
