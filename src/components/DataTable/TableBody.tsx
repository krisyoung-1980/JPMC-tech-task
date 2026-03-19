import type { VirtualItem } from "@tanstack/react-virtual";
import type { ColumnDef } from "../../types";
import styles from "./TableBody.module.css";

interface TableBodyProps<T> {
  rows: T[];
  virtualItems: VirtualItem[];
  totalSize: number;
  columns: ColumnDef<T>[];
  getRowKey: (row: T) => string | number;
  getRowClassName?: (row: T) => string | undefined;
}

export const TableBody = <T,>({
  rows,
  virtualItems,
  totalSize,
  columns,
  getRowKey,
  getRowClassName,
}: TableBodyProps<T>) => {
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? totalSize - virtualItems[virtualItems.length - 1].end
      : 0;

  return (
    <tbody>
      {paddingTop > 0 && (
        <tr aria-hidden="true">
          <td colSpan={columns.length} style={{ height: paddingTop }} />
        </tr>
      )}
      {virtualItems.map((virtualItem) => {
        const row = rows[virtualItem.index];
        return (
          <tr
            key={getRowKey(row)}
            className={`${styles.row} ${getRowClassName?.(row) ?? ""}`}
          >
            {columns.map((col) => (
              <td
                key={String(col.field)}
                className={`${styles.cell} ${col.cellClassName?.(row) ?? ""}`}
              >
                {col.render(row)}
              </td>
            ))}
          </tr>
        );
      })}
      {paddingBottom > 0 && (
        <tr aria-hidden="true">
          <td colSpan={columns.length} style={{ height: paddingBottom }} />
        </tr>
      )}
    </tbody>
  );
};
