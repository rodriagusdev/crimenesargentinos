"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ISuspect } from "@/models/ISuspect";
import { useAudioStore } from "@/stores/useAudioStore";
import { resolveSuspectImage } from "@/lib/suspectImages";

interface CronicaVictoryNewspaperProps {
  levelId: number;
  suspect: ISuspect | null;
  provinceName: string;
  score: number;
  hoursTaken: number;
  remainingPI: number;
  rank: string;
  onClose: () => void;
}

export default function CronicaVictoryNewspaper({
  levelId,
  suspect,
  provinceName,
  score,
  hoursTaken,
  remainingPI,
  rank,
  onClose,
}: CronicaVictoryNewspaperProps) {
  const playSfx = useAudioStore((state) => state.playSfx);
  const containerRef = useRef<HTMLDivElement>(null);

  const suspectName = suspect?.name ?? "Sospechoso";
  const suspectImage = resolveSuspectImage(suspect?.name, suspect?.image);

  // Sound effect on reveal
  useEffect(() => {
    try {
      playSfx("winning");
    } catch { }
  }, [playSfx]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-hidden select-none font-sans animate-fade-in">
      {/* Top Floating Action Bar */}
      <div className="w-full max-w-3xl lg:max-w-4xl flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-2 text-yellow-300/80 font-mono text-xs tracking-wider uppercase">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400 font-bold">✓ CASO #{String(levelId).padStart(2, "0")} RESUELTO</span>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-gradient-to-b from-emerald-950/90 to-black/90 px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold tracking-wider text-emerald-200 shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:border-emerald-400 hover:scale-105 active:scale-95 transition-all"
        >
          <span>✕</span>
          <span>VOLVER AL MENÚ</span>
        </button>
      </div>

      {/* The Iconic Alerta Conurbano Newspaper Front Page Sheet */}
      <div
        ref={containerRef}
        className="relative w-full max-w-3xl lg:max-w-4xl bg-[#f5eee0] text-[#1c1815] rounded-sm p-3 sm:p-4 md:p-4 lg:p-5 shadow-[0_25px_70px_rgba(0,0,0,0.95)] border-3 sm:border-4 border-[#1c1815] flex flex-col gap-1.5 sm:gap-2 max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-hidden justify-between"
        style={{
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.9), inset 0 0 50px rgba(180, 140, 80, 0.15)",
        }}
      >
        {/* Newspaper Top Dateline */}
        <div className="flex items-center justify-between border-b border-[#1c1815] pb-0.5 sm:pb-1 text-[9px] sm:text-[10px] md:text-xs font-mono font-bold tracking-wider text-[#1c1815] shrink-0">
          <span>BUENOS AIRES, REPÚBLICA ARGENTINA · EDICIÓN EXTRAORDINARIA N° 19.842</span>
          <span>PRECIO: $ 1.50</span>
        </div>

        {/* Iconic Alerta Conurbano Red Masthead */}
        <div className="bg-[#c51c1c] text-white py-1.5 sm:py-2 md:py-2.5 px-3 sm:px-4 text-center rounded-sm border-2 sm:border-3 border-[#1c1815] shadow-inner shrink-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black font-sans tracking-tight leading-none uppercase drop-shadow-md whitespace-nowrap">
            ALERTA CONURBANO
          </h1>
          <p className="text-[9px] sm:text-[10px] md:text-xs font-mono font-bold text-yellow-200 mt-0.5 sm:mt-1 tracking-widest uppercase">
            &ldquo;FIRME JUNTO AL PUEBLO&rdquo; · EL DIARIO DE MAYOR CIRCULACIÓN
          </p>
        </div>

        {/* Sub-bar / Division Bar */}
        <div className="flex items-center justify-between border-y border-[#1c1815] py-0.5 sm:py-1 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#1c1815] shrink-0">
          <span className="text-emerald-800 font-black">✓ CASO #{String(levelId).padStart(2, "0")} RESUELTO</span>
          <span className="text-[#c51c1c] font-black">POLICÍA FEDERAL ARGENTINA</span>
          <span className="text-emerald-800 font-bold">¡OPERATIVO EXITOSO!</span>
        </div>

        {/* Giant Main Headline */}
        <div className="text-center py-1 sm:py-1.5 shrink-0 bg-emerald-600/[0.08] border-y border-emerald-700/30 px-2 rounded-sm my-0.5 shadow-[inset_0_0_15px_rgba(16,185,129,0.06)]">
          <span className="text-[9px] sm:text-[10px] md:text-xs font-black tracking-widest text-emerald-800 uppercase block">
            ★ ¡VICTORIA DE LA JUSTICIA FEDERAL! · CASO RESUELTO ★
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight uppercase text-emerald-700 sm:text-emerald-800 mt-0.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
            ¡ATRAPADO EN {provinceName}!
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm italic font-serif text-[#44403c] mt-0.5 max-w-2xl mx-auto line-clamp-1">
            La Policía Federal desbarató el plan de escape de{" "}
            <strong>{suspectName}</strong>. Cayó tras un operativo en su escondite.
          </p>
        </div>

        {/* Two-Column Newspaper Layout */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-4 border-t-2 border-[#1c1815] pt-1.5 sm:pt-2 md:pt-3 flex-1 min-h-0 items-stretch">
          {/* Left Column: Suspect Mugshot with Red DETENIDO Stamp */}
          <div className="flex flex-col items-center justify-between min-h-0">
            <div className="relative w-full max-w-[220px] sm:max-w-[250px] md:max-w-[260px] h-full max-h-[140px] sm:max-h-[165px] md:max-h-[185px] lg:max-h-[220px] aspect-[4/5] bg-[#e7ded0] border-2 sm:border-3 border-[#1c1815] overflow-hidden flex items-center justify-center shadow-inner mx-auto">
              {/* Background height lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 sm:py-3 pointer-events-none opacity-30">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full border-b border-black" />
                ))}
              </div>

              {suspectImage ? (
                <Image
                  src={suspectImage}
                  alt={suspectName}
                  fill
                  sizes="320px"
                  className="object-cover grayscale contrast-125"
                />
              ) : (
                <div className="text-xl sm:text-2xl text-black/50 font-mono font-bold">
                  PRONTUARIO
                </div>
              )}

              {/* The Iconic Red DETENIDO Stamp */}
              <div className="absolute z-10 -rotate-12 border-2 sm:border-3 md:border-4 border-red-600 bg-red-600/20 backdrop-blur-[1px] px-2.5 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                <div className="border border-red-600 px-2 sm:px-2.5 py-0.5">
                  <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black font-sans tracking-widest text-red-600 uppercase">
                    DETENIDO
                  </span>
                </div>
              </div>
            </div>

            <span className="text-[9px] sm:text-[10px] md:text-xs font-mono font-bold text-center mt-1 uppercase text-[#44403c] truncate w-full">
              FOTO EXCLUSIVA · {suspectName} BAJO CUSTODIA FEDERAL
            </span>
          </div>

          {/* Right Column: Police Report & Investigation Stats */}
          <div className="flex flex-col justify-between gap-1 sm:gap-1.5 md:gap-2 min-h-0">
            <div className="border-2 border-[#1c1815] bg-white p-2 sm:p-2.5 md:p-3 rounded-sm shadow-sm flex flex-col justify-between">
              <div className="bg-[#1c1815] text-[#fef08a] px-2 py-0.5 text-center text-[9px] sm:text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider mb-1 sm:mb-1.5">
                ACTA DE CAPTURA POLICIAL
              </div>

              <div className="grid grid-cols-2 gap-x-2.5 sm:gap-x-3 gap-y-1 sm:gap-y-1.5 text-left">
                <div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-[#78716c] uppercase block">
                    PUNTAJE OBTENIDO
                  </span>
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-black">
                    {score.toLocaleString("es-AR")}
                  </span>
                </div>

                <div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-[#78716c] uppercase block">
                    TIEMPO INVERTIDO
                  </span>
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-black">
                    {hoursTaken} HS
                  </span>
                </div>

                <div className="border-t border-[#e7e5e4] pt-0.5 sm:pt-1">
                  <span className="text-[8px] sm:text-[9px] font-bold text-[#78716c] uppercase block">
                    PRESUPUESTO SOBRANTE
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-black text-black">
                    {remainingPI} PI
                  </span>
                </div>

                <div className="border-t border-[#e7e5e4] pt-0.5 sm:pt-1">
                  <span className="text-[8px] sm:text-[9px] font-bold text-[#78716c] uppercase block">
                    RANGO ASIGNADO
                  </span>
                  <span
                    className={`text-sm sm:text-base md:text-lg lg:text-xl font-black tracking-wider block ${
                      rank.startsWith("S")
                        ? "text-[#c51c1c]"
                        : rank === "A"
                        ? "text-amber-700"
                        : rank === "B"
                        ? "text-blue-900"
                        : "text-stone-700"
                    }`}
                  >
                    {rank}
                  </span>
                </div>
              </div>
            </div>

            {/* Editorial Article Box */}
            <div className="bg-[#e7ded0] p-1.5 sm:p-2 md:p-2.5 border border-[#1c1815] text-[10px] sm:text-[11px] md:text-xs font-serif leading-snug text-[#292524] line-clamp-2 sm:line-clamp-3">
              <span className="font-bold block mb-0.5 uppercase text-[9px] sm:text-[10px] font-mono">
                DETALLES DEL OPERATIVO:
              </span>
              El detective asignado reconstruyó el trayecto de fuga siguiendo pistas testimoniales en cada provincia, logrando capturar al prófugo en su escondite sin margen de escape.
            </div>
          </div>
        </div>

        {/* Newspaper Footer / Headlines */}
        <div className="border-t-2 border-[#1c1815] pt-1 sm:pt-1.5 flex items-center justify-between gap-3 text-[9px] sm:text-[10px] md:text-xs text-[#44403c] font-mono shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-black uppercase">
              DIVISIÓN INVESTIGACIONES
            </span>
            <span className="hidden sm:inline">· POLICÍA FEDERAL ARGENTINA</span>
          </div>

          <div className="font-bold text-[#c51c1c] uppercase tracking-wider text-right truncate">
            ¡EL CRIMEN NO DESCANSA, LA JUSTICIA TAMPOCO!
          </div>
        </div>
      </div>
    </div>
  );
}
