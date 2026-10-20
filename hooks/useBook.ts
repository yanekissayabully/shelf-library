import { useCallback } from "react";
import { getBook } from "@/lib/booksApi";
import { useAsync } from "./useAsync";

export function useBook(id: string) {
  const loader = useCallback((signal: AbortSignal) => getBook(id, signal), [id]);
  return useAsync(loader);
}
