import { ICompanyAmount } from './interfaces/ICompanyAmount';
import { Schema, model } from 'mongoose';

const companyAmountSchema = new Schema<ICompanyAmount>({
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
    label: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        required: true
    },
    sort: {
        type: Number
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

module.exports = model<ICompanyAmount>('CompanyAmount', companyAmountSchema);
export { ICompanyAmount };
