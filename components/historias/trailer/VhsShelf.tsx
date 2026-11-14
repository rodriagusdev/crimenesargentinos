"use client";

import VhsTape from "./VhsTape";
import { audioManager } from "@/lib/audioManager";
import { CASE_STORIES } from "@/lib/caseStories";
import styles from "./vhs.module.css";

/** Cuántos casetes se ven a la vez en el estante */
export const SHELF_VISIBLE = 2;

type Props = {
  /** Primer casete visible */
  start: number;
  /** Hacia dónde se movió por última vez (para la animación) y un contador para repetirla */
  move: { dir: "up" | "down"; n: number };
  onMove: (dir: "up" | "down") => void;
  /** Salta para que se vea ese casete (paginador) */
  onJump: (index: number) => void;
  watching: number | null;
  onPick: (index: number) => void;
};

// Flechas redondas como las del carrusel de niveles de /principal
const arrow =
  "flex size-11 shrink-0 items-center justify-center self-center rounded-full border border-amber-300/80 bg-[#0d1724]/95 " +
  "text-lg font-bold text-amber-200 cursor-pointer shadow-[0_10px_28px_rgba(0,0,0,0.75)] transition-all duration-200 " +
  "hover:bg-amber-300 hover:text-[#0d1724] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] active:scale-95 " +
  "disabled:opacity-0 disabled:pointer-events-none";

// Fichas del paginador como las de /principal (amarillas; la de los casetes a la vista, con anillo)
const dot = (active: boolean) =>
  `flex size-9 items-center justify-center rounded-xl border-2 bg-[#0c1421] text-xs cursor-pointer transition-all duration-150 select-none ${
    active
      ? "border-amber-400 text-amber-300 ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0c1421] shadow-[0_0_14px_rgba(245,158,11,0.55)]"
      : "border-amber-500/60 text-amber-300/80 hover:border-amber-400 hover:text-amber-200"
  }`;

// Estante vertical de la videoteca: muestra hasta 2 casetes, con flechas ▲ ▼ y paginador al estilo de /principal
export default function VhsShelf({ start, move, onMove, onJump, watching, onPick }: Props) {
  const visible = CASE_STORIES.slice(start, start + SHELF_VISIBLE);
  const last = Math.min(start + SHELF_VISIBLE, CASE_STORIES.length);
  const step = (dir: "up" | "down") => {
    audioManager.play("slide");
    onMove(dir);
  };

  return (
    <section aria-label="Cintas de los casos" className="mx-auto flex w-full max-w-xs flex-col gap-3 lg:max-w-none">
      <button type="button" className={arrow} onClick={() => step("up")} disabled={start === 0} aria-label="Casetes anteriores">
        ▲
      </button>

      <div
        key={`${start}-${move.n}`}
        className={`flex flex-col gap-3 p-3.5 ${move.n === 0 ? "" : move.dir === "down" ? styles.shelfDown : styles.shelfUp}`}
      >
        {visible.map((s, i) => (
          <VhsTape key={s.id} story={s} number={start + i + 1} watching={watching === start + i} onPick={() => onPick(start + i)} />
        ))}
      </div>

      <button
        type="button"
        className={arrow}
        onClick={() => step("down")}
        disabled={last >= CASE_STORIES.length}
        aria-label="Casetes siguientes"
      >
        ▼
      </button>

      {/* Paginador: una ficha por casete */}
      <nav aria-label="Casetes" className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-2 rounded-2xl border-2 border-[#1c2c3e] bg-[#0c1421] p-2 shadow-[0_12px_32px_rgba(0,0,0,0.85)]">
          {CASE_STORIES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                audioManager.play("mechanickey");
                onJump(i);
              }}
              aria-label={`Ver el casete ${i + 1}: ${s.title}`}
              aria-current={i >= start && i < last}
              className={dot(i >= start && i < last)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </nav>
    </section>
  );
}
