import { IStripePayment } from './interfaces/IStripePayment';
import { Schema, model } from 'mongoose';

const stripePaymentSchema = new Schema<IStripePayment>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    stripePlanId: {
        type: Schema.Types.ObjectId,
        ref: "StripePlan"
    },
    customerId: {
        type: String,
        required: true,
    },
    subscriptionId: {
        type: String,
        required: true
    },
    invoiceId: {
        type: String,
        required: true
    },
    payment: {
        type: Date,
        required: true
    },
    created:  {
        type: Date,
        required: true
    },
    modified:  {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    status: {
        type: String
    },
});

module.exports = model<IStripePayment>('StripePayment', stripePaymentSchema);
export { IStripePayment };
