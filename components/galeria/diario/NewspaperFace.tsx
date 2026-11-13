import SuspectPhoto from "../SuspectPhoto";
import type { GallerySuspect } from "@/lib/suspectReleases";

// Foto de diario: blanco y negro con trama, y el nombre como epígrafe
export default function NewspaperFace({ suspect, index, small = false }: { suspect: GallerySuspect; index: number; small?: boolean }) {
  return (
    <figure className="flex flex-col gap-1">
      <div className="relative aspect-square overflow-hidden border border-[#1b1813] bg-[#3a4250]">
        <SuspectPhoto suspect={suspect} index={index} className="grayscale contrast-125" />
        <div
          className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#000_1px,transparent_1.2px)] bg-[size:3px_3px]"
          aria-hidden
        />
      </div>
      <figcaption className={`font-serif font-bold uppercase leading-tight text-center ${small ? "text-[10px]" : "text-xs"}`}>
        {suspect.name}
      </figcaption>
    </figure>
  );
}
