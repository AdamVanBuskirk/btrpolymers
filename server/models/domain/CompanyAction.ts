import { ICompanyAction } from './interfaces/ICompanyAction';
import { Schema, model } from 'mongoose';

const companyActionSchema = new Schema<ICompanyAction>({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    actionId: {
        type: Schema.Types.ObjectId,
        ref: "Action",
        required: true
    },
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sort: {
        type: Number
    },
    values: {
        type: [String]
    },
    created:  {
        type: Date,
        required: true
    },
    modified:  {
        type: Date
    },
    active: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Date
    },
});

module.exports = model<ICompanyAction>('CompanyAction', companyActionSchema);
export { ICompanyAction };
