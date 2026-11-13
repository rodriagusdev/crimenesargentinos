"use client";

import DialMark from "./DialMark";
import VuMeter from "./VuMeter";
import styles from "./radioteatro.module.css";
import { chapterFrequency } from "./script";
import type { CaseStory } from "@/lib/caseStories";

type Props = {
  stories: CaseStory[];
  index: number;
  onAir: boolean;
  onTune: (index: number) => void;
  onToggle: () => void;
};

const KNOB =
  "grid size-11 sm:size-12 place-items-center rounded-full border-2 border-[#2b1d10] bg-[radial-gradient(circle_at_35%_30%,#f2e2c0,#b89a68_55%,#6b5434)] text-[#2b1d10] shadow-[0_4px_0_#2b1d10] active:translate-y-0.5 active:shadow-none outline-none focus-visible:ring-2 focus-visible:ring-amber-300";

// Radio a válvulas de los años 40 hecha con CSS: luz AL AIRE, parlante, dial con un capítulo por caso, vúmetro y perillas
export default function RadioSet({ stories, index, onAir, onTune, onToggle }: Props) {
  const count = stories.length;
  const story = stories[index];

  return (
    <div className={`${styles.cabinet} relative rounded-t-[3rem] rounded-b-2xl border-4 border-[#2b1d10] p-3 sm:p-5`}>
      {/* Cartel y luz AL AIRE */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="rounded bg-[#2b1d10] px-2 py-1 text-[9px] sm:text-[11px] tracking-[0.25em] text-[#f5dd9c]">RADIO POLICIAL</p>
        <p
          className={`flex items-center gap-1.5 rounded border-2 px-2 py-1 text-[9px] sm:text-[11px] tracking-widest transition-colors ${
            onAir ? `${styles.onAir} border-red-300 bg-red-600 text-white` : "border-[#2b1d10] bg-[#3a1010] text-red-200/40"
          }`}
        >
          <span className={`block size-2 rounded-full ${onAir ? "bg-white" : "bg-red-900"}`} aria-hidden />
          AL AIRE
        </p>
      </div>

      {/* Parlante */}
      <div className="rounded-[2rem] border-4 border-[#2b1d10] bg-[#3a2614] p-2 shadow-[inset_0_0_10px_rgba(0,0,0,0.6)]">
        <div className={`${styles.grille} ${onAir ? styles.grilleOn : ""} h-24 sm:h-32 rounded-[1.4rem]`} aria-hidden />
      </div>

      {/* Dial */}
      <div className={`${styles.dialGlass} relative mt-3 overflow-hidden rounded-md border-4 border-[#2b1d10] px-1 pb-1`}>
        <span
          className={`${styles.needle} pointer-events-none absolute top-0 bottom-0 w-0.5 bg-red-600 shadow-[0_0_4px_rgba(200,0,0,0.8)]`}
          style={{ left: `${((index + 0.5) / count) * 100}%` }}
          aria-hidden
        />
        <div className="flex">
          {stories.map((s, i) => (
            <DialMark
              key={s.id}
              frequency={chapterFrequency(s.level)}
              emoji={s.emoji}
              title={s.title}
              active={i === index}
              onTune={() => onTune(i)}
            />
          ))}
        </div>
        <p className="mt-0.5 text-center font-mono text-[8px] tracking-widest text-[#4a2c14]">KHz · ONDA MEDIA</p>
      </div>

      {/* Perillas y vúmetro */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <button type="button" onClick={() => onTune((index - 1 + count) % count)} className={KNOB} aria-label="Capítulo anterior">
          ◀
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-label={onAir ? "Detener la emisión" : "Escuchar el capítulo"}
          className={`${KNOB} size-14! sm:size-16! text-xl ${onAir ? "text-red-700" : ""}`}
        >
          {onAir ? "■" : "▶"}
        </button>
        <VuMeter on={onAir} />
        <button type="button" onClick={() => onTune((index + 1) % count)} className={KNOB} aria-label="Capítulo siguiente">
          ▶
        </button>
      </div>

      <p className="mt-3 truncate text-center font-mono text-[10px] sm:text-xs text-[#f5dd9c]/90">
        {chapterFrequency(story.level)} KHz · Capítulo {story.level} de {count}
      </p>
    </div>
  );
}
