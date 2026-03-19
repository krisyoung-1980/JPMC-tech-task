import { createContext, useContext } from "react";
import type { SortEntry, SortingOrder } from "../types";

export interface TableStateContextValue {
  sorts: SortEntry[];
  activeSorts: SortEntry[];
  handleSort: (
    key: string,
    shiftKey: boolean,
    sortingOrder: SortingOrder,
  ) => void;
}

export const TableStateContext = createContext<TableStateContextValue | null>(
  null,
);

export const useTableState = (): TableStateContextValue => {
  const ctx = useContext(TableStateContext);
  if (ctx === null) {
    throw new Error("useTableState must be used within a DataTable");
  }
  return ctx;
};
