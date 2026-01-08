import { IUserSetting } from "./interfaces/IUserSetting";
import { Schema, model } from 'mongoose';

const userSettingSchema = new Schema<IUserSetting>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    loadedCompanyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    sidebarExpanded: {
        type: Boolean,
        required: true
    },
    loadedComponentType: {
        type: String,
        required: true
    },
    loadedSubComponentType: {
        type: Schema.Types.Mixed,
        default: {},
    },
    statsScope: {
        type: String,
    },
    statsTimeframe: {
        type: String,
    },
    statsTeam: {
        type: String,
    },
    created: {
        type: Date,
        required: true
    },
    modified: {
        type: Date
    }
});

module.exports = model<IUserSetting>('UserSetting', userSettingSchema);
export { IUserSetting };
