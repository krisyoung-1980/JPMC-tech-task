import { useMemo } from "react";
import type { ColumnDef } from "../../types";
import { useSort } from "../../hooks/useSort";
import { useTableState, TableStateContext } from "../../hooks/useTableState";
import { sortData } from "../../utils/sortData";
import { TableHead } from "./TableHead";
import { TableBody } from "./TableBody";
import styles from "./DataTable.module.css";

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getRowKey: (row: T) => string | number;
  getRowClassName?: (row: T) => string | undefined;
}

const Table = <T,>({
  data,
  columns,
  getRowKey,
  getRowClassName,
}: DataTableProps<T>) => {
  const { activeSorts } = useTableState();
  const sorted = useMemo(
    () => sortData(data, activeSorts, columns),
    [data, activeSorts, columns],
  );

  return (
    <table className={styles.table} aria-label="Financial instruments">
      <colgroup>
        {columns.map((col) => (
          <col key={String(col.field)} style={{ width: col.width }} />
        ))}
      </colgroup>
      <TableHead columns={columns} />
      <TableBody
        rows={sorted}
        columns={columns}
        getRowKey={getRowKey}
        getRowClassName={getRowClassName}
      />
    </table>
  );
};

export const DataTable = <T,>({ columns, ...rest }: DataTableProps<T>) => {
  const initialSorts = useMemo(
    () =>
      columns
        .filter((col) => col.sort != null)
        .map((col) => ({ key: String(col.field), direction: col.sort! })),
    [columns],
  );

  const { sorts, activeSorts, handleSort } = useSort(initialSorts);

  const value = useMemo(
    () => ({ sorts, activeSorts, handleSort }),
    [sorts, activeSorts, handleSort],
  );

  return (
    <TableStateContext.Provider value={value}>
      <Table columns={columns} {...rest} />
    </TableStateContext.Provider>
  );
};
