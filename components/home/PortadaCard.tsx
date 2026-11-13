"use client";

import Link from "next/link";
import { audioManager } from "@/lib/audioManager";
import type { Portada } from "./portadas";

// Botón grande de la galería para abrir una portada
export default function PortadaCard({ portada, index, current }: { portada: Portada; index: number; current: boolean }) {
  return (
    <Link
      href={`/portadas/${portada.id}`}
      onMouseEnter={() => audioManager.play("opencasefile", { volume: 0.5 })}
      className="group flex flex-col rounded-2xl overflow-hidden border-2 border-[#1c2c3e] bg-[#0c1421] shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-all duration-200 hover:-translate-y-1.5 hover:border-[#E1C380] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E1C380]"
    >
      <div className="relative h-28 flex items-center justify-center" style={{ backgroundColor: portada.tone }}>
        <span className="text-4xl text-[#FFF3C7]/90 [text-shadow:0_4px_0_rgba(0,0,0,0.4)]">{index + 1}</span>
        {current && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded bg-[#E1C380] text-[#1b1813] text-[8px]">EN LA HOME</span>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-3 p-5">
        <h2 className="text-xs leading-relaxed text-[#FFF3C7]">{portada.name}</h2>
        <p className="font-mono text-sm leading-snug text-[#FFF3C7]/70">{portada.description}</p>
        <span className="mt-auto text-[9px] text-[#E1C380] group-hover:underline">VER PORTADA →</span>
      </div>
    </Link>
  );
}
