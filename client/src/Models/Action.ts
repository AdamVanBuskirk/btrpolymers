export interface Action {
    _id: string;
    type: string;
    name: string;
    sort: number;
    values: Array<string>;
}