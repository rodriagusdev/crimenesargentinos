"use client";

import { useEffect, useState } from "react";
import OpenBook from "./OpenBook";
import LetterIndex from "./LetterIndex";
import RotaryPhone from "./RotaryPhone";
import SearchSlip from "./SearchSlip";
import { buildPages, letterPages, normalize } from "./guiaPages";
import { useGuideBook } from "./useGuideBook";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import GameBackdrop, { CautionBar, GAME_BG } from "../GameBackdrop";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";
import styles from "./guia.module.css";

// Propuesta "Guía de personas": una guía telefónica de páginas amarillas abierta sobre el escritorio.
// Se hojea con flechas, con el uñero o buscando un nombre; las altas del release nuevo llegan en un suplemento abrochado.
export default function GuiaScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();
  const [query, setQuery] = useState("");
  const pages = buildPages(releases, isNew, firstNumber);
  const letters = letterPages(pages);
  const book = useGuideBook(pages.length);
  const newEdition = releases.some(isNew);
  const edition = releases[0].id;

  // Coincidencias del buscador (desde 2 letras)
  const q = normalize(query);
  const found = new Set(
    q.length >= 2 ? pages.flatMap((p) => p.entries.filter((e) => normalize(e.suspect.name).includes(q)).map((e) => e.suspect.name)) : [],
  );

  const search = (text: string) => {
    setQuery(text);
    const t = normalize(text);
    if (t.length < 2) return;
    const page = pages.findIndex((p) => p.entries.some((e) => normalize(e.suspect.name).includes(t)));
    if (page >= 0) book.goTo(page);
  };

  // Flechas del teclado para hojear (salvo mientras se escribe en el buscador)
  const { canNext, canPrev, flip } = book;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" && canNext) flip("next");
      if (e.key === "ArrowLeft" && canPrev) flip("prev");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canNext, canPrev, flip]);

  const last = Math.min(book.view + book.perView, pages.length);
  const navButton =
    "px-4 py-3 rounded-lg bg-[#ffd447] text-[#1b1813] text-[10px] shadow-[0_4px_0_#9a7b12] cursor-pointer active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:cursor-default";

  return (
    <div className={`relative ${GAME_BG} min-h-svh overflow-x-clip px-3 sm:px-6 py-8 sm:py-12 pb-24`}>
      <GameBackdrop glow="245,200,40" />
      <CautionBar className="max-w-5xl" />
      <div className="relative max-w-5xl mx-auto flex flex-col gap-6">
        <header className="text-center">
          <p className="text-[10px] tracking-[0.3em] text-amber-400/90">GUÍA OFICIAL DE LA CENTRAL · EDICIÓN {edition}</p>
          <h1 className="mt-2 font-serif text-4xl sm:text-6xl font-black text-[#ffd447] [text-shadow:0_4px_0_#1E2A36]">Guía de Personas</h1>
        </header>

        {/* Escritorio: teléfono y papelito del buscador */}
        <div className="flex items-end justify-center gap-6">
          <div className="hidden sm:block">
            <RotaryPhone />
          </div>
          <SearchSlip query={query} matches={found.size} onChange={search} />
        </div>

        {/* Uñero en celulares */}
        <div className="sm:hidden">
          <LetterIndex letters={letters} current={new Set()} onJump={book.goTo} vertical={false} />
        </div>

        <div key={edition} className={newEdition ? styles.dropIn : undefined}>
          <OpenBook
            pages={pages}
            view={book.view}
            perView={book.perView}
            turn={book.turn}
            found={found}
            letters={letters}
            onJump={book.goTo}
            newEdition={newEdition}
          />
        </div>

        <nav className="flex items-center justify-between gap-3" aria-label="Hojear la guía">
          <button type="button" className={navButton} disabled={!book.canPrev} onClick={() => book.flip("prev")}>
            ◀ <span className="hidden sm:inline">ANTERIOR</span>
          </button>
          <span className="font-mono text-sm text-[#f6e7a1]">
            {book.perView === 2 && last - book.view === 2 ? `Págs. ${book.view + 1}–${last}` : `Pág. ${book.view + 1}`} de {pages.length}
          </span>
          <button type="button" className={navButton} disabled={!book.canNext} onClick={() => book.flip("next")}>
            <span className="hidden sm:inline">SIGUIENTE</span> ▶
          </button>
        </nav>
      </div>

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          audioManager.play(preview ? "slide" : "stamp");
          book.reset();
          togglePreview();
        }}
      />
    </div>
  );
}
