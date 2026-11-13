"use client";

import { useSyncExternalStore } from "react";
import MarqueeBulbs from "./MarqueeBulbs";
import styles from "./cartelera.module.css";

// Cuenta regresiva a la función de las 21:00, sin problemas de hidratación (en el servidor no hay hora)
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 15_000);
  return () => clearInterval(id);
};
const readCountdown = () => {
  const now = new Date();
  const show = new Date(now);
  show.setHours(21, 0, 0, 0);
  if (show.getTime() <= now.getTime()) show.setDate(show.getDate() + 1);
  const mins = Math.round((show.getTime() - now.getTime()) / 60_000);
  if (mins <= 0) return "¡ARRIBA EL TELÓN!";
  return `FALTAN ${Math.floor(mins / 60)} H ${String(mins % 60).padStart(2, "0")} MIN`;
};

// Fachada del teatro: reflectores que se cruzan, bambalina de terciopelo y la marquesina con bombitas que corren
export default function TheaterFacade({ premiere }: { premiere: boolean }) {
  const countdown = useSyncExternalStore(subscribe, readCountdown, () => "FUNCIÓN DE HOY");

  return (
    <header className="relative overflow-hidden rounded-t-xl pt-10 pb-6 px-3 bg-[linear-gradient(180deg,#05040a,#1a0d0d)]">
      {/* Reflectores */}
      <span className={`${styles.beamLeft} absolute bottom-0 left-[8%] h-[150%] w-24 pointer-events-none bg-[linear-gradient(0deg,rgba(255,240,200,0.35),transparent_90%)] [clip-path:polygon(45%_100%,55%_100%,100%_0,0_0)]`} aria-hidden />
      <span className={`${styles.beamRight} absolute bottom-0 right-[8%] h-[150%] w-24 pointer-events-none bg-[linear-gradient(0deg,rgba(255,240,200,0.35),transparent_90%)] [clip-path:polygon(45%_100%,55%_100%,100%_0,0_0)]`} aria-hidden />

      {/* Bambalina de terciopelo con flecos dorados */}
      <div className="absolute inset-x-0 top-0 h-7 bg-[repeating-linear-gradient(90deg,#6e0f16_0_12px,#a3192a_24px,#7c1119_36px)] shadow-[0_6px_14px_rgba(0,0,0,0.6)]" aria-hidden>
        <span className="absolute inset-x-0 bottom-0 h-1.5 bg-[repeating-linear-gradient(90deg,#e8c25a_0_4px,transparent_4px_7px)]" />
      </div>

      {/* Marquesina */}
      <div className="relative mx-auto max-w-xl rounded-lg border-4 border-[#e8c25a] bg-[#1d0c0a] shadow-[0_0_40px_rgba(232,194,90,0.25)]">
        <MarqueeBulbs on count={14} />
        <div className="flex">
          <MarqueeBulbs on count={3} vertical />
          <div className="flex-1 py-3 text-center">
            <p className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#e8c25a]">TEATRO DE LA CENTRAL</p>
            <h1 className="mt-2 text-lg sm:text-3xl leading-relaxed text-[#fff1b8] [text-shadow:0_0_12px_rgba(255,214,102,0.8)]">EL ELENCO</h1>
            <p className="mt-1 font-mono text-xs text-[#FFF3C7]/70">
              {premiere ? "¡Noche de estreno!" : "Hoy 21:00"} · <span className="text-[#ffb36b]">{countdown}</span>
            </p>
          </div>
          <MarqueeBulbs on count={3} vertical />
        </div>
        <MarqueeBulbs on count={14} />
      </div>
      <p className="relative mt-3 text-center text-[9px] tracking-[0.3em] text-[#FFF3C7]/50">AV. CORRIENTES · BOLETERÍA ABIERTA</p>
    </header>
  );
}
