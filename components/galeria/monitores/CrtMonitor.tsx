import SuspectPhoto from "../SuspectPhoto";
import styles from "./monitores.module.css";
import type { GallerySuspect } from "@/lib/suspectReleases";

type Props = {
  suspect: GallerySuspect;
  cam: number;
  isNew: boolean;
  order: number;
  /** Es el canal que se ve en la pantalla principal */
  onAir: boolean;
  onSelect: () => void;
};

// Monitor CRT de la pared: imagen verdosa con barrido y tracking de VHS; al tocarlo pasa a la pantalla principal
export default function CrtMonitor({ suspect, cam, isNew, order, onAir, onSelect }: Props) {
  // Desfase fijo por cámara para que no fallen todas a la vez
  const drift = `${((cam * 1.37) % 9).toFixed(2)}s`;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={onAir}
      aria-label={`Cámara ${cam}: ${suspect.name}`}
      className={`group rounded-xl p-2 pb-2.5 text-left cursor-pointer transition-colors shadow-[0_10px_24px_rgba(0,0,0,0.6),inset_0_2px_0_rgba(255,255,255,0.08)] focus-visible:outline-2 focus-visible:outline-[#3dff7a] ${
        onAir ? "bg-[#33473a]" : "bg-[#2b2e33] hover:bg-[#363a40]"
      }`}
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[#0b120d] ${isNew ? styles.powerOn : ""}`}
        style={isNew ? { animationDelay: `${400 + order * 450}ms` } : undefined}
      >
        <div className={`absolute inset-0 ${styles.glitch}`} style={{ animationDelay: drift }}>
          <SuspectPhoto suspect={suspect} index={cam} className="grayscale contrast-125 brightness-90 transition-[filter] group-hover:brightness-110" />
          <div className="absolute inset-0 bg-[#3dff7a]/15 mix-blend-color pointer-events-none" aria-hidden />
        </div>
        <div
          className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_3px)]"
          aria-hidden
        />
        <div className={`absolute inset-x-0 top-0 h-1/4 pointer-events-none ${styles.roll}`} style={{ animationDelay: drift }} aria-hidden />
        <div className={`absolute inset-x-0 top-0 pointer-events-none mix-blend-screen ${styles.noise} ${styles.trackingBand}`} style={{ animationDelay: drift }} aria-hidden />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]" aria-hidden />
        <span className="absolute top-1.5 left-2 font-mono text-[10px] text-[#c8ffd6] [text-shadow:0_0_4px_#3dff7a]">CAM {String(cam).padStart(2, "0")}</span>
        {isNew && <span className="absolute top-1.5 right-2 text-[8px] sm:text-[10px] text-[#ff4d4d] galeria-blink">● NUEVO</span>}
        {onAir && <span className="absolute bottom-1.5 right-2 rounded-sm bg-[#c81e1e] px-1 text-[8px] text-white">EN PANTALLA</span>}
      </div>
      {/* Pie del monitor: luz de encendido y nombre */}
      <div className="mt-2 flex items-center gap-1.5">
        <span className={`size-1.5 shrink-0 rounded-full ${onAir ? "bg-[#ff4d4d] shadow-[0_0_6px_#ff4d4d]" : "bg-[#3dff7a] shadow-[0_0_6px_#3dff7a]"}`} aria-hidden />
        <p className="min-w-0 font-mono text-xs font-bold uppercase text-[#d9dde3] truncate">{suspect.name}</p>
      </div>
    </button>
  );
}
