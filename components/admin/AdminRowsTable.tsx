"use client";

import type { ReactNode } from "react";
import { useT } from "@/hooks/useT";
import { rowKey, type AdminTable } from "@/lib/adminTables";
import type { AdminRow } from "@/services/adminService";
import { useLocale } from "@/stores/useLocaleStore";
import AdminIcon from "./AdminIcon";
import type { AdminImage } from "./AdminImagePreview";
import { adminTableMessages } from "./AdminTablePage.messages";
import { button, fieldLabel, iconButton, isEmpty } from "./adminTableUi";

interface Props {
  table: AdminTable;
  totalRows: number;
  visibleRows: AdminRow[];
  loading: boolean;
  display: (name: string, value: unknown) => string; // texto de una celda (referencias resueltas)
  rowImages: (row: AdminRow) => AdminImage[];
  confirmDelete: string | null;
  onConfirmDelete: (key: string | null) => void;
  onRemove: (row: AdminRow) => void;
  onEdit: (row: AdminRow) => void;
  onPreview: (preview: { title: string; images: AdminImage[] }) => void;
}

// Listado de registros con sus acciones (ver imagen, editar, borrar con confirmación)
export default function AdminRowsTable(props: Props) {
  const { table, totalRows, visibleRows, loading, display, rowImages, confirmDelete, onConfirmDelete, onRemove, onEdit, onPreview } = props;
  const t = useT(adminTableMessages);
  const locale = useLocale();
  const editable = table.editable !== false;
  const columnCount = table.columns.length + 1;

  const renderCell = (name: string, value: unknown): ReactNode => {
    if (isEmpty(value)) return <span className="text-slate-600">—</span>;

    const field = table.fields.find((f) => f.name === name);
    if (field?.type === "boolean") {
      return value ? (
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20">{t("yes")}</span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-white/[0.04] px-2 py-0.5 text-xs font-medium text-slate-400 ring-1 ring-inset ring-white/10">{t("no")}</span>
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] bg-white/[0.02]">
            {table.columns.map((c) => (
              <th key={c} className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-slate-500 whitespace-nowrap">
                {fieldLabel(table, c, locale)}
              </th>
            ))}
            <th className="px-4 py-2.5 w-28" />
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {loading &&
            totalRows === 0 &&
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
            const images = rowImages(row);
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
                      <span className="text-xs text-red-200">{t("confirmDelete")}</span>
                      <button className={`${button} px-2.5 py-1 text-xs bg-red-500/80 text-white hover:bg-red-500`} onClick={() => onRemove(row)}>
                        {t("delete")}
                      </button>
                      <button className={`${button} px-2.5 py-1 text-xs text-slate-300 hover:bg-white/[0.06]`} onClick={() => onConfirmDelete(null)}>
                        {t("cancel")}
                      </button>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      {images.length > 0 && (
                        <button className={iconButton} onClick={() => onPreview({ title: table.label(row), images })} title={t("viewImage")} aria-label={t("viewImage")}>
                          <AdminIcon name="image" />
                        </button>
                      )}
                      {editable && (
                        <button className={iconButton} onClick={() => onEdit(row)} title={t("edit")} aria-label={t("edit")}>
                          <AdminIcon name="edit" />
                        </button>
                      )}
                      <button className={`${iconButton} hover:text-red-300`} onClick={() => onConfirmDelete(key)} title={t("delete")} aria-label={t("delete")}>
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
                <p className="text-sm text-slate-300">{totalRows === 0 ? t("emptyTitle") : t("noResults")}</p>
                <p className="mt-1 text-xs text-slate-500">{totalRows === 0 ? t("emptyHint") : t("noResultsHint")}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
