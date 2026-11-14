"use client";

import type { ReactNode } from "react";
import type { TrailerMessageKey } from "./TrailerScreen.messages";
import TrailerTitleCard from "./TrailerTitleCard";
import { ClueVisual, InterrogationVisual, MapVisual, WarrantVisual } from "./TrailerVisuals";
import SeamlessBackgroundVideo from "@/components/login/SeamlessBackgroundVideo";
import SplashLogo from "@/components/splash/SplashLogo";
import type { TimelineScene } from "@/hooks/useTrailerTimeline";

// Cada escena recibe `active`: pasa a true un instante después de montarse (ACTIVE_AFTER_MS), para que el montaje y el
// arranque de las transiciones no coincidan. El resto del movimiento es CSS que arranca al montar la escena.
// `tr` traduce los textos (placas y subtítulos) al idioma del jugador; las duraciones no dependen del largo del texto.
export type TrailerTranslate = (key: TrailerMessageKey) => string;
export type TrailerScene = TimelineScene & { render: (active: boolean, tr: TrailerTranslate) => ReactNode };

export const ACTIVE_AFTER_MS = 60;

// Toma con zoom lento (efecto Ken Burns) y subtítulo abajo
function Shot({ caption, className = "", children }: { caption?: string; className?: string; children: ReactNode }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="home-kenburns absolute inset-0 flex items-center justify-center px-6">{children}</div>
      {caption && (
        <p className="home-caption absolute bottom-[16%] inset-x-0 px-6 text-center text-sm sm:text-xl text-[#FFF3C7] [text-shadow:0_3px_0_#000,0_0_14px_#000]">
          {caption}
        </p>
      )}
    </div>
  );
}

const title = (key: TrailerMessageKey, ms: number, accent = false): TrailerScene => ({
  ms,
  render: (_active, tr) => <TrailerTitleCard text={tr(key)} ms={ms} accent={accent} />,
});

export const TRAILER_SCENES: TrailerScene[] = [
  { ...title("cardClock", 2600), sfx: "radio" },
  {
    ms: 3800,
    render: (_active, tr) => (
      <Shot caption={tr("captionHeist")}>
        <SeamlessBackgroundVideo src="/videos/introvid.mp4" poster="/images/principal_background.webp" fadeDuration={0.8} />
      </Shot>
    ),
  },
  title("cardNobody", 2000),
  {
    ms: 3600,
    sfx: "opencasefile",
    render: (active) => (
      <Shot className="bg-[#120b06]">
        <ClueVisual active={active} />
      </Shot>
    ),
  },
  title("cardAlmost", 1800),
  {
    ms: 4000,
    render: (active, tr) => (
      <Shot caption={tr("captionMap")} className="bg-[#0b1426]">
        <div className="w-[min(92vw,900px)]">
          <MapVisual active={active} />
        </div>
      </Shot>
    ),
  },
  {
    ms: 3600,
    render: (active, tr) => (
      <Shot caption={tr("captionQuestions")} className="bg-[#070c16]">
        <div className="w-[min(92vw,560px)]">
          <InterrogationVisual active={active} />
        </div>
      </Shot>
    ),
  },
  title("cardWarrant", 2400),
  {
    ms: 2800,
    render: (active) => (
      <Shot className="bg-[#1a0d0d]">
        <WarrantVisual active={active} />
      </Shot>
    ),
  },
  {
    ms: 4400,
    sfx: "opencasefile",
    render: (active, tr) => (
      <Shot className="bg-black">
        <div className="flex flex-col items-center gap-6">
          <SplashLogo visible={active} className="w-[min(80vw,560px)]" />
          <p className="home-caption text-[10px] sm:text-sm tracking-[0.3em] text-[#E1C380]">{tr("tagline")}</p>
        </div>
      </Shot>
    ),
  },
];
