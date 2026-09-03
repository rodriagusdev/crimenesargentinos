"use client";

import Leaderboard from "@/components/panel-leaderboard/Leaderboard";
import Levels from "@/components/panel-levels/Levels";
import PlayerPanel from "@/components/panel-player/PlayerPanel";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-[#E1C380] text-2xl">Cargando...</div>
      </div>
    );
  }

  /*
  if (!isAuthenticated) {
    return null; // El hook useAuth redirige automáticamente a /login
  }
  */
 
  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-6 xl:p-8">
      <div className="mx-auto grid gap-6 grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
        <aside>
          <PlayerPanel />
        </aside>

        <main>
          <Levels />
        </main>

        <aside>
          <Leaderboard />
        </aside>
      </div>
    </div>
  );
}
