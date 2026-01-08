
export interface SocialCredentials {
    email: string; 
    firstName: string;
    lastName: string; 
    platform: string;
    method: string;
    token: string;
    picture: string;
    companyId: string | undefined;
    link: string | undefined;
    device: string;
}