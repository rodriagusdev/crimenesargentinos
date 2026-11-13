import SuspectPhoto from "../SuspectPhoto";
import type { GallerySuspect } from "@/lib/suspectReleases";

// Monitor CRT con la imagen de una cámara: verdosa, con líneas de barrido; los nuevos se encienden con "CANAL NUEVO"
export default function CrtMonitor({ suspect, cam, isNew, order }: { suspect: GallerySuspect; cam: number; isNew: boolean; order: number }) {
  return (
    <div className="rounded-xl bg-[#2b2e33] p-2 pb-3 shadow-[0_10px_24px_rgba(0,0,0,0.6),inset_0_2px_0_rgba(255,255,255,0.08)]">
      <div
        className={`relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[#0b120d] ${isNew ? "galeria-crt-on" : ""}`}
        style={isNew ? { animationDelay: `${order * 90}ms` } : undefined}
      >
        <SuspectPhoto suspect={suspect} index={cam} className="grayscale contrast-125 brightness-90" />
        <div className="absolute inset-0 bg-[#3dff7a]/15 mix-blend-color pointer-events-none" aria-hidden />
        <div
          className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_3px)]"
          aria-hidden
        />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]" aria-hidden />
        <span className="absolute top-1.5 left-2 font-mono text-[10px] text-[#c8ffd6]">CAM {String(cam).padStart(2, "0")}</span>
        {isNew && <span className="absolute top-1.5 right-2 text-[10px] text-[#ff4d4d] galeria-blink">● NUEVO</span>}
      </div>
      <p className="mt-2 font-mono text-xs font-bold uppercase text-center text-[#d9dde3] truncate">{suspect.name}</p>
    </div>
  );
}
