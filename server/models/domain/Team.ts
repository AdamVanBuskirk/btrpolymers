import { ITeam } from "./interfaces/ITeam";
import { Schema, model } from 'mongoose';

const teamSchema = new Schema<ITeam>({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    name: {
        type: String
    },
    actionGoal: {
        type: Number,
    },
    created:  {
        type: Date,
        required: true
    },
    modified:  {
        type: Date
    },
    active:  {
        type: Boolean,
        required: true
    },
    deleted:  {
        type: Date
    }
});

module.exports = model<ITeam>('Team', teamSchema);
export { ITeam };
