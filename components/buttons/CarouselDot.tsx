"use client";

import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";

const messages = defineMessages({
  es: { goToLevel: "Ir al Nivel {n} ({state})", completed: "resuelto", current: "habilitado", locked: "bloqueado" },
  en: { goToLevel: "Go to Level {n} ({state})", completed: "solved", current: "unlocked", locked: "locked" },
});

export type CarouselDotState = "completed" | "current" | "locked";

interface Props {
  number: number;
  state: CarouselDotState;
  active: boolean; // solo el nivel seleccionado/clicado actualmente
  onClick: () => void;
}

const baseStyles: Record<CarouselDotState, { idle: string; active: string }> = {
  completed: {
    idle: "border-emerald-600/70 bg-[#0c1421] text-emerald-400 hover:border-emerald-400 hover:text-emerald-300",
    active:
      "border-emerald-400 bg-[#0c1421] text-emerald-300 ring-2 ring-emerald-400 ring-offset-1 sm:ring-offset-2 ring-offset-[#0c1421] shadow-[0_0_14px_rgba(16,185,129,0.5)] font-bold z-10",
  },
  current: {
    idle: "border-amber-500/60 bg-[#0c1421] text-amber-300/80 hover:border-amber-400 hover:text-amber-200",
    active:
      "border-amber-400 bg-[#0c1421] text-amber-300 ring-2 ring-amber-400 ring-offset-1 sm:ring-offset-2 ring-offset-[#0c1421] shadow-[0_0_14px_rgba(245,158,11,0.55)] font-bold z-10",
  },
  locked: {
    idle: "border-slate-800 bg-[#0c1421] text-slate-600 hover:border-slate-700 hover:text-slate-500",
    active:
      "border-slate-600 bg-[#0c1421] text-slate-400 ring-2 ring-slate-600 ring-offset-1 sm:ring-offset-2 ring-offset-[#0c1421] shadow-[0_0_10px_rgba(148,163,184,0.3)] font-bold z-10",
  },
};

// Ficha del paginador de niveles: tamaño uniforme, sin iconos, números retro.
// Verde para resueltos, amarillo para jugables, gris para bloqueados.
// Solo la ficha activa (clicada o visible actual) muestra el anillo de selección exterior.
export default function CarouselDot({ number, state, active, onClick }: Props) {
  const styles = baseStyles[state];
  const t = useT(messages);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("goToLevel", { n: number, state: t(state) })}
      aria-current={active}
      className={`
        relative flex items-center justify-center size-8 sm:size-11 shrink-0 rounded-lg sm:rounded-xl border-2 cursor-pointer
        font-['Press_Start_2P'] text-[10px] sm:text-sm transition-all duration-150 select-none
        ${active ? styles.active : styles.idle}
      `}
    >
      <span>{number}</span>
    </button>
  );
}
