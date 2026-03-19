import type { AssetClass, ColumnDef, Instrument } from "../../types";
import styles from "./columns.module.css";

const ASSET_CLASS_ORDER: Record<AssetClass, number> = {
  Equities: 0,
  Macro: 1,
  Credit: 2,
};

const ASSET_CLASS_ROW_CLASS: Record<AssetClass, string> = {
  Equities: styles["table__row--equities"],
  Macro: styles["table__row--macro"],
  Credit: styles["table__row--credit"],
};

export const instrumentColumns: ColumnDef<Instrument>[] = [
  {
    field: "ticker",
    label: "Ticker",
    sort: null,
    sortingOrder: ["asc", "desc", null],
    render: (row) => row.ticker,
  },
  {
    field: "assetClass",
    label: "Asset Class",
    sort: "asc",
    sortingOrder: ["asc", "desc", null],
    comparator: (a, b) =>
      ASSET_CLASS_ORDER[a.assetClass] - ASSET_CLASS_ORDER[b.assetClass],
    render: (row) => row.assetClass,
  },
  {
    field: "price",
    label: "Price",
    sort: null,
    sortingOrder: ["desc", "asc", null],
    width: 240,
    render: (row) =>
      row.price.toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    cellClassName: (row) =>
      row.price >= 0 ? styles.price : styles["price--negative"],
  },
];

export const getInstrumentRowClassName = (row: Instrument): string =>
  ASSET_CLASS_ROW_CLASS[row.assetClass];
