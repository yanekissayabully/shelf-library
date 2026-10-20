import type { Genre, NewBook, Status } from "./types";

// Form inputs are always strings; they are converted to numbers only after validation.
export interface BookFormValues {
  title: string;
  author: string;
  year: string;
  genre: Genre;
  pages: string;
  rating: string;
  status: Status;
}

export type BookFormErrors = Partial<Record<keyof BookFormValues, string>>;

export const EMPTY_FORM: BookFormValues = {
  title: "",
  author: "",
  year: "",
  genre: "Classic",
  pages: "",
  rating: "",
  status: "want",
};

export function validateBook(values: BookFormValues): BookFormErrors {
  const errors: BookFormErrors = {};
  const year = Number(values.year);
  const pages = Number(values.pages);
  const rating = Number(values.rating);

  if (values.title.trim() === "") errors.title = "Enter a title.";
  if (values.author.trim() === "") errors.author = "Enter an author.";

  if (values.year.trim() === "" || !Number.isInteger(year) || year > new Date().getFullYear()) {
    errors.year = "Enter a valid year, not in the future.";
  }
  if (values.pages.trim() === "" || !Number.isInteger(pages) || pages < 1 || pages > 5000) {
    errors.pages = "Enter a page count from 1 to 5000.";
  }
  if (values.rating.trim() === "" || Number.isNaN(rating) || rating < 0 || rating > 5) {
    errors.rating = "Enter a rating from 0 to 5.";
  }

  return errors;
}

export function toNewBook(values: BookFormValues): NewBook {
  return {
    title: values.title.trim(),
    author: values.author.trim(),
    year: Number(values.year),
    genre: values.genre,
    pages: Number(values.pages),
    rating: Math.round(Number(values.rating) * 10) / 10,
    status: values.status,
  };
}
