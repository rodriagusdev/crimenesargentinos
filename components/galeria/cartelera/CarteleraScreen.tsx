"use client";

import CastPortrait from "./CastPortrait";
import MarqueeBulbs from "./MarqueeBulbs";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";

// Propuesta "Cartelera de teatro": cada release es una temporada con su elenco; la nueva, "¡ESTRENO!" con las luces prendidas
export default function CarteleraScreen() {
  const { preview, togglePreview, releases, isNew } = useGalleryReleases();
  const hasPremiere = releases.some(isNew);

  return (
    <div className="min-h-svh bg-[#1a0d0d] bg-[radial-gradient(ellipse_at_top,rgba(160,30,30,0.35),transparent_60%)] px-3 sm:px-6 py-8 sm:py-12 text-[#FFF3C7]">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        <header className="text-center">
          <p className="text-[10px] tracking-[0.3em] text-[#e8c25a]">TEATRO DE LA CENTRAL · AV. CORRIENTES</p>
          <h1 className="mt-2 text-lg sm:text-2xl leading-relaxed">EL ELENCO</h1>
        </header>

        {releases.map((r, idx) => {
          const lit = isNew(r) || (!hasPremiere && idx === 0);
          return (
            <section
              key={r.id}
              className={`rounded-xl border-4 p-3 sm:p-6 flex flex-col gap-5 ${
                lit ? "border-[#e8c25a] bg-[#2a1210] galeria-in" : "border-[#4a3c2a] bg-[#1f1512]"
              }`}
            >
              <MarqueeBulbs on={lit} />
              <div className="text-center">
                {isNew(r) && <p className="text-sm sm:text-lg text-[#ff6b5b] galeria-blink">¡ESTRENO!</p>}
                <h2 className={`mt-1 text-base sm:text-xl ${lit ? "text-[#fff1b8]" : "text-[#b9ad95]"}`}>
                  TEMPORADA {r.id}
                </h2>
                <p className="mt-1 font-mono text-sm text-[#FFF3C7]/60">
                  {r.name} · {r.suspects.length} en escena
                </p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-5">
                {r.suspects.map((s, i) => (
                  <CastPortrait key={s.name} suspect={s} index={i} lit={lit} />
                ))}
              </div>
              <MarqueeBulbs on={lit} />
            </section>
          );
        })}
      </div>

      <ReleasePreviewToggle preview={preview} onToggle={togglePreview} />
    </div>
  );
}
