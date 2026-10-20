import { useEffect, useState } from "react";
import { isAbortError } from "@/lib/booksApi";

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };

type Loader<T> = (signal: AbortSignal) => Promise<T>;

// A result remembers which loader (and which retry) produced it. While the
// current loader has no result yet, the hook reports "loading" without having
// to call setState inside the effect.
interface Settled<T> {
  loader: Loader<T>;
  attempt: number;
  outcome: Exclude<AsyncState<T>, { status: "loading" }>;
}

const LOADING = { status: "loading" } as const;

export function useAsync<T>(loader: Loader<T>) {
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Cleanup aborts the request of the previous loader, so a slow old
    // response can never overwrite the result of a newer one.
    const controller = new AbortController();

    loader(controller.signal)
      .then((data) => setSettled({ loader, attempt, outcome: { status: "success", data } }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return;
        const message = error instanceof Error ? error.message : "Something went wrong.";
        setSettled({ loader, attempt, outcome: { status: "error", message } });
      });

    return () => controller.abort();
  }, [loader, attempt]);

  const isCurrent = settled !== null && settled.loader === loader && settled.attempt === attempt;
  const state: AsyncState<T> = isCurrent ? settled.outcome : LOADING;

  const retry = () => setAttempt((value) => value + 1);
  const replace = (data: T) => setSettled({ loader, attempt, outcome: { status: "success", data } });

  return { state, retry, replace };
}
