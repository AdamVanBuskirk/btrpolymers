import { IProspect } from './interfaces/IProspect';
import { Schema, model } from 'mongoose';

const prospectSchema = new Schema<IProspect>({
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
    typeId: {
        type: Schema.Types.ObjectId,
        ref: "ProspectType",
        required: true
    },
    company: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName:  {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
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

module.exports = model<IProspect>('Prospect', prospectSchema);
export { IProspect };
