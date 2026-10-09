"use client";

import { useAudioStore } from "@/stores/useAudioStore";

type GameButtonProps = {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export default function GameButton({
  icon,
  label,
  onClick,
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
}: GameButtonProps) {
  const isPrimary = variant === "primary";
  const playSfx = useAudioStore((state) => state.playSfx);
  const isDisabled = disabled || loading;

  const handleClick = () => {
    if (isDisabled) return;
    playSfx("click");
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => {
        if (!isDisabled) playSfx("typewriter");
      }}
      disabled={isDisabled}
      className={`
        relative group w-auto p-4 text-xs modern-button flex items-center justify-center rounded-2xl
        backdrop-blur-xs shadow-[0_20px_50px_rgba(0,0,0,0.6)]
        tracking-wider font-semibold
        transition-all duration-200 select-none
        ${
          isDisabled
            ? "opacity-50 cursor-not-allowed pointer-events-none bg-[rgba(20,30,42,0.4)] border border-[rgba(255,243,199,0.1)] text-[#FFF3C7]/40"
            : isPrimary
            ? "bg-gradient-to-b from-[rgba(38,58,82,0.88)] to-[rgba(20,32,48,0.88)] border border-[rgba(255,243,199,0.35)] text-[#FFF3C7] shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,243,199,0.25)] hover:from-[rgba(50,76,108,0.95)] hover:to-[rgba(28,45,68,0.95)] hover:border-[#E1C380] hover:shadow-[0_20px_50px_rgba(0,0,0,0.75),0_0_20px_rgba(225,195,128,0.3)] cursor-pointer"
            : "bg-[rgba(20,30,42,0.4)] border border-[rgba(255,243,199,0.14)] text-[#FFF3C7]/75 hover:bg-[rgba(255,243,199,0.08)] hover:text-[#FFF3C7] hover:border-[rgba(255,243,199,0.35)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)] cursor-pointer"
        }
        ${className}
      `}
    >
      {/* Loading Spinner or Icon */}
      {loading ? (
        <span className="inline-flex items-center mr-2 animate-spin">
          <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        </span>
      ) : (
        icon && (
          <span className="absolute left-4 opacity-0 translate-x-[-4px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 icon-float">
            {icon}
          </span>
        )
      )}

      <span className="pointer-events-none">
        {loading ? "PROCESANDO..." : label}
      </span>
    </button>
  );
}
