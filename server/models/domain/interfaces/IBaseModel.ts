import { Types } from 'mongoose';
export interface IBaseModel {
    _id: Types.ObjectId;
    created: Date;
    modified: Date;
    deleted?: Date;
    active: boolean;
}