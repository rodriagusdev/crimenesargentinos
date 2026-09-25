"use client";

import { useEffect, useState } from "react";
import { ICardLevelPreview } from "@/models/ICardLevelPreview";
import { getLevels } from "@/services/gameSessionService";
import { ILevelOverview } from "@/models/IGameSession";
import LevelCard from "./LevelCard";

// Tarjeta de un nivel: el caso ganado o en curso, o genérica si el caso todavía no se sorteó
function toCard(level: ILevelOverview): ICardLevelPreview {
  const hasCase = level.caseId !== null;
  return {
    id: level.level,
    title: hasCase ? level.title ?? "" : `NIVEL ${level.level}`,
    description: hasCase
      ? level.description ?? ""
      : level.status === "current"
        ? "Te va a tocar un caso al azar."
        : "Resolvé el nivel anterior para desbloquearlo.",
    imageURL: (hasCase && level.imageUrl) || `/images/levelcardspreview/level_${level.level}_preview.jpg`,
    videoURL: level.status === "current" ? level.videoUrl ?? undefined : undefined,
    canPlay: level.status === "current",
    completed: level.status === "completed",
  };
}

export default function Levels() {
  const [levels, setLevels] = useState<ICardLevelPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Niveles completados, el habilitado (con su caso si ya se sorteó) y los bloqueados
    getLevels()
      .then((apiLevels) => {
        if (!cancelled) setLevels(apiLevels.map(toCard));
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido";
        console.error("Error fetching levels:", errorMessage);
        if (!cancelled) setError(errorMessage);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isLoading = loading;
  const displayError = error;

  if (isLoading) {
    return (
      <section className="w-full">
        <h2
          className="
            mb-8 text-center
            font-['Press_Start_2P']
            text-[#E1C380]
            text-sm sm:text-base
            tracking-widest
          "
        >
          NIVELES
        </h2>
        <div className="text-center text-white">Cargando niveles...</div>
      </section>
    );
  }

  if (displayError) {
    return (
      <section className="w-full">
        <h2
          className="
            mb-8 text-center
            font-['Press_Start_2P']
            text-[#E1C380]
            text-sm sm:text-base
            tracking-widest
          "
        >
          NIVELES
        </h2>
        <div className="text-center text-red-500">Error: {displayError}</div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <h2
        className="
          mb-8 text-center
          font-['Press_Start_2P']
          text-[#E1C380]
          text-sm sm:text-base
          tracking-widest
        "
      >
        NIVELES
      </h2>

      <div
        className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            2xl:grid-cols-3
        "
      >
        {levels.map((level) => (
          <LevelCard
            key={level.id}
            preview={level}
  
          />
        ))}
      </div>
    </section>
  );
}
