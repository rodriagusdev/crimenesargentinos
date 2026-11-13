"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { CASE_STORIES, type CaseStory } from "@/lib/caseStories";
import { audioManager } from "@/lib/audioManager";
import GameBackdrop, { CautionBar, GAME_BG } from "@/components/galeria/GameBackdrop";
import BoardPoster from "./BoardPoster";
import PosterLightbox from "./PosterLightbox";
import styles from "./sebusca.module.css";

type Opened = { phase: "closed" } | { phase: "open" | "closing"; story: CaseStory };

// Restos de carteles viejos arrancados del corcho (posiciones fijas, sin azar en el render)
const SCRAPS = [
  { className: "left-[6%] top-[30%] h-10 w-16 rotate-12" },
  { className: "right-[8%] top-[55%] h-14 w-10 -rotate-6" },
  { className: "left-[40%] bottom-6 h-8 w-20 rotate-3" },
  { className: "right-[30%] top-6 h-6 w-14 -rotate-12" },
];

// Propuesta "Se busca… el objeto (no al ladrón)": un corcho en la calle, bajo un farol que titila, lleno de
// carteles de recompensa de lo que se robó o de quien desapareció. Al pasar se endereza el cartel; al tocarlo se
// despliega en grande con el llamado a jugar. Nunca aparece quien lo hizo.
export default function SeBuscaScreen() {
  const [opened, setOpened] = useState<Opened>({ phase: "closed" });

  const open = (story: CaseStory) => {
    audioManager.play("opencasefile");
    setOpened({ phase: "open", story });
  };
  const close = useCallback(() => {
    audioManager.play("click");
    setOpened((o) => (o.phase === "open" ? { phase: "closing", story: o.story } : o));
  }, []);
  const clear = useCallback(() => setOpened({ phase: "closed" }), []);

  return (
    <div className={`relative ${GAME_BG} min-h-svh overflow-x-clip px-3 pb-14 text-[#FFF3C7] sm:px-6`}>
      <GameBackdrop glow="234,179,8" />
      <CautionBar className="max-w-5xl" />

      <div className="relative mx-auto max-w-5xl pt-24 sm:pt-28">
        {/* Farol de la calle */}
        <div className="pointer-events-none absolute left-1/2 top-4 flex -translate-x-1/2 flex-col items-center sm:top-6" aria-hidden>
          <span className="h-5 w-1 bg-[#1b1b1b]" />
          <span className="h-3 w-12 rounded-t-lg bg-[#2a2a2a]" />
          <span className={`h-3 w-8 rounded-b-full bg-[#ffe9a8] shadow-[0_0_40px_18px_rgba(255,214,120,0.4)] ${styles.lamp}`} />
        </div>

        <header className="mb-8 text-center">
          <p className="text-[9px] tracking-[0.3em] text-[#E1C380] sm:text-[10px]">LA CENTRAL PIDE COLABORACIÓN</p>
          <h1 className={`${styles.slab} mt-3 text-4xl text-[#ffe9b0] drop-shadow-[0_4px_0_#7a4a1f] sm:text-6xl`}>
            <span className={styles.tall}>¡SE BUSCA!</span>
          </h1>
          <p className={`${styles.italic} mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#E1C380] sm:text-base`}>
            No buscamos a quien lo hizo: buscamos lo que se llevó. Tocá un cartel para leerlo de cerca.
          </p>
        </header>

        {/* Corcho con marco de madera */}
        <div className="rounded-xl border-[10px] border-[#4a2e17] shadow-[0_30px_70px_rgba(0,0,0,0.75),inset_0_0_0_2px_#2b1a0d] sm:border-[14px]">
          <div className={`relative overflow-y-auto overflow-x-hidden rounded px-3.5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10 ${styles.cork}`}>
            <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.55)]" aria-hidden />
            {SCRAPS.map((s) => (
              <span key={s.className} className={`pointer-events-none absolute bg-[#d8c8a0]/60 ${s.className}`} aria-hidden />
            ))}

            <div className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-7 sm:gap-y-10 lg:grid-cols-4">
              {CASE_STORIES.map((story, i) => (
                <BoardPoster key={story.id} story={story} order={i} onOpen={() => open(story)} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className={`${styles.italic} text-sm text-[#E1C380] sm:text-base`}>Ocho carteles. Ninguna pista. Todo depende de vos.</p>
          <Link
            href="/login?registro"
            onClick={() => audioManager.play("typewriter")}
            className="border-2 border-[#FFF3C7] bg-[#8a1c12] px-5 py-3.5 text-[10px] leading-relaxed text-[#FFF3C7] shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 sm:text-xs"
          >
            SALIR A BUSCAR · JUGAR
          </Link>
        </div>
      </div>

      {opened.phase !== "closed" && (
        <PosterLightbox key={opened.story.id} story={opened.story} closing={opened.phase === "closing"} onClose={close} onClosed={clear} />
      )}
    </div>
  );
}
