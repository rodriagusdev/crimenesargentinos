"use client";

import GameButton from "../buttons/GameButton";

interface LevelScreenTopBarProps {
  label: string;
  badgeText: string;
  onBack: () => void;
  disabled?: boolean;
  showDot?: boolean;
}

export function LevelScreenTopBar({
  label,
  badgeText,
  onBack,
  disabled = false,
}: LevelScreenTopBarProps) {
  return (
    <div className="relative z-20 p-4 md:p-6 flex items-center justify-end">
      <div className="flex flex-row-reverse gap-2 md:gap-4">
        <GameButton
          icon=""
          label={label}
          onClick={onBack}
          variant="secondary"
          disabled={disabled}
        />

        <div className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-2xl backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-[#FFF3C7]">
          <span className="text-xs uppercase tracking-widest text-[#E1C380] font-semibold font-mono">
            {badgeText}
          </span>
        </div>
      </div>
    </div>
  );
}
