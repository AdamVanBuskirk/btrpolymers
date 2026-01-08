import { IStripePlan } from './interfaces/IStripePlan';
import { Schema, model } from 'mongoose';

const stripePlanSchema = new Schema<IStripePlan>({
    productId: {
        type: String,
        required: true
    },
    priceId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    features: {
        type: [String],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    billingCycle: {
        type: String,
        required: true
    },
    sort: {
        type: Number,
        required: true
    },
    created: {
        type: Date,
        required: true
    },
    modified: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
});

module.exports = model<IStripePlan>('StripePlan', stripePlanSchema);
export { IStripePlan };
