"use client";

import { useState, type CSSProperties } from "react";
import SuspectPhoto from "../SuspectPhoto";
import { audioManager } from "@/lib/audioManager";
import type { GallerySuspect } from "@/lib/suspectReleases";
import styles from "./cartelera.module.css";

type Props = { suspect: GallerySuspect; index: number; lit: boolean; bowOnEnter: boolean };

// Foto de elenco con marco dorado y placa con el nombre; con las luces prendidas, un cono de reflector encima.
// Al tocarla, hace una reverencia (en el estreno, todo el elenco saluda al entrar)
export default function CastPortrait({ suspect, index, lit, bowOnEnter }: Props) {
  const [bows, setBows] = useState(0);
  const bowing = bows > 0 || bowOnEnter;
  const delay = { "--d": bows > 0 ? "0ms" : `${2000 + index * 150}ms` } as CSSProperties;

  return (
    <button
      type="button"
      onClick={() => {
        audioManager.play("opencasefile");
        setBows((b) => b + 1);
      }}
      aria-label={suspect.name}
      className="relative flex flex-col items-center cursor-pointer"
    >
      {lit && (
        <span
          className="absolute -top-3 inset-x-[-10%] h-[85%] pointer-events-none bg-[linear-gradient(180deg,rgba(255,240,200,0.3),transparent)] [clip-path:polygon(40%_0,60%_0,100%_100%,0_100%)]"
          aria-hidden
        />
      )}
      <span key={bows} style={delay} className={`relative block w-full ${bowing ? styles.bow : ""}`}>
        <span
          className={`relative block w-full aspect-[3/4] overflow-hidden rounded-sm border-4 bg-[#3a4250] ${
            lit
              ? "border-[#e8c25a] shadow-[0_0_24px_rgba(232,194,90,0.45),inset_0_0_0_2px_#7a5a1a]"
              : "border-[#6a5a3a] grayscale-[0.6] brightness-75"
          }`}
        >
          <SuspectPhoto suspect={suspect} index={index} />
        </span>
      </span>
      {/* Placa dorada con el nombre */}
      <span
        className={`relative -mt-2 w-[105%] rounded-sm px-1 py-1 text-center text-[8px] sm:text-[10px] leading-snug uppercase ${
          lit
            ? "bg-[linear-gradient(180deg,#f5d77a,#b8892a)] text-[#2a1a05] shadow-[0_3px_6px_rgba(0,0,0,0.6)]"
            : "bg-[linear-gradient(180deg,#8a7a5a,#5a4a32)] text-[#1f1512]"
        }`}
      >
        {suspect.name}
      </span>
    </button>
  );
}
