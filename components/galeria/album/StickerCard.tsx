import SuspectPhoto from "../SuspectPhoto";
import type { GallerySuspect } from "@/lib/suspectReleases";

// Figurita del álbum: número, foto y nombre. Las del release nuevo son holográficas
export default function StickerCard({ suspect, number, isNew }: { suspect: GallerySuspect; number: number; isNew: boolean }) {
  return (
    <figure
      className={`relative flex flex-col rounded-md overflow-hidden bg-white p-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:-translate-y-1 hover:rotate-1 ${
        isNew ? "ring-2 ring-[#ffd447] ring-offset-2 ring-offset-[#f3ead2]" : ""
      }`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#2b3445]">
        <SuspectPhoto suspect={suspect} index={number} />
        {isNew && <div className="galeria-holo absolute inset-0 pointer-events-none" aria-hidden />}
        <span className="absolute top-1 left-1 min-w-7 px-1 py-0.5 rounded-sm bg-[#1d4e89] text-white text-[10px] text-center shadow">
          {number}
        </span>
        {isNew && (
          <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-sm bg-[#c81e1e] text-white text-[10px] -rotate-6 shadow">
            ¡NUEVA!
          </span>
        )}
      </div>
      <figcaption className="mt-1.5 min-h-8 flex items-center justify-center rounded-sm bg-[#1d4e89] px-1 py-1 text-center font-mono text-xs font-bold leading-tight text-white uppercase">
        {suspect.name}
      </figcaption>
    </figure>
  );
}
