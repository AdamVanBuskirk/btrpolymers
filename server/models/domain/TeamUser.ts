import { ITeamUser } from "./interfaces/ITeamUser";
import { Schema, model } from 'mongoose';

const teamUserSchema = new Schema<ITeamUser>({
    teamId: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
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
    active:  {
        type: Boolean,
        required: true
    },
    deleted:  {
        type: Date
    }
});

module.exports = model<ITeamUser>('TeamUser', teamUserSchema);
export { ITeamUser };
