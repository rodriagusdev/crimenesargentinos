"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "@/stores/useAudioStore";
import { useT } from "@/hooks/useT";
import { cronicaDefeatNewspaperMessages } from "./CronicaDefeatNewspaper.messages";

interface CronicaDefeatNewspaperProps {
  levelId: number;
  gameOverReason: "time" | "pi" | "arrest" | "nowarrant" | null;
  hoursTaken: number;
  onRestart: () => void;
  onClose: () => void;
}

export default function CronicaDefeatNewspaper({
  levelId,
  gameOverReason,
  hoursTaken,
  onRestart,
  onClose,
}: CronicaDefeatNewspaperProps) {
  const playSfx = useAudioStore((state) => state.playSfx);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useT(cronicaDefeatNewspaperMessages);

  // Sound effect on defeat reveal
  useEffect(() => {
    try {
      playSfx("losing");
    } catch {}
  }, [playSfx]);

  // Headline & Narrative mapping based on failure reason
  const reason = gameOverReason === "time" || gameOverReason === "pi" || gameOverReason === "nowarrant" ? gameOverReason : "arrest";
  const content = {
    kicker: t(`${reason}Kicker`),
    headline: t(`${reason}Headline`),
    lead: t(`${reason}Lead`),
    statusText: t(`${reason}Status`),
    reasonText: t(`${reason}Reason`),
    stampText: t(`${reason}Stamp`),
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-hidden select-none font-sans animate-fade-in">
      {/* Top Floating Action Bar */}
      <div className="w-full max-w-3xl lg:max-w-4xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-0 mb-2 shrink-0">
        <div className="flex items-center gap-2 text-red-400 font-mono text-xs tracking-wider uppercase">
          <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span>{t("caseFailed", { n: String(levelId).padStart(2, "0") })}</span>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onRestart}
            className="flex-1 sm:flex-none justify-center min-h-9 sm:min-h-0 flex items-center gap-1.5 sm:gap-2 rounded-xl border border-yellow-500/60 bg-gradient-to-b from-[#3a2810] to-[#1a1205] px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold tracking-wider text-yellow-200 shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:border-yellow-300 hover:scale-105 active:scale-95 transition-all"
          >
            <span>🔄</span>
            <span>{t("retry")}</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 sm:flex-none justify-center min-h-9 sm:min-h-0 flex items-center gap-1.5 sm:gap-2 rounded-xl border border-stone-600/60 bg-gradient-to-b from-stone-900 to-black px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold tracking-wider text-stone-300 shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:border-stone-400 hover:scale-105 active:scale-95 transition-all"
          >
            <span>✕</span>
            <span>{t("backToMenu")}</span>
          </button>
        </div>
      </div>

      {/* The Iconic Alerta Conurbano Defeat Newspaper Sheet */}
      <div
        ref={containerRef}
        className="relative w-full max-w-3xl lg:max-w-4xl bg-[#f5eee0] text-[#1c1815] rounded-sm p-3 sm:p-4 md:p-4 lg:p-5 shadow-[0_25px_70px_rgba(0,0,0,0.95)] border-3 sm:border-4 border-[#1c1815] flex flex-col gap-1.5 sm:gap-2 min-h-0 max-h-[calc(100svh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden sm:[@media(min-height:501px)]:overflow-hidden justify-between"
        style={{
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.9), inset 0 0 50px rgba(180, 140, 80, 0.15)",
        }}
      >
        {/* Newspaper Top Dateline */}
        <div className="flex items-center justify-between gap-2 border-b border-[#1c1815] pb-0.5 sm:pb-1 text-[10px] md:text-xs font-mono font-bold tracking-wider text-[#1c1815] shrink-0">
          <span>{t("dateline")}</span>
          <span className="shrink-0">{t("price")}</span>
        </div>

        {/* Iconic Alerta Conurbano Red Masthead */}
        <div className="bg-[#c51c1c] text-white py-1.5 sm:py-2 md:py-2.5 px-3 sm:px-4 text-center rounded-sm border-2 sm:border-3 border-[#1c1815] shadow-inner shrink-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black font-sans tracking-tight leading-none uppercase drop-shadow-md whitespace-nowrap">
            ALERTA CONURBANO
          </h1>
          <p className="text-[10px] md:text-xs font-mono font-bold text-yellow-200 mt-0.5 sm:mt-1 tracking-widest uppercase">
            &ldquo;{t("tagline")}&rdquo; · {t("circulation")}
          </p>
        </div>

        {/* Sub-bar / Division Bar */}
        <div className="flex items-center justify-between gap-2 border-y border-[#1c1815] py-0.5 sm:py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#1c1815] shrink-0">
          <span>{t("caseArchived", { n: String(levelId).padStart(2, "0") })}</span>
          <span className="hidden sm:inline text-[#c51c1c] font-black">{t("federalPolice")}</span>
          <span>{t("redAlert")}</span>
        </div>

        {/* Giant Main Headline */}
        <div className="text-center py-0.5 sm:py-1 shrink-0">
          <span className="text-[10px] md:text-xs font-black tracking-widest text-[#c51c1c] uppercase block">
            {content.kicker}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight uppercase text-black mt-0.5">
            {content.headline}
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm italic font-serif text-[#44403c] mt-0.5 max-w-2xl mx-auto sm:line-clamp-1">
            {content.lead}
          </p>
        </div>

        {/* Two-Column Newspaper Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-4 border-t-2 border-[#1c1815] pt-1.5 sm:pt-2 md:pt-3 flex-none sm:[@media(min-height:501px)]:flex-1 min-h-0 items-stretch">
          {/* Left Column: Mystery Fugitive Silhouette with PRÓFUGO Stamp */}
          <div className="flex flex-col items-center justify-between min-h-0">
            <div className="relative w-full max-w-[220px] sm:max-w-[250px] md:max-w-[260px] h-full max-h-[140px] sm:max-h-[165px] md:max-h-[185px] lg:max-h-[220px] aspect-[4/5] bg-[#ded6c7] border-2 sm:border-3 border-[#1c1815] overflow-hidden flex items-center justify-center shadow-inner mx-auto">
              {/* Background height lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 sm:py-3 pointer-events-none opacity-30">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full border-b border-black" />
                ))}
              </div>

              {/* Shady Suspect Silhouette Vector */}
              <svg
                viewBox="0 0 100 120"
                className="w-3/4 h-3/4 text-stone-800/80 fill-current drop-shadow-md"
              >
                {/* Fedora hat */}
                <path d="M15 48 C 25 35, 75 35, 85 48 C 95 50, 75 52, 50 52 C 25 52, 5 50, 15 48 Z" />
                <path d="M30 46 C 30 25, 70 25, 70 46 Z" />
                {/* Head outline */}
                <circle cx="50" cy="58" r="16" />
                {/* Trenchcoat shoulders */}
                <path d="M20 120 L 25 80 L 38 72 L 50 78 L 62 72 L 75 80 L 80 120 Z" />
              </svg>

              {/* The Iconic Red PRÓFUGO / ERROR Stamp */}
              <div className="absolute z-10 -rotate-12 border-2 sm:border-3 md:border-4 border-red-700 bg-red-700/20 backdrop-blur-[1px] px-2.5 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded shadow-[0_0_20px_rgba(185,28,28,0.6)]">
                <div className="border border-red-700 px-2 sm:px-2.5 py-0.5">
                  <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black font-sans tracking-widest text-red-700 uppercase">
                    {content.stampText}
                  </span>
                </div>
              </div>
            </div>

            <span className="text-[10px] md:text-xs font-mono font-bold text-center mt-1 uppercase text-[#44403c] truncate w-full">
              {t("exclusivePhoto")}
            </span>
          </div>

          {/* Right Column: Police Report & Failure Stats */}
          <div className="flex flex-col justify-between gap-1 sm:gap-1.5 md:gap-2 min-h-0">
            <div className="border-2 border-[#1c1815] bg-white p-2 sm:p-2.5 md:p-3 rounded-sm shadow-sm flex flex-col justify-between">
              <div className="bg-[#1c1815] text-[#fef08a] px-2 py-0.5 text-center text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider mb-1 sm:mb-1.5">
                {t("failedReport")}
              </div>

              <div className="grid grid-cols-2 gap-x-2.5 sm:gap-x-3 gap-y-1 sm:gap-y-1.5 text-left">
                <div>
                  <span className="text-[10px] sm:text-[9px] font-bold text-[#78716c] uppercase block">
                    {t("caseStatus")}
                  </span>
                  <span className="text-[11px] sm:text-xs md:text-sm font-black text-red-700 uppercase block truncate">
                    {content.statusText}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] sm:text-[9px] font-bold text-[#78716c] uppercase block">
                    {t("timeSpent")}
                  </span>
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-black">
                    {t("hours", { n: hoursTaken })}
                  </span>
                </div>

                <div className="border-t border-[#e7e5e4] pt-0.5 sm:pt-1">
                  <span className="text-[10px] sm:text-[9px] font-bold text-[#78716c] uppercase block">
                    {t("closingReason")}
                  </span>
                  <span className="text-[11px] sm:text-xs md:text-sm font-black text-stone-800 uppercase block truncate">
                    {content.reasonText}
                  </span>
                </div>

                <div className="border-t border-[#e7e5e4] pt-0.5 sm:pt-1">
                  <span className="text-[10px] sm:text-[9px] font-bold text-[#78716c] uppercase block">
                    {t("assignedRank")}
                  </span>
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-red-700 tracking-wider block">
                    F
                  </span>
                </div>
              </div>
            </div>

            {/* Editorial Article Box */}
            <div className="bg-[#e7ded0] p-1.5 sm:p-2 md:p-2.5 border border-[#1c1815] text-[10px] sm:text-[11px] md:text-xs font-serif leading-snug text-[#292524] sm:line-clamp-3">
              <span className="font-bold block mb-0.5 uppercase text-[10px] font-mono">
                {t("editorialTitle")}
              </span>
              {t("editorialBody")}
            </div>
          </div>
        </div>

        {/* Newspaper Footer / Headlines */}
        <div className="border-t-2 border-[#1c1815] pt-1 sm:pt-1.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-0.5 sm:gap-3 text-[10px] md:text-xs text-[#44403c] font-mono shrink-0">
          <div className="flex items-center gap-2 truncate max-w-full">
            <span className="font-bold text-black uppercase">
              {t("internalAffairs")}
            </span>
            <span className="hidden sm:inline">{t("federalPoliceFooter")}</span>
          </div>

          <div className="font-bold text-[#c51c1c] uppercase tracking-wider text-left sm:text-right truncate max-w-full">
            {t("slogan")}
          </div>
        </div>
      </div>
    </div>
  );
}
