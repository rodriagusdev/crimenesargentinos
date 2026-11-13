import type { SuspectRelease } from "@/lib/suspectReleases";
import styles from "./fichero.module.css";

// Circular interna que llega con el release nuevo: avisa cuántas fichas ingresaron y en qué cajón quedaron
export default function IntakeMemo({ release }: { release: SuspectRelease }) {
  return (
    <div
      role="status"
      className={`relative mx-auto mb-5 max-w-md bg-[#fbf6e6] text-[#2b2117] px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.6)] ${styles.memo}`}
    >
      {/* Chinche */}
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 size-4 rounded-full bg-[#c81e1e] shadow-[0_2px_3px_rgba(0,0,0,0.5)]" aria-hidden />
      <p className="font-mono text-[10px] tracking-widest text-[#7a6a50]">CIRCULAR INTERNA N° {String(release.id).padStart(3, "0")}</p>
      <p className="mt-1 font-mono text-sm leading-snug">
        Ingresaron <b>{release.suspects.length} fichas nuevas</b> al archivo. Quedaron en el cajón «{release.name}».
      </p>
      <span
        className={`absolute -bottom-2 right-3 border-2 border-[#1d5fa8] px-2 py-0.5 text-[10px] text-[#1d5fa8] bg-[#fbf6e6]/80 ${styles.stamp}`}
        style={{ animationDelay: "500ms" }}
        aria-hidden
      >
        RECIBIDO
      </span>
    </div>
  );
}
