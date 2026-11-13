"use client";

import InterestPoster from "./InterestPoster";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";

// Ladrillos dibujados con gradientes (sin imagen)
const BRICKS =
  "bg-[#6e3526] bg-[linear-gradient(0deg,rgba(0,0,0,0.35)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.3)_2px,transparent_2px)] bg-[size:72px_32px,72px_64px]";

// Propuesta "Muro de carteles": un tramo de pared por release; el más nuevo arriba, bajo "RECIÉN LLEGADOS A LA CIUDAD"
export default function MuroScreen() {
  const { preview, togglePreview, releases, isNew } = useGalleryReleases();

  return (
    <div className={`min-h-svh ${BRICKS} px-3 sm:px-6 py-8 sm:py-12 text-[#FFF3C7]`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <header className="text-center">
          <h1 className="inline-block px-5 py-3 bg-[#111]/80 text-lg sm:text-2xl leading-relaxed [text-shadow:0_3px_0_#000]">
            PERSONAS DE INTERÉS
          </h1>
        </header>

        {releases.map((r) => {
          const fresh = isNew(r);
          return (
            <section key={r.id} className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {fresh ? (
                  <h2 className="px-4 py-2 bg-[#ffd447] text-[#1b1813] text-xs sm:text-sm -rotate-1 shadow-[0_6px_14px_rgba(0,0,0,0.5)]">
                    ¡RECIÉN LLEGADOS A LA CIUDAD!
                  </h2>
                ) : (
                  <h2 className="px-4 py-2 bg-[#111]/70 text-[#FFF3C7]/80 text-[10px] sm:text-xs">{r.name.toUpperCase()}</h2>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-7 sm:gap-x-6">
                {r.suspects.map((s, i) => (
                  <InterestPoster key={s.name} suspect={s} index={i} isNew={fresh} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <ReleasePreviewToggle preview={preview} onToggle={togglePreview} />
    </div>
  );
}
