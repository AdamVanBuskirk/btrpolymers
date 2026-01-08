import { Payload } from '../Models/Responses/Payload';

export const decodeToken = (token: string) => {
    let payload: Payload | null = null;
    if (token) {
        payload = JSON.parse(atob(token.split('.')[1]));
    }
    return payload;
}