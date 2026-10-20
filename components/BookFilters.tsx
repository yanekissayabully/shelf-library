import {
  GENRES,
  SORT_FIELDS,
  STATUSES,
  STATUS_LABELS,
  type BookQuery,
  type Genre,
  type SortField,
  type Status,
} from "@/lib/types";
import { SearchInput } from "./SearchInput";
import { SelectField } from "./SelectField";

export type FilterPatch = Partial<Pick<BookQuery, "genre" | "status" | "sortBy" | "order">>;

interface BookFiltersProps {
  query: BookQuery;
  // Changes when the filters are reset, which remounts the search input
  // and clears the text the user had typed.
  searchKey: number;
  onSearch: (value: string) => void;
  onChange: (patch: FilterPatch) => void;
  onReset: () => void;
}

const GENRE_OPTIONS: { value: Genre | "all"; label: string }[] = [
  { value: "all", label: "All genres" },
  ...GENRES.map((genre) => ({ value: genre, label: genre })),
];

const STATUS_OPTIONS: { value: Status | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  ...STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
];

const SORT_LABELS: Record<SortField, string> = {
  title: "Title",
  author: "Author",
  year: "Year",
  rating: "Rating",
  pages: "Pages",
};

const SORT_OPTIONS = SORT_FIELDS.map((field) => ({ value: field, label: SORT_LABELS[field] }));

export function BookFilters({ query, searchKey, onSearch, onChange, onReset }: BookFiltersProps) {
  const isDescending = query.order === "desc";

  return (
    <section className="filters" aria-label="Filters">
      <SearchInput key={searchKey} initialValue={query.search} onSearch={onSearch} />
      <SelectField
        label="Genre"
        value={query.genre}
        options={GENRE_OPTIONS}
        onChange={(genre) => onChange({ genre })}
      />
      <SelectField
        label="Status"
        value={query.status}
        options={STATUS_OPTIONS}
        onChange={(status) => onChange({ status })}
      />
      <div className="filters__sort">
        <SelectField
          label="Sort by"
          value={query.sortBy}
          options={SORT_OPTIONS}
          onChange={(sortBy) => onChange({ sortBy })}
        />
        <button
          type="button"
          className="button filters__order"
          aria-label={isDescending ? "Descending order" : "Ascending order"}
          onClick={() => onChange({ order: isDescending ? "asc" : "desc" })}
        >
          {isDescending ? "↓" : "↑"}
        </button>
      </div>
      <button type="button" className="button" onClick={onReset}>
        Reset
      </button>
    </section>
  );
}
