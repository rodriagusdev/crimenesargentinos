"use client";

import { useState } from "react";
import FileDrawer from "./FileDrawer";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";

// Propuesta "Fichero de prontuarios": un mueble metálico con un cajón por release (el más nuevo arriba y abierto)
export default function FicheroScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();
  // Sin elección, queda abierto el cajón más nuevo
  const [openId, setOpenId] = useState<number | null | "none">(null);
  const currentOpen = openId === null ? releases[0].id : openId;

  return (
    <div className="min-h-svh bg-[#1a1d22] bg-[radial-gradient(ellipse_at_top,rgba(255,236,190,0.12),transparent_60%)] px-3 sm:px-6 py-8 sm:py-12 text-[#FFF3C7]">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-6">
          <p className="text-[10px] tracking-[0.3em] text-[#E1C380]">ARCHIVO DE LA CENTRAL</p>
          <h1 className="mt-2 text-lg sm:text-2xl leading-relaxed">FICHERO DE PRONTUARIOS</h1>
        </header>

        {/* Mueble */}
        <div className="flex flex-col gap-3 sm:gap-4 rounded-xl bg-[#454d58] p-3 sm:p-4 border-4 border-[#353b44] shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
          {releases.map((r) => (
            <FileDrawer
              key={r.id}
              release={r}
              firstNumber={firstNumber(r)}
              isNew={isNew(r)}
              open={currentOpen === r.id}
              onToggle={() => setOpenId(currentOpen === r.id ? "none" : r.id)}
            />
          ))}
        </div>
      </div>

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          setOpenId(null);
          togglePreview();
        }}
      />
    </div>
  );
}
