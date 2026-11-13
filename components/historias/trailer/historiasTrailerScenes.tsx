"use client";

import type { ReactNode } from "react";
import TrailerCaseShot from "./TrailerCaseShot";
import TrailerMontageTile from "./TrailerMontageTile";
import TrailerTitleCard from "@/components/home/trailer/TrailerTitleCard";
import SplashLogo from "@/components/splash/SplashLogo";
import type { TimelineScene } from "@/hooks/useTrailerTimeline";
import { CASE_STORIES, type CaseStory } from "@/lib/caseStories";

// Guion del tráiler de los casos. Cada escena recibe `t`: los ms que lleva en pantalla; el logo arranca con t > 0
// para que el montaje y el arranque de la animación no coincidan.
export type HistoriaTrailerScene = TimelineScene & { label: string; render: (t: number) => ReactNode };

const ACTIVE_AFTER_MS = 60;
const CASE_MS = 4600;

const card = (text: string, ms: number, accent = false, sfx?: TimelineScene["sfx"]): HistoriaTrailerScene => ({
  ms,
  sfx,
  label: text,
  render: () => <TrailerTitleCard text={text} ms={ms} accent={accent} />,
});

const caseScene = (story: CaseStory, i: number): HistoriaTrailerScene => ({
  ms: CASE_MS,
  // Golpe de sonido al cortar a cada caso; alterna para que no canse
  sfx: i % 2 === 0 ? "swoosh" : "slide",
  label: story.title,
  render: () => <TrailerCaseShot story={story} total={CASE_STORIES.length} />,
});

const [c1, c2, c3, c4, c5, c6, c7, c8] = CASE_STORIES.map(caseScene);

export const HISTORIAS_TRAILER_SCENES: HistoriaTrailerScene[] = [
  card("ESTE INVIERNO…", 2600, false, "radio"),
  card("EN TODO EL PAÍS, ALGO DESAPARECE.", 2600),
  c1,
  c2,
  card("NADIE VIO NADA…", 2000),
  c3,
  c4,
  card("…O CASI NADIE.", 1800),
  c5,
  c6,
  card("CADA PREGUNTA CUESTA TIEMPO.", 2200),
  c7,
  c8,
  card("OCHO CASOS. UN SOLO DETECTIVE.", 3000, true, "stamp"),
  {
    ms: 3400,
    label: "Mosaico",
    render: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[#070c16] px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-[min(80vw,420px)] sm:w-[min(92vw,960px)]">
          {CASE_STORIES.map((s, i) => (
            <TrailerMontageTile key={s.id} story={s} index={i} />
          ))}
        </div>
      </div>
    ),
  },
  {
    ms: 4400,
    sfx: "opencasefile",
    label: "Crímenes Argentinos",
    render: (t) => (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black px-6">
        <SplashLogo visible={t > ACTIVE_AFTER_MS} className="w-[min(80vw,560px)]" />
        <p className="home-caption text-center text-[10px] sm:text-sm tracking-[0.3em] text-[#E1C380]">AHORA EN TU NAVEGADOR</p>
      </div>
    ),
  },
];
