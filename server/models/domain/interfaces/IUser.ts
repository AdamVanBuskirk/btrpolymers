import { IBaseModel } from "./IBaseModel";
export interface IUser extends IBaseModel {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar: string;
    activationToken: string;
    forgotPasswordToken: string;
    activationDate: Date;
    lastLoginDate: Date;
    platform: string;
    socialToken: string;
    passwordRecoveryToken: string;
    defaultAvatarColor: string;
    defaultAvatarFontColor: string;
    earlyAdopter: boolean;
}
