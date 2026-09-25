"use client";

import { AdminField } from "@/lib/adminTables";

export interface ReferenceOption {
  value: string;
  label: string;
}

interface Props {
  field: AdminField;
  value: unknown;
  disabled?: boolean;
  options?: ReferenceOption[]; // para campos "reference"
  onChange: (value: unknown) => void;
}

const inputClass =
  "w-full rounded-lg bg-[rgba(20,30,42,0.6)] border border-[rgba(255,243,199,0.18)] px-3 py-2 text-sm text-[#FFF3C7] " +
  "focus:outline-none focus:border-[#E1C380] disabled:opacity-50";

// Un campo del formulario según su tipo. Los números y las referencias vacías se guardan como null
export default function AdminFieldInput({ field, value, disabled, options = [], onChange }: Props) {
  const text = value === null || value === undefined ? "" : String(value);

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(value)}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="accent-[#E1C380]"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "textarea") {
    return <textarea className={`${inputClass} min-h-24`} value={text} disabled={disabled} onChange={(e) => onChange(e.target.value)} />;
  }

  if (field.type === "number" || field.type === "decimal") {
    return (
      <input
        type="number"
        step={field.type === "decimal" ? "0.01" : "1"}
        className={inputClass}
        value={text}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      />
    );
  }

  if (field.type === "select" || field.type === "reference") {
    const choices: ReferenceOption[] =
      field.type === "select" ? (field.options ?? []).map((o) => ({ value: o, label: o })) : options;

    return (
      <select
        className={inputClass}
        value={text}
        disabled={disabled}
        onChange={(e) => {
          const selected = e.target.value;
          if (selected === "") return onChange(null);
          // Las referencias a Casos son numéricas
          onChange(field.reference === "cases" ? Number(selected) : selected);
        }}
      >
        <option value="">{field.required ? "Seleccionar..." : "(ninguno)"}</option>
        {choices.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    );
  }

  return <input type="text" className={inputClass} value={text} disabled={disabled} onChange={(e) => onChange(e.target.value)} />;
}
