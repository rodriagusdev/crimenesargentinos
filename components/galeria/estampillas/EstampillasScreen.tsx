"use client";

import FirstDayCover from "./FirstDayCover";
import StampSheet from "./StampSheet";
import styles from "./estampillas.module.css";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";

// Propuesta "Estampillas": mesa del filatelista con el sobre de la colección y una hoja por serie.
// La serie nueva llega con colores vivos y el matasellos de "primer día de emisión" cae con su golpe
export default function EstampillasScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();
  const newest = releases[0];
  const firstDay = isNew(newest);
  const ordered = [...releases].sort((a, b) => a.id - b.id);

  return (
    <div className="relative min-h-svh overflow-hidden bg-[#2b3a2f] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)] px-3 sm:px-6 py-8 sm:py-12 pb-24">
      {/* Paño verde de la mesa y luz de la lámpara que se mueve despacio */}
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.08)_0_2px,transparent_2px_5px)]" aria-hidden />
      <div className={`${styles.lamp} pointer-events-none absolute -inset-1/4`} aria-hidden />

      <div className="relative max-w-5xl mx-auto flex flex-col gap-10">
        <FirstDayCover
          key={firstDay ? "primer-dia" : "sobre"}
          stamp={newest.suspects[0]}
          stampNumber={firstNumber(newest)}
          series={newest.id}
          firstDay={firstDay}
        />

        <p className="-mt-6 text-center text-[10px] leading-relaxed text-[#f4efe3]/60">
          <span className="hidden sm:inline">PASÁ LA LUPA POR LAS ESTAMPILLAS · </span>TOCÁ UNA PARA LEVANTARLA CON LA PINZA
        </p>

        {releases.map((r) => (
          <StampSheet key={r.id} release={r} start={firstNumber(r)} isNew={isNew(r)} page={ordered.indexOf(r) + 1} />
        ))}
      </div>

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          if (!preview) audioManager.play("stamp");
          togglePreview();
        }}
      />
    </div>
  );
}
