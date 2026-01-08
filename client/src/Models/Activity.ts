export interface Activity {
    _id: string;
    userId: string;
    section: string;
    object: string;
    objectId: string;
    action: string;
    description: string;
    created: Date;
}