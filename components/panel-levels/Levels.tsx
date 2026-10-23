"use client";

import { useEffect, useState } from "react";
import { ICardLevelPreview, ISubLevel } from "@/models/ICardLevelPreview";
import { getLevels } from "@/services/gameSessionService";
import { ILevelOverview } from "@/models/IGameSession";
import { getCompletedCases } from "@/lib/completedCases";
import LevelCard from "./LevelCard";

// Definición canónica de los 6 niveles y sus respectivos 3 subniveles (A, B, C)
const LEVEL_DEFINITIONS = [
  {
    id: 1,
    title: "ROBO A LAS ESTRELLAS",
    description: "El trofeo nacional desapareció en pleno centro porteño tras los festejos.",
    imageURL: "/images/levelcardspreview/level_1_preview.png",
    subLevels: [
      { code: "A" as const, caseId: 1, title: "El Obelisco" },
      { code: "B" as const, caseId: 6, title: "Pista Misionera" },
      { code: "C" as const, caseId: 7, title: "Rumbo Colonial" },
    ],
  },
  {
    id: 2,
    title: "DESAPARECEN LOS MAÑANEROS",
    description: "Fanáticos desaparecieron misteriosamente tras ganar el sorteo del tren nocturno.",
    imageURL: "/images/levelcardspreview/level_2_preview.png",
    subLevels: [
      { code: "A" as const, caseId: 2, title: "El Tren Nocturno" },
      { code: "B" as const, caseId: 8, title: "Pista Norte" },
      { code: "C" as const, caseId: 9, title: "Pista Austral" },
    ],
  },
  {
    id: 3,
    title: "CASO PATAGONIA",
    description: "Sombras en la cordillera y sospechas en la fría estepa patagónica.",
    imageURL: "/images/levelcardspreview/level_3_preview.png",
    subLevels: [
      { code: "A" as const, caseId: 3, title: "Refugio Nevado" },
      { code: "B" as const, caseId: 10, title: "Sombras en la Cordillera" },
      { code: "C" as const, caseId: 11, title: "Secreto en las Alturas" },
    ],
  },
  {
    id: 4,
    title: "RUTA NACIONAL 40",
    description: "Misterio a lo largo de la mítica ruta y sus rascacielos al anochecer.",
    imageURL: "/images/levelcardspreview/level_4_preview.png",
    subLevels: [
      { code: "A" as const, caseId: 4, title: "Cruce Desértico" },
      { code: "B" as const, caseId: 12, title: "Sombra Urbana" },
      { code: "C" as const, caseId: 13, title: "El Destino Final" },
    ],
  },
  {
    id: 5,
    title: "EL ASESINO DE LAS PROVINCIAS",
    description: "El río bajo la luna esconde el escape del audaz robo de diamantes.",
    imageURL: "/images/levelcardspreview/level_5_preview.png",
    subLevels: [
      { code: "A" as const, caseId: 5, title: "Río de Luna" },
      { code: "B" as const, caseId: 14, title: "Ribera del Carnaval" },
      { code: "C" as const, caseId: 15, title: "Fuga Fluvial" },
    ],
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

        // 1. Obtener casos completados guardados en cliente
        const localCompleted = new Set<number>(getCompletedCases());

        // Complementar con los casos que la API ya reporte como completados
        apiLevels.forEach((al) => {
          if (al.status === "completed" && al.caseId) {
            localCompleted.add(al.caseId);
          }
        });

        // 2. Mapear cada nivel con sus subniveles dinámicos
        const mappedLevels: ICardLevelPreview[] = LEVEL_DEFINITIONS.map((def, idx) => {
          const apiLevel = apiLevels.find((l) => l.level === def.id);

          // Nivel 1 siempre es accesible; niveles subsiguientes se desbloquean si el nivel previo
          // tiene su subnivel A resuelto o si la API lo habilita
          const prevDef = idx > 0 ? LEVEL_DEFINITIONS[idx - 1] : null;
          const prevLevelStarted = prevDef ? localCompleted.has(prevDef.subLevels[0].caseId) : true;
          const isApiPlayable = apiLevel ? apiLevel.status === "current" || apiLevel.status === "completed" : false;
          const canPlayLevel = def.id === 1 || isApiPlayable || prevLevelStarted;
          // Si quiero probar todos los niveles descomentar la linea de abajo y comentar la linea de arriba
          // Ademas, comentaru na parte en gamesession en el backend
          // const canPlayLevel = true;

          // Calcular estado de cada subnivel: A, B y C
          // Todos los subcasos están disponibles y son sorteables desde el comienzo
          const subLevels: ISubLevel[] = def.subLevels.map((subDef) => {
            if (!canPlayLevel) {
              return { ...subDef, status: "locked" as const };
            }

            const isDone = localCompleted.has(subDef.caseId);
            if (isDone) {
              return { ...subDef, status: "completed" as const };
            }

            // Todos los casos del 1 al 15 están disponibles en la BD
            if (subDef.caseId <= 15) {
              return { ...subDef, status: "current" as const };
            }

            return { ...subDef, status: "locked" as const };
          });

          // Un nivel SOLO se considera completado (RESUELTO ✓) si TODOS los subniveles disponibles están ganados
          const playableSublevels = subLevels.filter((s) => s.caseId <= 15);
          const allSublevelsCompleted = playableSublevels.length > 0 && playableSublevels.every((s) => s.status === "completed");

          return {
            id: def.id,
            title: apiLevel?.title ? `NIVEL ${def.id} · ${apiLevel.title.toUpperCase()}` : def.title,
            description: apiLevel?.description || def.description,
            imageURL: def.imageURL,
            videoURL: undefined,
            canPlay: canPlayLevel,
            completed: allSublevelsCompleted,
            subLevels,
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
