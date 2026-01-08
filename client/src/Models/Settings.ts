import { loadedComponentType, loadedSubComponentType } from '../Helpers/types';
import { Company } from './Company';
export interface Settings {
    _id: string;
    userId: string;
    loadedCompanyId: string;
    created: string;
    modified: string;
    loadedComponentType: loadedComponentType;
    previousComponentType: loadedComponentType;
    sidebarExpanded: boolean;
    searchText: string;
    //loadedSubComponentType: loadedSubComponentType;
    loadedSubComponentType: Record<string, unknown>;
    statsTimeframe: string; // "week" | "month" | "year" | "all"
    statsScope: string; // "me" | "team" | "company"
    statsTeam: string;
}