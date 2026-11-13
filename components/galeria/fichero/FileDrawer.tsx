"use client";

import RecordCard from "./RecordCard";
import { audioManager } from "@/lib/audioManager";
import type { SuspectRelease } from "@/lib/suspectReleases";

type Props = {
  release: SuspectRelease;
  firstNumber: number;
  isNew: boolean;
  open: boolean;
  onToggle: () => void;
};

// Cajón del fichero: el frente con la etiqueta del release y, abierto, las fichas adentro
export default function FileDrawer({ release, firstNumber, isNew, open, onToggle }: Props) {
  return (
    <div className="rounded-lg bg-[#56606e] p-2 sm:p-3 shadow-[inset_0_2px_0_rgba(255,255,255,0.15),0_8px_20px_rgba(0,0,0,0.5)]">
      <button
        type="button"
        onClick={() => {
          audioManager.play("slide");
          onToggle();
        }}
        aria-expanded={open}
        className="relative w-full flex flex-col items-center gap-3 rounded-md bg-gradient-to-b from-[#7d8794] to-[#5f6977] border border-[#3a424d] px-4 py-5 cursor-pointer hover:from-[#8994a1]"
      >
        {/* Portaetiquetas */}
        <span className="min-w-48 rounded-sm border-2 border-[#c9ccd1] bg-[#f6f0de] px-4 py-2 text-[#2b2117] shadow-inner">
          <span className="block text-xs">{release.name.toUpperCase()}</span>
          <span className="block font-mono text-sm font-bold">
            Legajos {firstNumber}–{firstNumber + release.suspects.length - 1}
          </span>
        </span>
        {/* Manija */}
        <span className="h-3 w-28 rounded-full bg-gradient-to-b from-[#e3e6ea] to-[#8f97a3] border border-[#4b525c] shadow" aria-hidden />
        <span className="font-mono text-xs text-[#e6e9ee]">{open ? "▲ CERRAR CAJÓN" : "▼ ABRIR CAJÓN"}</span>

        {isNew && (
          <span className="absolute top-3 -left-2 sm:-left-3 px-3 py-1 bg-[#c81e1e] text-white text-[10px] shadow-md -rotate-6">
            INGRESO RECIENTE
          </span>
        )}
      </button>

      {open && (
        <div className="galeria-in mt-3 rounded-md bg-[#2b313a] p-3 sm:p-5 shadow-[inset_0_6px_16px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pt-2.5">
            {release.suspects.map((s, i) => (
              <RecordCard key={s.name} suspect={s} number={firstNumber + i} isNew={isNew} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
