"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { adminTables } from "@/lib/adminTables";
import { useAdminGuard } from "@/hooks/useAdminGuard";

// Marco del panel: menú con las tablas agrupadas y control de acceso por rol
export default function AdminShell({ children }: { children: ReactNode }) {
  const allowed = useAdminGuard();
  const pathname = usePathname();
  const router = useRouter();

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080e18] text-[#FFF3C7] text-sm">
        Verificando permisos...
      </div>
    );
  }

  const groups = Array.from(new Set(adminTables.map((t) => t.group)));

  const logout = () => {
    localStorage.removeItem("auth_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#080e18] text-[#FFF3C7]">
      <aside className="w-64 shrink-0 border-r border-[rgba(255,243,199,0.12)] p-5 flex flex-col gap-6">
        <Link href="/admin" className="text-[#E1C380] text-sm font-semibold tracking-widest">
          PANEL ADMIN
        </Link>

        <nav className="flex-1 flex flex-col gap-5 overflow-y-auto">
          {groups.map((group) => (
            <div key={group} className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-[#FFF3C7]/50 mb-1">{group}</span>
              {adminTables
                .filter((t) => t.group === group)
                .map((t) => {
                  const active = pathname === `/admin/${t.key}`;
                  return (
                    <Link
                      key={t.key}
                      href={`/admin/${t.key}`}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        active
                          ? "bg-[rgba(225,195,128,0.15)] text-[#E1C380]"
                          : "text-[#FFF3C7]/80 hover:bg-[rgba(255,243,199,0.06)]"
                      }`}
                    >
                      {t.title}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-xs">
          <Link href="/principal" className="text-[#FFF3C7]/70 hover:text-[#E1C380]">
            ← Volver al juego
          </Link>
          <button onClick={logout} className="text-left text-[#FFF3C7]/70 hover:text-[#E1C380]">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
    </div>
  );
}
