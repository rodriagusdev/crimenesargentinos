"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { REGISTER_HREF, toneFor } from "./afiches";
import { audioManager } from "@/lib/audioManager";
import type { CaseStory } from "@/lib/caseStories";
import styles from "./afiches.module.css";

// Recortes de la misma escena, como los "fotogramas" de una contratapa
const FRAMES = ["20% 30%", "50% 60%", "80% 40%"];

// Contratapa de DVD del caso: frase, sinopsis, fotogramas de la escena, ficha técnica, código de barras y JUGAR.
// Se cierra con ✕, tocando afuera o con Escape.
export default function DvdBackCover({ story, onClose }: { story: CaseStory; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const tone = toneFor(story.level);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`Contratapa: ${story.title}`}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/80 backdrop-blur-sm ${styles.dimIn}`} aria-hidden />

      {/* Caja de plástico con la contratapa adentro */}
      <div className={`relative w-full max-w-md max-h-[92svh] overflow-y-auto overflow-x-hidden rounded-md border-[3px] border-[#1a1a1d] bg-[#0e0e10] p-2 shadow-[0_40px_90px_rgba(0,0,0,0.85)] ${styles.caseIn}`}>
        <span className="pointer-events-none absolute inset-y-2 left-0 w-1.5 bg-[repeating-linear-gradient(180deg,#2a2a2e_0_4px,#141416_4px_8px)]" aria-hidden />
        <article className="relative overflow-hidden rounded-sm bg-[linear-gradient(180deg,#160709,#050304)] p-4 sm:p-5 text-[#f3ead6]">
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_40%)]" aria-hidden />
          <button
            ref={closeRef}
            type="button"
            onClick={() => {
              audioManager.play("click");
              onClose();
            }}
            aria-label="Cerrar contratapa"
            className="absolute right-2 top-2 size-9 rounded-full bg-black/60 text-sm text-white/80 cursor-pointer hover:bg-[#7a1212] focus-visible:outline-2 focus-visible:outline-[#ffd678]"
          >
            ✕
          </button>

          <p className="pr-10 font-serif italic text-base sm:text-lg leading-snug" style={{ color: tone.accent }}>
            &ldquo;{story.tagline}&rdquo;
          </p>
          <h2 className="mt-3 font-serif font-black uppercase text-2xl leading-none tracking-tight">{story.title}</h2>
          <p className="mt-3 font-serif text-sm sm:text-base leading-relaxed text-[#f3ead6]/90">{story.synopsis}</p>

          <div className="mt-4 grid grid-cols-3 gap-1.5">
            {FRAMES.map((pos) => (
              <span key={pos} className="relative aspect-video overflow-hidden border border-white/20">
                <Image src={story.image} alt="" fill sizes="140px" className="object-cover scale-150" style={{ objectPosition: pos }} />
              </span>
            ))}
          </div>

          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-y border-white/20 py-2 font-mono text-xs sm:text-sm">
            <dt className="text-white/50">Lugar</dt>
            <dd>
              {story.place}, {story.province}
            </dd>
            <dt className="text-white/50">Se busca</dt>
            <dd>{story.wanted}</dd>
            <dt className="text-white/50">Duración</dt>
            <dd>Lo que tarde tu investigación</dd>
            <dt className="text-white/50">Idioma</dt>
            <dd>Español</dd>
          </dl>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="self-start border-2 border-white/80 px-1.5 py-0.5 font-serif text-[9px] font-bold tracking-wider">APTA PARA DETECTIVES</span>
              <span className="font-serif text-[9px] tracking-[0.2em] text-white/60">UN CASO DE NIVEL {story.level}</span>
            </div>
            {/* Código de barras */}
            <span className="flex flex-col items-center bg-white px-1.5 pt-1 pb-0.5" aria-hidden>
              <span className="block h-8 w-20 bg-[repeating-linear-gradient(90deg,#000_0_2px,transparent_2px_3px,#000_3px_4px,transparent_4px_7px)]" />
              <span className="font-mono text-[7px] text-black">7 79{story.level}0 2026 00{story.level}</span>
            </span>
          </div>

          <Link
            href={REGISTER_HREF}
            onClick={() => audioManager.play("typewriter")}
            className="mt-5 block rounded-sm bg-[#b3121b] py-3.5 text-center text-xs text-white shadow-[0_6px_0_#5c0a0e] hover:bg-[#d01822] active:translate-y-1 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd678]"
          >
            ▶ JUGAR
          </Link>
          <p className="mt-2 text-center font-mono text-xs text-white/50">Creá tu cuenta gratis y resolvé el caso.</p>
        </article>
      </div>
    </div>
  );
}
