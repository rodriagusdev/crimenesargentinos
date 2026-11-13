"use client";

import DirectoryEntry from "./DirectoryEntry";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";
import type { SuspectRelease } from "@/lib/suspectReleases";

const byName = (r: SuspectRelease) => r.suspects.map((s, i) => ({ s, i })).sort((a, b) => a.s.name.localeCompare(b.s.name, "es"));

// Propuesta "Guía telefónica": cada release es una edición; las altas nuevas van primero con separador amarillo
export default function GuiaScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();

  return (
    <div className="min-h-svh bg-[#3b2f24] px-3 sm:px-6 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto rounded-r-xl border-l-[14px] border-[#1d3f8a] bg-[#f7f2e2] text-[#1b1813] shadow-[0_24px_60px_rgba(0,0,0,0.7)] p-4 sm:p-8">
        <header className="flex flex-wrap items-end justify-between gap-2 border-b-4 border-[#1b1813] pb-3 mb-5">
          <div>
            <p className="text-[10px] tracking-[0.25em]">GUÍA OFICIAL DE LA CENTRAL</p>
            <h1 className="mt-1 font-serif text-3xl sm:text-5xl font-black">Guía de Personas</h1>
          </div>
          <span className="font-mono text-sm">Edición {releases[0].id}</span>
        </header>

        {releases.map((r) => {
          const fresh = isNew(r);
          const start = firstNumber(r);
          return (
            <section key={r.id} className="mb-6">
              <h2
                className={`mb-3 px-3 py-1.5 text-[10px] sm:text-xs ${
                  fresh ? "bg-[#ffd447] text-[#1b1813] galeria-in" : "bg-[#1b1813] text-[#f7f2e2]"
                }`}
              >
                {fresh ? `ALTAS DE ESTA EDICIÓN · ${r.name.toUpperCase()}` : `${r.name.toUpperCase()} · A–Z`}
              </h2>
              <ol className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                {byName(r).map(({ s, i }) => (
                  <DirectoryEntry key={s.name} suspect={s} number={start + i} isNew={fresh} />
                ))}
              </ol>
            </section>
          );
        })}
      </div>

      <ReleasePreviewToggle preview={preview} onToggle={togglePreview} />
    </div>
  );
}
