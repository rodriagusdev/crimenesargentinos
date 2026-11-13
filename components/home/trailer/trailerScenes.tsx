"use client";

import type { ReactNode } from "react";
import TrailerTitleCard from "./TrailerTitleCard";
import { ClueVisual, InterrogationVisual, MapVisual, WarrantVisual } from "./TrailerVisuals";
import SeamlessBackgroundVideo from "@/components/login/SeamlessBackgroundVideo";
import SplashLogo from "@/components/splash/SplashLogo";
import type { TimelineScene } from "@/hooks/useTrailerTimeline";

// Cada escena recibe `t`: los ms que lleva en pantalla. Las animaciones arrancan con t > 0 para que el montaje y el arranque no coincidan.
export type TrailerScene = TimelineScene & { render: (t: number) => ReactNode };

const ACTIVE_AFTER_MS = 60;

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

const title = (text: string, ms: number, accent = false): TrailerScene => ({
  ms,
  render: () => <TrailerTitleCard text={text} ms={ms} accent={accent} />,
});

export const TRAILER_SCENES: TrailerScene[] = [
  { ...title("BUENOS AIRES · 03:14 HS", 2600), sfx: "radio" },
  {
    ms: 3800,
    render: () => (
      <Shot caption="Un golpe sacude al país.">
        <SeamlessBackgroundVideo src="/videos/introvid.mp4" poster="/images/principal_background.webp" fadeDuration={0.8} />
      </Shot>
    ),
  },
  title("NADIE VIO NADA…", 2000),
  {
    ms: 3600,
    sfx: "opencasefile",
    render: (t) => (
      <Shot className="bg-[#120b06]">
        <ClueVisual active={t > ACTIVE_AFTER_MS} />
      </Shot>
    ),
  },
  title("…O CASI NADIE.", 1800),
  {
    ms: 4000,
    render: (t) => (
      <Shot caption="De Jujuy a Tierra del Fuego." className="bg-[#0b1426]">
        <div className="w-[min(92vw,900px)]">
          <MapVisual active={t > ACTIVE_AFTER_MS} />
        </div>
      </Shot>
    ),
  },
  {
    ms: 3600,
    render: (t) => (
      <Shot caption="Cada pregunta cuesta tiempo." className="bg-[#070c16]">
        <div className="w-[min(92vw,560px)]">
          <InterrogationVisual active={t > ACTIVE_AFTER_MS} />
        </div>
      </Shot>
    ),
  },
  title("TENÉS UNA SOLA ORDEN DE ARRESTO.", 2400),
  {
    ms: 2800,
    render: (t) => (
      <Shot className="bg-[#1a0d0d]">
        <WarrantVisual active={t > ACTIVE_AFTER_MS} />
      </Shot>
    ),
  },
  {
    ms: 4400,
    sfx: "opencasefile",
    render: (t) => (
      <Shot className="bg-black">
        <div className="flex flex-col items-center gap-6">
          <SplashLogo visible={t > ACTIVE_AFTER_MS} className="w-[min(80vw,560px)]" />
          <p className="home-caption text-[10px] sm:text-sm tracking-[0.3em] text-[#E1C380]">AHORA EN TU NAVEGADOR</p>
        </div>
      </Shot>
    ),
  },
];
