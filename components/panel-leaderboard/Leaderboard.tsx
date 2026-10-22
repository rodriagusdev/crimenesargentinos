"use client";

import { useEffect, useState } from "react";
import { getLeaderboard } from "@/services/gameSessionService";
import { ILeaderboardEntry } from "@/models/IGameSession";

export default function Leaderboard() {
  const [users, setUsers] = useState<ILeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getLeaderboard(10)
      .then((ranking) => {
        if (!cancelled) {
          setUsers(ranking);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error al obtener el ranking:", error);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden border-2 border-[#1c2c3e] bg-[#0c1421] shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-all duration-300 hover:border-amber-400/40">
      {/* 1. Header con estilo táctico matching LevelCard */}
      <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-[#1c2c3e]/80 bg-[#0e1724]">

        <span className="text-amber-400 text-xs">🏆</span>

        <div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-950/50 border border-amber-500/40 text-amber-300">
            TOP 10
          </span>
        </div>
      </div>

      {/* 2. Lista de jugadores */}
      <div className="divide-y divide-[#1c2c3e]/60 bg-[#0c1421]">
        {loading ? (
          <div className="p-8 text-center font-mono text-xs text-slate-400 uppercase tracking-wider animate-pulse">
            Cargando ranking...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center font-mono text-xs text-slate-400 uppercase tracking-wider">
            Sin agentes clasificados
          </div>
        ) : (
          users.map((user) => {
            const isFirst = user.position === 1;
            const isSecond = user.position === 2;
            const isThird = user.position === 3;

            return (
              <div
                key={`${user.position}-${user.username}`}
                className={`
                  flex items-center justify-between px-3.5 py-2.5 sm:px-4
                  hover:bg-[#121c2d] transition-colors duration-150 group/row
                  ${isFirst ? "bg-amber-500/[0.04]" : ""}
                `}
              >
                {/* Posición y Nombre */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`
                      w-7 h-7 flex items-center justify-center rounded-lg border
                      font-mono font-black text-xs shrink-0 select-none
                      ${isFirst
                        ? "border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                        : isSecond
                          ? "border-slate-300/70 bg-slate-300/15 text-slate-100"
                          : isThird
                            ? "border-amber-700/70 bg-amber-700/20 text-amber-400"
                            : "border-[#1c2c3e] bg-[#080d15]/80 text-slate-400"
                      }
                    `}
                  >
                    {user.position}
                  </div>

                  <span
                    className={`
                      truncate font-mono text-xs tracking-wide transition-colors
                      ${isFirst
                        ? "text-amber-200 font-bold group-hover/row:text-amber-300"
                        : isSecond
                          ? "text-slate-100 font-semibold group-hover/row:text-amber-300"
                          : isThird
                            ? "text-slate-200 font-medium group-hover/row:text-amber-300"
                            : "text-slate-300 group-hover/row:text-slate-100"
                      }
                    `}
                    title={user.username}
                  >
                    {user.username}
                  </span>
                </div>

                {/* Puntaje */}
                <div className="flex items-baseline gap-1 shrink-0 ml-2">
                  <span className="font-mono font-black text-xs sm:text-sm tracking-wider text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.2)]">
                    {user.points.toLocaleString()}
                  </span>
                  <span className="font-mono text-[9px] font-bold text-slate-400">
                    PTS
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

