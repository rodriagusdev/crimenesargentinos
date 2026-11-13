"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Sidewalk from "./Sidewalk";
import StreetScene from "./StreetScene";
import WallStretch from "./WallStretch";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";
import styles from "./muro.module.css";
import GameBackdrop, { CautionBar, GAME_BG } from "../GameBackdrop";

// Ladrillos dibujados con gradientes (sin imagen), oscurecidos por la noche
const BRICKS =
  "bg-[#5a2b20] bg-[linear-gradient(0deg,rgba(0,0,0,0.35)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.3)_2px,transparent_2px)] bg-[size:72px_32px,72px_64px]";

// Cada cuánto sopla una ráfaga que hace flamear un cartel al azar, y cuánto dura
const GUST_EVERY_MS = 3800;
const GUST_MS = 1200;

// Propuesta "Muro de carteles": calle de noche con farol, un tramo de pared por release y la vereda mojada.
// El release nuevo se pega con engrudo bajo "RECIÉN LLEGADOS A LA CIUDAD"
export default function MuroScreen() {
  const { preview, togglePreview, releases, isNew } = useGalleryReleases();
  // Cartel que está flameando ahora (por una ráfaga o porque lo tocaron)
  const [gust, setGust] = useState<string | null>(null);
  const calmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stampTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = releases.reduce((sum, r) => sum + r.suspects.length, 0);
  const namesKey = releases.flatMap((r) => r.suspects.map((s) => s.name)).join("|");

  const flutter = useCallback((name: string) => {
    setGust(name);
    if (calmTimer.current) clearTimeout(calmTimer.current);
    calmTimer.current = setTimeout(() => setGust(null), GUST_MS);
  }, []);

  useEffect(() => {
    const names = namesKey.split("|");
    const id = setInterval(() => flutter(names[Math.floor(Math.random() * names.length)]), GUST_EVERY_MS);
    return () => clearInterval(id);
  }, [namesKey, flutter]);

  useEffect(
    () => () => {
      if (calmTimer.current) clearTimeout(calmTimer.current);
      if (stampTimer.current) clearTimeout(stampTimer.current);
    },
    [],
  );

  return (
    <div className={`relative ${GAME_BG} min-h-svh overflow-x-hidden pt-6 sm:pt-8 text-[#FFF3C7]`}>
      <GameBackdrop glow="245,158,11" />
      <CautionBar className="max-w-6xl" />
      <div className="relative max-w-6xl mx-auto">
        <StreetScene count={total} />

        <div className={`relative ${BRICKS} px-3.5 sm:px-6 py-8 sm:py-12`}>
          {/* Luz del farol sobre la pared y sombra de la noche en los bordes */}
          <div
            className={`${styles.flicker} absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_12%_0%,rgba(255,200,110,0.28),transparent_70%)]`}
            aria-hidden
          />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_30%,transparent_40%,rgba(0,0,0,0.55))]" aria-hidden />

          <div className="relative flex flex-col gap-12">
            {releases.map((r) => (
              <WallStretch
                key={r.id}
                release={r}
                fresh={isNew(r)}
                gust={gust}
                onFlutter={(name) => {
                  audioManager.play("slide", { volume: 0.5 });
                  flutter(name);
                }}
              />
            ))}
          </div>
        </div>

        <Sidewalk />
      </div>

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          if (!preview) {
            // Brochazo de engrudo y el cartelón que se estampa contra la pared
            audioManager.play("slide");
            if (stampTimer.current) clearTimeout(stampTimer.current);
            stampTimer.current = setTimeout(() => audioManager.play("stamp"), 450);
          }
          togglePreview();
        }}
      />
    </div>
  );
}
