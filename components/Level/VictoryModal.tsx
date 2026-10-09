"use client";

import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import GameButton from "../buttons/GameButton";
import { useGameSessionStore } from "@/stores/useGameSessionStore";

interface VictoryModalProps {
  levelId: number;
}

export default function VictoryModal({ levelId }: VictoryModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const isVictory = useGameSessionStore((state) => state.isVictory);
  const warrantSuspectId = useGameSessionStore((state) => state.session?.warrantSuspectId ?? null);
  const suspects = useGameSessionStore((state) => state.suspects);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isVictory || typeof window === "undefined") {
    return null;
  }

  // Si ganó, la orden era para el culpable
  const capturedSuspect = suspects.find((s) => s.id === warrantSuspectId) ?? null;

  const handleBackToPrincipal = () => {
    useGameSessionStore.getState().resetSession();
    try {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.endsWith("_briefing_seen")) {
          sessionStorage.removeItem(key);
        }
      });
    } catch {
      // Ignorar errores en SSR
    }
    router.push("/principal");
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl backdrop-blur-xs border border-emerald-500/40 bg-[rgba(10,25,20,0.92)] shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-[#FFF3C7] flex flex-col items-center text-center gap-4">
        {/* Badge icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
          🏆
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30">
            CASO RESUELTO — NIVEL #{levelId.toString().padStart(2, "0")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-wider text-emerald-300 mt-2">
            ¡ARRESTO EXITOSO!
          </h2>
        </div>

        {/* Captured suspect preview */}
        {capturedSuspect && (
          <div className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-[rgba(5,15,12,0.7)] border border-emerald-500/30 text-left">
            <div className="relative size-14 rounded-xl overflow-hidden bg-black/50 border border-emerald-500/40 shrink-0">
              {capturedSuspect.image ? (
                <Image
                  src={capturedSuspect.image}
                  alt={capturedSuspect.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center size-full text-xl text-emerald-400">
                  👤
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                Detenido en custodia
              </span>
              <span className="text-sm font-bold font-mono text-[#FFF3C7]">
                {capturedSuspect.name}
              </span>
              <span className="text-[10px] font-mono text-emerald-300/80">
                Orden judicial ejecutada conforme a la ley
              </span>
            </div>
          </div>
        )}

        <p className="text-xs sm:text-sm text-[#FFF3C7]/90 font-mono leading-relaxed bg-black/40 p-4 rounded-xl border border-[rgba(255,243,199,0.1)]">
          Has localizado al sospechoso correcto en su escondite y ejecutado la orden de captura a tiempo. ¡Excelente trabajo de investigación!
        </p>

        <div className="flex flex-col gap-2.5 w-full pt-2">
          <GameButton
            icon="🏛️"
            label="VOLVER AL MENÚ PRINCIPAL"
            variant="primary"
            onClick={handleBackToPrincipal}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
