"use client";

import Image from "next/image";
import styles from "./trailer.module.css";
import type { CaseStory } from "@/lib/caseStories";

// Escena de un caso dentro del tráiler: el arte del lugar con zoom lento, el número de expediente, el titular,
// dónde empieza y la frase gancho. Nada de la investigación: solo lo que el juego muestra al arrancar.
export default function TrailerCaseShot({ story, total }: { story: CaseStory; total: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div className="home-kenburns absolute inset-0">
        <Image src={story.image} alt="" fill sizes="100vw" className="object-cover brightness-[0.7] saturate-[0.85]" />
      </div>
      <div className={`${styles.flash} absolute inset-0 bg-[#FFF3C7]`} aria-hidden />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.92)_8%,rgba(0,0,0,0.35)_45%,rgba(0,0,0,0.15)_70%,rgba(0,0,0,0.55)_100%)]"
        aria-hidden
      />

      {/* Entre las franjas de cine */}
      <div className="absolute inset-x-0 top-[9vh] bottom-[9vh] flex flex-col justify-end gap-3 sm:gap-4 px-5 sm:px-12 pb-6 sm:pb-10">
        <p className={`${styles.slideIn} flex items-center gap-2 text-[9px] sm:text-xs tracking-[0.25em] text-[#E1C380]`}>
          <span className="text-lg sm:text-2xl" aria-hidden>
            {story.emoji}
          </span>
          EXPEDIENTE {String(story.level).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>

        <h2
          className={`${styles.slam} max-w-4xl text-base sm:text-3xl leading-relaxed sm:leading-snug text-[#FFF3C7] uppercase [text-shadow:0_4px_0_#000,0_0_24px_rgba(0,0,0,0.9)]`}
        >
          {story.headline}
        </h2>

        <p className={`${styles.late} font-mono text-sm sm:text-lg text-[#FFF3C7]/85`}>
          <span aria-hidden>📍 </span>
          {story.place} · {story.province}
        </p>

        <p
          className={`${styles.later} self-start border-l-4 border-[#c81e1e] pl-3 font-serif italic text-base sm:text-2xl text-[#FFF3C7] [text-shadow:0_2px_8px_#000]`}
        >
          “{story.tagline}”
        </p>
      </div>
    </div>
  );
}
