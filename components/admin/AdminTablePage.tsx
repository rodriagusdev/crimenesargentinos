"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminField, AdminTable, deletePath, findAdminTable, rowKey } from "@/lib/adminTables";
import { AdminApiError, AdminRow, createRow, deleteRow, listRows, updateRow } from "@/services/adminService";
import AdminFieldInput, { ReferenceOption } from "./AdminFieldInput";

interface Props {
  tableKey: string;
}

interface FormState {
  mode: "create" | "edit";
  original?: AdminRow;
  values: AdminRow;
}

type ReferenceMap = Record<string, { options: ReferenceOption[]; labels: Map<string, string> }>;

const buttonClass = "px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors disabled:opacity-50";
const primaryButton = `${buttonClass} bg-[#E1C380] text-[#080e18] hover:bg-[#f0d596]`;
const secondaryButton = `${buttonClass} border border-[rgba(255,243,199,0.25)] text-[#FFF3C7] hover:bg-[rgba(255,243,199,0.08)]`;
const dangerButton = `${buttonClass} border border-red-400/40 text-red-300 hover:bg-red-950/40`;

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

  const applyResult = useCallback(
    (result: { data: AdminRow[]; refs: ReferenceMap }) => {
      setRows(result.data);
      setReferences(result.refs);
    },
    [],
  );

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

  // Texto que se muestra en una celda
  const display = useCallback(
    (name: string, value: unknown): string => {
      if (isEmpty(value)) return "—";
      const field = table.fields.find((f) => f.name === name);
      if (field?.type === "boolean") return value ? "Sí" : "No";
      if (field?.reference) return references[field.reference]?.labels.get(String(value)) ?? String(value);
      const text = String(value);
      return text.length > 80 ? `${text.slice(0, 80)}…` : text;
    },
    [table, references],
  );

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
      setNotice(form.mode === "create" ? "Registro creado." : "Cambios guardados.");
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
      setNotice("Registro borrado.");
      await load();
    } catch (err) {
      handleAuthError(err);
      setConfirmDelete(null);
      setError(err instanceof Error ? err.message : "No se pudo borrar");
    }
  };

  const editable = table.editable !== false;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#E1C380]">{table.title}</h1>
          <p className="text-sm text-[#FFF3C7]/70">{table.description}</p>
        </div>
        <button className={primaryButton} onClick={openCreate} disabled={loading}>
          + Nuevo
        </button>
      </header>

      {notice && <p className="text-sm text-emerald-300">{notice}</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {form && (
        <section className="rounded-2xl border border-[rgba(255,243,199,0.18)] bg-[rgba(20,30,42,0.4)] p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-widest text-[#E1C380]">
            {form.mode === "create" ? "NUEVO REGISTRO" : "EDITAR REGISTRO"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {table.fields.map((field) => (
              <div key={field.name} className={field.type === "textarea" ? "md:col-span-2 flex flex-col gap-1" : "flex flex-col gap-1"}>
                {field.type !== "boolean" && (
                  <span className="text-xs text-[#FFF3C7]/70">
                    {field.label}
                    {field.required && <span className="text-[#E1C380]"> *</span>}
                  </span>
                )}
                <AdminFieldInput
                  field={field}
                  value={form.values[field.name]}
                  disabled={saving || (form.mode === "edit" && field.keyPart)}
                  options={field.reference ? references[field.reference]?.options : undefined}
                  onChange={(value) => setValue(field, value)}
                />
                {field.hint && <span className="text-[11px] text-[#FFF3C7]/50">{field.hint}</span>}
              </div>
            ))}
          </div>

          {formError && <p className="text-sm text-red-300">{formError}</p>}

          <div className="flex gap-2">
            <button className={primaryButton} onClick={save} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button className={secondaryButton} onClick={() => setForm(null)} disabled={saving}>
              Cancelar
            </button>
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-lg bg-[rgba(20,30,42,0.6)] border border-[rgba(255,243,199,0.18)] px-3 py-2 text-sm focus:outline-none focus:border-[#E1C380]"
        />
        {filterField && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg bg-[rgba(20,30,42,0.6)] border border-[rgba(255,243,199,0.18)] px-3 py-2 text-sm focus:outline-none focus:border-[#E1C380]"
          >
            <option value="">{filterField.label}: todos</option>
            {references[filterField.reference!]?.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}
        <span className="self-center text-xs text-[#FFF3C7]/50">
          {loading ? "Cargando..." : `${visibleRows.length} de ${rows.length} registros`}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[rgba(255,243,199,0.18)]">
        <table className="w-full text-sm">
          <thead className="bg-[rgba(20,30,42,0.6)] text-left text-xs uppercase tracking-wider text-[#E1C380]">
            <tr>
              {table.columns.map((c) => (
                <th key={c} className="px-4 py-3 font-semibold">
                  {fieldLabel(table, c)}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,243,199,0.08)]">
            {visibleRows.map((row) => {
              const key = rowKey(table, row);
              return (
                <tr key={key} className="hover:bg-[rgba(255,243,199,0.04)]">
                  {table.columns.map((c) => (
                    <td key={c} className="px-4 py-2.5 align-top">
                      {display(c, row[c])}
                    </td>
                  ))}
                  <td className="px-4 py-2.5 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      {editable && (
                        <button className={secondaryButton} onClick={() => openEdit(row)}>
                          Editar
                        </button>
                      )}
                      {confirmDelete === key ? (
                        <>
                          <button className={dangerButton} onClick={() => remove(row)}>
                            Confirmar
                          </button>
                          <button className={secondaryButton} onClick={() => setConfirmDelete(null)}>
                            No
                          </button>
                        </>
                      ) : (
                        <button className={dangerButton} onClick={() => setConfirmDelete(key)}>
                          Borrar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && visibleRows.length === 0 && (
              <tr>
                <td colSpan={table.columns.length + 1} className="px-4 py-6 text-center text-[#FFF3C7]/50">
                  No hay registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
