//const mongoose = require('mongoose');
//const Schema = mongoose.Schema;

import { IEmailLog } from './interfaces/IEmailLog';
import { Schema, model } from 'mongoose';

const emailLogSchema = new Schema<IEmailLog>({
    /*
    id: {
        type: Number,
        required: true,
        unique: true
    },*/
    to: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    textMessage:  {
        type: String,
        required: true
    },
    htmlMessage:  {
        type: String,
        required: true
    },
    sent:  {
        type: Date,
        required: true
    }
});

module.exports = model<IEmailLog>('EmailLog', emailLogSchema);

export { IEmailLog };
