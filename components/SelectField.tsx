import { useId } from "react";

interface Option<V extends string> {
  value: V;
  label: string;
}

interface SelectFieldProps<V extends string> {
  label: string;
  value: V;
  options: Option<V>[];
  onChange: (value: V) => void;
}

export function SelectField<V extends string>({ label, value, options, onChange }: SelectFieldProps<V>) {
  const id = useId();

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="select"
        value={value}
        onChange={(event) => onChange(event.target.value as V)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
