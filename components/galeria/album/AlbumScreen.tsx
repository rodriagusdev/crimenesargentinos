"use client";

import { useState } from "react";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import StickerCard from "./StickerCard";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";

// Propuesta "Álbum de figuritas": una página por release, con pestañas arriba; la del release nuevo dice "¡NUEVA!"
export default function AlbumScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // Sin elección, se abre la página más nueva (al simular el release 2, salta sola a esa)
  const page = releases.find((r) => r.id === selectedId) ?? releases[0];
  const start = firstNumber(page);
  const pageIsNew = isNew(page);

  return (
    <div className="min-h-svh bg-[#123a6b] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.12),transparent_45%)] px-3 sm:px-6 py-8 sm:py-12 text-[#1b1813]">
      <div className="max-w-5xl mx-auto">
        <header className="text-center text-[#FFF3C7] mb-6">
          <p className="text-[10px] tracking-[0.3em] text-[#ffd447]">CRÍMENES ARGENTINOS</p>
          <h1 className="mt-2 text-lg sm:text-2xl leading-relaxed [text-shadow:0_4px_0_#0b2547]">ÁLBUM OFICIAL DE SOSPECHOSOS</h1>
        </header>

        {/* Pestañas: una por release, la más nueva primero */}
        <div className="flex gap-1.5 px-3 overflow-x-auto [scrollbar-width:none]" role="tablist">
          {releases.map((r) => {
            const active = r.id === page.id;
            return (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  audioManager.play("slide");
                  setSelectedId(r.id);
                }}
                className={`relative shrink-0 rounded-t-lg px-4 pt-2.5 pb-2 text-[10px] sm:text-xs cursor-pointer ${
                  active ? "bg-[#f3ead2] text-[#1d4e89]" : "bg-[#0b2547] text-[#FFF3C7]/80 hover:text-[#FFF3C7]"
                }`}
              >
                {r.name.toUpperCase()}
                {isNew(r) && (
                  <span className="absolute -top-2.5 -right-1.5 px-1.5 py-0.5 rounded bg-[#c81e1e] text-white text-[10px] rotate-6">¡NUEVA!</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Página del álbum */}
        <section
          key={page.id}
          className="galeria-in rounded-xl rounded-tl-none bg-[#f3ead2] p-3 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[repeating-linear-gradient(0deg,transparent,transparent_23px,rgba(29,78,137,0.06)_24px)]"
        >
          <div className="flex flex-wrap items-end justify-between gap-2 border-b-2 border-dashed border-[#1d4e89]/30 pb-3 mb-4">
            <h2 className="text-sm sm:text-base text-[#1d4e89]">{page.name.toUpperCase()}</h2>
            <span className="font-mono text-sm font-bold text-[#1d4e89]">
              Figuritas {start} a {start + page.suspects.length - 1} · {page.suspects.length}/{page.suspects.length}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {page.suspects.map((s, i) => (
              <StickerCard key={s.name} suspect={s} number={start + i} isNew={pageIsNew} />
            ))}
          </div>
        </section>
      </div>

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          setSelectedId(null);
          togglePreview();
        }}
      />
    </div>
  );
}
