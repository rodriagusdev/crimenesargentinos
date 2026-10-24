"use client";

import { useState } from "react";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import CaseDossierModal from "./CaseDossierModal";

// Llegó al escondite sin orden de arresto pero con las pistas: el backend bloquea viajar y preguntar
// hasta que emita la orden. Usamos el modal unificado de expediente (pistas + sospechosos)
// para que pueda revisar toda la evidencia antes de emitir la orden de arresto.
export default function FacingCriminalModal() {
  const facingCriminal = useGameSessionStore((state) => Boolean(state.session?.facingCriminal));
  const suspects = useGameSessionStore((state) => state.suspects);
  const briefing = useGameSessionStore((state) => state.briefing) ?? undefined;
  const initialClues = useGameSessionStore((state) => state.initialClues);
  const levelId = useGameSessionStore((state) => state.levelId ?? 1);
  const [isOpen, setIsOpen] = useState(true);

  // En el servidor no hay partida cargada: facingCriminal solo puede ser true en el cliente
  if (!facingCriminal || typeof document === "undefined") {
    return null;
  }

  return (
    <>
      <CaseDossierModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialTab="suspects"
        levelId={levelId}
        briefing={briefing}
        initialClues={initialClues}
        suspects={suspects}
        isFacingCriminal={true}
      />

      {/* Si el jugador cierra el modal para revisar la pantalla, botón flotante de emergencia para reabrirlo */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-[99999] animate-bounce">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase border-2 border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.7)] flex items-center gap-2.5 cursor-pointer hover:scale-105 transition-transform"
          >
            <span className="text-xl">🚨</span>
            <span>EMITIR ORDEN DE ARRESTO</span>
          </button>
        </div>
      )}
    </>
  );
}
