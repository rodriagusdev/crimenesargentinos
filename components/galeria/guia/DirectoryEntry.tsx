import SuspectPhoto from "../SuspectPhoto";
import type { GallerySuspect } from "@/lib/suspectReleases";

// Renglón de la guía: foto carnet, nombre en negrita, puntitos e interno. Las altas nuevas van resaltadas con marcador
export default function DirectoryEntry({ suspect, number, isNew }: { suspect: GallerySuspect; number: number; isNew: boolean }) {
  return (
    <li className={`break-inside-avoid flex items-center gap-2 py-1.5 px-1 ${isNew ? "bg-[#fff36b]/70 -rotate-[0.3deg]" : ""}`}>
      <div className="relative size-10 shrink-0 overflow-hidden border border-[#1b1813]/50 bg-[#3a4250]">
        <SuspectPhoto suspect={suspect} index={number} className="grayscale" />
      </div>
      <span className="font-serif text-sm font-black uppercase leading-tight">{suspect.name}</span>
      <span className="flex-1 min-w-4 self-end mb-1.5 border-b-2 border-dotted border-[#1b1813]/40" aria-hidden />
      <span className="font-mono text-xs font-bold">INT. {String(number).padStart(3, "0")}</span>
    </li>
  );
}
