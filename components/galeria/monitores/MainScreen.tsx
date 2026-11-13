"use client";

import SuspectPhoto from "../SuspectPhoto";
import styles from "./monitores.module.css";
import { useCrtClock } from "./useCrtClock";
import type { GallerySuspect } from "@/lib/suspectReleases";

// Barras de color de "sin señal"
const BARS = ["#c0c0c0", "#c0c000", "#00c0c0", "#00c000", "#c000c0", "#c00000", "#0000c0"];

type Props = {
  /** Cámara en pantalla; sin cámara se ven las barras */
  live: { suspect: GallerySuspect; cam: number } | null;
  /** Aviso de canal nuevo en vez de las barras de "sin señal" */
  newChannels: number;
  /** Cambia con cada cambio de canal: vuelve a disparar la ráfaga de estática */
  seq: number;
};

// Pantalla principal de la central: la cámara elegida en grande, con sello de hora, REC y estática al cambiar
export default function MainScreen({ live, newChannels, seq }: Props) {
  const stamp = useCrtClock();

  return (
    <div className="rounded-2xl bg-[#26292e] p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_2px_0_rgba(255,255,255,0.08)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[#0b120d]">
        {live ? (
          <div className={`absolute inset-0 ${styles.glitch}`}>
            <SuspectPhoto suspect={live.suspect} index={live.cam} className="grayscale contrast-125 brightness-90" />
            <div className="absolute inset-0 bg-[#3dff7a]/15 mix-blend-color" aria-hidden />
          </div>
        ) : (
          <div className="absolute inset-0 flex" aria-hidden>
            {BARS.map((c) => (
              <span key={c} className="flex-1 opacity-80" style={{ background: c }} />
            ))}
          </div>
        )}

        {/* Barrido, tracking, viñeta */}
        <div
          className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.3)_0,rgba(0,0,0,0.3)_1px,transparent_1px,transparent_3px)]"
          aria-hidden
        />
        <div className={`absolute inset-x-0 top-0 h-1/4 pointer-events-none ${styles.roll}`} aria-hidden />
        <div className={`absolute inset-x-0 top-0 pointer-events-none mix-blend-screen ${styles.noise} ${styles.trackingBand}`} aria-hidden />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_70px_rgba(0,0,0,0.95)]" aria-hidden />

        {/* Ráfaga de estática al cambiar de canal */}
        {seq > 0 && <div key={seq} className={`absolute inset-0 pointer-events-none bg-[#9aa39c] ${styles.noise} ${styles.burst}`} aria-hidden />}

        {/* Sobreimpresos */}
        <div className="absolute inset-x-3 top-2.5 flex items-start justify-between gap-2 font-mono text-[11px] sm:text-sm text-[#c8ffd6] [text-shadow:0_0_6px_#3dff7a]">
          <span>{live ? `CAM ${String(live.cam).padStart(2, "0")}` : "CAM --"}</span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#ff4d4d] galeria-blink" aria-hidden />
            REC
          </span>
        </div>
        <p className="absolute left-3 bottom-2.5 font-mono text-[11px] sm:text-sm text-[#c8ffd6] [text-shadow:0_0_6px_#3dff7a] tabular-nums">{stamp}</p>

        {live ? (
          <p className="absolute right-3 bottom-2.5 max-w-[50%] truncate rounded-sm bg-black/60 px-2 py-0.5 font-mono text-xs sm:text-base font-bold uppercase text-white">
            {live.suspect.name}
          </p>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <p className="rounded bg-black/80 px-3 py-2 text-center text-[10px] sm:text-xs leading-relaxed text-white">
              {newChannels > 0 ? (
                <>
                  <span className="text-[#ff4d4d] galeria-blink">● CANAL NUEVO</span>
                  <br />
                  {newChannels} CÁMARAS ENCENDIDAS
                </>
              ) : (
                <>
                  SIN SEÑAL
                  <br />
                  <span className="text-[#c8ffd6]">ELEGÍ UNA CÁMARA</span>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
