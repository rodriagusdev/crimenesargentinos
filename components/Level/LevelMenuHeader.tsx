"use client";

import { useT } from "@/hooks/useT";
import { levelMenuMessages } from "./LevelMenu.messages";

interface LevelMenuHeaderProps {
  levelId: number;
  currentTime: number;
  currentPI: number;
  isOpen: boolean;
  onToggle: () => void;
}

// Cabecera plegable del menú: número de caso, tiempo y puntos restantes, y flecha de abrir/cerrar
export default function LevelMenuHeader({ levelId, currentTime, currentPI, isOpen, onToggle }: LevelMenuHeaderProps) {
  const t = useT(levelMenuMessages);

  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 sm:px-5 py-2 sm:py-3.5 border-b border-[rgba(255,243,199,0.12)] hover:bg-[rgba(255,243,199,0.06)] transition-colors duration-200 cursor-pointer gap-3"
    >
      <div className="flex flex-col text-left shrink-0">
        <span className="text-[10px] uppercase tracking-wider text-[#E1C380]/80 font-mono font-semibold">
          {t("caseNumber", { n: levelId.toString().padStart(2, "0") })}
        </span>
        <h1 className="text-[10px] sm:text-sm font-bold text-[#FFF3C7] leading-tight">
          {t("investigation")}
        </h1>
      </div>

      {/* Recursos de investigación siempre visibles */}
      <div className="flex items-center gap-2 sm:gap-3 bg-[rgba(10,15,25,0.55)] px-2 sm:px-3 py-1.5 rounded-xl border border-[rgba(255,243,199,0.12)] font-mono">
        {/* TIEMPO */}
        <div className="flex items-center gap-1.5" title={t("hoursLeft")}>
          <span className="text-xs">⏳</span>
          <span
            className={`text-[10px] sm:text-xs font-bold ${
              currentTime <= 12
                ? "text-red-400 animate-pulse"
                : "text-[#FFF3C7]"
            }`}
          >
            {currentTime}<span className="hidden sm:inline">{t("hoursUnit")}</span>
          </span>
        </div>

        <div className="h-3.5 w-[1px] bg-[rgba(255,243,199,0.15)]" />

        {/* PUNTOS DE INVESTIGACIÓN */}
        <div className="flex items-center gap-1.5" title={t("pointsTitle")}>
          <span className="text-xs">🔍</span>
          <span
            className={`text-[10px] sm:text-xs font-bold ${
              currentPI <= 30
                ? "text-red-400 animate-pulse"
                : "text-[#FFF3C7]"
            }`}
          >
            {currentPI}<span className="hidden sm:inline">{t("pointsUnit")}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center size-6 rounded-lg bg-[rgba(255,243,199,0.05)] border border-[rgba(255,243,199,0.1)] shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`size-3.5 text-[#E1C380]/70 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>
  );
}
