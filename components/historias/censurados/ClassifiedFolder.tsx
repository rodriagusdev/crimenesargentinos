"use client";

import type { CSSProperties } from "react";
import type { CaseStory } from "@/lib/caseStories";
import styles from "./censurados.module.css";

type Props = { story: CaseStory; order: number; read: boolean; onOpen: () => void };

const ROTATIONS = [-2.5, 1.5, -1, 2.2, -1.8, 1, -0.6, 2.6];

// Carpeta de cartulina manila con su pestaña, el rótulo del expediente y el sello "CLASIFICADO" que cae de golpe.
// Al pasar el mouse se levanta y asoma la hoja del parte; con un clic (o toque) se abre.
export default function ClassifiedFolder({ story, order, read, onOpen }: Props) {
  const number = String(story.level).padStart(4, "0");
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Abrir el expediente ${story.title}`}
      className={`relative block w-full cursor-pointer pt-5 text-left text-[#2b2117] outline-none ${styles.folder}`}
      style={{ "--rot": `${ROTATIONS[order % ROTATIONS.length]}deg` } as CSSProperties}
    >
      {/* Pestaña */}
      <span className="absolute left-3 top-0 h-7 w-[45%] rounded-t-md bg-[#c9a467] px-2 pt-1 font-mono text-[9px] font-bold text-[#5a4325] sm:text-[10px]">
        EXP. {number}
      </span>

      {/* Hoja del parte que asoma */}
      <span className={`absolute inset-x-3 top-3 h-16 rounded-sm bg-[#f6f0de] shadow ${styles.peek}`} aria-hidden>
        <span className="mx-2 mt-2 block h-1 w-2/3 bg-[#1a1a1a]" />
        <span className="mx-2 mt-1.5 block h-1 w-1/2 bg-[#1a1a1a]" />
      </span>

      {/* Tapa */}
      <span className="relative block aspect-[4/3.4] overflow-hidden rounded-sm rounded-tl-none border border-[#a98852] bg-gradient-to-br from-[#e2c48a] via-[#d6b578] to-[#c5a062] p-2.5 shadow-[0_10px_18px_rgba(0,0,0,0.55)] sm:p-3.5">
        {/* Fibras del cartón */}
        <span className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(95deg,transparent_0_6px,rgba(120,80,30,0.25)_6px_7px)]" aria-hidden />

        {/* Rótulo */}
        <span className="relative block rounded-sm border border-[#bfb294] bg-[#f6f0de] px-2 py-1.5 shadow-sm">
          <span className="block font-mono text-[8px] tracking-widest text-[#7a6a50] sm:text-[9px]">CASO N° {story.level}</span>
          <span className="mt-0.5 block font-mono text-[11px] font-bold uppercase leading-tight sm:text-sm">{story.title}</span>
        </span>

        <span className="relative mt-2 flex items-center justify-between gap-1 font-mono text-[8px] text-[#5a4325] sm:text-[10px]">
          <span className="truncate">JURISD.: {story.province.toUpperCase()}</span>
          <span className="text-lg sm:text-2xl" aria-hidden>
            {story.emoji}
          </span>
        </span>

        {/* Sello CLASIFICADO */}
        <span
          className={`absolute bottom-3 left-[12%] w-[76%] border-[3px] border-[#b3191c] py-0.5 text-center text-[9px] text-[#b3191c] sm:text-xs ${styles.stamp} ${styles.ink}`}
          style={{ "--srot": "-9deg", animationDelay: `${300 + order * 160}ms` } as CSSProperties}
        >
          CLASIFICADO
        </span>

        {/* Ya leído: sello azul en la esquina */}
        {read && (
          <span
            className={`absolute right-1.5 top-1.5 rounded-sm border-2 border-[#1d4ed8] bg-[#f6f0de]/70 px-1 text-[7px] text-[#1d4ed8] ${styles.stamp}`}
            style={{ "--srot": "8deg" } as CSSProperties}
          >
            LEÍDO
          </span>
        )}
      </span>

      {/* Ojal del hilo de la carpeta */}
      <span className="absolute -bottom-1 left-1/2 size-3 -translate-x-1/2 rounded-full border-2 border-[#7a5a2a] bg-[#c9a467]" aria-hidden />
    </button>
  );
}
