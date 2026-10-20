import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteBook, updateBookStatus } from "@/lib/booksApi";
import { formatYear } from "@/lib/format";
import { STATUSES, STATUS_LABELS, type Book, type Status } from "@/lib/types";
import { SelectField } from "./SelectField";
import { StatusBadge } from "./StatusBadge";

interface BookInfoProps {
  book: Book;
  onChange: (book: Book) => void;
}

const STATUS_OPTIONS = STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] }));

export function BookInfo({ book, onChange }: BookInfoProps) {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<void>) => {
    setIsBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsBusy(false);
    }
  };

  const handleStatusChange = (status: Status) =>
    run(async () => {
      onChange(await updateBookStatus(book.id, status));
      setIsBusy(false);
    });

  const handleDelete = () =>
    run(async () => {
      await deleteBook(book.id);
      router.push("/");
    });

  return (
    <article className="detail">
      <StatusBadge status={book.status} />
      <h1>{book.title}</h1>
      <p className="detail__author">by {book.author}</p>

      <dl className="detail__facts">
        <div className="fact">
          <dt>Genre</dt>
          <dd>{book.genre}</dd>
        </div>
        <div className="fact">
          <dt>Published</dt>
          <dd>{formatYear(book.year)}</dd>
        </div>
        <div className="fact">
          <dt>Pages</dt>
          <dd>{book.pages}</dd>
        </div>
        <div className="fact">
          <dt>Rating</dt>
          <dd>★ {book.rating.toFixed(1)}</dd>
        </div>
      </dl>

      {error && (
        <p className="form__error" role="alert">
          {error}
        </p>
      )}

      <div className="detail__actions">
        <div className="detail__status">
          <SelectField
            label="Reading status"
            value={book.status}
            options={STATUS_OPTIONS}
            disabled={isBusy}
            onChange={handleStatusChange}
          />
        </div>

        {isConfirmingDelete ? (
          <div className="inline-actions">
            <button type="button" className="button button--danger" disabled={isBusy} onClick={handleDelete}>
              {isBusy ? "Deleting…" : "Confirm delete"}
            </button>
            <button
              type="button"
              className="button"
              disabled={isBusy}
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" className="button button--danger" onClick={() => setIsConfirmingDelete(true)}>
            Delete book
          </button>
        )}
      </div>
    </article>
  );
}
