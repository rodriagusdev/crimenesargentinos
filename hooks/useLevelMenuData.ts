"use client";

import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { IGameData } from "@/models/IGameData";
import { getGameData } from "@/services/levelService";
import { useGameSessionStore } from "@/stores/useGameSessionStore";

// Informe, pistas iniciales y sospechosos del caso para el menú de investigación.
// Si el caso es el de la partida en curso, salen del store; solo se piden a la API cuando el store no tiene ese caso.
export function useLevelMenuData(levelId: number) {
  const { storeLevelId, storeBriefing, storeInitialClues, storeSuspects } = useGameSessionStore(
    useShallow((state) => ({
      storeLevelId: state.levelId,
      storeBriefing: state.briefing,
      storeInitialClues: state.initialClues,
      storeSuspects: state.suspects,
    }))
  );

  const isCurrentLevel = storeLevelId === levelId;
  const storeHasLevel = isCurrentLevel && Boolean(storeBriefing) && storeSuspects.length > 0;

  // Copia pedida a la API, recordando de qué caso es para no mostrar datos de otro
  const [fetched, setFetched] = useState<{ levelId: number; data: IGameData } | null>(null);

  useEffect(() => {
    // Si ya está en el store del nivel actual, no repetimos la petición innecesariamente
    if (storeHasLevel) return;

    let cancelled = false;
    getGameData(levelId)
      .then((data) => {
        if (!cancelled) setFetched({ levelId, data });
      })
      .catch((error) => {
        console.error("Error fetching level data:", error);
      });
    return () => {
      cancelled = true;
    };
  }, [levelId, storeHasLevel]);

  const info = fetched?.levelId === levelId ? fetched.data : null;

  const briefing = (isCurrentLevel && storeBriefing) ? storeBriefing : info?.info;
  const initialClues = (isCurrentLevel && storeInitialClues && storeInitialClues.length > 0)
    ? storeInitialClues
    : (info?.initialClues ?? []);
  const suspects = (isCurrentLevel && storeSuspects && storeSuspects.length > 0)
    ? storeSuspects
    : (info?.suspects ?? []);

  return { briefing, initialClues, suspects };
}
