import { ICompanyUser } from "./interfaces/ICompanyUser";
import { Schema, model } from 'mongoose';

const companyUserSchema = new Schema<ICompanyUser>({
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
    actionGoal: {
        type: Number,
    },
    includeInReports: {
        type: Boolean,
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

module.exports = model<ICompanyUser>('CompanyUser', companyUserSchema);
export { ICompanyUser };
