export function objectToMap<V>(obj: { [key: string]: V }): Map<string, V> {
  const map = new Map<string, V>();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      map.set(key, obj[key]);
    }
  }
  return map;
}