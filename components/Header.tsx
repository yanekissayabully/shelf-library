import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand">
          Shelf
        </Link>
        <nav className="nav">
          <Link href="/" className="button">
            Library
          </Link>
          <Link href="/books/new" className="button button--primary">
            Add book
          </Link>
        </nav>
      </div>
    </header>
  );
}
