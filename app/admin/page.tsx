import Link from "next/link";
import { adminTables } from "@/lib/adminTables";
import AdminIcon from "@/components/admin/AdminIcon";

// Inicio del panel: las tablas de jugabilidad agrupadas
export default function AdminHome() {
  const groups = Array.from(new Set(adminTables.map((t) => t.group)));

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Panel de administración</h1>
        <p className="mt-1 text-sm text-slate-400">Contenido del juego: casos, mapa, diálogos y sospechosos.</p>
      </header>

      {groups.map((group) => (
        <section key={group} className="flex flex-col gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wider text-slate-500">{group}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {adminTables
              .filter((t) => t.group === group)
              .map((t) => (
                <Link
                  key={t.key}
                  href={`/admin/${t.key}`}
                  className="group rounded-xl border border-white/[0.06] bg-[#0d1421] p-5 transition-all hover:border-[#E1C380]/40 hover:bg-[#101a2a]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-100">{t.title}</h3>
                    <AdminIcon name="arrowRight" className="size-4 text-slate-600 transition-all group-hover:text-[#E1C380] group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{t.description}</p>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
