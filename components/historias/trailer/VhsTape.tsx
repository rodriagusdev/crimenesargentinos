"use client";

import { audioManager } from "@/lib/audioManager";
import type { CaseStory } from "@/lib/caseStories";
import styles from "./vhs.module.css";

// Colores de etiqueta, uno por cinta
const LABELS = ["#ffd447", "#ff8a5c", "#7fd1ff", "#b8f28a", "#ff9fd0", "#f5f0dc", "#c7a2ff", "#ffc06b"];

type Props = { story: CaseStory; number: number; watching: boolean; onPick: () => void };

// Cinta VHS del estante: carcasa negra, ventanita con carretes y etiqueta escrita a mano con el título del caso
export default function VhsTape({ story, number, watching, onPick }: Props) {
  return (
    <button
      type="button"
      onClick={onPick}
      onMouseEnter={() => audioManager.play("opencasefile", { volume: 0.4 })}
      aria-label={`Elegir el casete de ${story.title}`}
      className={`relative flex flex-col gap-2 rounded-md bg-[#141518] p-2.5 text-left cursor-pointer border-2 shadow-[0_10px_18px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] ${styles.tape} ${
        watching ? "border-[#e33]" : "border-[#2a2c31]"
      }`}
    >
      {/* Etiqueta */}
      <span className="block rounded-sm px-2 py-2 -rotate-[0.6deg]" style={{ backgroundColor: LABELS[(number - 1) % LABELS.length] }}>
        <span className="flex items-center justify-between font-mono text-[10px] font-bold text-[#1b1813]/70">
          <span>EXP. {String(number).padStart(2, "0")}</span>
          <span aria-hidden>{story.emoji}</span>
        </span>
        <span className="mt-1 block font-serif italic text-sm sm:text-base font-black leading-tight text-[#1b1813] min-h-10">{story.title}</span>
      </span>
      {/* Ventanita con los carretes */}
      <span className="flex items-center justify-center gap-6 rounded-sm bg-[#07080a] py-2 border border-[#2a2c31]" aria-hidden>
        {[0, 1].map((r) => (
          <span key={r} className={`relative size-7 rounded-full border-2 border-[#9aa1ab] bg-[#2b2e33] ${styles.reel}`}>
            <span className="absolute inset-2 rounded-full border border-dashed border-[#c8cdd4]" />
          </span>
        ))}
      </span>
      <span className="flex justify-between font-mono text-[10px] text-[#9aa1ab]">
        <span>VHS · SP</span>
        <span>{watching ? "▶ ELEGIDA" : "NIVEL " + story.level}</span>
      </span>
    </button>
  );
}
