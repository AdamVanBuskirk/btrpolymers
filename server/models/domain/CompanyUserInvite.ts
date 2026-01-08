import { ICompanyUserInvite } from "./interfaces/ICompanyUserInvite";
import { Schema, model } from 'mongoose';

const companyUserInviteSchema = new Schema<ICompanyUserInvite>({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    shareLink: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    actionGoal: {
        type: Number,
    },
    includeInReports: {
        type: Boolean,
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true
    },
    teams: [
        {
          type: Schema.Types.ObjectId,
          ref: "Team",
          required: false
        }
    ],
    created: {
        type: Date,
        required: true
    },
});

module.exports = model<ICompanyUserInvite>('CompanyUserInvite', companyUserInviteSchema);
export { ICompanyUserInvite };
