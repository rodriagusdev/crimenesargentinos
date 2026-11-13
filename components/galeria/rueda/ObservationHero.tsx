"use client";

import styles from "./rueda.module.css";
import { useWallClock } from "./useWallClock";

// Lado oscuro del vidrio: techo con tubos fluorescentes, cartel de la sala, reloj y las nucas de quienes miran
export default function ObservationHero() {
  const time = useWallClock();

  return (
    <div className="relative h-44 sm:h-52 overflow-hidden rounded-t-xl border-4 border-b-0 border-[#1d2026] bg-[linear-gradient(180deg,#15181d_0%,#0a0b0e_70%,#050506_100%)]">
      {/* Tubos fluorescentes */}
      <div className="absolute top-3 inset-x-6 sm:inset-x-16 flex justify-between gap-6" aria-hidden>
        <span className={`h-1.5 flex-1 rounded-full bg-[#eef6ff] shadow-[0_0_14px_4px_rgba(205,228,255,0.45)] ${styles.tube}`} />
        <span className="h-1.5 flex-1 rounded-full bg-[#eef6ff] shadow-[0_0_14px_4px_rgba(205,228,255,0.45)]" />
      </div>
      {/* Luz que cae del techo */}
      <div
        className="absolute inset-x-0 top-4 h-28 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(205,228,255,0.12),transparent_70%)] pointer-events-none"
        aria-hidden
      />

      {/* Cartel y reloj */}
      <div className="absolute top-8 inset-x-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.25em] text-[#E1C380]">SALA 2 · LADO OBSERVACIÓN</p>
          <h1 className="mt-2 text-lg sm:text-3xl text-[#FFF3C7] [text-shadow:0_0_18px_rgba(205,228,255,0.25)]">RUEDA DE RECONOCIMIENTO</h1>
          <p className="mt-1 font-mono text-xs text-[#FFF3C7]/55">Vidrio espejado: del otro lado no te ven.</p>
        </div>
        <div className="shrink-0 rounded border border-[#2a2f38] bg-black/60 px-2 py-1.5 text-center">
          <p className="font-mono text-sm sm:text-base text-[#ff5a4d] [text-shadow:0_0_8px_rgba(255,90,77,0.7)] tabular-nums" suppressHydrationWarning>
            {time}
          </p>
          <p className="text-[8px] text-white/50">HORA</p>
        </div>
      </div>

      {/* Nucas de los que miran a través del vidrio */}
      <div className="absolute bottom-0 inset-x-0 flex justify-center gap-10 sm:gap-24" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className={`flex flex-col items-center ${i === 1 ? "hidden sm:flex" : ""}`}>
            <span className="size-9 sm:size-11 rounded-full bg-[#020203] shadow-[0_-2px_6px_rgba(205,228,255,0.08)]" />
            <span className="-mt-1 h-6 sm:h-8 w-24 sm:w-28 rounded-t-[50%] bg-[#020203]" />
          </span>
        ))}
      </div>
    </div>
  );
}
