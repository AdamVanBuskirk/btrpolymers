import { Member } from "./Member";

export interface SaveMemberParams {
    projectId: string;
    member: Member;
}