"use client";

import CrtMonitor from "./CrtMonitor";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";

// Propuesta "Sala de monitores": una pared de televisores por release; los del release nuevo se encienden como "CANAL NUEVO"
export default function MonitoresScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();

  return (
    <div className="min-h-svh bg-[#0d0f12] px-3 sm:px-6 py-8 sm:py-12 text-[#d9dde3]">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <header className="text-center">
          <p className="text-[10px] tracking-[0.3em] text-[#3dff7a]">CENTRAL DE MONITOREO</p>
          <h1 className="mt-2 text-lg sm:text-2xl leading-relaxed">SALA DE MONITORES</h1>
        </header>

        {releases.map((r) => {
          const fresh = isNew(r);
          const start = firstNumber(r);
          return (
            <section key={r.id} className="flex flex-col gap-4">
              <h2 className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                {fresh ? (
                  <span className="px-2 py-1 rounded bg-[#c81e1e] text-white text-[10px] galeria-blink">● CANAL NUEVO</span>
                ) : null}
                {r.name.toUpperCase()}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 rounded-xl bg-[#1a1c20] p-2 sm:p-3 border-4 border-[#24272c]">
                {r.suspects.map((s, i) => (
                  <CrtMonitor key={s.name} suspect={s} cam={start + i} isNew={fresh} order={i} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          if (!preview) audioManager.play("radio");
          togglePreview();
        }}
      />
    </div>
  );
}
