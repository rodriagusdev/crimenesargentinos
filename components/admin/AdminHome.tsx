"use client";

import Link from "next/link";
import { useT } from "@/hooks/useT";
import { adminGroups, adminGroupTitles, adminTables } from "@/lib/adminTables";
import { defineMessages } from "@/lib/i18n/messages";
import { useLocale } from "@/stores/useLocaleStore";
import AdminIcon from "./AdminIcon";
import NewCaseButton from "./NewCaseButton";

const messages = defineMessages({
  es: { title: "Panel de administración", subtitle: "Contenido del juego: casos, mapa, diálogos y sospechosos." },
  en: { title: "Admin panel", subtitle: "Game content: cases, map, dialogs and suspects." },
});

// Inicio del panel: las tablas de jugabilidad agrupadas
export default function AdminHome() {
  const t = useT(messages);
  const locale = useLocale();

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">{t("title")}</h1>
          <p className="mt-1 text-sm text-slate-400">{t("subtitle")}</p>
        </div>
        <NewCaseButton />
      </header>

      {adminGroups.map((group) => (
        <section key={group} className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wider text-slate-500">{adminGroupTitles[group][locale]}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {adminTables
              .filter((table) => table.group === group)
              .map((table) => (
                <Link
                  key={table.key}
                  href={`/admin/${table.key}`}
                  className="group rounded-xl border border-white/[0.06] bg-[#0d1421] p-5 transition-all hover:border-[#E1C380]/40 hover:bg-[#101a2a]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-100">{table.title[locale]}</h3>
                    <AdminIcon name="arrowRight" className="size-4 text-slate-600 transition-all group-hover:text-[#E1C380] group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{table.description[locale]}</p>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
