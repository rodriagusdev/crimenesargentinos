import SuspectPhoto from "../SuspectPhoto";
import type { GallerySuspect } from "@/lib/suspectReleases";
import styles from "./guia.module.css";

type Props = { suspect: GallerySuspect; number: number; isNew: boolean; order: number };

// Renglón de la guía: foto carnet, nombre en negrita, puntitos e interno.
// Las altas nuevas reciben una pasada de marcador amarillo, una tras otra.
export default function DirectoryEntry({ suspect, number, isNew, order }: Props) {
  return (
    <li
      className={`break-inside-avoid flex items-center gap-2 py-1.5 px-1 transition-colors hover:bg-[#1d3f8a]/10 ${
        isNew ? `${styles.marker} -rotate-[0.3deg]` : ""
      }`}
      style={isNew ? { animationDelay: `${700 + order * 260}ms` } : undefined}
    >
      <div className="relative size-10 shrink-0 overflow-hidden border border-[#1b1813]/50 bg-[#3a4250]">
        <SuspectPhoto suspect={suspect} index={number} className="grayscale" />
      </div>
      <span className="font-serif text-sm font-black uppercase leading-tight">{suspect.name}</span>
      <span className="flex-1 min-w-4 self-end mb-1.5 border-b-2 border-dotted border-[#1b1813]/40" aria-hidden />
      <span className="font-mono text-xs font-bold">INT. {String(number).padStart(3, "0")}</span>
    </li>
  );
}
