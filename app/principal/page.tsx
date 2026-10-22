"use client";

import Leaderboard from "@/components/panel-leaderboard/Leaderboard";
import Levels from "@/components/panel-levels/Levels";
import PlayerPanel from "@/components/panel-player/PlayerPanel";
import { useAuth } from "@/hooks/useAuth";

export default function Principal() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-[#E1C380] text-2xl">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El hook useAuth redirige automáticamente a /login
  }

  return (
    <div className="min-h-screen bg-[#080e18] p-4 md:p-6 xl:p-8">
      <div className="mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
        {/* PANEL IZQUIERDO / COLUMNA 1 TABLET */}
        <aside className="order-1 md:order-1 xl:order-1 md:col-span-1 xl:col-span-1">
          <PlayerPanel />
        </aside>

        {/* PANEL DERECHO / COLUMNA 2 TABLET */}
        <aside className="order-3 md:order-2 xl:order-3 md:col-span-1 xl:col-span-1">
          <Leaderboard />
        </aside>

        {/* NIVELES / ANCHO COMPLETO EN TABLET */}
        <main className="order-2 md:order-3 xl:order-2 md:col-span-2 xl:col-span-1">
          <Levels />
        </main>
      </div>
    </div>
  );
}

