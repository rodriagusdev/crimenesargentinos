"use client";

import PlayingCard, { type Suit } from "./PlayingCard";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";

// Un palo por release, en orden
const SUITS: Suit[] = [
  { name: "Espadas", icon: "⚔️", color: "#1d3f8a" },
  { name: "Copas", icon: "🏆", color: "#a11d1d" },
  { name: "Oros", icon: "🪙", color: "#9a6b00" },
  { name: "Bastos", icon: "🪵", color: "#2f6b2a" },
];

// Propuesta "Mazo criollo": cada release es un palo del mazo; el palo nuevo sale recién repartido
export default function NaipesScreen() {
  const { preview, togglePreview, releases, isNew } = useGalleryReleases();

  return (
    <div className="min-h-svh bg-[#0f4a2c] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_65%)] px-3 sm:px-6 py-8 sm:py-12 text-[#FFF3C7]">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <header className="text-center">
          <p className="text-[10px] tracking-[0.3em] text-[#E1C380]">MAZO OFICIAL</p>
          <h1 className="mt-2 text-lg sm:text-2xl leading-relaxed [text-shadow:0_3px_0_#062616]">EL MAZO DE LA CENTRAL</h1>
          <p className="mt-2 font-mono text-sm text-[#FFF3C7]/70">Tocá una carta para darla vuelta.</p>
        </header>

        {releases.map((r) => {
          const fresh = isNew(r);
          const suit = SUITS[(r.id - 1) % SUITS.length];
          return (
            <section key={r.id} className="flex flex-col gap-4">
              <h2 className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                <span aria-hidden>{suit.icon}</span>
                {suit.name.toUpperCase()} · {r.name.toUpperCase()}
                {fresh && <span className="px-2 py-1 rounded bg-[#ffd447] text-[#1b1813] text-[10px]">PALO NUEVO · RECIÉN ABIERTO</span>}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
                {r.suspects.map((s, i) => (
                  <PlayingCard key={`${r.id}-${s.name}`} suspect={s} number={i + 1} suit={suit} dealt={fresh} order={i} />
                ))}
              </div>
            </section>
          );
        })}
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
