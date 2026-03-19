import type { ColumnDef, SortEntry } from "../types";

const defaultCompare = (a: unknown, b: unknown): number => {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""));
};

export const sortData = <T>(
  data: T[],
  sorts: SortEntry[],
  columns: ColumnDef<T>[],
): T[] => {
  if (sorts.length === 0) return [...data];

  const colByField = new Map(columns.map((col) => [String(col.field), col]));

  return [...data].sort((a, b) => {
    for (const { key, direction } of sorts) {
      const col = colByField.get(key);
      if (!col) continue;
      const asc = col.comparator
        ? col.comparator(a, b)
        : defaultCompare(a[col.field as keyof T], b[col.field as keyof T]);
      const cmp = asc * (direction === "asc" ? 1 : -1);
      if (cmp !== 0) return cmp;
    }
    return 0;
  });
};
