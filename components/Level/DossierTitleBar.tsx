"use client";

import { useAudioStore } from "@/stores/useAudioStore";
import { useT } from "@/hooks/useT";
import { caseDossierModalMessages } from "./CaseDossierModal.messages";

interface DossierTitleBarProps {
  levelId: number;
  isFacingCriminal: boolean;
  onClose: () => void;
}

// Barra de título del tablero: nombre, insignia del caso (o alerta de "frente al criminal") y botón de cierre
export default function DossierTitleBar({ levelId, isFacingCriminal, onClose }: DossierTitleBarProps) {
  const playSfx = useAudioStore((state) => state.playSfx);
  const t = useT(caseDossierModalMessages);

  return (
    <div className="w-full bg-[#060b12] border-b border-[rgba(255,243,199,0.14)] py-2 sm:py-3 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-3 shrink-0 select-none">
      {/* Left section: Window Controls & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-mono font-bold text-xs sm:text-sm text-amber-200 uppercase tracking-wider">
            {t("boardTitle")}
          </h2>
        </div>
      </div>

      {/* Right section: Case Badge, Clues Count & Window Close Button */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {isFacingCriminal ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase bg-red-950/80 border border-red-500/70 text-red-300 animate-pulse">
            <span className="size-2 rounded-full bg-red-500 animate-ping" />
            🚨<span className="hidden sm:inline">{t("facingCriminal")}</span>
          </span>
        ) : (
          <span className="inline-flex px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase bg-amber-500/15 border border-amber-500/35 text-amber-300">
            {t("caseNumber", { n: levelId.toString().padStart(2, "0") })}
          </span>
        )}

        <button
          type="button"
          onClick={onClose}
          onMouseEnter={() => playSfx("typewriter")}
          className="size-10 sm:size-9 rounded-xl bg-[rgba(255,243,199,0.06)] hover:bg-red-950/60 border border-[rgba(255,243,199,0.15)] hover:border-red-500/50 flex items-center justify-center text-[#FFF3C7]/70 hover:text-white transition-all duration-150 cursor-pointer shadow-sm active:scale-95"
          title={t("closeBoard")}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
