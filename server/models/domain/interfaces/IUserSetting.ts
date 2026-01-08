import { Types } from 'mongoose';
import { IBaseModel } from './IBaseModel';
export interface IUserSetting extends IBaseModel{
    userId: Types.ObjectId;
    loadedCompanyId: Types.ObjectId;
    sidebarExpanded: boolean;
    loadedComponentType: string;
    loadedSubComponentType: Record<string, unknown>;
    statsScope: string;
    statsTimeframe: string;
    statsTeam: string;
}
