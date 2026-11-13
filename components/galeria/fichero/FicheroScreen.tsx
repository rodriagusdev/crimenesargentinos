"use client";

import { useCallback, useState } from "react";
import FileDrawer from "./FileDrawer";
import IntakeMemo from "./IntakeMemo";
import LegajoLightbox from "./LegajoLightbox";
import { flightFrom, type OpenLegajo } from "./legajo";
import PendantLamp from "./PendantLamp";
import WallClock from "./WallClock";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";
import GameBackdrop, { CautionBar, GAME_BG } from "../GameBackdrop";

// Propuesta "Fichero de prontuarios": oficina en penumbra con una lámpara colgante sobre un mueble metálico,
// un cajón por release (el más nuevo arriba y abierto). El release nuevo llega con una circular y sellos.
export default function FicheroScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();
  // Sin elección, queda abierto el cajón más nuevo
  const [openId, setOpenId] = useState<number | null | "none">(null);
  const currentOpen = openId === null ? releases[0].id : openId;
  const newRelease = releases.find(isNew);
  const total = releases.reduce((sum, r) => sum + r.suspects.length, 0);
  // Legajo abierto en el centro de la pantalla (null: ninguno)
  const [legajo, setLegajo] = useState<OpenLegajo | null>(null);

  const closeLegajo = useCallback(() => {
    audioManager.play("click");
    setLegajo((l) => (l ? { ...l, phase: "closing" } : l));
  }, []);
  const clearLegajo = useCallback(() => setLegajo(null), []);

  return (
    <div className={`relative ${GAME_BG} min-h-svh overflow-x-clip px-3 sm:px-6 pb-12 text-[#FFF3C7]`}>
      <GameBackdrop glow="245,158,11" />
      <CautionBar className="max-w-5xl" />
      <div className="relative max-w-5xl mx-auto pt-28 sm:pt-32">
        <PendantLamp />

        <header className="relative flex items-center justify-between gap-3 mb-6">
          <WallClock />
          <div className="text-center flex-1 min-w-0">
            <p className="text-[10px] tracking-[0.3em] text-[#E1C380]">ARCHIVO DE LA CENTRAL</p>
            <h1 className="mt-2 text-base sm:text-2xl leading-relaxed">FICHERO DE PRONTUARIOS</h1>
          </div>
          {/* Contador de fichas archivadas */}
          <div className="shrink-0 rounded border-2 border-[#b08a3e] bg-[#2b2117] px-2 py-1.5 text-center shadow-[0_6px_14px_rgba(0,0,0,0.6)]">
            <p className="font-mono text-base sm:text-xl font-bold text-[#ffe9b0] tabular-nums">{String(total).padStart(3, "0")}</p>
            <p className="text-[8px] sm:text-[10px] text-[#E1C380]">FICHAS</p>
          </div>
        </header>

        {newRelease && <IntakeMemo key={newRelease.id} release={newRelease} />}

        {/* Mueble: tapa, cajones y zócalo */}
        <div className="relative">
          <div className="h-3 mx-1 rounded-t-lg bg-gradient-to-b from-[#6b7482] to-[#454d58]" aria-hidden />
          <div className="flex flex-col gap-3 sm:gap-4 rounded-b-xl bg-[#454d58] p-3 sm:p-4 border-4 border-t-0 border-[#353b44] shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
            {releases.map((r) => (
              <FileDrawer
                key={r.id}
                release={r}
                firstNumber={firstNumber(r)}
                isNew={isNew(r)}
                open={currentOpen === r.id}
                onToggle={() => setOpenId(currentOpen === r.id ? "none" : r.id)}
                awayName={legajo?.suspect.name ?? null}
                onOpenCard={(suspect, number, rect) => {
                  audioManager.play("opencasefile");
                  setLegajo({ suspect, number, release: r.name, isNew: isNew(r), phase: "open", from: flightFrom(rect) });
                }}
              />
            ))}
          </div>
          <div className="flex justify-between px-6" aria-hidden>
            <span className="h-4 w-8 rounded-b bg-[#2b313a]" />
            <span className="h-4 w-8 rounded-b bg-[#2b313a]" />
          </div>
        </div>
      </div>

      {legajo && <LegajoLightbox key={legajo.suspect.name} legajo={legajo} onClose={closeLegajo} onClosed={clearLegajo} />}

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          audioManager.play(preview ? "slide" : "stamp");
          setOpenId(null);
          togglePreview();
        }}
      />
    </div>
  );
}
