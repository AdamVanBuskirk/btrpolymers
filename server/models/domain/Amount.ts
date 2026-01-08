import { IAmount } from './interfaces/IAmount';
import { Schema, model } from 'mongoose';

const amountSchema = new Schema<IAmount>({
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

module.exports = model<IAmount>('Amount', amountSchema);
export { IAmount };
