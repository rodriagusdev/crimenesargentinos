"use client";

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminField, AdminTable, deletePath, findAdminTable, rowKey } from "@/lib/adminTables";
import { AdminApiError, AdminRow, createRow, deleteRow, listRows, updateRow } from "@/services/adminService";
import AdminFieldInput, { adminInputClass, ReferenceOption } from "./AdminFieldInput";
import AdminIcon from "./AdminIcon";

interface Props {
  tableKey: string;
}

interface FormState {
  mode: "create" | "edit";
  original?: AdminRow;
  values: AdminRow;
}

type ReferenceMap = Record<string, { options: ReferenceOption[]; labels: Map<string, string> }>;

const button = "inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const primaryButton = `${button} px-3.5 py-2 bg-[#E1C380] text-[#0a0f18] hover:bg-[#ecd29a]`;
const secondaryButton = `${button} px-3.5 py-2 border border-white/10 text-slate-200 hover:bg-white/[0.05]`;
const iconButton = `${button} size-8 text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]`;

const isEmpty = (value: unknown) => value === null || value === undefined || value === "";

function fieldLabel(table: AdminTable, name: string): string {
  if (name === "id") return "Id";
  return table.fields.find((f) => f.name === name)?.label ?? name;
}

export default function AdminTablePage({ tableKey }: Props) {
  const router = useRouter();
  const table = findAdminTable(tableKey)!;

  const [rows, setRows] = useState<AdminRow[]>([]);
  const [references, setReferences] = useState<ReferenceMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // 401: sesión vencida, 403: no es admin
  const handleAuthError = useCallback(
    (err: unknown) => {
      if (err instanceof AdminApiError && err.status === 401) router.replace("/login");
      else if (err instanceof AdminApiError && err.status === 403) router.replace("/principal");
    },
    [router],
  );

  // Trae los registros de la tabla y las opciones de las tablas a las que apunta
  const fetchData = useCallback(async () => {
    const referenced = Array.from(new Set(table.fields.filter((f) => f.reference).map((f) => f.reference!)));
    const [data, ...refData] = await Promise.all([
      listRows(table.controller),
      ...referenced.map((key) => listRows(findAdminTable(key)!.controller)),
    ]);

    const refs: ReferenceMap = {};
    referenced.forEach((key, i) => {
      const refTable = findAdminTable(key)!;
      const options = refData[i]
        .map((r) => ({ value: String(r.id), label: refTable.label(r) }))
        .sort((a, b) => a.label.localeCompare(b.label, "es", { numeric: true }));
      refs[key] = { options, labels: new Map(options.map((o) => [o.value, o.label])) };
    });

    return { data, refs };
  }, [table]);

  const applyResult = useCallback((result: { data: AdminRow[]; refs: ReferenceMap }) => {
    setRows(result.data);
    setReferences(result.refs);
  }, []);

  const applyError = useCallback(
    (err: unknown) => {
      handleAuthError(err);
      setError(err instanceof Error ? err.message : "No se pudieron cargar los datos");
    },
    [handleAuthError],
  );

  // La página recrea este componente por tabla (key), así que el estado arranca limpio
  useEffect(() => {
    let cancelled = false;
    fetchData()
      .then((result) => !cancelled && applyResult(result))
      .catch((err) => !cancelled && applyError(err))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [fetchData, applyResult, applyError]);

  // Los avisos de éxito se cierran solos
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timeout);
  }, [notice]);

  // Recarga después de guardar o borrar
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      applyResult(await fetchData());
    } catch (err) {
      applyError(err);
    } finally {
      setLoading(false);
    }
  };

  // Texto de una celda (se usa también para buscar y ordenar)
  const display = useCallback(
    (name: string, value: unknown): string => {
      if (isEmpty(value)) return "";
      const field = table.fields.find((f) => f.name === name);
      if (field?.type === "boolean") return value ? "Sí" : "No";
      if (field?.reference) return references[field.reference]?.labels.get(String(value)) ?? String(value);
      return String(value);
    },
    [table, references],
  );

  const renderCell = (name: string, value: unknown): ReactNode => {
    if (isEmpty(value)) return <span className="text-slate-600">—</span>;

    const field = table.fields.find((f) => f.name === name);
    if (field?.type === "boolean") {
      return value ? (
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20">Sí</span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-xs font-medium text-slate-400 ring-1 ring-inset ring-white/10">No</span>
      );
    }
    if (name === "id") return <span className="font-mono text-xs text-slate-400">{String(value)}</span>;

    const text = display(name, value);
    return (
      <span title={text.length > 70 ? text : undefined} className={field?.reference ? "text-slate-300" : undefined}>
        {text.length > 70 ? `${text.slice(0, 70)}…` : text}
      </span>
    );
  };

  const filterField = table.filterBy ? table.fields.find((f) => f.name === table.filterBy) : undefined;

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
      setFormError(`Completá: ${missing.map((f) => f.label).join(", ")}.`);
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
      setNotice(form.mode === "create" ? "Registro creado" : "Cambios guardados");
      await load();
    } catch (err) {
      handleAuthError(err);
      setFormError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: AdminRow) => {
    setError(null);
    try {
      await deleteRow(deletePath(table, row));
      setConfirmDelete(null);
      setNotice("Registro borrado");
      await load();
    } catch (err) {
      handleAuthError(err);
      setConfirmDelete(null);
      setError(err instanceof Error ? err.message : "No se pudo borrar");
    }
  };

  const editable = table.editable !== false;
  const columnCount = table.columns.length + 1;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Encabezado ── */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">{table.title}</h1>
          <p className="mt-1 text-sm text-slate-400">{table.description}</p>
        </div>
        <button className={primaryButton} onClick={openCreate} disabled={loading}>
          <AdminIcon name="plus" />
          Nuevo registro
        </button>
      </header>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-200">
          <AdminIcon name="alert" className="size-4 mt-0.5 shrink-0 text-red-300" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-red-300/70 hover:text-red-200" aria-label="Cerrar">
            <AdminIcon name="close" />
          </button>
        </div>
      )}

      {/* ── Tabla ── */}
      <section className="rounded-xl border border-white/[0.06] bg-[#0d1421] overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
          <div className="relative">
            <AdminIcon name="search" className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className={`${adminInputClass} w-72 pl-9`} />
          </div>
          {filterField && (
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${adminInputClass} w-64`}>
              <option value="">{filterField.label}: todos</option>
              {references[filterField.reference!]?.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
          <span className="ml-auto text-xs text-slate-500">
            {loading ? "Cargando..." : `${visibleRows.length} de ${rows.length} registros`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {table.columns.map((c) => (
                  <th key={c} className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    {fieldLabel(table, c)}
                  </th>
                ))}
                <th className="px-4 py-2.5 w-28" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading &&
                rows.length === 0 &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    {Array.from({ length: columnCount }).map((__, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-3 rounded bg-white/[0.05] animate-pulse" style={{ width: `${40 + ((i + j) % 4) * 15}%` }} />
                      </td>
                    ))}
                  </tr>
                ))}

              {visibleRows.map((row) => {
                const key = rowKey(table, row);
                const confirming = confirmDelete === key;
                return (
                  <tr key={key} className={`group transition-colors ${confirming ? "bg-red-500/[0.06]" : "hover:bg-white/[0.02]"}`}>
                    {table.columns.map((c) => (
                      <td key={c} className="px-4 py-3 align-top text-slate-200">
                        {renderCell(c, row[c])}
                      </td>
                    ))}
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      {confirming ? (
                        <div className="inline-flex items-center gap-2">
                          <span className="text-xs text-red-200">¿Borrar?</span>
                          <button className={`${button} px-2.5 py-1 text-xs bg-red-500/80 text-white hover:bg-red-500`} onClick={() => remove(row)}>
                            Borrar
                          </button>
                          <button className={`${button} px-2.5 py-1 text-xs text-slate-300 hover:bg-white/[0.06]`} onClick={() => setConfirmDelete(null)}>
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          {editable && (
                            <button className={iconButton} onClick={() => openEdit(row)} title="Editar" aria-label="Editar">
                              <AdminIcon name="edit" />
                            </button>
                          )}
                          <button className={`${iconButton} hover:text-red-300`} onClick={() => setConfirmDelete(key)} title="Borrar" aria-label="Borrar">
                            <AdminIcon name="trash" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {!loading && visibleRows.length === 0 && (
                <tr>
                  <td colSpan={columnCount} className="px-4 py-14 text-center">
                    <p className="text-sm text-slate-300">{rows.length === 0 ? "Todavía no hay registros" : "No hay resultados"}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {rows.length === 0 ? "Creá el primero con “Nuevo registro”." : "Probá con otra búsqueda o filtro."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Formulario (panel lateral) ── */}
      {form && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => !saving && setForm(null)} />
          <aside className="relative h-full w-full max-w-xl bg-[#0d1421] border-l border-white/[0.08] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 h-16 border-b border-white/[0.06]">
              <div>
                <h2 className="text-base font-semibold text-slate-50">{form.mode === "create" ? "Nuevo registro" : "Editar registro"}</h2>
                <p className="text-xs text-slate-500">{table.title}</p>
              </div>
              <button className={iconButton} onClick={() => setForm(null)} disabled={saving} aria-label="Cerrar">
                <AdminIcon name="close" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {table.fields.map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  {field.type !== "boolean" && (
                    <label className="text-sm font-medium text-slate-300">
                      {field.label}
                      {field.required && <span className="text-[#E1C380]"> *</span>}
                    </label>
                  )}
                  <AdminFieldInput
                    field={field}
                    value={form.values[field.name]}
                    disabled={saving || (form.mode === "edit" && field.keyPart)}
                    options={field.reference ? references[field.reference]?.options : undefined}
                    onChange={(value) => setValue(field, value)}
                  />
                  {field.hint && <p className="text-xs text-slate-500">{field.hint}</p>}
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.06] px-6 py-4 flex flex-col gap-3">
              {formError && (
                <div className="flex items-start gap-2 text-sm text-red-200">
                  <AdminIcon name="alert" className="size-4 mt-0.5 shrink-0 text-red-300" />
                  {formError}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button className={secondaryButton} onClick={() => setForm(null)} disabled={saving}>
                  Cancelar
                </button>
                <button className={primaryButton} onClick={save} disabled={saving}>
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

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
