import { IAction } from './interfaces/IAction';
import { Schema, model } from 'mongoose';

const actionSchema = new Schema<IAction>({
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

module.exports = model<IAction>('Action', actionSchema);
export { IAction };
