
export const sortArrayOfObjects = (sortType: any, direction: string, field: string, collection: Array<any>) => {
    if (typeof sortType === "string") {
        if (direction === "asc") {
            collection.sort((a, b) => (a[field as keyof typeof a] > b[field as keyof typeof a]) ? 1 : ((b[field as keyof typeof a] > a[field as keyof typeof a]) ? -1 : 0));
        } else {
            collection.sort((a, b) => (b[field as keyof typeof a] > a[field as keyof typeof a]) ? 1 : ((a[field as keyof typeof a] > b[field as keyof typeof a]) ? -1 : 0));
        }
    } else {
        /* numeric and boolean */
        if (direction === "asc") {
            collection.sort((a, b) => a[field as keyof typeof a] - b[field as keyof typeof a]);
        } else {
            collection.sort((a, b) => b[field as keyof typeof a] - a[field as keyof typeof a]);
        }
    }
    const sortedCollection = [...collection];
    return sortedCollection;
}