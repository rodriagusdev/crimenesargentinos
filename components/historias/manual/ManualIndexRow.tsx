"use client";

import type { CaseStory } from "@/lib/caseStories";

// Renglón del índice: número de expediente, caso, dónde empieza y el folio al que lleva
export default function ManualIndexRow({ story, folio, onOpen }: { story: CaseStory; folio: number; onOpen: (folio: number) => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(folio)}
        className="group w-full flex items-center gap-3 px-2.5 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-[#f3ead6] transition-colors cursor-pointer"
      >
        <span className="shrink-0 font-mono text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#e8deca] text-[#4a3a28] border border-[#c5b597]">
          {String(story.level).padStart(2, "0")}
        </span>
        <span className="shrink-0 text-lg sm:text-xl" aria-hidden>
          {story.emoji}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-serif font-bold text-xs sm:text-sm text-[#2b2117] uppercase tracking-wide">{story.title}</span>
          <span className="block font-serif italic text-[11px] sm:text-xs text-[#705c47] truncate">
            {story.place} · {story.province}
          </span>
        </span>
        {/* Línea de puntos hasta el número de folio, como en un índice impreso */}
        <span className="hidden md:block w-24 lg:w-40 border-b-2 border-dotted border-[#c4b395] translate-y-1" aria-hidden />
        <span className="shrink-0 font-mono text-[11px] sm:text-xs text-[#5a4835] group-hover:text-[#9e1c1c]">
          Folio {folio + 1} →
        </span>
      </button>
    </li>
  );
}
