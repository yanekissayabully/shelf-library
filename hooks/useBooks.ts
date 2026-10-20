import { useCallback } from "react";
import { listBooks } from "@/lib/booksApi";
import type { BookQuery } from "@/lib/types";
import { useAsync } from "./useAsync";

export function useBooks({ search, genre, status, sortBy, order, page, pageSize }: BookQuery) {
  // A new loader is created only when one of the query values changes,
  // which is what makes useAsync fetch again.
  const loader = useCallback(
    (signal: AbortSignal) =>
      listBooks({ search, genre, status, sortBy, order, page, pageSize }, signal),
    [search, genre, status, sortBy, order, page, pageSize],
  );

  const { state, retry } = useAsync(loader);
  return { state, retry };
}
