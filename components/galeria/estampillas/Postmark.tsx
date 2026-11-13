"use client";

import { useSyncExternalStore } from "react";
import styles from "./estampillas.module.css";

// Fecha de hoy sin problemas de hidratación: en el servidor muestra guiones
const subscribe = () => () => {};
const readDate = () => new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

type Props = { series: number; size?: "md" | "lg" };

// Matasellos de "primer día de emisión": cae de golpe, salpica tinta y deja las líneas onduladas de cancelación
export default function Postmark({ series, size = "lg" }: Props) {
  const today = useSyncExternalStore(subscribe, readDate, () => "--/--/----");
  const ring = size === "lg" ? "size-32 sm:size-40" : "size-24 sm:size-28";

  return (
    <div className="pointer-events-none flex items-center text-[#1d3f8a]" aria-label={`Matasellos: primer día de emisión, serie ${series}, ${today}`}>
      {/* Líneas onduladas de cancelación */}
      <svg viewBox="0 0 120 60" className={`${styles.postmark} w-16 sm:w-24 -mr-3 opacity-70`} aria-hidden>
        {[12, 24, 36, 48].map((y) => (
          <path key={y} d={`M0 ${y} q10 -7 20 0 t20 0 t20 0 t20 0 t20 0 t20 0`} fill="none" stroke="currentColor" strokeWidth="3" />
        ))}
      </svg>
      <div className={`relative ${ring}`}>
        <span className={`${styles.inkSplash} absolute inset-0 rounded-full bg-[#1d3f8a]/30 blur-md`} aria-hidden />
        <div
          className={`${styles.postmark} absolute inset-0 rounded-full border-4 border-current/70 bg-[#1d3f8a]/5 flex flex-col items-center justify-center text-center [mask-image:radial-gradient(circle,#000_60%,rgba(0,0,0,0.75))]`}
          aria-hidden
        >
          <span className="absolute inset-2.5 rounded-full border-2 border-dashed border-current/50" />
          <span className="text-[8px] sm:text-[10px] leading-relaxed px-5 opacity-85">PRIMER DÍA DE EMISIÓN</span>
          <span className="my-0.5 font-mono text-xs sm:text-sm font-bold opacity-85">
            {today}
          </span>
          <span className="text-[8px] sm:text-[10px] opacity-75">SERIE {series}</span>
        </div>
      </div>
    </div>
  );
}
