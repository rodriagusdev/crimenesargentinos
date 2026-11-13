"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { audioManager } from "@/lib/audioManager";

// Piezas visuales del manual de expedientes, con el mismo estilo de cuadernillo que "¿Cómo se juega?"
// (copiadas de components/rules/RulesBookParts para no acoplar este boceto al manual de reglas)

export function BookletCard({ num, title, children }: { num?: string; title: string; children: ReactNode }) {
  return (
    <div className="relative rounded border border-[#c4b395] bg-[#fdfbf5] p-3.5 sm:p-4 shadow-[0_2px_5px_rgba(40,30,20,0.06)] flex flex-col gap-1.5 transition-colors hover:border-[#9e835c]">
      <div className="flex items-center gap-2 border-b border-[#ded3be] pb-2">
        {num && (
          <span className="font-mono text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#e8deca] text-[#4a3a28] border border-[#c5b597]">
            {num}
          </span>
        )}
        <h4 className="font-serif font-bold text-xs sm:text-[14px] tracking-wide text-[#2b2117] uppercase">{title}</h4>
      </div>
      <div className="text-xs sm:text-[13px] leading-relaxed text-[#3d3124]">{children}</div>
    </div>
  );
}

export function VintageCallout({ label, icon = "📌", children }: { label: string; icon?: string; children: ReactNode }) {
  return (
    <div className="relative rounded border-2 border-[#b59e75] bg-[#f7f1e1] text-[#3d3122] p-3.5 sm:p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-sm" aria-hidden>
          {icon}
        </span>
        <span className="font-serif text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[#5e492f]">{label}</span>
      </div>
      <div className="text-xs sm:text-[13px] leading-relaxed font-serif">{children}</div>
    </div>
  );
}

// Foto del lugar, clavada con chinche (el hover suena como en los polaroids del juego)
export function PinnedPolaroid({ src, caption, subCaption, stamp }: { src: string; caption: string; subCaption: string; stamp: string }) {
  return (
    <div
      onMouseEnter={() => audioManager.play("opencasefile")}
      className="relative w-56 sm:w-64 p-2.5 pb-4 bg-[#faf8f5] text-zinc-900 border border-[#d6c7b2] shadow-[0_10px_24px_rgba(40,30,20,0.18)] rounded-xs rotate-[2deg] transition-all duration-200 hover:scale-105 hover:rotate-0 hover:shadow-[0_16px_32px_rgba(40,30,20,0.28)]"
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 size-4 rounded-full border border-red-200 bg-red-600 shadow-[0_1px_3px_rgba(0,0,0,0.5)] flex items-center justify-center">
        <span className="size-1 rounded-full bg-white/80" />
      </div>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950 border border-zinc-300 rounded-xs">
        <Image src={src} alt={caption} fill sizes="256px" className="object-cover contrast-[1.05] sepia-[0.15]" />
        <div className="absolute inset-0 flex items-end justify-end p-2 pointer-events-none">
          <span className="px-2 py-0.5 border-2 border-red-600 text-red-600 bg-[#faf8f5]/70 font-serif font-black text-[10px] tracking-widest uppercase rotate-[-8deg]">
            {stamp}
          </span>
        </div>
      </div>
      <div className="pt-2 text-center">
        <div className="font-mono text-[11px] sm:text-xs font-bold text-[#2d2116] tracking-tight leading-tight uppercase">{caption}</div>
        <div className="font-serif text-[10px] sm:text-[11px] text-[#705c47] italic mt-0.5 leading-none">{subCaption}</div>
      </div>
    </div>
  );
}

// Sello de goma de la Policía Federal, al pie de cada folio
export function PfaSeal() {
  return (
    <div className="hidden sm:flex shrink-0 size-14 rounded-full border-2 border-[#695138] bg-[#e7d8be] p-0.5 shadow-sm items-center justify-center text-center select-none rotate-[-4deg]">
      <div className="size-full rounded-full border border-dashed border-[#695138] flex flex-col items-center justify-center p-0.5">
        <span className="text-[6px] sm:text-[7px] font-serif font-bold tracking-widest text-[#5c442c] uppercase">Policía Federal</span>
        <span className="text-[8px] sm:text-[10px] font-black tracking-wider text-[#342414] leading-tight">PFA</span>
        <span className="text-[6px] sm:text-[7px] font-serif font-semibold text-[#5c442c] uppercase">Archivo</span>
      </div>
    </div>
  );
}

// Grapa metálica del lomo del cuadernillo
export function Staple() {
  return <div className="w-1.5 h-6 rounded-sm bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-600 shadow-sm border border-zinc-700/80 my-4" />;
}
