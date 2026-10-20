"use client";

import Link from "next/link";
import { useBook } from "@/hooks/useBook";
import { BookInfo } from "./BookInfo";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";

interface BookDetailProps {
  id: string;
}

export function BookDetail({ id }: BookDetailProps) {
  const { state, retry, replace } = useBook(id);

  return (
    <>
      <Link href="/" className="back-link">
        ← Back to library
      </Link>

      {state.status === "loading" && <LoadingState label="Loading book…" />}

      {state.status === "error" && <ErrorState message={state.message} onRetry={retry} />}

      {state.status === "success" && (
        <BookInfo key={state.data.id} book={state.data} onChange={replace} />
      )}
    </>
  );
}
