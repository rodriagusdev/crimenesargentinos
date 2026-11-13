import type { AdminField, AdminTable } from "@/lib/adminTables";
import type { Locale } from "@/lib/i18n/locale";
import type { ReferenceOption } from "./AdminFieldInput";

// Piezas compartidas por la pantalla de una tabla y sus sub-paneles (listado y formulario)

export interface FormState {
  mode: "create" | "edit";
  original?: Record<string, unknown>;
  values: Record<string, unknown>;
}

export type ReferenceMap = Record<string, { options: ReferenceOption[]; labels: Map<string, string> }>;

export const button = "inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
export const primaryButton = `${button} px-3.5 py-2 bg-[#E1C380] text-[#0a0f18] hover:bg-[#ecd29a]`;
export const secondaryButton = `${button} px-3.5 py-2 border border-white/10 text-slate-200 hover:bg-white/[0.05]`;
export const iconButton = `${button} size-8 text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]`;

export const isEmpty = (value: unknown) => value === null || value === undefined || value === "";

// "Retrato (URL)" → "Retrato": título de cada imagen en el preview
export const imageLabel = (field: AdminField, locale: Locale) => field.label[locale].replace(/\s*\(URL\)\s*$/, "");

export function fieldLabel(table: AdminTable, name: string, locale: Locale): string {
  if (name === "id") return "Id";
  return table.fields.find((f) => f.name === name)?.label[locale] ?? name;
}
