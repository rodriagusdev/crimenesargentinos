"use client";

import Image from "next/image";
import GameButton from "../buttons/GameButton";
import { getLevelProvinces } from "@/services/levelService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ILevelDataProvinces from "@/models/ILevelDataProvinces";

interface LevelDataProps {
  levelId: number;
}

export default function LevelProvinces({ levelId }: LevelDataProps) {
  const router = useRouter();
  const [data, SetData] = useState<ILevelDataProvinces | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLevel() {
      try {
        setLoading(true);
        setError(null);
        const data = await getLevelProvinces(levelId);
        if (!cancelled) {
          SetData(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar el nivel",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLevel();

    return () => {
      cancelled = true;
    };
  }, [levelId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#FFF3C7]">
        Cargando nivel {levelId}...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        {error ?? "Nivel no encontrado"}
      </div>
    );
  }

  return (
    <>
      <div className="absolute inset-0 -z-10">
        <Image
          src={data.backgroundUrl}
          alt={`Fondo nivel ${levelId}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 " />
      </div>

      {/* Lugares del mapa */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] gap-4 p-6">
        {data.provinces.map((province) => (
          <GameButton
            key={province.id}
            icon={""}
            label={province.name}
            onClick={() => router.push(`/level/${levelId}/${province.id}`)}
          />
        ))}
      </div>
    </>
  );
}
