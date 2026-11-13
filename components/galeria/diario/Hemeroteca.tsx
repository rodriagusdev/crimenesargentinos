"use client";

import { useState } from "react";
import NewspaperFace from "./NewspaperFace";
import { audioManager } from "@/lib/audioManager";
import type { SuspectRelease } from "@/lib/suspectReleases";
import styles from "./diario.module.css";

// Hemeroteca: las ediciones anteriores apiladas; se hojean de a una con las flechas
export default function Hemeroteca({ archive }: { archive: SuspectRelease[] }) {
  const [index, setIndex] = useState(0);
  const current = Math.min(index, archive.length - 1);
  const edition = archive[current];
  const single = archive.length < 2;

  const go = (delta: number) => {
    audioManager.play("slide");
    setIndex((current + delta + archive.length) % archive.length);
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-center text-xs text-[#E1C380]">HEMEROTECA</h2>

      <div className="relative">
        {/* Ejemplares de abajo de la pila */}
        <span className="absolute inset-0 translate-x-2 translate-y-2 rotate-[1.2deg] bg-[#cfc3a6] shadow-[0_12px_30px_rgba(0,0,0,0.6)]" aria-hidden />
        <span className="absolute inset-0 -translate-x-1 translate-y-1 -rotate-[0.8deg] bg-[#d6cbaf]" aria-hidden />

        <article
          key={edition.id}
          className={`relative bg-[#ddd2b8] text-[#1b1813] p-3 sm:p-5 sepia-[0.35] shadow-[0_6px_16px_rgba(0,0,0,0.4)] ${styles.flip}`}
        >
          <div className="flex items-baseline justify-between gap-2 border-b-2 border-[#1b1813] pb-1 mb-3">
            <h3 className="font-serif font-black text-lg sm:text-2xl uppercase">El Vespertino · {edition.name}</h3>
            <span className="shrink-0 font-mono text-[10px]">Ejemplar de archivo</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
            {edition.suspects.map((s, i) => (
              <NewspaperFace key={s.name} suspect={s} index={i} small />
            ))}
          </div>
        </article>
      </div>

      <div className="flex items-center justify-center gap-3 text-[10px] text-[#E1C380]">
        <button type="button" disabled={single} onClick={() => go(1)} className="rounded border border-[#E1C380]/60 px-3 py-2 enabled:hover:bg-[#E1C380]/15 enabled:cursor-pointer disabled:opacity-40">
          ◀ MÁS VIEJA
        </button>
        <span className="font-mono">
          {current + 1} / {archive.length}
        </span>
        <button type="button" disabled={single} onClick={() => go(-1)} className="rounded border border-[#E1C380]/60 px-3 py-2 enabled:hover:bg-[#E1C380]/15 enabled:cursor-pointer disabled:opacity-40">
          MÁS NUEVA ▶
        </button>
      </div>
    </section>
  );
}
