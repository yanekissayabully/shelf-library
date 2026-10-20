"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useBooks } from "@/hooks/useBooks";
import { resetBooks } from "@/lib/booksApi";
import type { BookQuery } from "@/lib/types";
import { BookFilters, type FilterPatch } from "./BookFilters";
import { BookGrid } from "./BookGrid";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { Pagination } from "./Pagination";

const DEFAULT_QUERY: BookQuery = {
  search: "",
  genre: "all",
  status: "all",
  sortBy: "title",
  order: "asc",
  page: 1,
  pageSize: 12,
};

export function Library() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [searchKey, setSearchKey] = useState(0);
  const { state, retry } = useBooks(query);

  // Any change to what is being shown starts again from the first page.
  const handleFilterChange = (patch: FilterPatch) =>
    setQuery((prev) => ({ ...prev, ...patch, page: 1 }));

  const handleSearch = useCallback(
    (search: string) =>
      setQuery((prev) => (prev.search === search ? prev : { ...prev, search, page: 1 })),
    [],
  );

  const handlePageChange = (page: number) => setQuery((prev) => ({ ...prev, page }));

  const handleReset = () => {
    setQuery(DEFAULT_QUERY);
    setSearchKey((key) => key + 1);
  };

  const handleRestoreSample = async () => {
    await resetBooks();
    retry();
  };

  const hasFilters = query.search !== "" || query.genre !== "all" || query.status !== "all";

  return (
    <>
      <div className="page__head">
        <div>
          <h1>Your library</h1>
          <p className="page__subtitle">Search, filter and sort the books on your shelf.</p>
        </div>
      </div>

      <BookFilters
        query={query}
        searchKey={searchKey}
        onSearch={handleSearch}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {state.status === "loading" && <LoadingState label="Loading books…" />}

      {state.status === "error" && <ErrorState message={state.message} onRetry={retry} />}

      {state.status === "success" && state.data.items.length === 0 && hasFilters && (
        <EmptyState
          title="No books match your filters"
          text="Try a different search term or clear the filters."
          action={
            <button type="button" className="button" onClick={handleReset}>
              Reset filters
            </button>
          }
        />
      )}

      {state.status === "success" && state.data.items.length === 0 && !hasFilters && (
        <EmptyState
          title="Your shelf is empty"
          text="Add your first book or bring back the sample library."
          action={
            <div className="inline-actions">
              <Link href="/books/new" className="button button--primary">
                Add book
              </Link>
              <button type="button" className="button" onClick={handleRestoreSample}>
                Restore sample library
              </button>
            </div>
          }
        />
      )}

      {state.status === "success" && state.data.items.length > 0 && (
        <>
          <p className="results-info">
            {state.data.total} {state.data.total === 1 ? "book" : "books"} found
          </p>
          <BookGrid books={state.data.items} />
          <Pagination
            page={query.page}
            total={state.data.total}
            pageSize={query.pageSize}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
}
