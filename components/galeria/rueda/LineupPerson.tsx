import SuspectPhoto from "../SuspectPhoto";
import styles from "./rueda.module.css";
import type { GallerySuspect } from "@/lib/suspectReleases";

type Props = {
  suspect: GallerySuspect;
  number: number;
  /** Lo llamaron por el intercomunicador y dio un paso al frente */
  stepped: boolean;
  /** Rueda nueva: entra caminando desde la puerta */
  walkIn: boolean;
  order: number;
  onCall: () => void;
};

// Persona en la rueda: foto contra la pared, sombra en el piso y el cartel con número y nombre. Al tocarla da un paso al frente.
export default function LineupPerson({ suspect, number, stepped, walkIn, order, onCall }: Props) {
  return (
    <button
      type="button"
      onClick={onCall}
      aria-pressed={stepped}
      aria-label={`Número ${number}, ${suspect.name}`}
      className={`group snap-start shrink-0 w-28 sm:w-36 cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-[#ffd447] ${walkIn ? styles.walkIn : ""}`}
      style={walkIn ? { animationDelay: `${300 + order * 220}ms` } : undefined}
    >
      <div className={`relative flex flex-col items-center gap-2 ${styles.step} ${stepped ? styles.stepped : ""}`}>
        {/* Luz que lo toma cuando da el paso */}
        {stepped && (
          <span
            className="absolute -inset-x-4 -top-10 bottom-6 bg-[radial-gradient(ellipse_55%_80%_at_50%_0%,rgba(255,242,207,0.4),transparent_75%)] pointer-events-none"
            aria-hidden
          />
        )}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-[40%] border-2 border-black/40 bg-[#3a4250] shadow-[0_10px_24px_rgba(0,0,0,0.6)] transition-[filter] group-hover:brightness-110">
          <SuspectPhoto suspect={suspect} index={number} />
        </div>
        {/* Cartel que sostiene */}
        <div
          className={`relative w-full rounded-sm border px-2 py-1.5 text-center transition-colors ${
            stepped ? "bg-[#1b1813] border-[#ffd447]/70" : "bg-[#111] border-[#cfd6e0]/30"
          }`}
        >
          <span className="block text-[10px] text-[#ffd447]">N° {number}</span>
          <span className="block font-mono text-xs font-bold uppercase leading-tight text-white">{suspect.name}</span>
        </div>
        {/* Sombra en el piso */}
        <span className="h-2 w-3/4 rounded-[50%] bg-black/50 blur-[3px]" aria-hidden />
      </div>
    </button>
  );
}
