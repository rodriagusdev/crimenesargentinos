import SuspectPhoto from "../SuspectPhoto";
import type { GuideEntry } from "./guiaPages";
import styles from "./guia.module.css";

type Props = {
  entry: GuideEntry;
  /** Alta de la edición nueva: se pinta con marcador */
  fresh: boolean;
  order: number;
  /** Coincide con lo que se busca: queda encerrado con birome roja */
  found: boolean;
};

// Aviso de la guía: foto carnet, nombre en negrita, puntitos e interno.
// Las altas nuevas reciben una pasada de marcador; lo que se busca, un círculo de birome.
export default function DirectoryEntry({ entry, fresh, order, found }: Props) {
  return (
    <li className="relative flex items-center gap-3 border-b border-[#1b1813]/15 py-2 last:border-b-0">
      <div className="relative size-14 sm:size-16 shrink-0 overflow-hidden border-2 border-[#1b1813] bg-[#3a4250] shadow-[2px_2px_0_#1b1813]">
        <SuspectPhoto suspect={entry.suspect} index={entry.number} className="grayscale contrast-125" />
      </div>
      <span
        className={`min-w-0 font-serif text-base sm:text-lg font-black uppercase leading-tight ${fresh ? styles.marker : ""}`}
        style={fresh ? { animationDelay: `${600 + order * 280}ms` } : undefined}
      >
        {entry.suspect.name}
      </span>
      <span className="flex-1 min-w-3 self-end mb-2 border-b-2 border-dotted border-[#1b1813]/45" aria-hidden />
      <span className="shrink-0 font-mono text-sm font-bold">INT. {String(entry.number).padStart(3, "0")}</span>

      {/* Círculo de birome alrededor de lo que se buscó */}
      {found && (
        <svg className="pointer-events-none absolute -inset-x-2 -inset-y-1 h-[calc(100%+0.5rem)] w-[calc(100%+1rem)]" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
          <path
            className={styles.pen}
            d="M6 22 C 4 8, 40 3, 70 5 S 99 14, 96 24 S 60 39, 30 37 S 2 30, 8 16"
            fill="none"
            stroke="#d42020"
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
    </li>
  );
}
