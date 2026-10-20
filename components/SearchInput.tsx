import { useEffect, useId, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface SearchInputProps {
  initialValue: string;
  onSearch: (value: string) => void;
}

// Keeps the text the user is typing locally and reports it to the parent only
// after they stop typing, so every keystroke does not trigger a request.
export function SearchInput({ initialValue, onSearch }: SearchInputProps) {
  const id = useId();
  const [draft, setDraft] = useState(initialValue);
  const debounced = useDebouncedValue(draft, 350);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        Search
      </label>
      <input
        id={id}
        type="search"
        className="input"
        placeholder="Title or author"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
    </div>
  );
}
