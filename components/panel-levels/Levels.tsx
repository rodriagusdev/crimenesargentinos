"use client";

import { useEffect, useState } from "react";
import { ICardLevelPreview } from "@/models/ICardLevelPreview";
import { getLevels } from "@/services/gameSessionService";
import { ILevelOverview } from "@/models/IGameSession";
import LevelCard from "./LevelCard";

// Definición canónica de los 5 niveles del juego
const LEVEL_DEFINITIONS = [
  {
    id: 1,
    title: "ROBO A LAS ESTRELLAS",
    description: "El trofeo nacional desapareció en pleno centro porteño tras los festejos.",
    imageURL: "/images/levelcardspreview/level_1_preview.jpg",
  },
  {
    id: 2,
    title: "DESAPARECEN LOS MAÑANEROS",
    description: "Fanáticos desaparecieron misteriosamente tras ganar el sorteo del tren nocturno.",
    imageURL: "/images/levelcardspreview/level_2_preview.jpg",
  },
  {
    id: 3,
    title: "CASO PATAGONIA",
    description: "Sombras en la cordillera y sospechas en la fría estepa patagónica.",
    imageURL: "/images/levelcardspreview/level_3_preview.jpg",
  },
  {
    id: 4,
    title: "RUTA NACIONAL 40",
    description: "Misterio a lo largo de la mítica ruta y sus rascacielos al anochecer.",
    imageURL: "/images/levelcardspreview/level_4_preview.jpg",
  },
  {
    id: 5,
    title: "EL ASESINO DE LAS PROVINCIAS",
    description: "El río bajo la luna esconde el escape del audaz robo de diamantes.",
    imageURL: "/images/levelcardspreview/level_5_preview.jpg",
  },
];

export default function Levels() {
  const [levels, setLevels] = useState<ICardLevelPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getLevels()
      .then((apiLevels: ILevelOverview[]) => {
        if (cancelled) return;

        // Mapear cada nivel según el estado devuelto por el backend
        const mappedLevels: ICardLevelPreview[] = LEVEL_DEFINITIONS.map((def) => {
          const apiLevel = apiLevels.find((l) => l.level === def.id);
          const isCompleted = apiLevel?.status === "completed";
          const isCurrent = apiLevel?.status === "current";
          // Nivel 1 siempre es accesible; niveles subsiguientes se habilitan según la API
          const canPlayLevel = def.id === 1 || isCompleted || isCurrent;

          return {
            id: def.id,
            title: apiLevel?.title ? `NIVEL ${def.id} · ${apiLevel.title.toUpperCase()}` : def.title,
            description: apiLevel?.description || def.description,
            imageURL: def.imageURL,
            videoURL: undefined,
            canPlay: canPlayLevel,
            completed: isCompleted,
          };
        });

        setLevels(mappedLevels);
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

  if (loading) {
    return (
      <section className="w-full">
        {/* Barra diagonal de precaución */}
        <div className="h-2.5 w-full bg-[repeating-linear-gradient(45deg,#eab308,#eab308_12px,#090d16_12px,#090d16_24px)] rounded-full shadow-sm mb-6 border border-yellow-500/40" />

        <h2 className="mb-4 text-center font-['Press_Start_2P'] text-[#E1C380] text-sm sm:text-base tracking-widest">
          NIVELES
        </h2>
        <div className="text-center text-slate-400 font-mono text-xs py-12">
          Cargando casos policiales...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full">
        <div className="h-2.5 w-full bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_12px,#090d16_12px,#090d16_24px)] rounded-full shadow-sm mb-6 border border-red-500/40" />
        <h2 className="mb-4 text-center font-['Press_Start_2P'] text-[#E1C380] text-sm sm:text-base tracking-widest">
          NIVELES
        </h2>
        <div className="text-center text-red-400 font-mono text-xs py-12">
          Error al cargar los niveles: {error}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      {/* 1. Barra de advertencia policial estilo cinta de peligro */}
      <div className="h-3 w-full bg-[repeating-linear-gradient(45deg,#eab308,#eab308_14px,#090d16_14px,#090d16_28px)] rounded-full shadow-[0_0_12px_rgba(234,179,8,0.3)] mb-5 border border-yellow-500/50" />

      {/* 2. Cabecera táctica retro */}
      <div className="mb-6 text-center">
        <h2 className="font-['Press_Start_2P'] text-[#E1C380] text-sm sm:text-base tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          NIVELES DE INVESTIGACION
        </h2>
      </div>

      {/* 3. Grilla de tarjetas con imagen como protagonista visual */}
      <div
        className="
          grid gap-6
          grid-cols-1
          md:grid-cols-2
          2xl:grid-cols-3
        "
      >
        {levels.map((level) => (
          <LevelCard key={level.id} preview={level} />
        ))}
      </div>
    </section>
  );
}
