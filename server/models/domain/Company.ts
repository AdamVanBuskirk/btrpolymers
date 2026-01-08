import { ICompany } from "./interfaces/ICompany";
import { Schema, model } from 'mongoose';

const companySchema = new Schema<ICompany>({
    name: {
        type: String
    },
    logo: {
        type: String
    },
    actionGoal: {
        type: Number
    },
    industryId: {
        type: Schema.Types.ObjectId
    },
    timezone: {
        type: String
    },
    prospectVisibility: {
        type: String
    },
    created:  {
        type: Date,
        required: true
    },
    modified:  {
        type: Date
    },
    active:  {
        type: Boolean,
        required: true
    },
    deleted:  {
        type: Date
    }
});

module.exports = model<ICompany>('Company', companySchema);
export { ICompany };
