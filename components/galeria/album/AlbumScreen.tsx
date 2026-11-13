"use client";

import { useEffect, useRef, useState } from "react";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import AlbumCover from "./AlbumCover";
import AlbumPage, { type PacketState } from "./AlbumPage";
import AlbumTab from "./AlbumTab";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";

// Tiempos del sobre: cuánto tarda en romperse y cuánto duran las figuritas pegándose
const OPEN_MS = 750;
const PASTE_MS = 1400;

type View = { selectedId: number | null; turn: "next" | "prev" };

// Propuesta "Álbum de figuritas": tapa con contador, una página por release y un sobrecito para el release nuevo
export default function AlbumScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();
  const [view, setView] = useState<View>({ selectedId: null, turn: "next" });
  const [packet, setPacket] = useState<PacketState>("cerrado");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Sin elección, se abre la página más nueva (al simular el release 2, salta sola a esa)
  const page = releases.find((r) => r.id === view.selectedId) ?? releases[0];
  // Páginas en orden de álbum (release 1 primero)
  const ordered = [...releases].sort((a, b) => a.id - b.id);
  const pageIndex = ordered.findIndex((r) => r.id === page.id);
  const newRelease = releases.find(isNew);
  const total = releases.reduce((sum, r) => sum + r.suspects.length, 0);
  const sealedCount = newRelease && (packet === "cerrado" || packet === "abriendo") ? newRelease.suspects.length : 0;

  const goTo = (id: number) => {
    if (id === page.id) return;
    audioManager.play("slide");
    setView({ selectedId: id, turn: id > page.id ? "next" : "prev" });
  };

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
    setView({ selectedId: null, turn: "next" });
    togglePreview();
  };

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

        {/* Pestañas: una por release, la más nueva primero */}
        <div className="flex gap-1.5 px-3 pt-3 overflow-x-auto overflow-y-hidden [scrollbar-width:none]" role="tablist">
          {releases.map((r) => (
            <AlbumTab key={r.id} label={r.name} active={r.id === page.id} isNew={isNew(r)} onSelect={() => goTo(r.id)} />
          ))}
        </div>

        <AlbumPage
          key={page.id}
          page={page}
          start={firstNumber(page)}
          isNew={isNew(page)}
          packet={packet}
          turn={view.turn}
          pageNumber={pageIndex + 1}
          pageCount={ordered.length}
          onOpenPacket={openPacket}
          onTurn={(dir) => {
            const target = ordered[pageIndex + (dir === "next" ? 1 : -1)];
            if (target) goTo(target.id);
          }}
        />
      </div>

      <ReleasePreviewToggle preview={preview} onToggle={onToggle} />
    </div>
  );
}
