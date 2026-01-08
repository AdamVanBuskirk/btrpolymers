import { IOutreach } from './interfaces/IOutreach';
import { Schema, model } from 'mongoose';

const outreachSchema = new Schema<IOutreach>({
    prospectId: {
        type: Schema.Types.ObjectId,
        ref: "Prospect",
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    success: {
        type: Boolean
    },
    successArchived: {
        type: Boolean
    },
    actions: [
        {
            name: { type: String, required: true },
            value: { type: String, required: true }
        }
    ],
    amounts: [
        {
            name: { type: String, required: true },
            value: { type: String, required: true }
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
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

module.exports = model<IOutreach>('Outreach', outreachSchema);
export { IOutreach };
