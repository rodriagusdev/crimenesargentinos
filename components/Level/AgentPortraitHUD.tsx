"use client";

import Image from "next/image";
import { useAppPathname } from "@/hooks/useAppPathname";
import { useEffect, useState } from "react";
import { useAvatarStore } from "@/stores/useAvatarStore";
import { useIsFullscreen } from "@/hooks/useIsFullscreen";
import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";

const messages = defineMessages({
  es: { portrait: "Retrato del Detective", noPhoto: "SIN FOTO" },
  en: { portrait: "Detective Portrait", noPhoto: "NO PHOTO" },
});

// Tamaño y posición en ventana normal (ajustado para que no tape las locaciones con zoom al 100%)
const SIZE_WINDOW =
  "bottom-0 right-[7px] sm:bottom-[7px] sm:right-[15px] w-[72px] h-[88px] sm:w-24 sm:h-32 lg:w-[min(8.5rem,15vh)] lg:h-[min(10.5rem,19vh)] p-1 sm:p-2 border-[3px] sm:border-[5px]";
// A pantalla completa hay más lugar: vuelve al tamaño original, más grande
const SIZE_FULLSCREEN =
  "bottom-3 right-3 sm:bottom-8 sm:right-8 w-20 h-24 sm:w-44 sm:h-56 md:w-56 md:h-56 p-1 sm:p-2.5 border-[3px] sm:border-[6px]";

export default function AgentPortraitHUD() {
  const fullscreen = useIsFullscreen();
  const pathname = useAppPathname();
  const currentAvatar = useAvatarStore((state) => state.currentAvatar);
  const initAvatar = useAvatarStore((state) => state.initAvatar);
  const [mounted, setMounted] = useState(false);
  const t = useT(messages);

  useEffect(() => {
    setMounted(true);
    void initAvatar();
  }, [initAvatar]);

  if (!mounted) return null;

  // Segmentos: ['', 'level', ':levelId'] -> 2 segmentos (Mapa general)
  // ['', 'level', ':levelId', ':provinceId'] -> 3 segmentos (Mapa provincial)
  // ['', 'level', ':levelId', ':provinceId', ':locationId'] -> 4 segmentos (Locación / Interrogatorio)
  const segments = pathname.split("/").filter(Boolean);
  const isInsideLocation = segments.length >= 4;

  // Solo se muestra en el mapa general y mapa provincial en la esquina inferior derecha.
  // En escritorio su tamaño depende del alto de la ventana, para no tapar las locaciones con zoom al 100%
  if (isInsideLocation) return null;

  return (
    <aside
      aria-label={t("portrait")}
      className={`
        no-desktop-zoom fixed z-30 pointer-events-none select-none
        ${fullscreen ? SIZE_FULLSCREEN : SIZE_WINDOW}
        bg-[#0c131d]
        border-[#1a2332]
        [@media(max-height:500px)_and_(pointer:coarse)]:bottom-3 [@media(max-height:500px)_and_(pointer:coarse)]:right-3 [@media(max-height:500px)_and_(pointer:coarse)]:w-20 [@media(max-height:500px)_and_(pointer:coarse)]:h-24 [@media(max-height:500px)_and_(pointer:coarse)]:p-1 [@media(max-height:500px)_and_(pointer:coarse)]:border-[3px]
        rounded-xl
        shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.05),0_0_0_1px_rgba(0,0,0,0.8)]
        flex items-center justify-center
      `}
    >
      {currentAvatar ? (
        <div className="relative w-full h-full overflow-hidden rounded-sm bg-black shadow-[inset_0_0_12px_rgba(0,0,0,0.7)] border border-black/70">
          <Image
            src={currentAvatar}
            alt={t("portrait")}
            fill
            priority
            sizes="(max-width: 640px) 80px, 224px"
            className="object-cover object-top"
          />
        </div>
      ) : (
        <div className="relative w-full h-full overflow-hidden rounded-sm flex flex-col items-center justify-center bg-[#070b12] text-amber-300/40 border border-black/70 p-1 sm:p-4">
          <span className="text-2xl sm:text-5xl mb-1 sm:mb-2">👤</span>
          <span className="font-mono text-[10px] text-center uppercase tracking-normal sm:tracking-widest text-[#E1C380]/60 font-semibold">
            {t("noPhoto")}
          </span>
        </div>
      )}
    </aside>
  );
}
