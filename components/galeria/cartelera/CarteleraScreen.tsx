"use client";

import Audience from "./Audience";
import SeasonSection from "./SeasonSection";
import TheaterFacade from "./TheaterFacade";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";
import GameBackdrop, { CautionBar, GAME_BG } from "../GameBackdrop";

// Propuesta "Cartelera de teatro": fachada con marquesina y reflectores; cada release es una temporada con su elenco.
// La que está en cartel abre el telón con las luces prendidas; el estreno trae rosas, reverencias y aplausos
export default function CarteleraScreen() {
  const { preview, togglePreview, releases, isNew } = useGalleryReleases();
  const hasPremiere = releases.some(isNew);

  return (
    <div className={`relative ${GAME_BG} min-h-svh overflow-x-hidden px-3 sm:px-6 py-8 sm:py-12 text-[#FFF3C7]`}>
      <GameBackdrop glow="220,38,38" />
      <CautionBar className="max-w-5xl" />
      <div className="relative max-w-5xl mx-auto">
        <TheaterFacade premiere={hasPremiere} />

        <div className="flex flex-col gap-10 border-x-4 border-[#3a1a14] bg-[#140a0a] px-2 sm:px-5 py-8">
          {releases.map((r, idx) => (
            <SeasonSection key={r.id} release={r} premiere={isNew(r)} lit={isNew(r) || (!hasPremiere && idx === 0)} />
          ))}
        </div>

        <Audience cheering={hasPremiere} />
      </div>

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          // Estreno: fanfarria y aplausos de la platea
          if (!preview) audioManager.play("winning");
          togglePreview();
        }}
      />
    </div>
  );
}
