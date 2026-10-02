"use client";

import { useEffect } from "react";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import GameOverModal from "./GameOverModal";
import VictoryModal from "./VictoryModal";

interface LevelTimerProps {
  levelId: number;
}

export default function LevelTimer({ levelId }: LevelTimerProps) {
  const initSession = useGameSessionStore((state) => state.initSession);

  useEffect(() => {
    initSession(levelId).catch((err) => console.error("Error al iniciar la partida:", err));
  }, [levelId, initSession]);

  return (
    <>
      <GameOverModal levelId={levelId} />
      <VictoryModal levelId={levelId} />
    </>
  );
}

