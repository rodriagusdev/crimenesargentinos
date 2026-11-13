"use client";

import { useState } from "react";
import SuspectPhoto from "../SuspectPhoto";
import styles from "./naipes.module.css";
import { audioManager } from "@/lib/audioManager";
import type { GallerySuspect } from "@/lib/suspectReleases";

export type Suit = { name: string; icon: string; color: string };

type Props = { suspect: GallerySuspect; number: number; suit: Suit; dealt: boolean; order: number; onFlip: () => void };

// Naipe criollo: frente con número, palo, foto y nombre; se levanta al pasar el mouse y al tocarlo se da vuelta
export default function PlayingCard({ suspect, number, suit, dealt, order, onFlip }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        audioManager.play("slide");
        setFlipped((f) => !f);
        onFlip();
      }}
      aria-label={`${suspect.name}, ${number} de ${suit.name}`}
      aria-pressed={flipped}
      className={`relative aspect-[5/8] [perspective:900px] cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-[#ffd447] ${styles.lift} ${
        dealt ? styles.deal : ""
      }`}
      style={dealt ? { animationDelay: `${900 + order * 160}ms` } : undefined}
    >
      <div
        className="relative size-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        {/* Frente */}
        <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col rounded-lg bg-[#fbf7ec] border-2 border-[#1b1813]/70 p-1.5 shadow-[0_6px_14px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between text-xs font-bold" style={{ color: suit.color }}>
            <span>{number}</span>
            <span aria-hidden>{suit.icon}</span>
          </div>
          <div
            className="relative flex-1 my-1 overflow-hidden rounded-sm border-2 bg-[#3a4250]"
            style={{ borderColor: suit.color }}
          >
            <SuspectPhoto suspect={suspect} index={number} />
          </div>
          <span className="font-serif text-[11px] sm:text-xs font-bold uppercase leading-tight text-center text-[#1b1813]">{suspect.name}</span>
          <div className="flex items-center justify-between text-xs font-bold rotate-180" style={{ color: suit.color }}>
            <span>{number}</span>
            <span aria-hidden>{suit.icon}</span>
          </div>
        </div>
        {/* Dorso */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] rounded-lg border-[3px] border-[#fbf7ec] bg-[#8b1d1d] bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.12)_0,rgba(255,255,255,0.12)_4px,transparent_4px,transparent_10px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_4px,transparent_4px,transparent_10px)] flex items-center justify-center shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <span className="rounded-[50%] border-2 border-[#fbf7ec] bg-[#8b1d1d] px-2 py-3 text-[10px] text-[#fbf7ec] text-center leading-relaxed">
            C.A.
          </span>
        </div>
      </div>
    </button>
  );
}
