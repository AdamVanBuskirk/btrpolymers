// utils/csv.ts
export type CsvColumn = { id: string; label: string };

function csvEscape(value: any): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  // escape if contains comma, quote, newline
  if (/[,"\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function rowsToCsv(columns: CsvColumn[], rows: Record<string, any>[]): string {
  const header = columns.map((c) => csvEscape(c.label)).join(",");
  const lines = rows.map((r) => columns.map((c) => csvEscape(r[c.id])).join(","));
  return [header, ...lines].join("\r\n");
}
