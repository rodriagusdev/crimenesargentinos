"use client";

import styles from "./mapa.module.css";
import type { ProvincePin } from "./mapGeometry";

type Props = {
  pin: ProvincePin;
  active: boolean;
  delayMs: number;
  onSelect: () => void;
};

// Chinche de una provincia: punto rojo que late, con el emoji del caso. Si arrancan dos casos ahí, queda doble.
export default function CasePin({ pin, active, delayMs, onSelect }: Props) {
  const count = pin.cases.length;
  const label = count > 1 ? `${count} casos en ${pin.province}` : `${pin.cases[0].title} · ${pin.province}`;
  const flip = pin.left > 60; // etiqueta del lado de adentro del mapa

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={label}
      aria-pressed={active}
      style={{ left: `${pin.left}%`, top: `${pin.top}%`, animationDelay: `${delayMs}ms` }}
      className="group galeria-in absolute -translate-x-1/2 -translate-y-1/2 p-2 outline-none"
    >
      <span className="relative block">
        {count > 1 && (
          <span
            className="absolute left-1.5 -top-1.5 block size-3 sm:size-4 rounded-full bg-red-700 border-2 border-[#fff3c7]/80"
            aria-hidden
          />
        )}
        <span
          className={`${styles.pulse} absolute inset-0 rounded-full ${active ? "bg-cyan-300" : "bg-red-500"}`}
          style={{ animationDelay: `${delayMs}ms` }}
          aria-hidden
        />
        <span
          className={`relative block size-3 sm:size-4 rounded-full border-2 border-[#fff3c7] transition-transform group-hover:scale-125 group-focus-visible:scale-125 ${
            active ? "bg-cyan-400 shadow-[0_0_14px_rgba(56,232,255,1)] scale-125" : "bg-red-500 shadow-[0_0_12px_rgba(255,60,60,0.9)]"
          }`}
          aria-hidden
        />
      </span>

      <span
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 flex items-center gap-1 whitespace-nowrap rounded-sm border px-1 py-0.5 text-[7px] sm:text-[9px] tracking-widest [text-shadow:0_1px_0_#000] transition-colors ${
          flip ? "right-full mr-0.5" : "left-full ml-0.5"
        } ${active ? "border-cyan-300 bg-cyan-950/90 text-cyan-100" : "border-red-400/40 bg-black/70 text-[#fff3c7] group-hover:border-red-300"}`}
        aria-hidden
      >
        <span className="text-[10px] sm:text-xs not-italic">{pin.cases.map((c) => c.emoji).join("")}</span>
        {count > 1 ? `×${count}` : pin.province.toUpperCase()}
      </span>
    </button>
  );
}
