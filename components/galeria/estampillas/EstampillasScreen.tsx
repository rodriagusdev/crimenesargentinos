"use client";

import StampCard from "./StampCard";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";

const SHEET = "#f4efe3";

// Propuesta "Estampillas": cada release es una serie en su hoja; la nueva lleva matasellos de "primer día de emisión"
export default function EstampillasScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();
  const today = new Date().toLocaleDateString("es-AR");

  return (
    <div className="min-h-svh bg-[#2b3a2f] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)] px-3 sm:px-6 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        <header className="text-center text-[#f4efe3]">
          <p className="text-[10px] tracking-[0.3em] text-[#E1C380]">COLECCIÓN FILATÉLICA</p>
          <h1 className="mt-2 text-lg sm:text-2xl leading-relaxed">ROSTROS DE LA REPÚBLICA</h1>
        </header>

        {releases.map((r) => {
          const fresh = isNew(r);
          const start = firstNumber(r);
          return (
            <section
              key={r.id}
              className={`relative p-3 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${fresh ? "galeria-in" : "opacity-90"}`}
              style={{ backgroundColor: SHEET }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4 text-[#1b1813]">
                <h2 className="font-serif text-lg sm:text-2xl font-black uppercase">Serie {r.id}</h2>
                <span className="font-mono text-sm">
                  {r.suspects.length} valores · {r.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1">
                {r.suspects.map((s, i) => (
                  <StampCard key={s.name} suspect={s} number={start + i} isNew={fresh} sheetColor={SHEET} />
                ))}
              </div>

              {/* Matasellos sobre la serie nueva */}
              {fresh && (
                <div
                  className="pointer-events-none absolute top-10 right-2 sm:right-8 size-36 sm:size-44 rounded-full border-4 border-[#1d3f8a]/70 text-[#1d3f8a]/80 flex flex-col items-center justify-center text-center -rotate-12"
                  aria-hidden
                >
                  <span className="text-[10px] leading-relaxed px-4">PRIMER DÍA DE EMISIÓN</span>
                  <span className="mt-1 font-mono text-sm font-bold" suppressHydrationWarning>
                    {today}
                  </span>
                  <span className="absolute inset-3 rounded-full border-2 border-dashed border-[#1d3f8a]/50" />
                </div>
              )}
            </section>
          );
        })}
      </div>

      <ReleasePreviewToggle preview={preview} onToggle={togglePreview} />
    </div>
  );
}
