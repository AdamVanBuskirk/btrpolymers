import { Types } from 'mongoose';
import { IBaseModel } from './IBaseModel';
import { Role } from '../../../helpers/types';
export interface IRole extends IBaseModel{
    name: Role
    description: string;
}
