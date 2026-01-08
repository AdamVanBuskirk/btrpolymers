export interface CompanyAction {
    //_id: string;
    actionId: string;
    type: string;
    name: string;
    sort: number;
    values: Array<string>;
}