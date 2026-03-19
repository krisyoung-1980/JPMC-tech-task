import { sortData } from "./sortData";
import { instrumentColumns } from "../components/FinancialInstrumentsTable/columns";
import type { Instrument } from "../types";

const instruments: Instrument[] = [
  { ticker: "ZEBRA", price: 500, assetClass: "Credit" },
  { ticker: "ALPHA", price: 1000, assetClass: "Equities" },
  { ticker: "MIDDLE", price: -200, assetClass: "Macro" },
];

describe("sortData — single column", () => {
  describe("assetClass", () => {
    it("asc: Equities → Macro → Credit", () => {
      const result = sortData(
        instruments,
        [{ key: "assetClass", direction: "asc" }],
        instrumentColumns,
      );
      expect(result.map((i) => i.assetClass)).toEqual([
        "Equities",
        "Macro",
        "Credit",
      ]);
    });

    it("desc: Credit → Macro → Equities", () => {
      const result = sortData(
        instruments,
        [{ key: "assetClass", direction: "desc" }],
        instrumentColumns,
      );
      expect(result.map((i) => i.assetClass)).toEqual([
        "Credit",
        "Macro",
        "Equities",
      ]);
    });
  });

  describe("price", () => {
    it("desc: highest first", () => {
      const result = sortData(
        instruments,
        [{ key: "price", direction: "desc" }],
        instrumentColumns,
      );
      const prices = result.map((i) => i.price);
      expect(prices).toEqual([...prices].sort((a, b) => b - a));
    });

    it("asc: lowest first", () => {
      const result = sortData(
        instruments,
        [{ key: "price", direction: "asc" }],
        instrumentColumns,
      );
      const prices = result.map((i) => i.price);
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });
  });

  describe("ticker", () => {
    it("asc: alphabetical", () => {
      const result = sortData(
        instruments,
        [{ key: "ticker", direction: "asc" }],
        instrumentColumns,
      );
      const tickers = result.map((i) => i.ticker);
      expect(tickers).toEqual([...tickers].sort());
    });

    it("desc: reverse alphabetical", () => {
      const result = sortData(
        instruments,
        [{ key: "ticker", direction: "desc" }],
        instrumentColumns,
      );
      const tickers = result.map((i) => i.ticker);
      expect(tickers).toEqual([...tickers].sort((a, b) => b.localeCompare(a)));
    });
  });
});

describe("sortData — multi-column", () => {
  const mixed: Instrument[] = [
    { ticker: "BRAVO", price: 200, assetClass: "Equities" },
    { ticker: "ALPHA", price: 100, assetClass: "Equities" },
    { ticker: "DELTA", price: 300, assetClass: "Credit" },
    { ticker: "CHARLIE", price: 150, assetClass: "Credit" },
  ];

  it("primary assetClass asc, secondary ticker asc", () => {
    const result = sortData(
      mixed,
      [
        { key: "assetClass", direction: "asc" },
        { key: "ticker", direction: "asc" },
      ],
      instrumentColumns,
    );
    expect(result.map((i) => i.ticker)).toEqual([
      "ALPHA",
      "BRAVO",
      "CHARLIE",
      "DELTA",
    ]);
  });

  it("primary assetClass asc, secondary price desc", () => {
    const result = sortData(
      mixed,
      [
        { key: "assetClass", direction: "asc" },
        { key: "price", direction: "desc" },
      ],
      instrumentColumns,
    );
    expect(result.map((i) => i.ticker)).toEqual([
      "BRAVO",
      "ALPHA",
      "DELTA",
      "CHARLIE",
    ]);
  });

  it("primary assetClass desc, secondary ticker asc", () => {
    const result = sortData(
      mixed,
      [
        { key: "assetClass", direction: "desc" },
        { key: "ticker", direction: "asc" },
      ],
      instrumentColumns,
    );
    expect(result.map((i) => i.ticker)).toEqual([
      "CHARLIE",
      "DELTA",
      "ALPHA",
      "BRAVO",
    ]);
  });
});

describe("sortData — invariants", () => {
  it("does not mutate the original array", () => {
    const original = [...instruments];
    sortData(
      instruments,
      [{ key: "price", direction: "asc" }],
      instrumentColumns,
    );
    expect(instruments).toEqual(original);
  });

  it("returns a copy when sorts is empty", () => {
    const result = sortData(instruments, [], instrumentColumns);
    expect(result).toEqual(instruments);
    expect(result).not.toBe(instruments);
  });

  it("handles a single element", () => {
    const single: Instrument[] = [
      { ticker: "SOLO", price: 1, assetClass: "Macro" },
    ];
    expect(
      sortData(
        single,
        [{ key: "assetClass", direction: "asc" }],
        instrumentColumns,
      ),
    ).toEqual(single);
  });
});
