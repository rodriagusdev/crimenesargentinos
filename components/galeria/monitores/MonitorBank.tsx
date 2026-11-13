import CrtMonitor from "./CrtMonitor";
import styles from "./monitores.module.css";
import type { SuspectRelease } from "@/lib/suspectReleases";

type Props = {
  release: SuspectRelease;
  bank: number;
  fresh: boolean;
  start: number;
  onAirCam: number;
  onSelect: (cam: number) => void;
};

// Banco de monitores de un release; el nuevo muestra la secuencia de encendido
export default function MonitorBank({ release, bank, fresh, start, onAirCam, onSelect }: Props) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
        {fresh && <span className="px-2 py-1 rounded bg-[#c81e1e] text-white text-[10px] galeria-blink">● CANAL NUEVO</span>}
        BANCO {bank} · {release.name.toUpperCase()}
        <span className="font-mono text-sm text-[#d9dde3]/50">{release.suspects.length} cámaras</span>
      </h2>

      {/* Secuencia de encendido de la pared nueva */}
      {fresh && (
        <div className="flex items-center gap-3 rounded-md border border-[#3dff7a]/30 bg-[#0b120d] px-3 py-2">
          <span className="shrink-0 font-mono text-xs text-[#c8ffd6]">ENCENDIENDO BANCO {bank}</span>
          <span className="relative h-2 flex-1 overflow-hidden rounded-sm bg-[#1a2a1f]" aria-hidden>
            <span className={`absolute inset-0 bg-[#3dff7a] shadow-[0_0_8px_#3dff7a] ${styles.progress}`} />
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 rounded-xl bg-[#1a1c20] p-2 sm:p-3 border-4 border-[#24272c] shadow-[inset_0_0_30px_rgba(61,255,122,0.05)]">
        {release.suspects.map((s, i) => (
          <CrtMonitor
            key={s.name}
            suspect={s}
            cam={start + i}
            isNew={fresh}
            order={i}
            onAir={onAirCam === start + i}
            onSelect={() => onSelect(start + i)}
          />
        ))}
      </div>
    </section>
  );
}
