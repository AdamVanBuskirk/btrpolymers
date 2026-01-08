import { IProspectType } from './interfaces/IProspectType';
import { Schema, model } from 'mongoose';

const prospectTypeSchema = new Schema<IProspectType>({
    name: {
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

module.exports = model<IProspectType>('ProspectType', prospectTypeSchema);
export { IProspectType };
