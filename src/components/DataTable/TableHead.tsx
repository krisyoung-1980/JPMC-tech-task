import type { ColumnDef, SortDirection, SortEntry } from "../../types";
import { useTableState } from "../../hooks/useTableState";
import styles from "./TableHead.module.css";

const DIRECTION_ICON: Record<SortDirection, string> = { asc: "▲", desc: "▼" };
const ARIA_SORT: Record<SortDirection, "ascending" | "descending"> = {
  asc: "ascending",
  desc: "descending",
};

const sortIcon = (entry: SortEntry, index: number, total: number): string => {
  const prefix = total > 1 ? ` ${index + 1}` : "";
  return `${prefix}${DIRECTION_ICON[entry.direction]}`;
};

interface TableHeadProps<T> {
  columns: ColumnDef<T>[];
}

export const TableHead = <T,>({ columns }: TableHeadProps<T>) => {
  const { sorts, handleSort } = useTableState();
  return (
    <thead>
      <tr>
        {columns.map((col) => {
          const fieldKey = String(col.field);
          const entryIndex = sorts.findIndex((sort) => sort.key === fieldKey);
          const entry = entryIndex !== -1 ? sorts[entryIndex] : undefined;
          const ariaSort = entry ? ARIA_SORT[entry.direction] : "none";

          return (
            <th key={fieldKey} className={styles.header} aria-sort={ariaSort}>
              {col.sortingOrder !== undefined ? (
                <button
                  className={`${styles.sort} ${entry ? styles["sort--active"] : ""}`}
                  onClick={(e) =>
                    handleSort(fieldKey, e.shiftKey, col.sortingOrder!)
                  }
                >
                  {col.label}
                  <span className={styles["sort-icon"]} aria-hidden="true">
                    {entry ? sortIcon(entry, entryIndex, sorts.length) : " ⇅"}
                  </span>
                </button>
              ) : (
                <span className={styles.sort}>{col.label}</span>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
