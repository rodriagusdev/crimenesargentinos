"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./trailer.module.css";
import type { CaseStory } from "@/lib/caseStories";

// Una foto del mosaico final del tráiler: cae con un leve giro y lleva el número de expediente
export default function TrailerMontageTile({ story, index }: { story: CaseStory; index: number }) {
  const tilt = index % 2 === 0 ? -2 : 2;
  const style = { animationDelay: `${150 + index * 160}ms`, "--tilt": `${tilt}deg` } as CSSProperties;
  return (
    <div style={style} className={`${styles.tile} relative aspect-[4/3] overflow-hidden border-2 border-[#FFF3C7]/80 bg-black shadow-[0_10px_24px_rgba(0,0,0,0.7)]`}>
      <Image src={story.image} alt="" fill sizes="(max-width: 640px) 45vw, 220px" className="object-cover brightness-75" />
      <span className="absolute left-1 top-1 px-1.5 py-1 bg-black/75 text-[8px] sm:text-[9px] text-[#E1C380]">
        {String(story.level).padStart(2, "0")}
      </span>
      <span className="absolute right-1 bottom-0.5 text-base sm:text-xl" aria-hidden>
        {story.emoji}
      </span>
    </div>
  );
}
