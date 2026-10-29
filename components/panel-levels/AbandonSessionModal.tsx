"use client";

import { createPortal } from "react-dom";
import { audioManager } from "@/lib/audioManager";

interface Props {
  level: number; // nivel que se quiere jugar
  replay: boolean; // es un nivel ya resuelto
  inProgressLevel: number; // nivel de la partida en curso que se abandonaría
  abandoning: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Confirmación antes de abandonar la partida en curso de otro nivel (cuenta como perdida)
export default function AbandonSessionModal({ level, replay, inProgressLevel, abandoning, onConfirm, onCancel }: Props) {
  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none"
      onClick={(e) => {
        // El portal sigue dentro del árbol de la tarjeta: sin esto el click la vuelve a abrir
        e.stopPropagation();
        if (!abandoning) onCancel();
      }}
    >
      <div
        className="relative w-full max-w-md border border-red-500/30 bg-[rgba(18,22,32,0.95)] shadow-[0_25px_60px_rgba(0,0,0,0.8)] rounded-2xl p-6 sm:p-7 flex flex-col items-center text-center text-[#FFF3C7] gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-3xl shadow-inner">
          ⚠️
        </div>

        <h3 className="text-lg sm:text-xl font-bold font-mono text-[#FFF3C7]">
          ¿{replay ? "Rejugar" : "Jugar"} el nivel {level}?
        </h3>

        <p className="text-xs text-[#FFF3C7]/80 font-mono bg-[rgba(10,15,25,0.6)] p-3.5 rounded-xl border border-[rgba(255,243,199,0.12)] leading-relaxed">
          Tenés una partida en curso del nivel {inProgressLevel}. Si seguís, se abandona y cuenta como perdida.
        </p>

        <div className="flex flex-row gap-3 w-full pt-1">
          <button
            type="button"
            onClick={() => {
              audioManager.play("typewriter");
              onConfirm();
            }}
            disabled={abandoning}
            className="flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white border border-red-400/60 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {abandoning ? "ABANDONANDO..." : "SÍ, SEGUIR"}
          </button>

          <button
            type="button"
            onClick={() => {
              audioManager.play("click");
              onCancel();
            }}
            disabled={abandoning}
            className="flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-[rgba(20,30,42,0.6)] hover:bg-[rgba(255,243,199,0.1)] text-[#FFF3C7]/80 hover:text-[#FFF3C7] border border-[rgba(255,243,199,0.2)] transition-all duration-200 cursor-pointer"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
