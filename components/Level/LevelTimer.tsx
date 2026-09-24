"use client";

import { useEffect, useState } from "react";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import GameOverModal from "./GameOverModal";

interface LevelTimerProps {
  levelId: number;
}

export default function LevelTimer({ levelId }: LevelTimerProps) {
  const [mounted, setMounted] = useState(false);

  const initSession = useGameSessionStore((state) => state.initSession);
  const currentTime = useGameSessionStore((state) => state.currentTime);
  const currentPI = useGameSessionStore((state) => state.currentPI);

  useEffect(() => {
    setMounted(true);
    initSession(levelId).catch((err) => console.error("Error al iniciar la partida:", err));
  }, [levelId, initSession]);

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none select-none">
        <div className="px-5 py-2 rounded-2xl backdrop-blur-md bg-[rgba(20,30,42,0.85)] border border-[rgba(255,243,199,0.18)] shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center gap-4 sm:gap-6">
          {/* Tiempo Restante */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#E1C380]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-3.5 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#E1C380]/80 font-semibold">
                Tiempo
              </span>
              <span className="text-xs sm:text-sm font-bold font-mono tracking-wider text-[#FFF3C7]">
                {mounted ? `${currentTime} HS` : "-- HS"}
              </span>
            </div>
          </div>

          {/* Divisor vertical */}
          <div className="w-px h-6 bg-[rgba(255,243,199,0.15)]" />

          {/* Puntos de Investigación (PI) */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[9px] uppercase font-mono tracking-widest text-cyan-400/80 font-semibold">
                PI
              </span>
              <span className="text-xs sm:text-sm font-bold font-mono tracking-wider text-[#FFF3C7]">
                {mounted ? `${currentPI} PTS` : "-- PTS"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <GameOverModal levelId={levelId} />
    </>
  );
}

