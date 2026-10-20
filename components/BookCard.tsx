import Link from "next/link";
import { formatYear } from "@/lib/format";
import type { Book } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`} className="book-card">
      <StatusBadge status={book.status} />
      <div>
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">{book.author}</p>
      </div>
      <div className="book-card__meta">
        <span>{book.genre}</span>
        <span>{formatYear(book.year)}</span>
        <span>★ {book.rating.toFixed(1)}</span>
      </div>
    </Link>
  );
}
