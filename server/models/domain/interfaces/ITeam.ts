import { Types } from 'mongoose';
import { IBaseModel } from './IBaseModel';
import { Role } from '../../../helpers/types';
export interface ITeam extends IBaseModel{
    companyId: Types.ObjectId;
    name: string;
    actionGoal?: number;
}
