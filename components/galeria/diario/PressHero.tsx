"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "./diario.module.css";

const START = 48_213;
const withDots = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// Taller de la rotativa: rodillos girando, el papel que corre y el contador de ejemplares de la tirada.
// Con edición especial (`rush`), la máquina acelera y cuenta más rápido.
export default function PressHero({ rush }: { rush: boolean }) {
  const [printed, setPrinted] = useState(START);

  useEffect(() => {
    const id = setInterval(() => setPrinted((n) => n + 1 + Math.floor(Math.random() * (rush ? 24 : 6))), rush ? 300 : 900);
    return () => clearInterval(id);
  }, [rush]);

  const speed = { "--press-speed": rush ? "0.18s" : "0.6s" } as CSSProperties;

  return (
    <div className="relative h-32 sm:h-36 overflow-hidden rounded-t-lg border-4 border-b-0 border-[#14110e] bg-[#1c1916] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,214,140,0.18),transparent_65%)]" style={speed}>
      {/* Papel que corre por la máquina */}
      <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-7 ${styles.web}`} aria-hidden />
      {/* Rodillos, de a pares arriba y abajo del papel */}
      <div className="absolute inset-x-0 inset-y-3 flex justify-around items-center pointer-events-none" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className="flex flex-col gap-8 sm:gap-10">
            <span className={`block h-7 w-14 sm:w-20 rounded-full border-2 border-[#0e0c0a] shadow-[0_4px_8px_rgba(0,0,0,0.6)] ${styles.roller}`} />
            <span className={`block h-7 w-14 sm:w-20 rounded-full border-2 border-[#0e0c0a] shadow-[0_4px_8px_rgba(0,0,0,0.6)] ${styles.roller}`} />
          </span>
        ))}
      </div>

      {/* Carteles del taller */}
      <div className="absolute top-2 left-2 rounded bg-black/60 px-2 py-1">
        <p className="text-[8px] sm:text-[10px] tracking-[0.2em] text-[#E1C380]">TALLERES DE EL VESPERTINO</p>
        <p className="font-mono text-[10px] text-white/70">Rotativa N° 2 {rush ? "· ¡A TODA MÁQUINA!" : "· en marcha"}</p>
      </div>
      <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-right">
        <p className="font-mono text-sm sm:text-base font-bold tabular-nums text-[#ffd447]">{withDots(printed)}</p>
        <p className="text-[8px] text-white/60">EJEMPLARES IMPRESOS</p>
      </div>
    </div>
  );
}
