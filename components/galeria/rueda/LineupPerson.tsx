import SuspectPhoto from "../SuspectPhoto";
import type { GallerySuspect } from "@/lib/suspectReleases";

// Persona en la rueda de reconocimiento: foto contra la pared con su cartel de número y nombre
export default function LineupPerson({ suspect, number }: { suspect: GallerySuspect; number: number }) {
  return (
    <div className="snap-start shrink-0 w-32 sm:w-40 flex flex-col items-center gap-2">
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-[40%] border-2 border-black/40 bg-[#3a4250] shadow-[0_10px_24px_rgba(0,0,0,0.6)]">
        <SuspectPhoto suspect={suspect} index={number} />
      </div>
      {/* Cartel que sostiene */}
      <div className="w-full rounded-sm bg-[#111] border border-[#cfd6e0]/30 px-2 py-1.5 text-center">
        <span className="block text-[10px] text-[#ffd447]">N° {number}</span>
        <span className="block font-mono text-xs font-bold uppercase leading-tight text-white">{suspect.name}</span>
      </div>
    </div>
  );
}
