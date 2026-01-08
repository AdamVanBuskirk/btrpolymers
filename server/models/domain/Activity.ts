import { IActivity } from "./interfaces/IActivity";
import { Schema, model } from 'mongoose';

const activitySchema = new Schema<IActivity>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    section: {
        type: String,
        required: true
    },
    object: {
        type: String
    },
    objectId: {
        type: Schema.Types.ObjectId,
        require: true
    },
    action:  {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    created:  {
        type: Date,
        required: true
    }
});

module.exports = model<IActivity>('Activity', activitySchema);
export { IActivity };
