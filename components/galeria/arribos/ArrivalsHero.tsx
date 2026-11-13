"use client";

import { useSyncExternalStore } from "react";
import FlapTiles from "./FlapTiles";

// Reloj en vivo sin problemas de hidratación: en el servidor muestra "--:--"
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 10_000);
  return () => clearInterval(id);
};
const readTime = () => new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });

// Ventanal de la terminal: cielo al atardecer, avión aterrizando, pista con luces y el reloj del aeropuerto
export default function ArrivalsHero() {
  const time = useSyncExternalStore(subscribe, readTime, () => "--:--");

  return (
    <div className="relative h-40 sm:h-52 overflow-hidden rounded-t-xl border-4 border-b-0 border-[#2a2f38] bg-[linear-gradient(180deg,#1b2a4a_0%,#6b3a5e_55%,#e8875a_100%)]">
      {/* Montantes del ventanal */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="border-r-4 border-[#2a2f38]/80 last:border-r-0" />
        ))}
      </div>

      {/* Avión aterrizando */}
      <span className="arribos-plane absolute top-8 left-0 text-3xl sm:text-5xl [filter:drop-shadow(0_4px_6px_rgba(0,0,0,0.5))]" aria-hidden>
        ✈️
      </span>

      {/* Pista con luces que corren */}
      <div className="absolute bottom-0 inset-x-0 h-10 sm:h-12 bg-[#23262b]" aria-hidden>
        <div className="arribos-runway absolute top-1/2 -translate-y-1/2 inset-x-0 h-1.5" />
      </div>

      {/* Cartel de la terminal y reloj */}
      <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-3">
        <div className="rounded bg-black/55 px-3 py-2 backdrop-blur-sm">
          <p className="text-[10px] tracking-[0.25em] text-[#ffd447]">TERMINAL A</p>
          <h1 className="mt-1 text-lg sm:text-3xl text-white">ARRIBOS</h1>
          <p className="font-mono text-xs text-white/70">Arrivals · Internacionales</p>
        </div>
        <div className="rounded bg-black/55 px-2 py-2 backdrop-blur-sm text-center">
          <FlapTiles text={time} />
          <p className="mt-1 text-[10px] text-white/70">HORA LOCAL</p>
        </div>
      </div>
    </div>
  );
}
