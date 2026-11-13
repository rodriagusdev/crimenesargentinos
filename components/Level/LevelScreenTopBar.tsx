"use client";

import GameButton from "../buttons/GameButton";

interface LevelScreenTopBarProps {
  label: string;
  badgeText: string;
  onBack: () => void;
  disabled?: boolean;
  showDot?: boolean;
}

// En celular el texto completo ("VOLVER AL MAPA DE LA PROVINCIA") no entra con la fuente pixelada
function toShortLabel(label: string): string {
  return label.replace(/^(VOLVER AL|BACK TO)\s+/i, "← ");
}

export function LevelScreenTopBar({
  label,
  badgeText,
  onBack,
  disabled = false,
}: LevelScreenTopBarProps) {
  return (
    <div className="relative z-20 px-3 pt-1 pb-2 sm:p-4 md:p-6 [@media(max-height:500px)_and_(pointer:coarse)]:p-3 flex items-center justify-end">
      <div className="flex flex-row-reverse gap-2 md:gap-4 min-w-0">
        {/* Celular: etiqueta corta y más compacta */}
        <div className="sm:hidden">
          <GameButton
            icon=""
            label={toShortLabel(label)}
            onClick={onBack}
            variant="secondary"
            disabled={disabled}
            className="max-sm:px-3 max-sm:py-3 max-sm:text-[10px]"
          />
        </div>
        <div className="hidden sm:block">
          <GameButton
            icon=""
            label={label}
            onClick={onBack}
            variant="secondary"
            disabled={disabled}
          />
        </div>

        <div className="hidden sm:flex [@media(max-height:500px)_and_(pointer:coarse)]:hidden items-center gap-2 px-3 md:px-4 py-2 rounded-2xl backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-[#FFF3C7]">
          <span className="text-xs uppercase tracking-widest text-[#E1C380] font-semibold font-mono">
            {badgeText}
          </span>
        </div>
      </div>
    </div>
  );
}
