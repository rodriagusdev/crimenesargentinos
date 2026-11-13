"use client";

import type { CSSProperties } from "react";
import SuspectSilhouette, { SilhouetteVariant } from "./SuspectSilhouette";

export type EvidencePhoto = {
  silhouette: SilhouetteVariant;
  caption: string;
  position: string; // clases de posición absoluta (top/left/right/bottom)
  rotate: number;
  fromX: string;
  fromY: string;
  delayMs: number;
};

type EvidencePolaroidProps = {
  photo: EvidencePhoto;
  visible: boolean;
};

// Foto de un sospechoso sin identificar que cae girando sobre el escritorio y queda clavada con una chinche
export default function EvidencePolaroid({ photo, visible }: EvidencePolaroidProps) {
  const style = {
    "--rot": `${photo.rotate}deg`,
    "--from-x": photo.fromX,
    "--from-y": photo.fromY,
    transitionDelay: `${photo.delayMs}ms`,
  } as CSSProperties;

  return (
    <figure
      style={style}
      className={`splash-polaroid absolute ${photo.position} w-[clamp(84px,12vw,170px)] p-1.5 pb-5 sm:p-2 sm:pb-7 bg-[#f4efe2] shadow-[0_14px_30px_rgba(0,0,0,0.7)] ${
        visible ? "splash-polaroid--in" : ""
      }`}
    >
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 size-3.5 rounded-full bg-red-600 shadow-[0_2px_0_#5a0d0d,inset_-2px_-2px_0_rgba(0,0,0,0.25)]" />
      <div className="relative aspect-square overflow-hidden bg-black">
        <SuspectSilhouette variant={photo.silhouette} />
      </div>
      <figcaption className="absolute bottom-1.5 sm:bottom-2 inset-x-0 text-center text-[6px] sm:text-[8px] text-[#2a2a2a] tracking-wider">
        {photo.caption}
      </figcaption>
    </figure>
  );
}
