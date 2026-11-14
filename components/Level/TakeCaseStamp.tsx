"use client";

import styles from "./caseBriefing.module.css";

type Props = { label: string; pressed: boolean; onPress: () => void };

// Botón con forma de sello de goma: tinta roja, doble borde y algo torcido; al apretarlo se endereza y se hunde
export default function TakeCaseStamp({ label, pressed, onPress }: Props) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={pressed}
      className={`group relative cursor-pointer rounded-md border-4 border-[#c81e1e] bg-[#1a0d0d]/70 px-6 py-3 sm:px-8 sm:py-4 text-[#ff5a4a] shadow-[0_8px_18px_rgba(0,0,0,0.6)] -rotate-2 transition-transform duration-150 hover:rotate-0 hover:scale-105 active:scale-95 disabled:cursor-default ${styles.pinIn} ${
        pressed ? styles.stampPress : ""
      }`}
    >
      {/* Doble borde de sello */}
      <span className="pointer-events-none absolute inset-1 rounded-sm border-2 border-[#c81e1e]/70" aria-hidden />
      <span className="relative flex items-center gap-3 text-xs sm:text-sm lg:text-base tracking-widest [text-shadow:0_0_8px_rgba(200,30,30,0.5)]">
        <span aria-hidden>✦</span>
        {label}
        <span aria-hidden>✦</span>
      </span>
    </button>
  );
}
