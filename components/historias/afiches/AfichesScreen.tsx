"use client";

import { useCallback, useState } from "react";
import DvdBackCover from "./DvdBackCover";
import MarqueeSign from "./MarqueeSign";
import MoviePoster from "./MoviePoster";
import { audioManager } from "@/lib/audioManager";
import { CASE_STORIES, type CaseStory } from "@/lib/caseStories";
import GameBackdrop, { CautionBar, GAME_BG } from "@/components/galeria/GameBackdrop";

// Telón de terciopelo: pliegues verticales en bordó
const VELVET =
  "bg-[repeating-linear-gradient(90deg,#3d070d_0,#5c0d15_22px,#2a0409_44px)] shadow-[inset_0_20px_40px_rgba(0,0,0,0.8),inset_0_-20px_40px_rgba(0,0,0,0.8)]";

// Propuesta "Próximos estrenos": hall de cine con marquesina, pared de terciopelo con los afiches de los ocho casos
// y alfombra roja. Al tocar un afiche se abre la contratapa del DVD con la sinopsis y el botón JUGAR.
export default function AfichesScreen() {
  const [open, setOpen] = useState<CaseStory | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <div className={`relative ${GAME_BG} min-h-svh overflow-x-clip px-3 sm:px-6 pt-16 pb-0 sm:pt-12`}>
      <GameBackdrop glow="220,40,60" />
      <CautionBar className="max-w-5xl" />

      <div className="relative max-w-5xl mx-auto flex flex-col">
        <MarqueeSign />

        <section aria-label="Afiches" className={`relative mt-4 rounded-t-lg border-x-4 border-t-4 border-[#b8892e]/70 ${VELVET} px-3.5 py-6 sm:p-8`}>
          {/* Luz de los apliques sobre el terciopelo */}
          <span className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,214,120,0.18),transparent_70%)]" aria-hidden />
          <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {CASE_STORIES.map((s, i) => (
              <MoviePoster
                key={s.id}
                story={s}
                order={i}
                onOpen={() => {
                  audioManager.play("click");
                  setOpen(s);
                }}
              />
            ))}
          </div>
        </section>

        {/* Alfombra roja con sogas de terciopelo */}
        <div className="relative h-24 sm:h-32 [perspective:400px]" aria-hidden>
          <div className="absolute inset-x-[18%] top-0 h-full origin-top bg-[linear-gradient(180deg,#8a0f18,#b3121b_40%,#6d0a12)] [transform:rotateX(35deg)] shadow-[0_0_40px_rgba(179,18,27,0.4)]">
            <span className="absolute inset-y-0 left-1.5 w-1 bg-[#d4a640]/70" />
            <span className="absolute inset-y-0 right-1.5 w-1 bg-[#d4a640]/70" />
          </div>
          <span className="absolute left-[8%] top-3 h-14 w-2 rounded-t-full bg-[#d4a640]" />
          <span className="absolute right-[8%] top-3 h-14 w-2 rounded-t-full bg-[#d4a640]" />
          <span className="absolute left-[8%] right-[82%] top-5 h-6 rounded-b-full border-b-4 border-[#8a0f18]" />
          <span className="absolute right-[8%] left-[82%] top-5 h-6 rounded-b-full border-b-4 border-[#8a0f18]" />
        </div>
      </div>

      {open && <DvdBackCover key={open.id} story={open} onClose={close} />}
    </div>
  );
}
