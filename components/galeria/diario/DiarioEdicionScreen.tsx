"use client";

import NewspaperFace from "./NewspaperFace";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";

// Propuesta "Edición especial": la tapa de El Vespertino del release más nuevo; las anteriores, más chicas en la hemeroteca
export default function DiarioEdicionScreen() {
  const { preview, togglePreview, releases, isNew } = useGalleryReleases();
  const [latest, ...archive] = releases;

  return (
    <div className="min-h-svh bg-[#2a2420] px-3 sm:px-6 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        {/* Tapa principal */}
        <article key={latest.id} className="galeria-in bg-[#f2ead8] text-[#1b1813] p-4 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.7)] -rotate-[0.4deg]">
          <header className="text-center border-b-4 border-double border-[#1b1813] pb-3">
            <div className="flex justify-between font-serif text-[10px] sm:text-xs uppercase tracking-wider">
              <span>Edición especial</span>
              <span>{latest.name}</span>
            </div>
            <h1 className="mt-2 font-serif font-black text-3xl sm:text-6xl tracking-tight">El Vespertino</h1>
          </header>

          <h2 className="mt-4 font-serif font-black text-2xl sm:text-5xl leading-none text-center uppercase">
            {isNew(latest) ? "Nueva banda en el país" : `${latest.suspects.length} personas de interés`}
          </h2>
          <p className="mt-3 mb-5 font-serif italic text-sm sm:text-base text-center text-[#3d3124]">
            {isNew(latest)
              ? "La Central difundió las caras de quienes llegaron en el último release. Si los ve, avise a la comisaría más cercana."
              : "La Central difundió las caras de todas las personas de interés de sus expedientes."}
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 border-t border-[#1b1813] pt-4">
            {latest.suspects.map((s, i) => (
              <NewspaperFace key={s.name} suspect={s} index={i} />
            ))}
          </div>
        </article>

        {/* Hemeroteca: ediciones anteriores */}
        {archive.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-center text-xs text-[#E1C380]">HEMEROTECA</h2>
            {archive.map((r) => (
              <article key={r.id} className="bg-[#ddd2b8] text-[#1b1813] p-3 sm:p-5 sepia-[0.35] shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
                <h3 className="font-serif font-black text-lg sm:text-2xl uppercase border-b-2 border-[#1b1813] pb-1 mb-3">
                  El Vespertino · {r.name}
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
                  {r.suspects.map((s, i) => (
                    <NewspaperFace key={s.name} suspect={s} index={i} small />
                  ))}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      <ReleasePreviewToggle preview={preview} onToggle={togglePreview} />
    </div>
  );
}
