"use client";

import RecordCard from "./RecordCard";
import type { useLegajo } from "./useLegajo";
import { audioManager } from "@/lib/audioManager";
import type { SuspectRelease } from "@/lib/suspectReleases";
import styles from "./fichero.module.css";

type Props = {
  release: SuspectRelease;
  firstNumber: number;
  isNew: boolean;
  open: boolean;
  onToggle: () => void;
  /** Nombre del sospechoso con el legajo en el centro (en su lugar queda la cinta rota) */
  awayName: string | null;
  /** Gestos de las fichas (vista previa con mouse, toque en pantallas táctiles) */
  legajo: Pick<ReturnType<typeof useLegajo>, "hoverStart" | "hoverEnd" | "tap">;
};

const initial = (name: string) => name.normalize("NFD").charAt(0).toUpperCase();

// Cajón del fichero: el frente con portaetiquetas, manija y cerradura; abierto, sale con profundidad y muestra
// los separadores con letras y las fichas adentro
export default function FileDrawer({ release, firstNumber, isNew, open, onToggle, awayName, legajo }: Props) {
  const letters = [...new Set(release.suspects.map((s) => initial(s.name)))].sort();
  const last = firstNumber + release.suspects.length - 1;
  const card = (suspect: SuspectRelease["suspects"][number], number: number) => ({ suspect, number, release: release.name, isNew });

  return (
    <div className="rounded-lg bg-[#56606e] p-2 sm:p-3 shadow-[inset_0_2px_0_rgba(255,255,255,0.15),0_8px_20px_rgba(0,0,0,0.5)]">
      <button
        type="button"
        onClick={() => {
          audioManager.play("slide");
          onToggle();
        }}
        aria-expanded={open}
        className={`relative w-full flex flex-col items-center gap-3 rounded-md bg-gradient-to-b from-[#7d8794] to-[#5f6977] border border-[#3a424d] px-4 py-5 cursor-pointer hover:from-[#8994a1] transition-transform duration-200 ${
          open ? "translate-y-0.5 shadow-[inset_0_-4px_0_rgba(0,0,0,0.25)]" : "shadow-[0_4px_0_#3a424d]"
        }`}
      >
        {/* Remaches de las esquinas */}
        {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos) => (
          <span key={pos} className={`absolute ${pos} size-1.5 rounded-full bg-[#c9ccd1] shadow-[0_1px_0_#2b313a]`} aria-hidden />
        ))}

        {/* Portaetiquetas de bronce */}
        <span className="min-w-48 rounded-sm border-[3px] border-[#b08a3e] bg-[#f6f0de] px-4 py-2 text-[#2b2117] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25),0_1px_0_rgba(255,255,255,0.3)]">
          <span className="block text-xs">{release.name.toUpperCase()}</span>
          <span className="block font-mono text-sm font-bold">
            Legajos {firstNumber}–{last}
          </span>
          <span className="block font-mono text-[10px] text-[#7a6a50]">{release.suspects.length} fichas</span>
        </span>
        {/* Manija y cerradura */}
        <span className="flex items-center gap-4" aria-hidden>
          <span className="h-3 w-28 rounded-full bg-gradient-to-b from-[#e3e6ea] to-[#8f97a3] border border-[#4b525c] shadow" />
          <span className="relative size-4 rounded-full bg-gradient-to-b from-[#d9b25d] to-[#8a6a25] border border-[#5a4517]">
            <span className="absolute left-1/2 top-1 -translate-x-1/2 h-2 w-0.5 bg-[#2b2117]" />
          </span>
        </span>
        <span className="font-mono text-xs text-[#e6e9ee]">{open ? "▲ CERRAR CAJÓN" : "▼ ABRIR CAJÓN"}</span>

        {isNew && (
          <span className={`absolute top-3 -left-2 sm:-left-3 px-3 py-1 bg-[#c81e1e] text-white text-[10px] shadow-md ${styles.ribbon}`}>
            INGRESO RECIENTE
          </span>
        )}
      </button>

      {open && (
        <div
          className={`relative mt-3 rounded-md bg-[#2b313a] p-3 sm:p-5 shadow-[inset_0_10px_20px_rgba(0,0,0,0.7),inset_0_-2px_0_rgba(255,255,255,0.06)] ${styles.drawerOut}`}
        >
          {/* Separadores con letras, escalonados como en un fichero real */}
          <div className="flex flex-wrap gap-1 mb-4" aria-label={`Separadores: ${letters.join(", ")}`}>
            {letters.map((l, i) => (
              <span
                key={l}
                aria-hidden
                className="rounded-t-md bg-[#c9b98f] border border-b-0 border-[#9e8f68] px-2 pt-0.5 font-mono text-[10px] font-bold text-[#2b2117]"
                style={{ marginTop: `${(i % 3) * 3}px` }}
              >
                {l}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pt-2.5">
            {release.suspects.map((s, i) => (
              <RecordCard
                key={s.name}
                suspect={s}
                number={firstNumber + i}
                isNew={isNew}
                order={i}
                away={awayName === s.name}
                onHoverStart={(el) => legajo.hoverStart(card(s, firstNumber + i), el)}
                onHoverEnd={legajo.hoverEnd}
                onTap={(el) => legajo.tap(card(s, firstNumber + i), el)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
