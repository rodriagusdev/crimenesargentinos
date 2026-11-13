import SuspectPhoto from "../SuspectPhoto";
import styles from "./album.module.css";
import type { GallerySuspect } from "@/lib/suspectReleases";

type Props = { suspect: GallerySuspect; number: number; isNew: boolean; /** Recién salida del sobre: se pega con animación */ pasting?: boolean; order: number };

// Figurita del álbum: número, foto y nombre, con brillo de papel satinado. Las del release nuevo son holográficas
export default function StickerCard({ suspect, number, isNew, pasting = false, order }: Props) {
  return (
    <figure
      tabIndex={0}
      className={`${styles.sticker} ${pasting ? styles.paste : ""} relative flex flex-col rounded-md overflow-hidden bg-white p-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:-translate-y-1 hover:rotate-1 focus-visible:-translate-y-1 outline-none ${
        isNew ? "ring-2 ring-[#ffd447] ring-offset-2 ring-offset-[#f3ead2]" : ""
      }`}
      style={{ animationDelay: pasting ? `${order * 160}ms` : undefined }}
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
      {/* Brillo satinado: pasa solo cada tanto (demora distinta por figurita) y al apoyar el mouse */}
      <span className={styles.shine} style={{ animationDelay: `${(order * 1.7) % 9}s` }} aria-hidden />
    </figure>
  );
}
