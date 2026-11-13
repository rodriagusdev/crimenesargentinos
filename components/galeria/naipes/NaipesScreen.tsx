"use client";

import { useState } from "react";
import SuitSection from "./SuitSection";
import TableTop from "./TableTop";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import styles from "./naipes.module.css";
import type { Suit } from "./PlayingCard";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";
import GameBackdrop, { CautionBar, GAME_BG } from "../GameBackdrop";

// Un palo por release, en orden
const SUITS: Suit[] = [
  { name: "Espadas", icon: "⚔️", color: "#1d3f8a" },
  { name: "Copas", icon: "🏆", color: "#a11d1d" },
  { name: "Oros", icon: "🪙", color: "#9a6b00" },
  { name: "Bastos", icon: "🪵", color: "#2f6b2a" },
];
const suitOf = (id: number) => SUITS[(id - 1) % SUITS.length];

// Lo que va anotando la mesa: naipes dados vuelta y mezclas del mazo
type Tally = { flips: number; shuffles: number };

// Propuesta "Mazo criollo": mesa de truco con paño y borde de madera; cada release es un palo y el nuevo se reparte desde el mazo
export default function NaipesScreen() {
  const { preview, togglePreview, releases, isNew } = useGalleryReleases();
  const [tally, setTally] = useState<Tally>({ flips: 0, shuffles: 0 });
  const newRelease = releases.find(isNew);

  return (
    <div className={`relative ${GAME_BG} min-h-svh px-2 sm:px-6 py-6 sm:py-12 text-[#FFF3C7]`}>
      <GameBackdrop glow="245,158,11" />
      <CautionBar className="max-w-6xl" />
      {/* Mesa: borde de madera y paño */}
      <div className={`relative max-w-6xl mx-auto rounded-[28px] p-2.5 sm:p-4 shadow-[0_30px_60px_rgba(0,0,0,0.7)] ${styles.wood}`}>
        <div
          className={`rounded-[20px] bg-[#0f4a2c] px-3 sm:px-6 py-8 sm:py-10 shadow-[inset_0_0_50px_rgba(0,0,0,0.65)] flex flex-col gap-10 ${styles.felt}`}
        >
          <TableTop
            newSuit={newRelease ? { suit: suitOf(newRelease.id), cards: newRelease.suspects.length } : null}
            flips={tally.flips}
            shuffles={tally.shuffles}
            onShuffle={() => {
              audioManager.play("swoosh");
              setTally((t) => ({ ...t, shuffles: t.shuffles + 1 }));
            }}
          />

          {releases.map((r) => (
            <SuitSection
              key={r.id}
              release={r}
              suit={suitOf(r.id)}
              fresh={isNew(r)}
              onFlip={() => setTally((t) => ({ ...t, flips: t.flips + 1 }))}
            />
          ))}
        </div>
      </div>

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          if (!preview) audioManager.play("swoosh");
          togglePreview();
        }}
      />
    </div>
  );
}
