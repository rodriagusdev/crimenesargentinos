"use client";

import { useState } from "react";
import SuspectPhoto from "../SuspectPhoto";
import { audioManager } from "@/lib/audioManager";
import type { GallerySuspect } from "@/lib/suspectReleases";
import styles from "./fichero.module.css";

type Props = { suspect: GallerySuspect; number: number; isNew: boolean; order: number };

// Ficha de prontuario: número de legajo, foto y nombre. Se levanta al pasar y, con un clic, se saca del cajón.
// Las del release nuevo reciben el sello "NUEVO" de golpe, una tras otra.
export default function RecordCard({ suspect, number, isNew, order }: Props) {
  const [pulled, setPulled] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        audioManager.play("opencasefile");
        setPulled((p) => !p);
      }}
      aria-pressed={pulled}
      className={`relative block w-full text-left cursor-pointer bg-[#f6f0de] text-[#2b2117] rounded-sm border border-[#cdbf9f] p-2 shadow-[0_6px_14px_rgba(0,0,0,0.35)] ${styles.card} ${
        pulled ? styles.cardPulled : ""
      }`}
    >
      {/* Solapa superior de la ficha */}
      <span className="absolute -top-2.5 left-3 h-3 w-14 rounded-t-sm bg-[#e9dfc4] border border-b-0 border-[#cdbf9f]" aria-hidden />
      {/* Renglones de máquina de escribir de fondo */}
      <span
        className="absolute inset-0 pointer-events-none opacity-40 bg-[repeating-linear-gradient(180deg,transparent_0_13px,#d9cdb2_13px_14px)]"
        aria-hidden
      />
      <span className="relative flex items-center justify-between font-mono text-[10px] font-bold text-[#7a6a50] border-b border-[#d9cdb2] pb-1 mb-2">
        <span>LEGAJO</span>
        <span>N° {String(number).padStart(4, "0")}</span>
      </span>
      <span className="relative block aspect-square overflow-hidden border border-[#b9ab8c] bg-[#3a4250]">
        <SuspectPhoto suspect={suspect} index={number} className="grayscale-[0.35] contrast-110" />
        {/* Clip metálico que sostiene la foto */}
        <span
          className="absolute -top-1 left-1/2 -translate-x-1/2 h-4 w-3 rounded-sm border-2 border-[#9aa1ab] bg-gradient-to-b from-[#e3e6ea] to-[#8f97a3] shadow"
          aria-hidden
        />
        {isNew && (
          <span
            className={`absolute bottom-2 right-1 px-2 py-0.5 border-2 border-[#c81e1e] text-[#c81e1e] bg-[#f6f0de]/85 text-[10px] ${styles.stamp}`}
            style={{ animationDelay: `${350 + order * 220}ms` }}
          >
            NUEVO
          </span>
        )}
      </span>
      <span className="relative mt-2 block font-mono text-xs sm:text-sm font-bold uppercase leading-tight text-center">{suspect.name}</span>
    </button>
  );
}
