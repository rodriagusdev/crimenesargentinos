"use client";

import { useState, type PointerEvent } from "react";
import SuspectPhoto from "../SuspectPhoto";
import styles from "./estampillas.module.css";
import { audioManager } from "@/lib/audioManager";
import type { GallerySuspect } from "@/lib/suspectReleases";

type Props = { suspect: GallerySuspect; number: number; isNew: boolean };

// La lupa sigue al puntero: se escriben variables CSS directo en el elemento, sin re-render
const trackLens = (e: PointerEvent<HTMLDivElement>) => {
  const el = e.currentTarget;
  const box = el.getBoundingClientRect();
  el.style.setProperty("--lx", `${e.clientX - box.left}px`);
  el.style.setProperty("--ly", `${e.clientY - box.top}px`);
  el.style.setProperty("--pw", `${box.width}px`);
  el.style.setProperty("--ph", `${box.height}px`);
};

// Estampilla con dentado, marca de agua y bolsillo de papel cristal. Con un clic, la pinza la levanta para mirarla
export default function StampCard({ suspect, number, isNew }: Props) {
  const [lifted, setLifted] = useState(false);

  return (
    <div className={`relative ${lifted ? "z-10" : ""}`}>
      <button
        type="button"
        aria-pressed={lifted}
        aria-label={`${suspect.name}: ${lifted ? "volver a guardar" : "levantar con la pinza"}`}
        onClick={() => {
          audioManager.play(lifted ? "click" : "opencasefile");
          setLifted((l) => !l);
        }}
        className={`${styles.lift} ${lifted ? styles.lifted : "drop-shadow-[0_3px_3px_rgba(0,0,0,0.25)] hover:-translate-y-0.5"} block w-full cursor-pointer text-left`}
      >
        <div className={`${styles.perforated} ${isNew ? "bg-[#fffdf6]" : "bg-[#f1e9d8]"}`}>
          <div
            className={`${styles.watermark} flex flex-col gap-1 p-1.5 border-2 ${
              isNew ? "border-[#1d4e89] bg-[#e8f1fb]" : "border-[#8b7d68] bg-[#efe6d4] sepia-[0.4]"
            }`}
          >
            <div className={`flex justify-between text-[10px] ${isNew ? "text-[#c81e1e]" : "text-[#1b1813]"}`}>
              <span>${number}</span>
              <span>ARG</span>
            </div>
            <div className={`${styles.photoArea} relative aspect-[4/5] overflow-hidden bg-[#3a4250]`} onPointerMove={trackLens} onPointerEnter={trackLens}>
              <SuspectPhoto suspect={suspect} index={number} className={isNew ? "saturate-125" : "grayscale-[0.4]"} />
              {/* Lupa */}
              <span className={`${styles.lens} pointer-events-none absolute size-28 overflow-hidden rounded-full bg-[#3a4250] ring-4 ring-[#3b2a1a] shadow-[0_8px_18px_rgba(0,0,0,0.5)]`} aria-hidden>
                <span className={`${styles.lensInner} absolute block`}>
                  <SuspectPhoto suspect={suspect} index={number} className={isNew ? "saturate-125" : "grayscale-[0.4]"} />
                </span>
                <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.35),transparent_45%)]" />
              </span>
            </div>
            <span className="font-serif text-xs font-bold uppercase leading-tight text-center text-[#1b1813]">{suspect.name}</span>
            <span className="text-[10px] leading-tight text-center text-[#5a4f40]">CORREO · REP. ARGENTINA</span>
          </div>
        </div>
      </button>

      {/* Bolsillo de papel cristal: se ve mientras la estampilla está guardada */}
      {!lifted && <span className={`${styles.glassine} pointer-events-none absolute inset-x-[-4px] bottom-[-4px] h-[42%] rounded-[2px]`} aria-hidden />}

      {/* Pinza filatélica */}
      {lifted && (
        <svg viewBox="0 0 60 120" className={`${styles.tweezers} pointer-events-none absolute -top-14 -right-3 w-8 sm:w-10 rotate-[25deg] drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]`} aria-hidden>
          <path d="M22 0h6l6 100-6 18-4-18z" fill="#c9ccd2" stroke="#7d828c" strokeWidth="1.5" />
          <path d="M32 0h6l-2 100-4 18-2-18z" fill="#e3e6eb" stroke="#7d828c" strokeWidth="1.5" />
          <rect x="21" y="18" width="18" height="10" rx="2" fill="#7d828c" />
        </svg>
      )}
    </div>
  );
}
