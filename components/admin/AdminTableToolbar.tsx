"use client";

import { useT } from "@/hooks/useT";
import type { AdminField } from "@/lib/adminTables";
import { useLocale } from "@/stores/useLocaleStore";
import { adminInputClass, type ReferenceOption } from "./AdminFieldInput";
import AdminIcon from "./AdminIcon";
import { adminTableMessages } from "./AdminTablePage.messages";

interface Props {
  search: string;
  onSearch: (value: string) => void;
  filterField?: AdminField;
  filterOptions: ReferenceOption[];
  filter: string;
  onFilter: (value: string) => void;
  loading: boolean;
  visibleCount: number;
  totalCount: number;
}

// Búsqueda, filtro por referencia y conteo de registros del listado
export default function AdminTableToolbar({ search, onSearch, filterField, filterOptions, filter, onFilter, loading, visibleCount, totalCount }: Props) {
  const t = useT(adminTableMessages);
  const locale = useLocale();

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
      <div className="relative">
        <AdminIcon name="search" className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input placeholder={t("search")} value={search} onChange={(e) => onSearch(e.target.value)} className={`${adminInputClass} w-72 pl-9`} />
      </div>
      {filterField && (
        <select value={filter} onChange={(e) => onFilter(e.target.value)} className={`${adminInputClass} w-64`}>
          <option value="">{t("filterAll", { field: filterField.label[locale] })}</option>
          {filterOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
      <span className="ml-auto text-xs text-slate-500">{loading ? t("loading") : t("count", { visible: visibleCount, total: totalCount })}</span>
    </div>
  );
}
