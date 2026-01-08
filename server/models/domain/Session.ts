//const mongoose = require('mongoose');
//const Schema = mongoose.Schema;

import { ISession } from './interfaces/ISession';
import { Schema, model } from 'mongoose';

const sessionSchema = new Schema<ISession>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    device: {
        type: String,
        required: true
    },
    refreshToken: String,
    created:  {
        type: Date,
        required: true
    }
});

module.exports = model<ISession>('Session', sessionSchema);
export { ISession };
