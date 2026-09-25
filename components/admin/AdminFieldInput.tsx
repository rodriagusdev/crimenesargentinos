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

export const adminInputClass =
  "w-full rounded-md bg-[#0a0f18] border border-white/10 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 " +
  "focus:outline-none focus:border-[#E1C380]/60 focus:ring-2 focus:ring-[#E1C380]/15 disabled:opacity-50 disabled:cursor-not-allowed transition";

// Un campo del formulario según su tipo. Los números y las referencias vacías se guardan como null
export default function AdminFieldInput({ field, value, disabled, options = [], onChange }: Props) {
  const text = value === null || value === undefined ? "" : String(value);

  if (field.type === "boolean") {
    const checked = Boolean(value);
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="flex items-center gap-3 text-sm text-slate-200 disabled:opacity-50"
      >
        <span className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-[#E1C380]" : "bg-white/10"}`}>
          <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all ${checked ? "left-[18px]" : "left-0.5"}`} />
        </span>
        {field.label}
      </button>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        className={`${adminInputClass} min-h-28 resize-y leading-relaxed`}
        value={text}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === "number" || field.type === "decimal") {
    return (
      <input
        type="number"
        step={field.type === "decimal" ? "0.01" : "1"}
        className={adminInputClass}
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
        className={adminInputClass}
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

  return <input type="text" className={adminInputClass} value={text} disabled={disabled} onChange={(e) => onChange(e.target.value)} />;
}
