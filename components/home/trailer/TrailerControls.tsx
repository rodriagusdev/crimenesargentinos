"use client";

import { trailerScreenMessages } from "./TrailerScreen.messages";
import { useT } from "@/hooks/useT";
import { useTimelineElapsed, type TrailerState } from "@/hooks/useTrailerTimeline";

type TrailerControlsProps = {
  state: TrailerState;
  total: number;
  starts: number[];
  onToggle: () => void;
  onSkip: () => void;
};

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

// Barra de reproductor: pausa, progreso con marcas por escena, tiempo y saltar
export default function TrailerControls({ state, total, starts, onToggle, onSkip }: TrailerControlsProps) {
  const t = useT(trailerScreenMessages);
  const playing = state.phase === "playing";
  return (
    <div className="absolute bottom-0 inset-x-0 z-20 flex items-center gap-3 sm:gap-4 px-3 sm:px-6 h-[9vh] min-h-14 text-[#FFF3C7]">
      <button
        type="button"
        onClick={onToggle}
        className="shrink-0 size-11 flex items-center justify-center rounded-full border border-[#FFF3C7]/40 hover:border-[#E1C380] cursor-pointer"
        aria-label={playing ? t("pause") : t("resume")}
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          {playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4v16l13-8z" />}
        </svg>
      </button>

      <TrailerProgress state={state} total={total} starts={starts} label={t("progress")} />

      <button type="button" onClick={onSkip} className="shrink-0 px-3 py-3 text-[10px] sm:text-[9px] text-[#FFF3C7]/70 hover:text-[#E1C380] cursor-pointer">
        {t("skip")}
      </button>
    </div>
  );
}

// Progreso y tiempo: lo único que se refresca en cada tick del reloj
function TrailerProgress({ state, total, starts, label }: { state: TrailerState; total: number; starts: number[]; label: string }) {
  const elapsed = useTimelineElapsed(state, total);
  return (
    <>
      <div
        className="relative flex-1 h-1.5 rounded-full bg-[#FFF3C7]/20 overflow-hidden"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={Math.round(total / 1000)}
        aria-valuenow={Math.round(elapsed / 1000)}
      >
        <div className="absolute inset-y-0 left-0 bg-[#c81e1e]" style={{ width: `${(elapsed / total) * 100}%` }} />
        {starts.slice(1).map((s) => (
          <span key={s} className="absolute inset-y-0 w-0.5 bg-black/70" style={{ left: `${(s / total) * 100}%` }} />
        ))}
      </div>

      <span className="shrink-0 font-mono text-xs sm:text-sm tabular-nums text-[#FFF3C7]/70">
        {fmt(elapsed)} / {fmt(total)}
      </span>
    </>
  );
}
