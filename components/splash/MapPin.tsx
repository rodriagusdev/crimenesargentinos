"use client";

import type { CSSProperties } from "react";

type MapPinProps = {
  left: number; // % del contenedor de la sala
  top: number;
  label: string;
  delayMs: number;
  visible: boolean;
};

// Pin rojo que se enciende sobre una provincia del mapa táctico
export default function MapPin({ left, top, label, delayMs, visible }: MapPinProps) {
  const style: CSSProperties = { left: `${left}%`, top: `${top}%`, transitionDelay: `${delayMs}ms` };

  return (
    <div
      style={style}
      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-[2.5]"
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-60" />
      <span className="relative block size-2.5 sm:size-3.5 rounded-full bg-red-500 border-2 border-[#fff3c7] shadow-[0_0_12px_rgba(255,60,60,0.9)]" />
      <span className="absolute left-full top-1/2 -translate-y-1/2 ml-1.5 whitespace-nowrap text-[6px] sm:text-[9px] tracking-widest text-[#fff3c7] [text-shadow:0_1px_0_#000,0_0_6px_#000]">
        {label}
      </span>
    </div>
  );
}
