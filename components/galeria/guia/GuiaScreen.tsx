"use client";

import { useState } from "react";
import DirectoryEntry from "./DirectoryEntry";
import GuiaDesk from "./GuiaDesk";
import LetterHeading from "./LetterHeading";
import ThumbIndex from "./ThumbIndex";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { guideItems, thumbTargets } from "./guiaIndex";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";
import styles from "./guia.module.css";

// Propuesta "Guía telefónica": un libro grueso sobre el escritorio, con uñero A–Z. Cada release es una edición;
// cuando llega una nueva, el libro cae sobre la mesa y las altas se pintan con marcador.
export default function GuiaScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();
  // Última letra buscada con el uñero (n cambia para repetir el destello)
  const [flash, setFlash] = useState({ anchor: "", n: 0 });
  const newRelease = releases.find(isNew);
  const edition = releases[0].id;
  const targets = thumbTargets(releases);

  const jump = (anchor: string) => {
    audioManager.play("slide");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(anchor)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setFlash((f) => ({ anchor, n: f.n + 1 }));
  };

  return (
    <div className="min-h-svh overflow-x-clip bg-[#3b2f24] bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,220,160,0.18),transparent_60%),repeating-linear-gradient(92deg,rgba(0,0,0,0.12)_0_3px,transparent_3px_22px,rgba(255,255,255,0.03)_22px_24px,transparent_24px_61px)] px-3 sm:px-6 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto">
        <GuiaDesk edition={edition} newRelease={newRelease} />

        <div key={edition} className={newRelease ? styles.dropIn : undefined}>
          {/* Libro: lomo azul, hojas y canto con uñero */}
          <div className="relative flex overflow-hidden rounded-r-xl border-l-[14px] border-[#1d3f8a] bg-[#f7f2e2] text-[#1b1813] shadow-[0_24px_60px_rgba(0,0,0,0.7),inset_10px_0_18px_rgba(0,0,0,0.18)]">
            <div className="flex-1 min-w-0 p-4 sm:p-8">
              <header className="flex flex-wrap items-end justify-between gap-2 border-b-4 border-[#1b1813] pb-3 mb-3">
                <div>
                  <p className="text-[10px] tracking-[0.25em]">GUÍA OFICIAL DE LA CENTRAL</p>
                  <h1 className="mt-1 font-serif text-3xl sm:text-5xl font-black">Guía de Personas</h1>
                </div>
                <span className="font-mono text-sm">Edición {edition}</span>
              </header>

              {/* Uñero en celulares: fila de pestañas */}
              <div className="sm:hidden mb-4">
                <ThumbIndex targets={targets} onJump={jump} vertical={false} />
              </div>

              {releases.map((r) => {
                const fresh = isNew(r);
                return (
                  <section key={r.id} className="mb-6">
                    <h2
                      className={`mb-2 px-3 py-1.5 text-[10px] sm:text-xs ${
                        fresh ? "bg-[#ffd447] text-[#1b1813] galeria-in" : "bg-[#1b1813] text-[#f7f2e2]"
                      }`}
                    >
                      {fresh ? `ALTAS DE ESTA EDICIÓN · ${r.name.toUpperCase()}` : `${r.name.toUpperCase()} · A–Z`}
                    </h2>
                    <ol className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                      {guideItems(r, firstNumber(r)).map((item) =>
                        item.kind === "letter" ? (
                          <LetterHeading
                            key={`${item.anchor}-${flash.anchor === item.anchor ? flash.n : 0}`}
                            letter={item.letter}
                            anchor={item.anchor}
                            flash={flash.anchor === item.anchor}
                          />
                        ) : (
                          <DirectoryEntry key={item.suspect.name} suspect={item.suspect} number={item.number} isNew={fresh} order={item.order} />
                        ),
                      )}
                    </ol>
                  </section>
                );
              })}

              <footer className="flex justify-between border-t border-[#1b1813]/40 pt-2 font-mono text-[10px] text-[#1b1813]/60">
                <span>Guía de Personas · Edición {edition}</span>
                <span>Pág. 1</span>
              </footer>
            </div>

            {/* Canto de las hojas con el uñero (tablet y escritorio) */}
            <div className="hidden sm:block w-10 shrink-0 border-l border-[#d6ccb0] bg-[repeating-linear-gradient(90deg,#efe7d0_0_1px,#f7f2e2_1px_3px)]">
              <ThumbIndex targets={targets} onJump={jump} vertical />
            </div>

            {/* Mancha de café */}
            <span
              className="pointer-events-none absolute bottom-6 right-8 sm:right-20 size-28 sm:size-36 rounded-full border-[7px] border-[#7a4a1f]/20 mix-blend-multiply blur-[0.6px] [clip-path:polygon(0_0,100%_0,100%_78%,62%_100%,0_100%)]"
              aria-hidden
            >
              <span className="absolute inset-2 rounded-full border-2 border-[#7a4a1f]/10" />
            </span>

            {/* Faja de la edición nueva */}
            {newRelease && (
              <span className="pointer-events-none absolute top-0 right-0 size-32 overflow-hidden" aria-hidden>
                <span className={`absolute top-7 -right-10 w-48 rotate-45 bg-[#c81e1e] py-1 text-center text-[10px] text-white shadow-md ${styles.band}`}>
                  ¡NUEVA EDICIÓN!
                </span>
              </span>
            )}
          </div>

          {/* Grosor del libro: hojas apiladas */}
          <div className="mx-3 h-2 rounded-b-sm bg-[repeating-linear-gradient(180deg,#e6dcc0_0_1px,#f3ecd8_1px_2px)] shadow-[0_6px_10px_rgba(0,0,0,0.5)]" aria-hidden />
          <div className="mx-5 h-1.5 rounded-b-sm bg-[#1d3f8a] shadow-[0_6px_10px_rgba(0,0,0,0.5)]" aria-hidden />
        </div>
      </div>

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          audioManager.play(preview ? "slide" : "stamp");
          togglePreview();
        }}
      />
    </div>
  );
}
