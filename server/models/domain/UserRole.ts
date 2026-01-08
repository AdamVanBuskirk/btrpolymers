import { IUserRole } from "./interfaces/IUserRole";
import { Schema, model } from 'mongoose';

const userRoleSchema = new Schema<IUserRole>({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true
    },
    created: {
        type: Date,
        required: true
    },
    modified: {
        type: Date
    },
    active: {
        type: Boolean,
        required: true
    },
    deleted: {
        type: Date
    }
});

module.exports = model<IUserRole>('UserRole', userRoleSchema);
export { IUserRole };
