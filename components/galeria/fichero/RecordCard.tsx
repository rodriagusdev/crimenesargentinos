"use client";

import SuspectPhoto from "../SuspectPhoto";
import type { GallerySuspect } from "@/lib/suspectReleases";
import styles from "./fichero.module.css";

type Props = {
  suspect: GallerySuspect;
  number: number;
  isNew: boolean;
  order: number;
  /** Su legajo está en el centro: en el cajón queda solo la cinta rota */
  away: boolean;
  onHoverStart: (el: HTMLElement) => void;
  onHoverEnd: () => void;
  onTap: (el: HTMLElement) => void;
};

// Ficha de prontuario pegada con cinta: número de legajo, foto y nombre. Al pasar el mouse se despega desde la
// cinta y el legajo vuela al centro; en pantallas táctiles, con un toque. Las nuevas reciben el sello "NUEVO".
export default function RecordCard({ suspect, number, isNew, order, away, onHoverStart, onHoverEnd, onTap }: Props) {
  return (
    <div
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && onHoverStart(e.currentTarget)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onHoverEnd()}
    >
      <button
        type="button"
        onClick={(e) => {
          // Con mouse ya se abre al pasar; el toque es para pantallas táctiles y teclado
          if (e.detail === 0 || !window.matchMedia("(hover: hover)").matches) onTap(e.currentTarget.parentElement ?? e.currentTarget);
        }}
        aria-label={`Ver el legajo de ${suspect.name}`}
        className={`relative block w-full text-left cursor-zoom-in bg-[#f6f0de] text-[#2b2117] rounded-sm border border-[#cdbf9f] p-2 pt-3 shadow-[0_6px_14px_rgba(0,0,0,0.35)] ${styles.card} ${
          away ? styles.away : ""
        }`}
      >
        {/* Renglones de máquina de escribir de fondo */}
        <span
          className="absolute inset-0 pointer-events-none opacity-40 bg-[repeating-linear-gradient(180deg,transparent_0_13px,#d9cdb2_13px_14px)]"
          aria-hidden
        />
        <span className="relative flex items-center justify-between font-mono text-[10px] font-bold text-[#7a6a50] border-b border-[#d9cdb2] pb-1 mb-2">
          <span>LEGAJO</span>
          <span>N° {String(number).padStart(4, "0")}</span>
        </span>
        <span className="relative block aspect-square overflow-hidden border border-[#b9ab8c] bg-[#3a4250]">
          <SuspectPhoto suspect={suspect} index={number} className="grayscale-[0.35] contrast-110" />
          {isNew && (
            <span
              className={`absolute bottom-2 right-1 px-2 py-0.5 border-2 border-[#c81e1e] text-[#c81e1e] bg-[#f6f0de]/85 text-[10px] ${styles.stamp}`}
              style={{ animationDelay: `${350 + order * 220}ms` }}
            >
              NUEVO
            </span>
          )}
        </span>
        <span className="relative mt-2 block font-mono text-xs sm:text-sm font-bold uppercase leading-tight text-center">{suspect.name}</span>
      </button>

      {/* Cinta que pega la ficha al cajón: cuando el legajo se arranca, queda rota */}
      <span
        className={`pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 -rotate-2 h-5 w-16 ${styles.tape} ${away ? styles.tapeTorn : ""}`}
        aria-hidden
      />
    </div>
  );
}
