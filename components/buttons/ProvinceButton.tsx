"use client";

import Image from "next/image";

interface Props {
  label: string;
  icon: string;
  top?: string;
  left?: string;
  isCurrent?: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
}

// Inclinación orgánica sutil para cada polaroid en el corcho
const getRotation = (name: string) => {
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const angles = ["rotate-[-2deg]", "rotate-[1.5deg]", "rotate-[-1deg]", "rotate-[2deg]"];
  return angles[sum % angles.length];
};

export function ProvinceButton({
  label,
  icon,
  top,
  left,
  isCurrent = false,
  onClick,
  onMouseEnter,
}: Props) {
  const rotation = getRotation(label);

  return (
    <div
      style={{ top, left }}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className="
        absolute
        -translate-x-1/2 -translate-y-1/2
        z-20
        cursor-pointer
        group
        select-none
      "
    >
      {/* Marco Polaroid Detective */}
      <div
        className={`
          relative flex flex-col items-center
          w-18 sm:w-20 md:w-24
          p-1 sm:p-1.5 pb-1 sm:pb-1.5
          rounded-[3px] bg-[#faf8f5] text-zinc-900
          shadow-[0_12px_28px_rgba(0,0,0,0.7),0_2px_4px_rgba(0,0,0,0.4)]
          transition-all duration-200
          group-hover:scale-110 group-hover:rotate-0 group-hover:z-30 group-hover:shadow-[0_18px_36px_rgba(0,0,0,0.9)]
          active:scale-95
          ${rotation}
          ${isCurrent
            ? "ring-3 ring-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.65)]"
            : "hover:ring-2 hover:ring-[#E1C380]"
          }
        `}
      >
        {/* Chincheta / Thumbtack fijada en la parte superior */}
        <div
          className={`
            absolute -top-2 left-1/2 -translate-x-1/2
            w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 shadow-md z-30
            flex items-center justify-center
            ${isCurrent
              ? "bg-amber-400 border-amber-100 ring-2 ring-amber-400/60 shadow-[0_0_12px_#f59e0b]"
              : "bg-red-600 border-red-200 shadow-[0_2px_5px_rgba(0,0,0,0.6)]"
            }
          `}
        >
          <span className="w-1 h-1 rounded-full bg-white/80" />
        </div>

        {/* Aura de radar si es la provincia actual del detective */}
        {isCurrent && (
          <span className="absolute -inset-1.5 rounded-sm border-2 border-amber-400/80 animate-ping pointer-events-none" />
        )}

        {/* Ventana fotográfica cuadrada de la Polaroid */}
        <div className="relative aspect-square w-full rounded-[2px] overflow-hidden bg-zinc-950 border border-zinc-300">
          <Image
            src={icon}
            alt={label}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-300 group-hover:scale-108"
          />

          {/* Sello de ubicación actual */}
          {isCurrent && (
            <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-amber-400 text-[8px] font-mono font-black text-black uppercase tracking-wider shadow">
              ACTUAL
            </span>
          )}
        </div>

        {/* Borde inferior blanco clásico de Polaroid con tipografía mecanografiada */}
        <span className="font-mono font-bold text-[9px] sm:text-[10px] md:text-[11px] text-zinc-900 tracking-tight mt-1 text-center truncate w-full px-0.5">
          {label}
        </span>
      </div>
    </div>
  );
}