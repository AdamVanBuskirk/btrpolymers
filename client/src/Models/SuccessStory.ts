import { Outreach } from './Outreach';
import { Prospect } from './Prospect';

export interface SuccessStory {
    prospect: Prospect,
    outreaches: Outreach[];
}