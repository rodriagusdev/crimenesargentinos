"use client";

import { useEffect, useState } from "react";
import { ICardLevelPreview } from "@/models/ICardLevelPreview";
import { getLevelsByUserId, LevelResponse } from "@/lib/api";
import { useUserId } from "@/hooks/useUserId";
import LevelCard from "./LevelCard";

export default function Levels() {
  const { userId, loading: userIdLoading, error: userIdError } = useUserId();
  const [levels, setLevels] = useState<ICardLevelPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userIdLoading || !userId) {
      return;
    }

    const fetchLevels = async () => {
      try {
        setLoading(true);
        setError(null);

        // Llamar al API para obtener los niveles
        const apiLevels = await getLevelsByUserId(userId);

        // Mapear la respuesta a ICardLevelPreview
        const mappedLevels: ICardLevelPreview[] = apiLevels.map(
          (level: LevelResponse) => ({
            id: level.caseId,
            title: level.title,
            description: level.description,
            imageURL: level.imageUrl,
            videoURL: level.videoUrl,
            canPlay: level.canPlay,
          })
        );

        setLevels(mappedLevels);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        console.error("Error fetching levels:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [userId, userIdLoading]);

  const isLoading = userIdLoading || loading;
  const displayError = userIdError || error;

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
            key={level.title}
            preview={level}
  
          />
        ))}
      </div>
    </section>
  );
}
