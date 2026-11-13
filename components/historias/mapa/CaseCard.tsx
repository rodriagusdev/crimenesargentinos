"use client";

import Image from "next/image";
import Link from "next/link";
import type { CaseStory } from "@/lib/caseStories";

type Props = {
  story: CaseStory;
  /** Casos que arrancan en la misma provincia (pestañas) */
  siblings: CaseStory[];
  onPick: (index: number) => void;
  onClose: () => void;
};

// Ficha del caso: escena, titular, sinopsis y lugar. Nada de la investigación.
export default function CaseCard({ story, siblings, onPick, onClose }: Props) {
  return (
    <article className="overflow-hidden rounded-xl border-2 border-cyan-400/40 bg-[#0b1220] text-[#e8f4ff] shadow-[0_0_30px_rgba(56,232,255,0.15)]">
      <header className="flex items-center justify-between gap-2 border-b border-cyan-400/30 bg-cyan-950/60 px-3 py-2">
        <p className="text-[9px] sm:text-[10px] tracking-[0.25em] text-cyan-300">
          EXPEDIENTE N.º {String(story.level).padStart(3, "0")} · ABIERTO
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-2 py-1 text-xs text-cyan-200 hover:bg-cyan-400/20 focus-visible:outline-2 focus-visible:outline-cyan-300"
          aria-label="Cerrar ficha"
        >
          ✕
        </button>
      </header>

      {siblings.length > 1 && (
        <div className="flex gap-1 border-b border-cyan-400/20 px-2 pt-2" role="tablist" aria-label="Casos en esta provincia">
          {siblings.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === story.id}
              onClick={() => onPick(i)}
              className={`min-w-0 flex-1 truncate rounded-t px-2 py-1.5 text-[10px] sm:text-xs ${
                s.id === story.id ? "bg-cyan-400 text-[#06101c]" : "bg-white/5 text-cyan-100/70 hover:bg-white/10"
              }`}
            >
              {s.emoji} {s.title}
            </button>
          ))}
        </div>
      )}

      <div className="relative aspect-[16/9] w-full">
        <Image src={story.image} alt={`Escena: ${story.place}`} fill sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-transparent to-transparent" aria-hidden />
        <span className="absolute left-3 bottom-2 text-3xl [filter:drop-shadow(0_3px_4px_rgba(0,0,0,0.7))]" aria-hidden>
          {story.emoji}
        </span>
      </div>

      <div className="space-y-3 px-4 pb-4 pt-2">
        <h2 className="text-base sm:text-xl text-white">{story.title}</h2>
        <p className="border-l-4 border-red-500 pl-2 text-sm font-bold text-red-300">«{story.headline}»</p>
        <p className="font-mono text-sm leading-relaxed text-[#cfe3f5]">{story.synopsis}</p>
        <dl className="grid grid-cols-2 gap-2 font-mono text-xs">
          <div className="rounded bg-white/5 p-2">
            <dt className="text-[10px] text-cyan-300/80">LUGAR DEL HECHO</dt>
            <dd>📍 {story.place}</dd>
          </div>
          <div className="rounded bg-white/5 p-2">
            <dt className="text-[10px] text-cyan-300/80">PROVINCIA</dt>
            <dd>{story.province}</dd>
          </div>
        </dl>
        <Link
          href="/login?registro"
          className="block rounded-md bg-[#ffd447] px-3 py-2.5 text-center text-xs sm:text-sm text-[#14171c] shadow-[0_4px_0_#a8861d] hover:brightness-110 active:translate-y-0.5 active:shadow-none"
        >
          TOMAR EL CASO ▶
        </Link>
      </div>
    </article>
  );
}
