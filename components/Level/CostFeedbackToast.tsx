"use client";

interface CostFeedbackToastProps {
  cost: {
    time: number;
    pi: number;
  } | null;
  unlockedClue?: string | null;
}

export default function CostFeedbackToast({
  cost,
  unlockedClue,
}: CostFeedbackToastProps) {
  if (!cost && !unlockedClue) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] pointer-events-none select-none transition-all duration-300 flex flex-col items-center gap-2">
      {cost && (
        <div className="px-5 py-2.5 rounded-2xl backdrop-blur-md bg-[rgba(20,10,15,0.92)] border border-red-500/50 shadow-[0_12px_35px_rgba(0,0,0,0.85)] flex items-center gap-3 animate-pulse">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
            <span className="text-cyan-300">-{cost.pi} PUNTOS DE INVESTIGACIÓN</span>
            <span className="text-[#FFF3C7]/40">|</span>
            <span className="text-amber-300">-{cost.time} HS</span>
          </div>
        </div>
      )}

      {unlockedClue && (
        <div className="px-5 py-2.5 rounded-2xl backdrop-blur-md bg-[rgba(15,25,35,0.95)] border border-amber-400/60 shadow-[0_12px_35px_rgba(225,195,128,0.25)] flex items-center gap-2.5">
          <span className="text-lg">🔍</span>
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase font-bold text-[#E1C380] tracking-wider">
              ¡Se añadió informacion a Pistas!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

