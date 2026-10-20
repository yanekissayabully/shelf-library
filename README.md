# Shelf

A single page app for tracking a personal library: browse 100+ books, search and filter them, open a book, change its reading status, and add your own books.

Built with Next.js (App Router), React and TypeScript. No UI or state libraries.

## Features

- **List view** — paginated grid of books (12 per page).
- **Search** — by title or author, debounced so typing does not fire a request per keystroke.
- **Filters** — genre and reading status.
- **Sorting** — by title, author, year, rating or pages, ascending or descending.
- **Detail view** — `/books/[id]`, change the reading status or delete the book.
- **Add form** — `/books/new`, controlled inputs with validation.
- **Loading, error, empty and success states** for every request, with a retry button on errors.
- **Reset** — clears all filters; an empty shelf can be restored to the sample library.

## Data source

The app uses the simulated API described in the assignment (`lib/booksApi.ts`):

- all functions return Promises and take 300–700 ms;
- 110 seed books live in `lib/seed.ts`;
- the "database" is stored in `localStorage`, so added, changed and deleted books survive a reload.

Search, filtering, sorting and pagination are done inside the API function, like on a real backend: the UI sends a query and receives one page plus the total count.

## Project structure

```
app/                 routes: / , /books/[id] , /books/new
components/          reusable UI (see below)
hooks/               useAsync, useBooks, useBook, useDebouncedValue
lib/                 types, seed data, simulated API, validation, formatting
```

Components:

| Component | Role |
| --- | --- |
| `Library` | List page: owns the query state, picks what to render |
| `BookFilters` | Search, genre, status, sort controls and reset |
| `SearchInput` | Debounced text input |
| `SelectField` | Labelled, generic `<select>` |
| `BookGrid` / `BookCard` | List of books and one book |
| `Pagination` | Previous / next with page counter |
| `BookDetail` / `BookInfo` | Loads one book / shows it and its actions |
| `BookForm` / `FormField` | Controlled add form and a labelled input with an error |
| `LoadingState`, `ErrorState`, `EmptyState`, `StatusBadge` | Shared presentational pieces |

## How data reaches the UI

1. `Library` keeps the current query (`search`, `genre`, `status`, `sortBy`, `order`, `page`) in `useState`.
2. `useBooks(query)` builds a loader function that changes only when a query value changes.
3. `useAsync(loader)` runs it in `useEffect`. The cleanup aborts the previous request through an `AbortController`, so a slow old response can never replace a newer one (no race condition).
4. The hook returns `loading | error | success`, and `Library` renders the matching component.

Changing any filter or sort resets the page to 1. The search input keeps its own draft text and reports it after 350 ms of silence; the Reset button remounts it through a changing `key`.

## Run locally

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`.

## Deploy

The project is a standard Next.js app and deploys to Vercel without extra configuration: import the repository, set the root directory to this folder if it lives in a larger repo, and deploy.
