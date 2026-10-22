"use client";

import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import CronicaDefeatNewspaper from "./CronicaDefeatNewspaper";

interface GameOverModalProps {
  levelId: number;
}

export default function GameOverModal({ levelId }: GameOverModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const isGameOver = useGameSessionStore((state) => state.isGameOver);
  const gameOverReason = useGameSessionStore((state) => state.gameOverReason);
  const restartLevel = useGameSessionStore((state) => state.restartLevel);
  const session = useGameSessionStore((state) => state.session);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isGameOver || typeof window === "undefined") {
    return null;
  }

  const initialTime = session?.initialTime ?? 35;
  const currentTime = session?.currentTime ?? 0;
  const hoursTaken = Math.max(1, initialTime - currentTime);

  const handleRestart = async () => {
    try {
      await restartLevel(levelId);
    } catch (err) {
      console.error("Error al reiniciar el nivel:", err);
    }
    const initialRoute = useGameSessionStore.getState().initialRoute ?? `/level/${levelId}`;
    router.push(initialRoute);
  };

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
    <CronicaDefeatNewspaper
      levelId={levelId}
      gameOverReason={gameOverReason}
      hoursTaken={hoursTaken}
      onRestart={handleRestart}
      onClose={handleBackToPrincipal}
    />,
    document.body
  );
}
