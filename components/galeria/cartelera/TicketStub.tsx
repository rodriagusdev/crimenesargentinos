"use client";

import { useState } from "react";
import { audioManager } from "@/lib/audioManager";
import styles from "./cartelera.module.css";

// Entrada de la temporada: al tocarla, el acomodador corta el talón (y otro toque lo vuelve a poner)
export default function TicketStub({ season, lit }: { season: number; lit: boolean }) {
  const [torn, setTorn] = useState(false);
  const row = String.fromCharCode(64 + ((season * 5) % 26 || 1));

  return (
    <button
      type="button"
      onClick={() => {
        audioManager.play("slide");
        setTorn((t) => !t);
      }}
      aria-pressed={torn}
      aria-label={`Entrada de la temporada ${season}`}
      className={`mx-auto flex max-w-full cursor-pointer text-left font-mono ${lit ? "text-[#2a1a05]" : "text-[#3a3226] opacity-70"}`}
    >
      <span className={`flex flex-col justify-center rounded-l-md px-3 py-2 ${lit ? "bg-[#f3dfa6]" : "bg-[#b9ad95]"}`}>
        <span className="text-[10px] tracking-[0.3em] font-bold">ENTRADA</span>
        <span className="text-xs">Temporada {season} · Platea</span>
      </span>
      {/* Talón con borde troquelado */}
      <span
        className={`flex flex-col justify-center rounded-r-md border-l-2 border-dashed border-[#7a5a1a] px-3 py-2 ${lit ? "bg-[#e8c25a]" : "bg-[#9a8f78]"} ${
          torn ? styles.torn : "transition-transform duration-300"
        }`}
      >
        <span className="text-[10px] font-bold">FILA {row}</span>
        <span className="text-[10px]">BUTACA {season * 7}</span>
      </span>
    </button>
  );
}
