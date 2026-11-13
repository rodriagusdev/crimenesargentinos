"use client";

import CaseFrontPage from "./CaseFrontPage";
import FrontPageThumb from "./FrontPageThumb";
import { useHemeroteca, type Turn } from "./useHemeroteca";
import { CASE_STORIES } from "@/lib/caseStories";
import GameBackdrop, { CautionBar, GAME_BG } from "@/components/galeria/GameBackdrop";
import styles from "./vespertino.module.css";

const TURN_CLASS: Record<Turn, string> = {
  open: styles.spinIn,
  next: styles.turnNext,
  prev: styles.turnPrev,
  jump: styles.spinIn,
};

const ARROW =
  "rounded border border-[#E1C380]/60 bg-[#070c16]/80 px-3 py-2.5 text-[10px] text-[#E1C380] cursor-pointer hover:bg-[#E1C380]/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E1C380]";

// Propuesta "Tapas de El Vespertino": cada caso es la tapa del diario del día del hecho. Las ocho forman una
// hemeroteca que se hojea con flechas, teclado o deslizando el dedo, con una tira de miniaturas para saltar.
export default function VespertinoScreen() {
  const { index, turn, go, jump, swipe } = useHemeroteca(CASE_STORIES.length);
  const story = CASE_STORIES[index];

  return (
    <div className={`relative ${GAME_BG} min-h-svh overflow-x-clip px-3 sm:px-6 pt-16 pb-10 sm:py-12`}>
      <GameBackdrop glow="245,158,11" />
      <CautionBar className="max-w-4xl" />

      <div className="relative max-w-4xl mx-auto flex flex-col gap-5">
        <header className="text-center">
          <p className="text-[9px] sm:text-[10px] tracking-widest text-[#E1C380]/80">ARCHIVO DE LA REDACCIÓN</p>
          <h1 className="mt-2 text-sm sm:text-xl leading-relaxed text-[#FFF3C7] [text-shadow:0_3px_0_rgba(0,0,0,0.6)]">
            HEMEROTECA DE EL VESPERTINO
          </h1>
          <p className="mt-2 font-mono text-sm text-[#FFF3C7]/70">Ocho casos, ocho tapas. Hojealas con las flechas o deslizando el dedo.</p>
        </header>

        <div className="flex items-center justify-between gap-2">
          <button type="button" onClick={() => go(-1)} className={ARROW} aria-label="Tapa anterior">
            ◀ <span className="hidden sm:inline">ANTERIOR</span>
          </button>
          <span className="font-mono text-sm text-[#E1C380]" aria-live="polite">
            Tapa {index + 1} de {CASE_STORIES.length}
          </span>
          <button type="button" onClick={() => go(1)} className={ARROW} aria-label="Tapa siguiente">
            <span className="hidden sm:inline">SIGUIENTE</span> ▶
          </button>
        </div>

        {/* La pila: ejemplares de abajo y la tapa de arriba, que se da vuelta al hojear */}
        <div className="relative [perspective:1600px] touch-pan-y" {...swipe}>
          <span className="absolute inset-0 translate-x-2.5 translate-y-2.5 rotate-[1.4deg] bg-[#cfc3a6] shadow-[0_12px_30px_rgba(0,0,0,0.6)]" aria-hidden />
          <span className="absolute inset-0 -translate-x-1.5 translate-y-1 -rotate-[0.9deg] bg-[#ddd2b8]" aria-hidden />
          <div key={index} className={`relative -rotate-[0.3deg] ${TURN_CLASS[turn]}`}>
            <CaseFrontPage story={story} />
          </div>
        </div>

        <nav aria-label="Todas las tapas" className="mt-3">
          <h2 className="mb-3 text-center text-[10px] text-[#E1C380]">TODAS LAS TAPAS</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 px-1 pt-2">
            {CASE_STORIES.map((s, i) => (
              <FrontPageThumb key={s.id} story={s} active={i === index} onSelect={() => jump(i)} />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
