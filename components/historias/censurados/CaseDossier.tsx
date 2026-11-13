"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CaseStory } from "@/lib/caseStories";
import { audioManager } from "@/lib/audioManager";
import RedactedBar from "./RedactedBar";
import TypedLine from "./TypedLine";
import { useTypewriter } from "./useTypewriter";
import styles from "./censurados.module.css";

type Props = { story: CaseStory; closing: boolean; onClose: () => void; onClosed: () => void };

// Anchos de las barras de censura (renglones falsos: debajo no hay nada del caso). Cada expediente arranca en
// otro punto de la lista para que no se vean todos iguales.
const WIDTHS = [94, 78, 100, 62, 30, 88, 100, 54, 22, 84, 70, 36];
const barsFor = (level: number, from: number, count: number) =>
  Array.from({ length: count }, (_, i) => WIDTHS[(level * 3 + from + i) % WIDTHS.length]);

// El parte policial que sale de la carpeta: se tipea a máquina lo que el juego cuenta al empezar (titular, lugar,
// relato), con la foto del lugar sujeta con un clip. El resto del informe está tachado con barras negras y, cuando
// termina de escribirse, cae el sello "CLASIFICADO". Se cierra con ✕, Escape o tocando afuera.
export default function CaseDossier({ story, closing, onClose, onClosed }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const fields = [
    { label: "ASUNTO:", text: story.headline, big: true },
    { label: "LUGAR DEL HECHO:", text: story.place },
    { label: "JURISDICCIÓN:", text: story.province },
    { label: "RELATO:", text: story.synopsis },
  ];
  const starts = fields.map((_, i) => fields.slice(0, i).reduce((n, f) => n + f.text.length, 0));
  const total = fields.reduce((n, f) => n + f.text.length, 0);
  const { shown, done, skip } = useTypewriter(total);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const number = String(story.level).padStart(4, "0");

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal aria-label={`Parte policial: ${story.title}`}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/80 backdrop-blur-sm ${closing ? styles.dimOut : styles.dimIn}`} aria-hidden />

      <article
        onClick={done ? undefined : skip}
        onAnimationEnd={(e) => {
          if (closing && e.target === e.currentTarget) onClosed();
        }}
        className={`relative max-h-[92svh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-sm border border-[#cdbf9f] bg-[#f6f0de] p-4 pt-5 text-[#2b2117] shadow-[0_40px_80px_rgba(0,0,0,0.8)] sm:p-8 ${
          closing ? styles.sheetOut : styles.sheetIn
        }`}
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-40 bg-[repeating-linear-gradient(180deg,transparent_0_27px,#d9cdb2_27px_28px)]"
          aria-hidden
        />

        <header className="relative mb-4 flex items-start justify-between gap-3 border-b-2 border-double border-[#b9ab8c] pb-3 pr-10 font-mono">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#7a6a50] sm:text-xs">CENTRAL DE INVESTIGACIONES</p>
            <p className="mt-1 text-lg font-black sm:text-2xl">PARTE POLICIAL</p>
          </div>
          <p className="shrink-0 text-right text-[11px] font-bold sm:text-sm">
            EXP. N° {number}
            <span className="mt-1 flex items-center justify-end gap-1 text-[10px] font-normal text-[#7a6a50]">
              FECHA <span className="inline-block h-3 w-14 bg-[#111]" />
            </span>
          </p>
        </header>

        {/* Foto del lugar, sujeta con un clip */}
        <figure className="relative float-right mb-2 ml-3 w-[42%] max-w-56 rotate-2 border-[5px] border-b-[18px] border-white bg-white shadow-[0_8px_16px_rgba(0,0,0,0.35)] sm:ml-5">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={story.image} alt={`Lugar del hecho: ${story.place}`} fill sizes="(min-width: 640px) 224px, 40vw" className="object-cover sepia-[0.45] contrast-110" />
          </div>
          <figcaption className="absolute -bottom-4 inset-x-0 text-center font-mono text-[8px] text-[#7a6a50] sm:text-[9px]">FOTO 1 · LUGAR DEL HECHO</figcaption>
          <span className="absolute -top-4 left-5 h-9 w-3 rounded-full border-[3px] border-[#9aa3ad] shadow-sm" aria-hidden />
        </figure>

        <div className="relative space-y-2">
          {fields.map((f, i) => {
            const start = starts[i];
            const fieldShown = Math.max(0, Math.min(f.text.length, shown - start));
            const typing = !done && shown >= start && shown < start + f.text.length;
            return <TypedLine key={f.label} label={f.label} text={f.text} shown={fieldShown} typing={typing} big={f.big} />;
          })}
        </div>

        {/* Lo que no se cuenta: barras negras sin nada debajo */}
        <section className="relative clear-both mt-6 space-y-5 font-mono">
          {[
            { title: "II. DILIGENCIAS", bars: barsFor(story.level, 0, 5) },
            { title: "III. CONCLUSIONES", bars: barsFor(story.level, 5, 4) },
          ].map((s, si) => (
            <div key={s.title}>
              <p className="mb-2 text-xs font-bold tracking-widest text-[#7a6a50] sm:text-sm">{s.title}</p>
              <div className="space-y-2">
                {s.bars.map((w, i) => (
                  <RedactedBar key={i} width={w} delayMs={250 + (si * 5 + i) * 70} />
                ))}
              </div>
            </div>
          ))}

          {done && (
            <span
              className={`pointer-events-none absolute right-2 top-6 border-4 border-[#b3191c] px-3 py-1 text-base text-[#b3191c] sm:right-10 sm:text-2xl ${styles.stamp} ${styles.ink}`}
              style={{ "--srot": "-14deg" } as CSSProperties}
              aria-hidden
            >
              CLASIFICADO
            </span>
          )}
        </section>

        <footer className="relative mt-7 flex flex-col items-center gap-3 border-t-2 border-dashed border-[#b9ab8c] pt-5 text-center">
          <p className="font-mono text-[11px] text-[#7a6a50] sm:text-xs">El resto del expediente solo se abre adentro de la Central.</p>
          <Link
            href="/login?registro"
            onClick={() => audioManager.play("typewriter")}
            className="border-2 border-[#2b2117] bg-[#b3191c] px-4 py-3 text-[10px] leading-relaxed text-[#f6f0de] shadow-[4px_4px_0_#2b2117] transition-transform hover:-translate-y-0.5 sm:text-xs"
          >
            DESCLASIFICAR EN EL JUEGO
          </Link>
        </footer>

        <button
          ref={closeRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Cerrar el expediente"
          className="absolute right-2 top-2 size-9 cursor-pointer rounded-full border-2 border-[#2b2117] bg-[#f6f0de] text-xs text-[#2b2117] hover:bg-[#b3191c] hover:text-[#f6f0de]"
        >
          ✕
        </button>
      </article>
    </div>
  );
}
