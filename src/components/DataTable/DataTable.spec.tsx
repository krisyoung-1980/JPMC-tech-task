import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "./DataTable";
import {
  instrumentColumns,
  getInstrumentRowClassName,
} from "../FinancialInstrumentsTable/columns";
import type { Instrument } from "../../types";

const instruments: Instrument[] = [
  { ticker: "ZEBRA", price: 500.0, assetClass: "Credit" },
  { ticker: "ALPHA", price: 1000.0, assetClass: "Equities" },
  { ticker: "MIDDLE", price: -200.0, assetClass: "Macro" },
  { ticker: "BRAVO", price: 750.0, assetClass: "Equities" },
  { ticker: "OMEGA", price: -50.0, assetClass: "Credit" },
  { ticker: "ZULU", price: 2000.0, assetClass: "Macro" },
];

const getRows = () => screen.getAllByRole("row").slice(1); // skip header row

const getCellsOf = (row: HTMLElement) => within(row).getAllByRole("cell");

const ticker = (row: HTMLElement) => getCellsOf(row)[0].textContent!;

const assetClass = (row: HTMLElement) => getCellsOf(row)[1].textContent!;

const defaultProps = {
  data: instruments,
  columns: instrumentColumns,
  getRowKey: (row: Instrument) => row.ticker,
  getRowClassName: getInstrumentRowClassName,
};

describe("DataTable", () => {
  describe("Basic Behaviour", () => {
    it("renders all rows", () => {
      render(<DataTable {...defaultProps} />);
      expect(getRows()).toHaveLength(instruments.length);
    });
  });

  describe("Sorting", () => {
    it("applies default sort (Asset Class asc) on load", () => {
      render(<DataTable {...defaultProps} />);
      const classes = getRows().map(assetClass);
      expect(classes.lastIndexOf("Equities")).toBeLessThan(
        classes.indexOf("Macro"),
      );
      expect(classes.lastIndexOf("Macro")).toBeLessThan(
        classes.indexOf("Credit"),
      );
    });

    it("clicking a column header once sorts A → Z", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} />);
      await user.click(screen.getByRole("button", { name: "Ticker" }));
      const tickers = getRows().map(ticker);
      expect(tickers).toEqual([...tickers].sort((a, b) => a.localeCompare(b)));
    });

    it("clicking a column header twice sorts Z → A", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} />);
      await user.click(screen.getByRole("button", { name: "Ticker" }));
      await user.click(screen.getByRole("button", { name: "Ticker" }));
      const tickers = getRows().map(ticker);
      expect(tickers).toEqual([...tickers].sort((a, b) => b.localeCompare(a)));
    });

    it("clicking a column header three times clears the sort and falls back to default", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} />);
      for (let i = 0; i < 3; i++) {
        await user.click(screen.getByRole("button", { name: "Ticker" }));
      }
      const classes = getRows().map(assetClass);
      expect(classes.lastIndexOf("Equities")).toBeLessThan(
        classes.indexOf("Macro"),
      );
      expect(classes.lastIndexOf("Macro")).toBeLessThan(
        classes.indexOf("Credit"),
      );
    });

    it("switching columns resets to the new column's default direction", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} />);
      await user.click(screen.getByRole("button", { name: "Price" }));
      await user.click(screen.getByRole("button", { name: "Price" })); // now asc
      await user.click(screen.getByRole("button", { name: "Ticker" })); // new column → default asc
      const tickers = getRows().map(ticker);
      expect(tickers).toEqual([...tickers].sort((a, b) => a.localeCompare(b)));
    });

    it("shift+click adds a second sort column", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} />);
      await user.keyboard("{Shift>}");
      await user.click(screen.getByRole("button", { name: "Ticker" }));
      await user.keyboard("{/Shift}");

      const rows = getRows();
      const equityTickers = rows
        .filter((row) => assetClass(row) === "Equities")
        .map(ticker);
      expect(equityTickers).toEqual(
        [...equityTickers].sort((a, b) => a.localeCompare(b)),
      );
      const creditTickers = rows
        .filter((row) => assetClass(row) === "Credit")
        .map(ticker);
      expect(creditTickers).toEqual(
        [...creditTickers].sort((a, b) => a.localeCompare(b)),
      );
    });

    it("plain click after multi-sort resets to single-column sort", async () => {
      const user = userEvent.setup();
      render(<DataTable {...defaultProps} />);
      await user.keyboard("{Shift>}");
      await user.click(screen.getByRole("button", { name: "Ticker" }));
      await user.keyboard("{/Shift}");
      await user.click(screen.getByRole("button", { name: "Ticker" }));
      const tickers = getRows().map(ticker);
      expect(tickers).toEqual([...tickers].sort((a, b) => a.localeCompare(b)));
      expect(
        screen.getByRole("columnheader", { name: "Asset Class" }),
      ).toHaveAttribute("aria-sort", "none");
    });
  });
});
