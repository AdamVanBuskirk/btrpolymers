import { Types } from 'mongoose';
import { IBaseModel } from './IBaseModel';
import { Role } from '../../../helpers/types';
export interface ITeamUser extends IBaseModel{
    teamId: Types.ObjectId;
    userId: Types.ObjectId;
}
