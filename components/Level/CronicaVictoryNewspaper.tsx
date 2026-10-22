"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ISuspect } from "@/models/ISuspect";
import { useAudioStore } from "@/stores/useAudioStore";

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
  const suspectImage = suspect?.image ?? null;

  // Sound effect on reveal
  useEffect(() => {
    try {
      playSfx("arrest");
    } catch { }
  }, [playSfx]);

  return (
    <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-hidden select-none font-sans animate-fade-in">
      {/* Top Floating Action Bar */}
      <div className="w-full max-w-3xl lg:max-w-4xl flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-2 text-yellow-300/80 font-mono text-xs tracking-wider uppercase">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>CASO #{String(levelId).padStart(2, "0")} CLAUSURADO</span>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-xl border border-red-500/50 bg-gradient-to-b from-red-950/90 to-black/90 px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold tracking-wider text-red-200 shadow-[0_10px_25px_rgba(0,0,0,0.6)] hover:border-red-400 hover:scale-105 active:scale-95 transition-all"
        >
          <span>✕</span>
          <span>VOLVER AL MENÚ</span>
        </button>
      </div>

      {/* The Iconic Alerta Conurbano Newspaper Front Page Sheet */}
      <div
        ref={containerRef}
        className="relative w-full max-w-3xl lg:max-w-4xl bg-[#f5eee0] text-[#1c1815] rounded-sm p-4 sm:p-5 shadow-[0_25px_70px_rgba(0,0,0,0.95)] border-4 border-[#1c1815] flex flex-col gap-2 max-h-[calc(100vh-4.5rem)] overflow-hidden justify-between"
        style={{
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.9), inset 0 0 50px rgba(180, 140, 80, 0.15)",
        }}
      >
        {/* Newspaper Top Dateline */}
        <div className="flex items-center justify-between border-b border-[#1c1815] pb-1 text-[10px] sm:text-xs font-mono font-bold tracking-wider text-[#1c1815] shrink-0">
          <span>BUENOS AIRES, REPÚBLICA ARGENTINA · EDICIÓN EXTRAORDINARIA N° 19.842</span>
          <span>PRECIO: $ 1.50</span>
        </div>

        {/* Iconic Alerta Conurbano Red Masthead */}
        <div className="bg-[#c51c1c] text-white py-2 sm:py-3 px-4 text-center rounded-sm border-2 sm:border-3 border-[#1c1815] shadow-inner shrink-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-sans tracking-tight leading-none uppercase drop-shadow-md whitespace-nowrap">
            ALERTA CONURBANO
          </h1>
          <p className="text-[10px] sm:text-xs font-mono font-bold text-yellow-200 mt-1 tracking-widest uppercase">
            &ldquo;FIRME JUNTO AL PUEBLO&rdquo; · EL DIARIO DE MAYOR CIRCULACIÓN
          </p>
        </div>

        {/* Sub-bar / Division Bar */}
        <div className="flex items-center justify-between border-y border-[#1c1815] py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#1c1815] shrink-0">
          <span>CASO #{String(levelId).padStart(2, "0")} RESUELTO</span>
          <span className="text-[#c51c1c] font-black">POLICÍA FEDERAL ARGENTINA</span>
          <span>COMUNICADO OFICIAL</span>
        </div>

        {/* Giant Main Headline */}
        <div className="text-center py-1 shrink-0">
          <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#c51c1c] uppercase block">
            ÚLTIMO MOMENTO · JUSTICIA FEDERAL
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase text-black mt-0.5">
            ¡ATRAPADO EN {provinceName}!
          </h2>
          <p className="text-xs sm:text-sm italic font-serif text-[#44403c] mt-0.5 max-w-2xl mx-auto line-clamp-1">
            La Policía Federal desbarató el plan de escape de{" "}
            <strong>{suspectName}</strong>. Cayó tras un operativo en su escondite.
          </p>
        </div>

        {/* Two-Column Newspaper Layout */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 border-t-2 border-[#1c1815] pt-2 sm:pt-3 flex-1 min-h-0 items-stretch">
          {/* Left Column: Suspect Mugshot with Red DETENIDO Stamp */}
          <div className="flex flex-col items-center justify-between min-h-0">
            <div className="relative w-full max-w-[260px] h-full max-h-[220px] sm:max-h-[260px] aspect-[4/5] bg-[#e7ded0] border-2 sm:border-3 border-[#1c1815] overflow-hidden flex items-center justify-center shadow-inner mx-auto">
              {/* Background height lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-3 pointer-events-none opacity-30">
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
                <div className="text-2xl sm:text-3xl text-black/50 font-mono font-bold">
                  PRONTUARIO
                </div>
              )}

              {/* The Iconic Red DETENIDO Stamp */}
              <div className="absolute z-10 -rotate-12 border-3 sm:border-4 border-red-600 bg-red-600/20 backdrop-blur-[1px] px-3 sm:px-4 py-0.5 sm:py-1 rounded shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                <div className="border border-red-600 px-2.5 sm:px-3 py-0.5">
                  <span className="text-xl sm:text-3xl font-black font-sans tracking-widest text-red-600 uppercase">
                    DETENIDO
                  </span>
                </div>
              </div>
            </div>

            <span className="text-[10px] sm:text-xs font-mono font-bold text-center mt-1.5 uppercase text-[#44403c] truncate w-full">
              FOTO EXCLUSIVA · {suspectName} BAJO CUSTODIA FEDERAL
            </span>
          </div>

          {/* Right Column: Police Report & Investigation Stats */}
          <div className="flex flex-col justify-between gap-2 min-h-0">
            <div className="border-2 border-[#1c1815] bg-white p-2.5 sm:p-3 rounded-sm shadow-sm flex flex-col justify-between">
              <div className="bg-[#1c1815] text-[#fef08a] px-2 py-0.5 sm:py-1 text-center text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider mb-2">
                ACTA DE CAPTURA POLICIAL
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-left">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#78716c] uppercase block">
                    PUNTAJE OBTENIDO
                  </span>
                  <span className="text-base sm:text-xl font-black text-black">
                    {score.toLocaleString("es-AR")}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#78716c] uppercase block">
                    TIEMPO INVERTIDO
                  </span>
                  <span className="text-base sm:text-xl font-black text-black">
                    {hoursTaken} HS
                  </span>
                </div>

                <div className="border-t border-[#e7e5e4] pt-1">
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#78716c] uppercase block">
                    PRESUPUESTO SOBRANTE
                  </span>
                  <span className="text-xs sm:text-base font-black text-black">
                    {remainingPI} PI
                  </span>
                </div>

                <div className="border-t border-[#e7e5e4] pt-1">
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#78716c] uppercase block">
                    RANGO ASIGNADO
                  </span>
                  <span
                    className={`text-base sm:text-xl font-black tracking-wider block ${
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
            <div className="bg-[#e7ded0] p-2 sm:p-2.5 border border-[#1c1815] text-[11px] sm:text-xs font-serif leading-snug text-[#292524]">
              <span className="font-bold block mb-1 uppercase text-[10px] font-mono">
                DETALLES DEL OPERATIVO:
              </span>
              El detective asignado reconstruyó el trayecto de fuga siguiendo pistas testimoniales en cada provincia, logrando capturar al prófugo en su escondite sin margen de escape.
            </div>
          </div>
        </div>

        {/* Newspaper Footer / Headlines */}
        <div className="border-t-2 border-[#1c1815] pt-1.5 sm:pt-2 flex items-center justify-between gap-3 text-[10px] sm:text-xs text-[#44403c] font-mono shrink-0">
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
