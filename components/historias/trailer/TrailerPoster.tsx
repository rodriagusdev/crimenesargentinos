"use client";

import Image from "next/image";
import Link from "next/link";
import TrailerFilmStrip from "./TrailerFilmStrip";
import styles from "./trailer.module.css";
import GameBackdrop, { GAME_BG } from "@/components/galeria/GameBackdrop";

type TrailerPosterProps = {
  ended: boolean;
  seconds: number;
  onPlay: () => void;
};

const PLAY_ICON = (
  <svg className="size-5 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M7 4v16l13-8z" />
  </svg>
);

// Póster del tráiler (antes de verlo) y placa final (después): logo, tira de película con los casos y los botones
export default function TrailerPoster({ ended, seconds, onPlay }: TrailerPosterProps) {
  return (
    <div className={`relative min-h-svh flex flex-col overflow-hidden text-[#FFF3C7] ${GAME_BG}`}>
      <GameBackdrop glow={ended ? "200,30,30" : "245,158,11"} />
      <div
        className={`${styles.projector} pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[140%] sm:w-[70%] h-full bg-[radial-gradient(ellipse_at_top,rgba(255,243,199,0.12),transparent_65%)]`}
        aria-hidden
      />
      <div className="splash-grain pointer-events-none absolute -inset-[50%]" aria-hidden />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 sm:gap-7 px-4 pt-20 pb-12 text-center">
        <p className="text-[9px] sm:text-[11px] tracking-[0.3em] text-[#E1C380]/80">
          {ended ? "FIN DEL TRÁILER" : "LA CENTRAL PRESENTA"}
        </p>

        <Image src="/images/logofinal.png" alt="Crímenes Argentinos" width={600} height={400} priority className="w-[min(78vw,420px)] h-auto" />

        <TrailerFilmStrip className="w-screen -my-1 -rotate-2" />

        {ended ? (
          <>
            <h1 className="text-base sm:text-2xl leading-relaxed [text-shadow:0_4px_0_#1E2A36]">¿Te animás, agente?</h1>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link href="/login?registro" className="px-6 py-4 rounded-xl bg-[#c81e1e] hover:bg-[#a51818] text-xs">
                JUGAR AHORA
              </Link>
              <Link href="/reglas" className="px-6 py-4 rounded-xl border-2 border-[#E1C380] hover:bg-[#E1C380]/10 text-xs">
                VER REGLAS
              </Link>
              <button type="button" onClick={onPlay} className="px-6 py-4 rounded-xl text-xs text-[#FFF3C7]/70 hover:text-[#E1C380] cursor-pointer">
                ↺ VOLVER A VER
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-sm sm:text-xl leading-relaxed tracking-[0.15em] [text-shadow:0_4px_0_#1E2A36]">
              OCHO CASOS. UN SOLO DETECTIVE.
            </h1>
            <button
              type="button"
              onClick={onPlay}
              className="group flex items-center gap-4 pl-5 pr-7 py-4 rounded-full bg-[#c81e1e] hover:bg-[#a51818] shadow-[0_0_40px_rgba(200,30,30,0.45)] cursor-pointer"
            >
              <span className="size-12 flex items-center justify-center rounded-full bg-[#FFF3C7] text-[#c81e1e] transition-transform group-hover:scale-110">
                {PLAY_ICON}
              </span>
              <span className="text-xs sm:text-sm">VER TRÁILER</span>
            </button>
            <p className="font-mono text-sm text-[#FFF3C7]/60">{seconds} segundos · con sonido · espacio para pausar</p>
          </>
        )}
      </main>
    </div>
  );
}
