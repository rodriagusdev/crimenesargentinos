"use client";

import { useT } from "@/hooks/useT";
import type { AdminField, AdminTable } from "@/lib/adminTables";
import { useLocale } from "@/stores/useLocaleStore";
import AdminFieldInput from "./AdminFieldInput";
import AdminIcon from "./AdminIcon";
import type { AdminImage } from "./AdminImagePreview";
import { adminTableMessages } from "./AdminTablePage.messages";
import { button, iconButton, imageLabel, isEmpty, primaryButton, secondaryButton, type FormState, type ReferenceMap } from "./adminTableUi";

interface Props {
  table: AdminTable;
  form: FormState;
  references: ReferenceMap;
  saving: boolean;
  error: string | null;
  onChange: (field: AdminField, value: unknown) => void;
  onClose: () => void;
  onSave: () => void;
  onPreview: (preview: { title: string; images: AdminImage[] }) => void;
}

// Formulario de alta / edición de un registro (panel lateral)
export default function AdminRowForm({ table, form, references, saving, error, onChange, onClose, onSave, onPreview }: Props) {
  const t = useT(adminTableMessages);
  const locale = useLocale();

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => !saving && onClose()} />
      <aside className="relative h-full w-full max-w-xl bg-[#0d1421] border-l border-white/[0.08] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-semibold text-slate-50">{form.mode === "create" ? t("newRecord") : t("editRecord")}</h2>
            <p className="text-xs text-slate-500">{table.title[locale]}</p>
          </div>
          <button className={iconButton} onClick={onClose} disabled={saving} aria-label={t("close")}>
            <AdminIcon name="close" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {table.fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1.5">
              {field.type !== "boolean" && (
                <label className="text-sm font-medium text-slate-300">
                  {field.label[locale]}
                  {field.required && <span className="text-[#E1C380]"> *</span>}
                </label>
              )}
              <AdminFieldInput
                field={field}
                value={form.values[field.name]}
                disabled={saving || (form.mode === "edit" && field.keyPart)}
                options={field.reference ? references[field.reference]?.options : undefined}
                onChange={(value) => onChange(field, value)}
              />
              {field.image && !isEmpty(form.values[field.name]) && (
                <button
                  type="button"
                  className={`${button} self-start px-2.5 py-1 text-xs text-slate-300 border border-white/10 hover:bg-white/[0.05]`}
                  onClick={() =>
                    onPreview({
                      title: imageLabel(field, locale),
                      images: [{ label: imageLabel(field, locale), url: String(form.values[field.name]) }],
                    })
                  }
                >
                  <AdminIcon name="image" className="size-3.5" />
                  {t("viewImage")}
                </button>
              )}
              {field.hint && <p className="text-xs text-slate-500">{field.hint[locale]}</p>}
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] px-6 py-4 flex flex-col gap-3">
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-200">
              <AdminIcon name="alert" className="size-4 mt-0.5 shrink-0 text-red-300" />
              {error}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button className={secondaryButton} onClick={onClose} disabled={saving}>
              {t("cancel")}
            </button>
            <button className={primaryButton} onClick={onSave} disabled={saving}>
              {saving ? t("saving") : t("save")}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
