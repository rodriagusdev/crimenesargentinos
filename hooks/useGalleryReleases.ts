"use client";

import { useState } from "react";
import { galleryReleases, isNewRelease, type SuspectRelease } from "@/lib/suspectReleases";

/** Releases para los bocetos de la pantalla de sospechosos, con el interruptor del release de muestra */
export function useGalleryReleases() {
  const [preview, setPreview] = useState(false);
  const releases = galleryReleases(preview);

  // Número de figurita/ficha continuo entre releases (el release 1 arranca en 1)
  const firstNumber = (release: SuspectRelease) =>
    releases.filter((r) => r.id < release.id).reduce((sum, r) => sum + r.suspects.length, 0) + 1;

  return {
    preview,
    togglePreview: () => setPreview((p) => !p),
    releases,
    isNew: (release: SuspectRelease) => isNewRelease(release, releases),
    firstNumber,
  };
}
