import { useState, useEffect } from "react";
import type { Instrument } from "../types";

interface UseFindInstrumentsQueryResult {
  data: Instrument[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export const useFindInstrumentsQuery = (): UseFindInstrumentsQueryResult => {
  const [data, setData] = useState<Instrument[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/instruments", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Instrument[]>;
      })
      .then((json) => {
        setData(json);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { data, isLoading, isError: error !== null, error };
};
