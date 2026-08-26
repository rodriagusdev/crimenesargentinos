"use client";

import Image from "next/image";
import GameButton from "../buttons/GameButton";
import { getLevelLocations } from "@/services/levelService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ILevelLocations from "@/models/ILevelLocations";

interface LevelDataProps {
  levelId: number;
  provinceId: number;
}

export default function LevelProvinceLocations({ levelId,provinceId }: LevelDataProps) {
  const router = useRouter();

  const [data, SetData] = useState<ILevelLocations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    let cancelled = false;

    async function loadLevel() {
      try {
        setLoading(true);
        setError(null);
        const data = await getLevelLocations(provinceId);
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
  }, [provinceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#FFF3C7]">
        Cargando nivel {provinceId}...
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
          src={""}
          alt={`Fondo nivel ${provinceId}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Lugares del mapa */}

      {data.locations.map((location) => (
        <GameButton
          key={location.id}
          icon={""}
          label={location.name}
          onClick={() => router.push(`/level/${levelId}/${provinceId}/${location.id}`)}
        />
      ))}

    
    </>
  );
}


/*
{insideLocation && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0">
            <Image
              src={data.locations[idLocation].backgroundUrl}
              alt="Location background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0" />
          </div>
          <DialogBox
            introText={data.locations[idLocation]?.dialog.introText}
            portraitUrl={data.locations[idLocation]?.dialog.portraitUrl || ""}
            characterName={data.locations[idLocation]?.dialog.npc || ""}
            questions={data.locations[idLocation]?.dialog.questions || ""}
            answers={data.locations[idLocation]?.dialog.answers || ""}
            onClose={onExitLocation}
          />
        </div>
      )}*/