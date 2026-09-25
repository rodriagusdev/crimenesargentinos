"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { adminTables } from "@/lib/adminTables";
import { getUserIdentity } from "@/lib/auth";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import AdminIcon, { AdminIconName } from "./AdminIcon";

const groupIcons: Record<string, AdminIconName> = {
  Casos: "folder",
  Mapa: "map",
  Diálogos: "chat",
  Sospechosos: "user",
};

// Marco del panel: barra lateral con las tablas agrupadas, barra superior con la ruta y control de acceso por rol
export default function AdminShell({ children }: { children: ReactNode }) {
  const allowed = useAdminGuard();
  const pathname = usePathname();
  const router = useRouter();

  const identity = useMemo(() => (allowed ? getUserIdentity() : { name: "", email: "" }), [allowed]);

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f18] text-slate-400 text-sm">
        Verificando permisos...
      </div>
    );
  }

  const groups = Array.from(new Set(adminTables.map((t) => t.group)));
  const current = adminTables.find((t) => pathname === `/admin/${t.key}`);

  const logout = () => {
    localStorage.removeItem("auth_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#0a0f18] text-slate-200">
      {/* ── Barra lateral ── */}
      <aside className="w-64 shrink-0 bg-[#0d1421] border-r border-white/[0.06] flex flex-col sticky top-0 h-screen">
        <Link href="/admin" className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06]">
          <span className="size-8 rounded-lg bg-[#E1C380] text-[#0a0f18] text-xs font-bold flex items-center justify-center">CA</span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-slate-100">Crímenes Argentinos</span>
            <span className="text-[11px] text-slate-500">Administración</span>
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">
          <Link
            href="/admin"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
              pathname === "/admin" ? "bg-white/[0.06] text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
            }`}
          >
            <AdminIcon name="home" />
            Inicio
          </Link>

          {groups.map((group) => (
            <div key={group} className="flex flex-col gap-0.5">
              <span className="flex items-center gap-2 px-3 mb-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                <AdminIcon name={groupIcons[group] ?? "folder"} className="size-3.5" />
                {group}
              </span>
              {adminTables
                .filter((t) => t.group === group)
                .map((t) => {
                  const active = current?.key === t.key;
                  return (
                    <Link
                      key={t.key}
                      href={`/admin/${t.key}`}
                      className={`relative px-3 py-1.5 pl-8 rounded-md text-sm transition-colors ${
                        active ? "bg-[#E1C380]/10 text-[#E1C380] font-medium" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                      }`}
                    >
                      {active && <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-[#E1C380]" />}
                      {t.title}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] p-3 flex flex-col gap-1">
          <div className="flex items-center gap-3 px-2 py-2">
            <span className="size-8 rounded-full bg-white/[0.06] text-slate-300 text-xs font-semibold flex items-center justify-center uppercase">
              {identity.name.slice(0, 2) || "AD"}
            </span>
            <span className="min-w-0 flex flex-col leading-tight">
              <span className="text-sm text-slate-200 truncate">{identity.name || "Administrador"}</span>
              <span className="text-[11px] text-slate-500 truncate">{identity.email}</span>
            </span>
          </div>
          <Link href="/principal" className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]">
            <AdminIcon name="arrowLeft" />
            Ir al juego
          </Link>
          <button onClick={logout} className="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] text-left">
            <AdminIcon name="logout" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Contenido ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 shrink-0 border-b border-white/[0.06] bg-[#0a0f18]/80 backdrop-blur sticky top-0 z-20 flex items-center px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/admin" className="hover:text-slate-300">
              Panel
            </Link>
            {current && (
              <>
                <span>/</span>
                <span>{current.group}</span>
                <span>/</span>
                <span className="text-slate-200">{current.title}</span>
              </>
            )}
          </nav>
        </header>

        <main className="flex-1 px-8 py-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
