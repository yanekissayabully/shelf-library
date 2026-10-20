import { BookForm } from "@/components/BookForm";

export default function NewBookPage() {
  return (
    <>
      <div className="page__head">
        <div>
          <h1>Add a book</h1>
          <p className="page__subtitle">Fill in the details; you can change the reading status later.</p>
        </div>
      </div>
      <BookForm />
    </>
  );
}
