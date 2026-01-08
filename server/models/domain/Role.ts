import { IRole } from "./interfaces/IRole";
import { Schema, model } from 'mongoose';

const roleSchema = new Schema<IRole>({
    name: {
        type: String
    },
    description: {
        type: String
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

module.exports = model<IRole>('Role', roleSchema);
export { IRole };
