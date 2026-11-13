"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useT } from "@/hooks/useT";
import { AdminField, deletePath, findAdminTable } from "@/lib/adminTables";
import { AdminRow, createRow, deleteRow, updateRow } from "@/services/adminService";
import { useLocale } from "@/stores/useLocaleStore";
import AdminIcon from "./AdminIcon";
import AdminImagePreview, { AdminImage } from "./AdminImagePreview";
import AdminRowForm from "./AdminRowForm";
import AdminRowsTable from "./AdminRowsTable";
import { adminTableMessages } from "./AdminTablePage.messages";
import AdminTableToolbar from "./AdminTableToolbar";
import { imageLabel, isEmpty, primaryButton, type FormState } from "./adminTableUi";
import CaseWizard from "./case-wizard/CaseWizard";
import { useAdminTableData } from "./useAdminTableData";

interface Props {
  tableKey: string;
}

export default function AdminTablePage({ tableKey }: Props) {
  const t = useT(adminTableMessages);
  const locale = useLocale();
  const table = findAdminTable(tableKey)!;

  const { rows, references, loading, error, setError, reload: load, handleAuthError } = useAdminTableData(table);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [showCaseWizard, setShowCaseWizard] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ title: string; images: AdminImage[] } | null>(null);

  // Los avisos de éxito se cierran solos
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timeout);
  }, [notice]);

  // Texto de una celda (se usa también para buscar y ordenar)
  const display = useCallback(
    (name: string, value: unknown): string => {
      if (isEmpty(value)) return "";
      const field = table.fields.find((f) => f.name === name);
      if (field?.type === "boolean") return value ? t("yes") : t("no");
      if (field?.reference) return references[field.reference]?.labels.get(String(value)) ?? String(value);
      return String(value);
    },
    [table, references, t],
  );

  const filterField = table.filterBy ? table.fields.find((f) => f.name === table.filterBy) : undefined;

  // Imágenes cargadas en un registro (campos marcados con image), para el botón "Ver imagen"
  const imageFields = table.fields.filter((f) => f.image);
  const rowImages = (row: AdminRow): AdminImage[] =>
    imageFields.filter((f) => !isEmpty(row[f.name])).map((f) => ({ label: imageLabel(f, locale), url: String(row[f.name]) }));

  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows
      .filter((r) => !filter || String(r[table.filterBy!]) === filter)
      .filter((r) => !query || table.columns.some((c) => display(c, r[c]).toLowerCase().includes(query)))
      .sort((a, b) => {
        for (const name of table.orderBy ?? []) {
          const diff = display(name, a[name]).localeCompare(display(name, b[name]), "es", { numeric: true });
          if (diff !== 0) return diff;
        }
        return 0;
      });
  }, [rows, filter, search, table, display]);

  const openCreate = () => {
    if (table.key === "cases") {
      setForm(null);
      setShowCaseWizard(true);
      setFormError(null);
      return;
    }

    const values: AdminRow = {};
    table.fields.forEach((f) => (values[f.name] = f.type === "boolean" ? false : null));
    // Si hay un filtro activo, el registro nuevo queda dentro de ese filtro
    if (filter && filterField) values[filterField.name] = filterField.reference === "cases" ? Number(filter) : filter;
    setFormError(null);
    setForm({ mode: "create", values });
  };

  const openEdit = (row: AdminRow) => {
    setFormError(null);
    setForm({ mode: "edit", original: row, values: { ...row } });
  };

  const setValue = (field: AdminField, value: unknown) =>
    setForm((prev) => (prev ? { ...prev, values: { ...prev.values, [field.name]: value } } : prev));

  const save = async () => {
    if (!form) return;

    const missing = table.fields.filter((f) => f.required && f.type !== "boolean" && isEmpty(form.values[f.name]));
    if (missing.length > 0) {
      setFormError(t("missing", { fields: missing.map((f) => f.label[locale]).join(", ") }));
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      if (form.mode === "create") {
        const payload: AdminRow = { ...form.values };
        // En estas tablas el Id no lo genera el backend
        if (table.keyKind === "guid-client") payload.id = crypto.randomUUID();
        await createRow(table.controller, payload);
      } else {
        await updateRow(table.controller, { ...form.original, ...form.values });
      }
      setForm(null);
      setNotice(form.mode === "create" ? t("created") : t("saved"));
      await load();
    } catch (err) {
      handleAuthError(err);
      setFormError(err instanceof Error ? err.message : t("saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: AdminRow) => {
    setError(null);
    try {
      await deleteRow(deletePath(table, row));
      setConfirmDelete(null);
      setNotice(t("deleted"));
      await load();
    } catch (err) {
      handleAuthError(err);
      setConfirmDelete(null);
      setError(err instanceof Error ? err.message : t("deleteFailed"));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Encabezado ── */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">{table.title[locale]}</h1>
          <p className="mt-1 text-sm text-slate-400">{table.description[locale]}</p>
        </div>
        <button className={primaryButton} onClick={openCreate} disabled={loading}>
          <AdminIcon name="plus" />
          {t("newRecord")}
        </button>
      </header>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-200">
          <AdminIcon name="alert" className="size-4 mt-0.5 shrink-0 text-red-300" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-red-300/70 hover:text-red-200" aria-label={t("close")}>
            <AdminIcon name="close" />
          </button>
        </div>
      )}

      {/* ── Tabla ── */}
      <section className="rounded-xl border border-white/[0.06] bg-[#0d1421] overflow-hidden">
        <AdminTableToolbar
          search={search}
          onSearch={setSearch}
          filterField={filterField}
          filterOptions={filterField ? references[filterField.reference!]?.options ?? [] : []}
          filter={filter}
          onFilter={setFilter}
          loading={loading}
          visibleCount={visibleRows.length}
          totalCount={rows.length}
        />

        <AdminRowsTable
          table={table}
          totalRows={rows.length}
          visibleRows={visibleRows}
          loading={loading}
          display={display}
          rowImages={rowImages}
          confirmDelete={confirmDelete}
          onConfirmDelete={setConfirmDelete}
          onRemove={remove}
          onEdit={openEdit}
          onPreview={setPreview}
        />
      </section>

      {/* ── Formulario (panel lateral) ── */}
      {form && (
        <AdminRowForm
          table={table}
          form={form}
          references={references}
          saving={saving}
          error={formError}
          onChange={setValue}
          onClose={() => setForm(null)}
          onSave={save}
          onPreview={setPreview}
        />
      )}

      {/* ── Wizard multistep para casos ── */}
      {showCaseWizard && (
        <CaseWizard
          onClose={async (created) => {
            setShowCaseWizard(false);
            if (created) await load();
          }}
        />
      )}

      {/* ── Preview de imágenes ── */}
      {preview && <AdminImagePreview title={preview.title} images={preview.images} onClose={() => setPreview(null)} />}

      {/* ── Aviso de éxito ── */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-[#0d1f1a] px-4 py-3 text-sm text-emerald-200 shadow-xl">
          <AdminIcon name="check" className="size-4 text-emerald-300" />
          {notice}
        </div>
      )}
    </div>
  );
}
