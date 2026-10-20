export const GENRES = [
  "Classic",
  "Fantasy",
  "Sci-Fi",
  "Mystery",
  "History",
  "Science",
  "Biography",
  "Technology",
  "Philosophy",
] as const;

export const STATUSES = ["want", "reading", "finished"] as const;

export type Genre = (typeof GENRES)[number];
export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  want: "Want to read",
  reading: "Reading",
  finished: "Finished",
};

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: Genre;
  pages: number;
  rating: number;
  status: Status;
}

export type NewBook = Omit<Book, "id">;

export const SORT_FIELDS = ["title", "author", "year", "rating", "pages"] as const;
export type SortField = (typeof SORT_FIELDS)[number];
export type SortOrder = "asc" | "desc";

export interface BookQuery {
  search: string;
  genre: Genre | "all";
  status: Status | "all";
  sortBy: SortField;
  order: SortOrder;
  page: number;
  pageSize: number;
}

export interface BookPage {
  items: Book[];
  total: number;
}
