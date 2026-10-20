"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createBook } from "@/lib/booksApi";
import { GENRES, STATUSES, STATUS_LABELS } from "@/lib/types";
import {
  EMPTY_FORM,
  toNewBook,
  validateBook,
  type BookFormErrors,
  type BookFormValues,
} from "@/lib/validation";
import { FormField } from "./FormField";
import { SelectField } from "./SelectField";

const GENRE_OPTIONS = GENRES.map((genre) => ({ value: genre, label: genre }));
const STATUS_OPTIONS = STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] }));

export function BookForm() {
  const router = useRouter();
  const [values, setValues] = useState<BookFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<BookFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = <K extends keyof BookFormValues>(field: K, value: BookFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const foundErrors = validateBook(values);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const book = await createBook(toNewBook(values));
      router.push(`/books/${book.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not save the book.");
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form__wide">
        <FormField
          label="Title"
          value={values.title}
          error={errors.title}
          onChange={(event) => setField("title", event.target.value)}
        />
      </div>
      <div className="form__wide">
        <FormField
          label="Author"
          value={values.author}
          error={errors.author}
          onChange={(event) => setField("author", event.target.value)}
        />
      </div>

      <SelectField
        label="Genre"
        value={values.genre}
        options={GENRE_OPTIONS}
        onChange={(genre) => setField("genre", genre)}
      />
      <SelectField
        label="Status"
        value={values.status}
        options={STATUS_OPTIONS}
        onChange={(status) => setField("status", status)}
      />

      <FormField
        label="Year"
        type="number"
        value={values.year}
        error={errors.year}
        onChange={(event) => setField("year", event.target.value)}
      />
      <FormField
        label="Pages"
        type="number"
        value={values.pages}
        error={errors.pages}
        onChange={(event) => setField("pages", event.target.value)}
      />
      <FormField
        label="Rating (0–5)"
        type="number"
        step="0.1"
        value={values.rating}
        error={errors.rating}
        onChange={(event) => setField("rating", event.target.value)}
      />

      {submitError && (
        <p className="form__error form__wide" role="alert">
          {submitError}
        </p>
      )}

      <div className="form__actions form__wide">
        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Add book"}
        </button>
        <Link href="/" className="button">
          Cancel
        </Link>
      </div>
    </form>
  );
}
