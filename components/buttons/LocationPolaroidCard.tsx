"use client";

import Image from "next/image";
import ILocation from "@/models/ILocation";
import { audioManager } from "@/lib/audioManager";

interface LocationPolaroidCardProps {
  location: ILocation;
  isCurrent: boolean;
  hours: number;
  rotation: string;
  disabled?: boolean;
  onMouseEnter?: () => void;
  onClick?: () => void;
}

export function LocationPolaroidCard({
  location,
  isCurrent,
  hours,
  rotation,
  disabled = false,
  onMouseEnter,
  onClick,
}: LocationPolaroidCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => {
        audioManager.play("opencasefile");
        onMouseEnter?.();
      }}
      onClick={onClick}
      className={`
        group relative flex flex-col justify-between p-2.5 sm:p-3 rounded-sm bg-[#faf8f5] text-zinc-900
        shadow-[0_12px_28px_rgba(0,0,0,0.65)] select-none transition-all duration-200 cursor-pointer
        hover:scale-105 hover:rotate-0 hover:z-20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.85)]
        active:scale-95 text-left
        ${rotation}
        ${isCurrent
          ? "ring-4 ring-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)]"
          : "hover:ring-2 hover:ring-amber-400/80"
        }
      `}
    >
      {/* Chincheta superior */}
      <div
        className={`
          absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 shadow-md flex items-center justify-center z-20
          ${isCurrent
            ? "bg-amber-400 border-amber-100 ring-2 ring-amber-400/60 shadow-[0_0_10px_#f59e0b]"
            : "bg-red-600 border-red-200 shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          }
        `}
      >
        <span className="w-1 h-1 rounded-full bg-white/80" />
      </div>

      {/* Foto Polaroid cuadrada */}
      <div className="relative aspect-square w-full rounded-xs overflow-hidden bg-zinc-950 border border-zinc-300">
        <Image
          src={location.imageUrl}
          alt={location.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 240px"
          className="object-cover transition-transform duration-300 group-hover:scale-108"
        />
      </div>

      {/* Faldón blanco clásico de Polaroid con tipografía mecanografiada */}
      <div className="flex flex-col items-center mt-2.5 w-full">
        <h3 className="font-mono font-black text-xs sm:text-sm text-zinc-900 tracking-tight text-center truncate w-full">
          {location.name}
        </h3>

        <div className="mt-1 flex items-center justify-center">
          {isCurrent ? (
            <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-[9px] font-mono font-bold text-amber-900 tracking-wider">
              BASE ACTUAL
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-300 text-[9px] font-mono font-semibold text-zinc-700 tracking-wider flex items-center gap-1">
              <span className="text-cyan-700 font-bold">⏱</span> {hours} HS
            </span>
          )}
        </div>

        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1.5 opacity-70 group-hover:opacity-100 group-hover:text-amber-800 transition-opacity">
          {isCurrent ? "REINGRESAR ➔" : "INSPECCIONAR ➔"}
        </span>
      </div>
    </button>
  );
}
