export interface dtoUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    created: Date;
    modified: Date;
    active: boolean;
    password: string;
    avatar: string;
    defaultAvatarColor: string;
    defaultAvatarFontColor: string;
}