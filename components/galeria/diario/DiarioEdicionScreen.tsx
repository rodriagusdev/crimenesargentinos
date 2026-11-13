"use client";

import ExtraBanner from "./ExtraBanner";
import FrontPage from "./FrontPage";
import Hemeroteca from "./Hemeroteca";
import PressHero from "./PressHero";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";

// Propuesta "Edición especial": el taller de la rotativa y, debajo, la tapa de El Vespertino del release más nuevo.
// Cuando sale un release, la tapa llega girando y el canillita pregona; las anteriores quedan en la hemeroteca.
export default function DiarioEdicionScreen() {
  const { preview, togglePreview, releases, isNew } = useGalleryReleases();
  const [latest, ...archive] = releases;
  const fresh = isNew(latest);

  return (
    <div className="min-h-svh overflow-x-clip bg-[#2a2420] bg-[radial-gradient(ellipse_at_top,rgba(255,214,140,0.10),transparent_60%)] px-3 sm:px-6 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <PressHero rush={fresh} />
        {fresh && <ExtraBanner key={latest.id} count={latest.suspects.length} />}
        <FrontPage key={latest.id} release={latest} fresh={fresh} />
        {archive.length > 0 && <Hemeroteca archive={archive} />}
      </div>

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          audioManager.play(preview ? "slide" : "swoosh");
          togglePreview();
        }}
      />
    </div>
  );
}
