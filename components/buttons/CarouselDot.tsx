"use client";

export type CarouselDotState = "completed" | "current" | "locked";

interface Props {
  number: number;
  state: CarouselDotState;
  active: boolean; // la tarjeta está en la vista del carrusel
  onClick: () => void;
}

const stateClass: Record<CarouselDotState, string> = {
  completed: "border-emerald-500/70 bg-emerald-950/70 text-emerald-300 hover:border-emerald-400",
  current: "border-amber-400 bg-amber-400/15 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.45)] hover:bg-amber-400/25",
  locked: "border-slate-700 bg-[#0a111c] text-slate-500 hover:border-slate-500",
};

const stateLabel: Record<CarouselDotState, string> = {
  completed: "resuelto",
  current: "habilitado",
  locked: "bloqueado",
};

// Ficha del paginador de niveles: ✓ resuelto, número dorado el habilitado, candado los bloqueados.
// La que está en la vista se marca con un borde exterior y se agranda
export default function CarouselDot({ number, state, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ir al (${stateLabel[state]})`}
      aria-current={active}
      className={`
        relative flex items-center justify-center size-8 rounded-md border-2 cursor-pointer
        font-['Press_Start_2P'] text-[9px] transition-all duration-200
        ${stateClass[state]}
        ${active ? "scale-110 ring-2 ring-offset-2 ring-offset-[#080e18] ring-amber-200/60" : "opacity-75 hover:opacity-100"}
      `}
    >
      {state === "completed" ? "✓" : state === "locked" ? "🔒" : number}
    </button>
  );
}
