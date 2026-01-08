//import { shareType } from "../../Helpers/types"; 
export interface SharingContextParam {
    _id: string;
    email: string;
    event: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLAnchorElement>;
}