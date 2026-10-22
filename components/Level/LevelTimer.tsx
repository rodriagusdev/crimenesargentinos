"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useGameSessionStore } from "@/stores/useGameSessionStore";

// Lazy loading: Los periódicos de Victoria y Derrota solo se cargan si la partida termina
const GameOverModal = dynamic(() => import("./GameOverModal"), { ssr: false });
const VictoryModal = dynamic(() => import("./VictoryModal"), { ssr: false });

interface LevelTimerProps {
  levelId: number;
}

export default function LevelTimer({ levelId }: LevelTimerProps) {
  const initSession = useGameSessionStore((state) => state.initSession);
  const isGameOver = useGameSessionStore((state) => state.isGameOver);
  const isVictory = useGameSessionStore((state) => state.isVictory);

  useEffect(() => {
    initSession(levelId).catch((err) => console.error("Error al iniciar la partida:", err));
  }, [levelId, initSession]);

  return (
    <>
      {isGameOver && <GameOverModal levelId={levelId} />}
      {isVictory && <VictoryModal levelId={levelId} />}
    </>
  );
}
