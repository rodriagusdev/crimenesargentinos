"use client";

import Leaderboard from "@/components/panel-leaderboard/Leaderboard";
import Levels from "@/components/panel-levels/Levels";
import PlayerPanel from "@/components/panel-player/PlayerPanel";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  // Cuando haya un contexto, definira si el usuario está logueado o no, por ahora lo simulamos con localStorage
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Verificamos si ya se guardó que el usuario entró (testeo)
    const hasAccessed = localStorage.getItem("hasAccessedGame");

    if (!hasAccessed) {
      // Primera vez → lo mandamos al login
      localStorage.setItem("hasAccessedGame", "true"); // Guardamos que ya entró
      router.push("/login"); // Redirigir al login
    }
  }, [router]);

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
