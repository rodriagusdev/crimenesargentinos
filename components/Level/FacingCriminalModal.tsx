"use client";

import { createPortal } from "react-dom";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import LevelSuspects from "./LevelSuspects";

// Llegó al escondite sin orden de arresto pero con las pistas: el backend bloquea viajar y preguntar
// hasta que emita la orden, que se resuelve en el acto (victoria o derrota)
export default function FacingCriminalModal() {
  const facingCriminal = useGameSessionStore((state) => Boolean(state.session?.facingCriminal));
  const suspects = useGameSessionStore((state) => state.suspects);

  // En el servidor no hay partida cargada: facingCriminal solo puede ser true en el cliente
  if (!facingCriminal || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl backdrop-blur-xs border border-red-500/40 bg-[rgba(20,10,15,0.9)] shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-[#FFF3C7] flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-3xl shadow-inner animate-pulse">
          🚨
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-red-400 font-semibold px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/30">
            Escondite localizado
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-wider text-red-300 mt-2">
            ¡ESTÁS FRENTE AL CRIMINAL!
          </h2>
        </div>

        <LevelSuspects
          suspects={suspects}
          detail="El criminal está acá y no podés moverte sin una orden. Elegí a quién emitirle la orden de arresto: si es el culpable, lo detenés; si no, se escapa."
        />
      </div>
    </div>,
    document.body,
  );
}
