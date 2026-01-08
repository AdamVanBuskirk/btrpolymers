export function mapToObject<K, V>(map: Map<K, V>): Record<string, V> {
    const obj: Record<string, V> = {};
    map.forEach((value, key) => {
        obj[String(key)] = value; // Ensure key is a string
    });
    return obj;
}
