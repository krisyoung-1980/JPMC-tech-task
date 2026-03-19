import type { ColumnDef } from "../../types";
import styles from "./TableBody.module.css";

interface TableBodyProps<T> {
  rows: T[];
  columns: ColumnDef<T>[];
  getRowKey: (row: T) => string | number;
  getRowClassName?: (row: T) => string | undefined;
}

export const TableBody = <T,>({
  rows,
  columns,
  getRowKey,
  getRowClassName,
}: TableBodyProps<T>) => {
  return (
    <tbody>
      {rows.map((row) => (
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
      ))}
    </tbody>
  );
};
