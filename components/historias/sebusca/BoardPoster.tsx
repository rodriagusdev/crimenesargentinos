"use client";

import type { CSSProperties } from "react";
import type { CaseStory } from "@/lib/caseStories";
import PosterFace from "./PosterFace";
import styles from "./sebusca.module.css";

type Props = { story: CaseStory; order: number; onOpen: () => void };

const ROTATIONS = [-3, 2, -1.5, 3.2, -2.4, 1.2, -0.8, 2.6];
const PINS = ["#c81e1e", "#1d4ed8", "#eab308", "#16a34a"];

// Cartel clavado en el corcho con una chinche: llega de un golpe, está torcido y con una esquina despegada que
// se mueve con el aire. Al pasar el mouse se endereza y viene al frente; con un clic (o toque) se abre grande.
export default function BoardPoster({ story, order, onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Ver el cartel: se busca ${story.wanted}`}
      className={`relative block w-full cursor-zoom-in text-left outline-none hover:z-10 focus-visible:z-10 ${styles.poster}`}
      style={{ "--rot": `${ROTATIONS[order % ROTATIONS.length]}deg`, animationDelay: `${150 + order * 120}ms` } as CSSProperties}
    >
      <span className="block shadow-[0_10px_18px_rgba(0,0,0,0.5)]">
        <PosterFace story={story} />
      </span>

      {/* Esquina despegada */}
      <span
        className={`pointer-events-none absolute bottom-0 right-0 size-5 bg-[linear-gradient(135deg,#c9b48a_50%,transparent_50%)] shadow-[-2px_-2px_4px_rgba(0,0,0,0.25)] sm:size-7 ${styles.corner}`}
        style={{ animationDelay: `${order * 0.45}s` }}
        aria-hidden
      />

      {/* Chinche */}
      <span
        className="pointer-events-none absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full shadow-[0_3px_4px_rgba(0,0,0,0.6)] sm:size-5"
        style={{ background: `radial-gradient(circle at 35% 30%, #fff8, ${PINS[order % PINS.length]} 45%)` }}
        aria-hidden
      />
    </button>
  );
}
