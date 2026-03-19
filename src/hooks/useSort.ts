import { useState, useCallback } from "react";
import type { SortDirection, SortingOrder, SortEntry } from "../types";

const getNext = (
  current: SortDirection | undefined,
  sortingOrder: SortingOrder,
): SortDirection | null => {
  if (current === undefined) {
    return (
      sortingOrder.find((dir): dir is SortDirection => dir !== null) ?? null
    );
  }
  const idx = sortingOrder.indexOf(current);
  const nextIdx = idx === -1 ? 0 : (idx + 1) % sortingOrder.length;
  return sortingOrder[nextIdx] ?? null;
};

const applyMultiSort = <K extends string>(
  prev: SortEntry<K>[],
  key: K,
  sortingOrder: SortingOrder,
): SortEntry<K>[] => {
  const existing = prev.find((entry) => entry.key === key);

  if (existing) {
    const next = getNext(existing.direction, sortingOrder);
    return next === null
      ? prev.filter((entry) => entry.key !== key)
      : prev.map((entry) =>
          entry.key === key ? { ...entry, direction: next } : entry,
        );
  }

  const firstDir = getNext(undefined, sortingOrder);
  return firstDir === null ? prev : [...prev, { key, direction: firstDir }];
};

const applySingleSort = <K extends string>(
  prev: SortEntry<K>[],
  key: K,
  sortingOrder: SortingOrder,
): SortEntry<K>[] => {
  const isSoleSort = prev.length === 1 && prev[0].key === key;

  if (isSoleSort) {
    const next = getNext(prev[0].direction, sortingOrder);
    return next === null ? [] : [{ key, direction: next }];
  }

  const firstDir = getNext(undefined, sortingOrder);
  return firstDir === null ? prev : [{ key, direction: firstDir }];
};

interface UseSortResult<K extends string> {
  sorts: SortEntry<K>[];
  activeSorts: SortEntry<K>[];
  handleSort: (key: K, shiftKey: boolean, sortingOrder: SortingOrder) => void;
}

export const useSort = <K extends string>(
  initialSorts: SortEntry<K>[],
): UseSortResult<K> => {
  const [sorts, setSorts] = useState<SortEntry<K>[]>(initialSorts);

  const handleSort = useCallback(
    (key: K, shiftKey: boolean, sortingOrder: SortingOrder) =>
      setSorts((prev) =>
        shiftKey
          ? applyMultiSort(prev, key, sortingOrder)
          : applySingleSort(prev, key, sortingOrder),
      ),
    [],
  );

  const activeSorts = sorts.length > 0 ? sorts : initialSorts;

  return { sorts, activeSorts, handleSort };
};
