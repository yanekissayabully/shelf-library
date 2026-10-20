import { SEED_BOOKS } from "./seed";
import type { Book, BookPage, BookQuery, NewBook, Status } from "./types";

// Simulated REST API: every call is asynchronous, takes some time and keeps
// its "database" in localStorage, so changes survive a page reload.

const STORAGE_KEY = "shelf.books";
const MIN_DELAY_MS = 300;
const MAX_DELAY_MS = 700;

function delay(signal?: AbortSignal): Promise<void> {
  const ms = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Request aborted", "AbortError"));
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      reject(new DOMException("Request aborted", "AbortError"));
    }

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function readAll(): Book[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    writeAll(SEED_BOOKS);
    return SEED_BOOKS;
  }

  try {
    return JSON.parse(raw) as Book[];
  } catch {
    throw new Error("Stored library data is corrupted. Reset it to continue.");
  }
}

function writeAll(books: Book[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function compareBooks(a: Book, b: Book, { sortBy, order }: BookQuery): number {
  const left = a[sortBy];
  const right = b[sortBy];
  const result =
    typeof left === "string" && typeof right === "string"
      ? left.localeCompare(right)
      : Number(left) - Number(right);

  // Equal values fall back to the title so the order is always deterministic.
  const directed = order === "asc" ? result : -result;
  return directed || a.title.localeCompare(b.title);
}

function matches(book: Book, query: BookQuery): boolean {
  const needle = query.search.trim().toLowerCase();
  const textMatch =
    needle === "" ||
    book.title.toLowerCase().includes(needle) ||
    book.author.toLowerCase().includes(needle);

  return (
    textMatch &&
    (query.genre === "all" || book.genre === query.genre) &&
    (query.status === "all" || book.status === query.status)
  );
}

export async function listBooks(query: BookQuery, signal?: AbortSignal): Promise<BookPage> {
  await delay(signal);

  const filtered = readAll()
    .filter((book) => matches(book, query))
    .sort((a, b) => compareBooks(a, b, query));

  const start = (query.page - 1) * query.pageSize;
  return {
    items: filtered.slice(start, start + query.pageSize),
    total: filtered.length,
  };
}

export async function getBook(id: string, signal?: AbortSignal): Promise<Book> {
  await delay(signal);

  const book = readAll().find((item) => item.id === id);
  if (!book) throw new Error("This book does not exist or was removed.");
  return book;
}

export async function createBook(data: NewBook): Promise<Book> {
  await delay();

  const book: Book = { ...data, id: crypto.randomUUID() };
  writeAll([book, ...readAll()]);
  return book;
}

export async function updateBookStatus(id: string, status: Status): Promise<Book> {
  await delay();

  const books = readAll();
  const book = books.find((item) => item.id === id);
  if (!book) throw new Error("This book does not exist or was removed.");

  const updated: Book = { ...book, status };
  writeAll(books.map((item) => (item.id === id ? updated : item)));
  return updated;
}

export async function deleteBook(id: string): Promise<void> {
  await delay();
  writeAll(readAll().filter((item) => item.id !== id));
}

export async function resetBooks(): Promise<void> {
  await delay();
  writeAll(SEED_BOOKS);
}
