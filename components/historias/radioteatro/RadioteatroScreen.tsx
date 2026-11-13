"use client";

import { useMemo, useState } from "react";
import RadioSet from "./RadioSet";
import ScriptSheet from "./ScriptSheet";
import { buildScript } from "./script";
import { useBroadcast } from "./useBroadcast";
import GameBackdrop, { CautionBar, GAME_BG } from "@/components/galeria/GameBackdrop";
import { CASE_STORIES } from "@/lib/caseStories";
import { audioManager } from "@/lib/audioManager";

// Propuesta "Radioteatro policial": cada caso es un capítulo de Radio Policial que se sintoniza en el dial
export default function RadioteatroScreen() {
  const [index, setIndex] = useState(0);
  const story = CASE_STORIES[index];
  const script = useMemo(() => buildScript(story), [story]);
  const { state, play, stop } = useBroadcast(script);
  const onAir = state.status === "playing";

  const tune = (i: number) => {
    if (i === index) return;
    audioManager.play("click");
    stop();
    setIndex(i);
  };

  const toggle = () => {
    audioManager.play("click");
    if (onAir) stop();
    else play();
  };

  return (
    <div className={`relative ${GAME_BG} min-h-svh overflow-x-hidden px-3 sm:px-6 pt-16 pb-12 text-[#f5f5f0]`}>
      <GameBackdrop glow="245,180,80" />
      <CautionBar className="max-w-5xl" />

      <div className="relative mx-auto max-w-5xl">
        <header className="mb-6 text-center">
          <p className="text-[10px] tracking-[0.3em] text-amber-300">LU-POLICIAL · ONDA MEDIA</p>
          <h1 className="mt-1 text-2xl sm:text-4xl text-[#f5dd9c] [text-shadow:0_0_18px_rgba(255,200,90,0.45)]">RADIOTEATRO POLICIAL</h1>
          <p className="mt-2 font-mono text-xs sm:text-sm text-[#f5f5f0]/70">
            Ocho capítulos, ocho casos. Girá el dial, subí el volumen y escuchá lo que pasó.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
          <div className="mx-auto w-full max-w-sm lg:sticky lg:top-6">
            <RadioSet stories={CASE_STORIES} index={index} onAir={onAir} onTune={tune} onToggle={toggle} />
          </div>
          <ScriptSheet key={story.id} story={story} script={script} state={state} onPlay={toggle} />
        </div>
      </div>
    </div>
  );
}
