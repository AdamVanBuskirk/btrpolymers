//const mongoose = require('mongoose');
//const Schema = mongoose.Schema;

import { IUser } from './interfaces/IUser';
import { Schema, model } from 'mongoose';

const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName:  {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
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
    //refreshToken: String,
    activationToken:  {
        type: String
    },
    forgotPasswordToken:  {
        type: String
    },
    activationDate: {
        type: Date
    },
    lastLoginDate: {
        type: Date
    },
    platform: {
        type: String
    },
    socialToken: {
        type: String
    },
    passwordRecoveryToken: {
        type: String
    },
    defaultAvatarColor: {
        type: String
    },
    defaultAvatarFontColor: {
        type: String
    },
    /*
    signupPage: {
        type: String,
        required: false,
    }, 
    signupPackage: {
        type: String,
        required: false,
    },
    */
    earlyAdopter: {
        type: Boolean
    }
});

module.exports = model<IUser>('User', userSchema);

export { IUser };
