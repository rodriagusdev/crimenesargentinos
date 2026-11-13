import SuspectPhoto from "../SuspectPhoto";
import type { GallerySuspect } from "@/lib/suspectReleases";

// Foto de elenco con marco dorado y el nombre en letras de marquesina
export default function CastPortrait({ suspect, index, lit }: { suspect: GallerySuspect; index: number; lit: boolean }) {
  return (
    <figure className="flex flex-col items-center gap-2">
      <div
        className={`relative w-full aspect-square overflow-hidden rounded-full border-4 bg-[#3a4250] ${
          lit ? "border-[#e8c25a] shadow-[0_0_24px_rgba(232,194,90,0.45)]" : "border-[#7a6a4a] grayscale-[0.5]"
        }`}
      >
        <SuspectPhoto suspect={suspect} index={index} />
      </div>
      <figcaption
        className={`text-center text-[10px] sm:text-xs leading-relaxed uppercase ${lit ? "text-[#fff1b8] [text-shadow:0_0_8px_rgba(255,214,102,0.8)]" : "text-[#b9ad95]"}`}
      >
        {suspect.name}
      </figcaption>
    </figure>
  );
}
