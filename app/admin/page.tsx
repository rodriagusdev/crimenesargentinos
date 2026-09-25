import Link from "next/link";
import { adminTables } from "@/lib/adminTables";

// Inicio del panel: las tablas de jugabilidad agrupadas
export default function AdminHome() {
  const groups = Array.from(new Set(adminTables.map((t) => t.group)));

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-xl font-bold text-[#E1C380]">Panel de administración</h1>
        <p className="text-sm text-[#FFF3C7]/70">Contenido del juego: casos, mapa, diálogos y sospechosos.</p>
      </header>

      {groups.map((group) => (
        <section key={group} className="flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-widest text-[#FFF3C7]/50">{group}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {adminTables
              .filter((t) => t.group === group)
              .map((t) => (
                <Link
                  key={t.key}
                  href={`/admin/${t.key}`}
                  className="rounded-2xl border border-[rgba(255,243,199,0.18)] bg-[rgba(20,30,42,0.4)] p-4 hover:border-[#E1C380] transition-colors"
                >
                  <h3 className="text-sm font-semibold text-[#FFF3C7]">{t.title}</h3>
                  <p className="mt-1 text-xs text-[#FFF3C7]/60">{t.description}</p>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
