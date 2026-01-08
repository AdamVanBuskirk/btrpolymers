import { Types } from 'mongoose';
export interface IActivity {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    section: string;
    object: string;
    objectId: Types.ObjectId;
    action: string;
    description: string;
    created: Date;
}
