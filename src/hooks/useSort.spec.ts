import { renderHook, act } from "@testing-library/react";
import { useSort } from "./useSort";
import type { SortDirection, SortingOrder } from "../types";

type TestKey = "name" | "age" | "score";

const initial = [{ key: "name" as TestKey, direction: "asc" as SortDirection }];
const ascFirstOrder: SortingOrder = ["asc", "desc", null];
const descFirstOrder: SortingOrder = ["desc", "asc", null];

describe("useSort", () => {
  describe("initial state", () => {
    it("returns the provided initial sorts", () => {
      const { result } = renderHook(() => useSort<TestKey>(initial));
      expect(result.current.sorts).toEqual(initial);
    });
  });

  describe("plain click (no shift)", () => {
    it("switching to a new key starts at first direction in sortingOrder", () => {
      const { result } = renderHook(() => useSort<TestKey>(initial));
      act(() => result.current.handleSort("score", false, descFirstOrder));
      expect(result.current.sorts).toEqual([
        { key: "score", direction: "desc" },
      ]);
    });

    it("switching to a new key respects asc-first sortingOrder", () => {
      const { result } = renderHook(() => useSort<TestKey>(initial));
      act(() => result.current.handleSort("age", false, ascFirstOrder));
      expect(result.current.sorts).toEqual([{ key: "age", direction: "asc" }]);
    });

    it("clicking the active sole key advances to next direction in sortingOrder", () => {
      const { result } = renderHook(() => useSort<TestKey>(initial));
      act(() => result.current.handleSort("name", false, ascFirstOrder));
      expect(result.current.sorts).toEqual([
        { key: "name", direction: "desc" },
      ]);
    });

    it("third click clears the sort entirely", () => {
      const { result } = renderHook(() => useSort<TestKey>(initial));
      act(() => result.current.handleSort("name", false, ascFirstOrder)); // asc → desc
      act(() => result.current.handleSort("name", false, ascFirstOrder)); // desc → null → []
      expect(result.current.sorts).toEqual([]);
    });

    it("plain click on any key collapses a multi-sort to a single entry", () => {
      const { result } = renderHook(() => useSort<TestKey>(initial));
      act(() => result.current.handleSort("age", true, ascFirstOrder)); // build multi-sort
      act(() => result.current.handleSort("score", false, descFirstOrder)); // plain click → single
      expect(result.current.sorts).toHaveLength(1);
      expect(result.current.sorts[0].key).toBe("score");
    });
  });

  describe("shift+click", () => {
    it("appends a new key using the first direction in sortingOrder", () => {
      const { result } = renderHook(() => useSort<TestKey>(initial));
      act(() => result.current.handleSort("score", true, descFirstOrder));
      expect(result.current.sorts).toEqual([
        { key: "name", direction: "asc" },
        { key: "score", direction: "desc" },
      ]);
    });

    it("toggles direction of an existing key in a multi-sort", () => {
      const { result } = renderHook(() => useSort<TestKey>(initial));
      act(() => result.current.handleSort("age", true, ascFirstOrder)); // append age asc
      act(() => result.current.handleSort("age", true, ascFirstOrder)); // advance age → desc
      expect(result.current.sorts).toEqual([
        { key: "name", direction: "asc" },
        { key: "age", direction: "desc" },
      ]);
    });

    it("third shift+click removes the key from multi-sort", () => {
      const { result } = renderHook(() => useSort<TestKey>(initial));
      act(() => result.current.handleSort("age", true, ascFirstOrder)); // append age asc
      act(() => result.current.handleSort("age", true, ascFirstOrder)); // advance age → desc
      act(() => result.current.handleSort("age", true, ascFirstOrder)); // desc → null → remove
      expect(result.current.sorts).toEqual([{ key: "name", direction: "asc" }]);
    });

    it("removing the last multi-sort key leaves sorts empty", () => {
      const { result } = renderHook(() =>
        useSort<TestKey>([
          { key: "name" as TestKey, direction: "asc" as SortDirection },
        ]),
      );
      act(() => result.current.handleSort("name", true, ascFirstOrder)); // advance name → desc
      act(() => result.current.handleSort("name", true, ascFirstOrder)); // desc → null → remove → []
      expect(result.current.sorts).toEqual([]);
    });

    it("preserves sort order when toggling a secondary column", () => {
      const { result } = renderHook(() => useSort<TestKey>(initial));
      act(() => result.current.handleSort("age", true, ascFirstOrder));
      act(() => result.current.handleSort("score", true, descFirstOrder));
      act(() => result.current.handleSort("age", true, ascFirstOrder)); // toggle middle entry
      expect(result.current.sorts.map((s) => s.key)).toEqual([
        "name",
        "age",
        "score",
      ]);
    });
  });
});
