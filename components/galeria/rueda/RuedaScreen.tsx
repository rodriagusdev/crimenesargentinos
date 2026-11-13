"use client";

import LineupPerson from "./LineupPerson";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";

// Pared de la rueda: gris con las líneas de altura
const WALL =
  "bg-[#4b5361] bg-[repeating-linear-gradient(180deg,transparent_0,transparent_38px,rgba(230,236,244,0.35)_38px,rgba(230,236,244,0.35)_40px)]";

// Propuesta "Rueda de reconocimiento": una fila por release, se recorre de costado; la nueva entra con reflector
export default function RuedaScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();

  return (
    <div className="min-h-svh bg-[#14171c] px-3 sm:px-6 py-8 sm:py-12 text-[#FFF3C7]">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <header className="text-center">
          <p className="text-[10px] tracking-[0.3em] text-[#E1C380]">SALA DE RECONOCIMIENTO</p>
          <h1 className="mt-2 text-lg sm:text-2xl leading-relaxed">RUEDA DE SOSPECHOSOS</h1>
        </header>

        {releases.map((r) => {
          const fresh = isNew(r);
          const start = firstNumber(r);
          return (
            <section key={r.id} className={`flex flex-col gap-3 ${fresh ? "galeria-in" : ""}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xs sm:text-sm">
                  {r.name.toUpperCase()}
                  {fresh && <span className="ml-3 px-2 py-1 rounded bg-[#c81e1e] text-white text-[10px]">NUEVA RUEDA</span>}
                </h2>
                <span className="font-mono text-sm text-[#FFF3C7]/60">{r.suspects.length} personas · deslizá →</span>
              </div>

              <div className={`relative rounded-xl overflow-hidden border-4 border-[#262b33] ${WALL}`}>
                {/* Reflector que barre la rueda nueva; la vieja queda en penumbra */}
                {fresh ? (
                  <div className="galeria-spot absolute inset-0 pointer-events-none" aria-hidden />
                ) : (
                  <div className="absolute inset-0 bg-black/25 pointer-events-none" aria-hidden />
                )}
                <div className="relative flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden snap-x px-4 sm:px-6 pt-6 pb-5 [scrollbar-width:thin]">
                  {r.suspects.map((s, i) => (
                    <LineupPerson key={s.name} suspect={s} number={start + i} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          // La rueda nueva entra con portazo
          if (!preview) audioManager.play("stamp");
          togglePreview();
        }}
      />
    </div>
  );
}
