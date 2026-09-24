"use client";

import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GameButton from "../buttons/GameButton";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { useFlagStore } from "@/stores/useFlagStore";

interface GameOverModalProps {
  levelId: number;
}

export default function GameOverModal({ levelId }: GameOverModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const isGameOver = useGameSessionStore((state) => state.isGameOver);
  const gameOverReason = useGameSessionStore((state) => state.gameOverReason);
  const restartLevel = useGameSessionStore((state) => state.restartLevel);
  const clearFlags = useFlagStore((state) => state.clearFlags);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isGameOver || typeof window === "undefined") {
    return null;
  }

  const handleRestart = async () => {
    clearFlags();
    try {
      await restartLevel(levelId);
    } catch (err) {
      console.error("Error al reiniciar el nivel:", err);
    }
    const initialRoute = useGameSessionStore.getState().initialRoute ?? `/level/${levelId}`;
    router.push(initialRoute);
  };

  const handleBackToPrincipal = () => {
    clearFlags();
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

  const title =
    gameOverReason === "time"
      ? "¡TIEMPO AGOTADO!"
      : "¡SIN PUNTOS DE INVESTIGACIÓN!";

  const description =
    gameOverReason === "time"
      ? "El plazo límite de la investigación ha concluido y el sospechoso logró escapar del país. El caso se ha cerrado."
      : "Has agotado todos tus Puntos de Investigación (PI) sin obtener la evidencia suficiente para proceder. El sospechoso ha burlado la persecución.";

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl backdrop-blur-xs border border-red-500/30 bg-[rgba(20,10,15,0.85)] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-[#FFF3C7] flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-3xl shadow-inner animate-bounce">
          ⚠️
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-red-400 font-semibold">
            CASO NO RESUELTO
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-wider text-red-400 mt-1">
            {title}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-[#FFF3C7]/85 font-mono leading-relaxed bg-black/40 p-4 rounded-xl border border-[rgba(255,243,199,0.1)]">
          {description}
        </p>

        <div className="flex flex-col gap-3 w-full pt-2">
          <GameButton
            icon="🔄"
            label="REINTENTAR INVESTIGACIÓN"
            variant="primary"
            onClick={handleRestart}
          />

          <GameButton
            icon="🏛️"
            label="VOLVER AL MENÚ PRINCIPAL"
            variant="secondary"
            onClick={handleBackToPrincipal}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
