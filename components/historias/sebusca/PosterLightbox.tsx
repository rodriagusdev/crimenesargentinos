"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { CaseStory } from "@/lib/caseStories";
import { audioManager } from "@/lib/audioManager";
import PosterFace from "./PosterFace";
import styles from "./sebusca.module.css";

type Props = { story: CaseStory; closing: boolean; onClose: () => void; onClosed: () => void };

// Cartel abierto en grande: se despliega desde la chinche y cae el sello "¡SE PAGA!". Abajo, el llamado a jugar.
// Se cierra con ✕, Escape o tocando afuera.
export default function PosterLightbox({ story, closing, onClose, onClosed }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal aria-label={`Se busca: ${story.wanted}`}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/80 backdrop-blur-sm ${closing ? styles.dimOut : styles.dimIn}`} aria-hidden />

      <div
        onAnimationEnd={(e) => {
          if (closing && e.target === e.currentTarget) onClosed();
        }}
        className={`relative max-h-[92svh] w-full max-w-lg overflow-y-auto overflow-x-hidden px-1 pb-1 pt-4 ${closing ? styles.rollUp : styles.unroll}`}
      >
        <div className="relative shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
          <PosterFace story={story} large />

          <span
            className={`${styles.slab} pointer-events-none absolute right-3 top-[38%] border-4 border-[#8a1c12] bg-[#efe0bb]/70 px-3 py-1 text-xl text-[#8a1c12] sm:right-6 sm:text-3xl ${styles.stamp}`}
            aria-hidden
          >
            ¡SE PAGA!
          </span>

          <div className={`${styles.paper} flex flex-col items-center gap-2 border-t-2 border-dashed border-[#3a1f0c]/50 px-4 pb-5 pt-3 text-center`}>
            <p className={`${styles.italic} text-sm text-[#3a1f0c]`}>¿Te animás a salir a buscar?</p>
            <Link
              href="/login?registro"
              onClick={() => audioManager.play("typewriter")}
              className="border-2 border-[#3a1f0c] bg-[#8a1c12] px-4 py-3 text-[10px] leading-relaxed text-[#efe0bb] shadow-[4px_4px_0_#3a1f0c] transition-transform hover:-translate-y-0.5 sm:text-xs"
            >
              TOMAR EL CASO
            </Link>
          </div>
        </div>

        {/* Chinche */}
        <span className="pointer-events-none absolute left-1/2 top-2 size-6 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff8,#c81e1e_45%)] shadow-[0_3px_4px_rgba(0,0,0,0.6)]" aria-hidden />

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar el cartel"
          className="absolute right-2 top-6 size-9 cursor-pointer rounded-full border-2 border-[#3a1f0c] bg-[#efe0bb] text-xs text-[#3a1f0c] hover:bg-[#8a1c12] hover:text-[#efe0bb]"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
