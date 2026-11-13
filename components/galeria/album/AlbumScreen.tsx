"use client";

import { useEffect, useRef, useState } from "react";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import AlbumCover from "./AlbumCover";
import AlbumNav from "./AlbumNav";
import AlbumPage, { type PacketState } from "./AlbumPage";
import AlbumTab from "./AlbumTab";
import { buildLeaves } from "./albumPages";
import { useAlbumPager } from "./useAlbumPager";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";

// Tiempos del sobre: cuánto tarda en romperse y cuánto duran las figuritas pegándose
const OPEN_MS = 750;
const PASTE_MS = 1400;
// Distancia mínima del deslizamiento con el dedo para dar vuelta la hoja
const SWIPE_PX = 50;

// Propuesta "Álbum de figuritas": tapa con contador, 10 figuritas por hoja que se dan vuelta sobre el lomo,
// pestañas por release y un sobrecito para el release nuevo
export default function AlbumScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();
  const [packet, setPacket] = useState<PacketState>("cerrado");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const touchX = useRef<number | null>(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const leaves = buildLeaves(releases, firstNumber);
  // Se abre en la primera hoja del release más nuevo (al simular el release 2, salta sola a esa)
  const firstLeafOf = (id: number) => leaves.findIndex((l) => l.release.id === id);
  const pager = useAlbumPager(leaves.length, firstLeafOf(releases[0].id));
  const { state, current } = pager;
  const leaf = leaves[current];

  const newRelease = releases.find(isNew);
  const total = releases.reduce((sum, r) => sum + r.suspects.length, 0);
  const sealedCount = newRelease && (packet === "cerrado" || packet === "abriendo") ? newRelease.suspects.length : 0;

  const openPacket = () => {
    audioManager.play("opencasefile");
    setPacket("abriendo");
    timers.current.push(
      setTimeout(() => setPacket("pegando"), OPEN_MS),
      setTimeout(() => setPacket("pegado"), OPEN_MS + PASTE_MS),
    );
  };

  const onToggle = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (!preview) audioManager.play("hint");
    setPacket("cerrado");
    pager.reset();
    togglePreview();
  };

  // Mientras gira una hoja: abajo queda la que se descubre (siguiente) o la que se tapa (anterior)
  const turning = state.kind === "turning" ? state : null;
  const underIndex = turning ? (turning.dir === "next" ? turning.to : turning.from) : current;
  const flipIndex = turning ? (turning.dir === "next" ? turning.from : turning.to) : null;

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#123a6b] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.12),transparent_45%)] px-3 sm:px-6 py-8 sm:py-12 pb-24 text-[#1b1813]">
      <div className="max-w-5xl mx-auto">
        <AlbumCover pasted={total - sealedCount} total={total} />

        {/* Aviso del sobre nuevo */}
        {newRelease && (
          <p
            key={sealedCount ? "sobre" : "listo"}
            className="galeria-in mb-4 rounded-lg border-2 border-dashed border-[#ffd447] bg-[#0b2547] px-3 py-2.5 text-center text-[10px] leading-relaxed text-[#ffd447]"
            role="status"
          >
            {sealedCount
              ? `¡LLEGÓ UN SOBRE NUEVO! ABRILO Y PEGÁ LAS ${sealedCount} FIGURITAS DE LA ${newRelease.name.toUpperCase()}`
              : "¡FIGURITAS PEGADAS! YA TENÉS TODA LA COLECCIÓN"}
          </p>
        )}

        {/* Pestañas: saltan a la primera hoja de cada release, el más nuevo primero */}
        <div className="flex gap-1.5 px-3 pt-3 overflow-x-auto overflow-y-hidden [scrollbar-width:none]" role="tablist">
          {releases.map((r) => (
            <AlbumTab key={r.id} label={r.name} active={r.id === leaf.release.id} isNew={isNew(r)} onSelect={() => pager.go(firstLeafOf(r.id))} />
          ))}
        </div>

        {/* Hojas: la de abajo en su lugar y, durante el giro, la que rota sobre el lomo encima */}
        <div
          className="relative touch-pan-y"
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > SWIPE_PX) pager.go(current + (dx < 0 ? 1 : -1));
          }}
        >
          <AlbumPage
            key={`hoja-${underIndex}`}
            leaf={leaves[underIndex]}
            isNew={isNew(leaves[underIndex].release)}
            packet={packet}
            onOpenPacket={openPacket}
            cast={turning?.dir}
          />
          {flipIndex !== null && turning && (
            <AlbumPage
              key={`giro-${flipIndex}-${turning.dir}`}
              leaf={leaves[flipIndex]}
              isNew={isNew(leaves[flipIndex].release)}
              packet={packet}
              onOpenPacket={openPacket}
              flip={turning.dir}
              onFlipEnd={pager.finish}
            />
          )}
        </div>

        <AlbumNav page={current + 1} pageCount={leaves.length} onPrev={() => pager.go(current - 1)} onNext={() => pager.go(current + 1)} />
      </div>

      <ReleasePreviewToggle preview={preview} onToggle={onToggle} />
    </div>
  );
}
