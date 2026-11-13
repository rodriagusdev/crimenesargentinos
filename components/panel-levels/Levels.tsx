"use client";

import { useEffect, useState } from "react";
import { ICardLevelPreview } from "@/models/ICardLevelPreview";
import { getLevels } from "@/services/gameSessionService";
import { ILevelOverview } from "@/models/IGameSession";
import { resolveAssetLevel } from "@/lib/caseAssetPaths";
import LevelsCarousel from "./LevelsCarousel";
import { useT } from "@/hooks/useT";
import { useLocale } from "@/stores/useLocaleStore";
import { levelsMessages, type LevelFallbackId } from "./Levels.messages";

// Definición canónica del catálogo de niveles del juego. Se mantiene el listado
// conocido de casos antiguos y se agregan los nuevos casos 16, 17 y 18 para que
// la pantalla principal no queden limitada a los primeros 5 IDs.
const LEVEL_DEFINITIONS: { id: LevelFallbackId; imageURL: string }[] = [
  { id: 1, imageURL: "/images/levelcardspreview/level_1_preview.jpg" },
  { id: 2, imageURL: "/images/levelcardspreview/level_2_preview.jpg" },
  { id: 3, imageURL: "/images/levelcardspreview/level_3_preview.jpg" },
  { id: 4, imageURL: "/images/levelcardspreview/level_4_preview.jpg" },
  { id: 5, imageURL: "/images/levelcardspreview/level_5_preview.jpg" },
  { id: 16, imageURL: "/images/levelcardspreview/alfajor.webp" },
  { id: 17, imageURL: "/images/levelcardspreview/camiseta86.webp" },
  { id: 18, imageURL: "/images/levelcardspreview/bandoneon.webp" },
];

function getLevelPreviewImageUrl(level: number): string {
  if (level >= 16 && level <= 18) {
    const bonusImageByLevel: Record<number, string> = {
      16: "/images/levelcardspreview/alfajor.webp",
      17: "/images/levelcardspreview/camiseta86.webp",
      18: "/images/levelcardspreview/bandoneon.webp",
    };

    return bonusImageByLevel[level] ?? "/images/levelcardspreview/level_1_preview.jpg";
  }

  const resolvedLevel = resolveAssetLevel(level);
  return `/images/levelcardspreview/level_${resolvedLevel}_preview.jpg`;
}

export default function Levels() {
  const [levels, setLevels] = useState<ICardLevelPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useT(levelsMessages);
  // La API devuelve los títulos en el idioma elegido: al cambiarlo se vuelven a pedir
  const locale = useLocale();

  useEffect(() => {
    let cancelled = false;
    const definitions = LEVEL_DEFINITIONS.map((def) => ({
      ...def,
      title: t(`title${def.id}`),
      description: t(`description${def.id}`),
    }));

    getLevels()
      .then((apiLevels: ILevelOverview[]) => {
        if (cancelled) return;

        const definitionsById = new Map<number, (typeof definitions)[number]>(
          definitions.map((def) => [def.id, def] as const)
        );

        const mergedDefinitions = [
          ...definitions,
          ...apiLevels
            .filter(
              (apiLevel) =>
                !definitionsById.has(apiLevel.level) &&
                apiLevel.level >= 16 &&
                apiLevel.level <= 18
            )
            .map((apiLevel) => ({
              id: apiLevel.level,
              title: apiLevel.title?.toUpperCase() ?? t("levelFallback", { n: apiLevel.level }),
              description: apiLevel.description ?? t("descriptionFallback"),
              imageURL: getLevelPreviewImageUrl(apiLevel.level),
            })),
        ]
          .filter((def) => def.id >= 1 && def.id <= 5 || def.id >= 16 && def.id <= 18)
          .sort((a, b) => a.id - b.id);

        // Mapear cada nivel según el estado devuelto por el backend.
        const mappedLevels: ICardLevelPreview[] = mergedDefinitions.map((def) => {
          const apiLevel = apiLevels.find((l) => l.level === def.id);
          const isCompleted = apiLevel?.status === "completed";
          const isCurrent = apiLevel?.status === "current";
          // El 16 se habilita al ganar el 5, el 17 al ganar el 16 y el 18 al ganar el 17 (lo decide el backend)
          const canPlayLevel = def.id === 1 || isCompleted || isCurrent;

          return {
            id: def.id,
            title: apiLevel?.title ? apiLevel.title.toUpperCase() : def.title,
            description: apiLevel?.description || def.description,
            imageURL: def.imageURL,
            videoURL: undefined,
            canPlay: canPlayLevel,
            completed: isCompleted,
            variantsTotal: apiLevel?.variantsTotal ?? 0,
            variantsWon: apiLevel?.variantsWon ?? 0,
          };
        });

        setLevels(mappedLevels);
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : t("unknownError");
        console.error("Error fetching levels:", errorMessage);
        if (!cancelled) setError(errorMessage);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // locale: al cambiar de idioma se vuelven a pedir los niveles
  }, [locale, t]);

  if (loading) {
    return (
      <section className="w-full">
        {/* Barra diagonal de precaución */}
        <div className="h-2.5 w-full bg-[repeating-linear-gradient(45deg,#eab308,#eab308_12px,#090d16_12px,#090d16_24px)] rounded-full shadow-sm mb-6 border border-yellow-500/40" />

        <h2 className="mb-4 text-center font-['Press_Start_2P'] text-[#E1C380] text-sm sm:text-base tracking-widest">
          {t("levels")}
        </h2>
        <div className="text-center text-slate-400 font-mono text-xs py-12">
          {t("loading")}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full">
        <div className="h-2.5 w-full bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_12px,#090d16_12px,#090d16_24px)] rounded-full shadow-sm mb-6 border border-red-500/40" />
        <h2 className="mb-4 text-center font-['Press_Start_2P'] text-[#E1C380] text-sm sm:text-base tracking-widest">
          {t("levels")}
        </h2>
        <div className="text-center text-red-400 font-mono text-xs py-12">
          {t("loadError", { error })}
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
        <h2 className="font-['Press_Start_2P'] text-[#E1C380] text-[11px] sm:text-base tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {t("heading")}
        </h2>
      </div>

      {/* 3. Tarjetas: carrusel entre 600px y 1920px, grilla en celular y pantallas muy anchas */}
      <LevelsCarousel levels={levels} />
    </section>
  );
}
