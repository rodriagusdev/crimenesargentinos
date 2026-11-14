"use client";

import Image from "next/image";
import Link from "next/link";
import PlayerChrome from "./PlayerChrome";
import { CASE_SCENES } from "./caseTrailer";
import type { CaseStory } from "@/lib/caseStories";
import type { TrailerState } from "@/hooks/useTrailerTimeline";
import styles from "./vhs.module.css";

type Props = {
  /** Ocupa toda la pantalla: la tele se agranda lo más posible sin salirse a lo alto */
  fullscreen: boolean;
  story: CaseStory | null;
  number: number;
  state: TrailerState;
  scene: number;
  sceneElapsed: number;
  elapsed: number;
  /** Duración del tráiler e inicio de cada escena (barra de progreso a pantalla completa) */
  duration: number;
  starts: number[];
  /** Total de cintas */
  tapes: number;
  onToggle: () => void;
  onSkip: () => void;
  onPrev: () => void;
  onNext: () => void;
  onEject: () => void;
};

const counter = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `0:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

// Televisor de tubo con videocasetera (reproduciendo a pantalla completa, solo el video): muestra el tráiler del caso elegido con la estética de VHS
// (indicador ▶ PLAY, contador de cinta, banda de tracking) y, al terminar, la placa para tomar el caso
export default function VhsTelevision(props: Props) {
  const { fullscreen, story, number, state, scene, sceneElapsed, elapsed, onToggle, onSkip, onNext, onEject } = props;
  const showing = story && (state.phase === "playing" || state.phase === "paused");
  const ended = story && state.phase === "ended";

  return (
    <div
      className={
        fullscreen
          ? "w-full"
          : "w-full rounded-[28px] bg-[linear-gradient(180deg,#5a4630,#3b2e20)] p-3 sm:p-5 shadow-[0_30px_60px_rgba(0,0,0,0.75)] border-4 border-[#2a2017]"
      }
      // Reproduciendo, solo el video: lo más grande que entre en 16:9 sin salirse a lo alto
      style={fullscreen ? { maxWidth: "calc(100svh * 16 / 9)" } : undefined}
    >
      <div className={fullscreen ? "group relative" : "grid gap-3 sm:gap-5 sm:grid-cols-[1fr_auto] items-center"}>
        {/* Pantalla */}
        <div
          className={
            fullscreen
              ? "relative aspect-video overflow-hidden bg-black"
              : "relative aspect-video overflow-hidden rounded-[22px] bg-[#0a0d12] shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] border-4 border-[#1b1510]"
          }
        >
          {showing && (
            <div key={`${story.id}-${scene}`} className={`absolute inset-0 ${scene === 0 ? styles.powerOn : ""}`}>
              <div className={`absolute inset-0 ${styles.jitter}`}>{CASE_SCENES[scene].render(story, number)}</div>
            </div>
          )}

          {!story && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-[#7fd1ff]/80">
              <span className={`text-xs sm:text-sm ${styles.blink}`}>SIN SEÑAL</span>
              <span className="font-mono text-sm text-white/60">Elegí una cinta del estante</span>
            </div>
          )}

          {ended && (
            <div className={`absolute inset-0 ${styles.fadeUp}`}>
              {/* Imagen de cierre del caso (si tiene) de fondo, apenas pixelada, y un velo para leer el texto */}
              {story.trailerArt?.finale && (
                <Image src={story.trailerArt.finale} alt="" fill unoptimized className="object-cover [image-rendering:pixelated]" />
              )}
              <div className={`absolute inset-0 ${story.trailerArt?.finale ? "bg-black/55" : "bg-black/85"}`} aria-hidden />
              <div className="relative flex size-full flex-col items-center justify-center gap-2 sm:gap-4 px-4 text-center">
                <p className="font-serif text-base sm:text-3xl font-black uppercase text-white [text-shadow:0_3px_0_#000]">{story.title}</p>
                <p className="font-mono text-[11px] sm:text-sm text-white/80 [text-shadow:0_2px_0_#000]">El resto del expediente se abre al jugar.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link href="/login?registro" className="px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-[#c81e1e] hover:bg-[#a51818] text-white text-[10px]">
                    TOMAR ESTE CASO
                  </Link>
                  <button type="button" onClick={onNext} className="px-3 py-2 sm:px-4 sm:py-3 rounded-lg border-2 border-[#E1C380] bg-black/40 text-[#FFF3C7] text-[10px] cursor-pointer hover:bg-[#E1C380]/10">
                    SIGUIENTE CINTA ▶
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* A pantalla completa, tocar el video pausa o sigue */}
          {fullscreen && showing && (
            <button type="button" onClick={onToggle} className="absolute inset-0 cursor-pointer" aria-label={state.phase === "playing" ? "Pausar" : "Reproducir"} />
          )}

          {/* Indicadores de la videocasetera en pantalla (a pantalla completa los reemplazan los controles) */}
          {showing && !fullscreen && (
            <div className="pointer-events-none absolute inset-0 font-mono text-white [text-shadow:0_0_4px_rgba(0,0,0,0.9)]">
              <span className={`absolute top-3 left-4 text-sm sm:text-lg ${state.phase === "playing" && sceneElapsed < 2500 && scene === 0 ? styles.blink : ""}`}>
                {state.phase === "playing" ? "▶ PLAY" : "❚❚ PAUSA"}
              </span>
              <span className="absolute bottom-3 right-4 text-sm sm:text-lg">{counter(elapsed)}</span>
              <span className="absolute bottom-3 left-4 text-xs sm:text-sm">SP</span>
            </div>
          )}

          {/* Textura de VHS y del tubo */}
          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.12)_0,rgba(0,0,0,0.12)_1px,transparent_1px,transparent_3px)]" aria-hidden />
          <div className={`pointer-events-none absolute inset-x-0 top-0 ${styles.tracking}`} aria-hidden />
          <div className="pointer-events-none absolute inset-0 rounded-[18px] shadow-[inset_0_0_60px_rgba(0,0,0,0.85)]" aria-hidden />
          {fullscreen && story && (
            <PlayerChrome
              story={story}
              number={number}
              tapes={props.tapes}
              playing={state.phase === "playing"}
              ended={state.phase === "ended"}
              elapsed={elapsed}
              duration={props.duration}
              starts={props.starts}
              onToggle={onToggle}
              onPrev={props.onPrev}
              onNext={onNext}
              onClose={onEject}
            />
          )}
        </div>

        {/* Panel de la videocasetera (solo con la tele; a pantalla completa están los controles del reproductor) */}
        {!fullscreen && (
        <div className="flex sm:flex-col items-center justify-between gap-3 rounded-xl bg-[#2a2017] p-3">
          <div className="hidden sm:flex flex-col gap-3" aria-hidden>
            <span className="size-12 rounded-full bg-[radial-gradient(circle_at_35%_35%,#c9b38a,#5a4630)] border-2 border-[#1b1510]" />
            <span className="size-12 rounded-full bg-[radial-gradient(circle_at_35%_35%,#c9b38a,#5a4630)] border-2 border-[#1b1510]" />
          </div>
          <div className="flex sm:flex-col gap-2">
            {[
              { label: state.phase === "playing" ? "❚❚" : "▶", aria: state.phase === "playing" ? "Pausar" : "Reproducir", onClick: onToggle, disabled: !story || state.phase === "ended" },
              { label: "⏭", aria: "Saltar al final", onClick: onSkip, disabled: !showing },
              { label: "⏏", aria: "Sacar la cinta", onClick: onEject, disabled: !story },
            ].map((b) => (
              <button
                key={b.aria}
                type="button"
                onClick={b.onClick}
                disabled={b.disabled}
                aria-label={b.aria}
                className="size-11 rounded-md bg-[#141518] text-[#e6e9ee] text-base shadow-[0_3px_0_#000] cursor-pointer active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:cursor-default"
              >
                {b.label}
              </button>
            ))}
          </div>
          <span className={`size-2.5 rounded-full ${state.phase === "playing" ? "bg-[#ff3b3b] shadow-[0_0_8px_#ff3b3b]" : "bg-[#4a3a28]"}`} aria-hidden />
        </div>
        )}
      </div>
    </div>
  );
}
