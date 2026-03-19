import type React from "react";

export type AssetClass = "Equities" | "Macro" | "Credit";

export type SortDirection = "asc" | "desc";

export type SortingOrder = (SortDirection | null)[];

export interface SortEntry<K extends string = string> {
  key: K;
  direction: SortDirection;
}

export interface ColumnDef<T> {
  field: keyof T;
  label: string;
  width?: string | number;
  sort?: SortDirection | null;
  sortingOrder?: SortingOrder;
  comparator?: (a: T, b: T) => number;
  render: (row: T) => React.ReactNode;
  cellClassName?: (row: T) => string | undefined;
}

export interface Instrument {
  ticker: string;
  price: number;
  assetClass: AssetClass;
}
