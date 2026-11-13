"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { audioManager } from "@/lib/audioManager";

export type CaseNote = { title: string; synopsis: string; tilt: number };

// Ficha de un caso clavada en el corcho: se endereza y suena al pasar el mouse
export default function CaseNoteCard({ note, delayMs }: { note: CaseNote; delayMs: number }) {
  const style = { "--tilt": `${note.tilt}deg`, animationDelay: `${delayMs}ms` } as CSSProperties;

  return (
    <Link
      href="/login"
      style={style}
      onMouseEnter={() => audioManager.play("opencasefile", { volume: 0.5 })}
      className="home-drop relative flex flex-col gap-2 p-4 bg-[#f4efe2] text-[#1b1813] rotate-(--tilt) shadow-[0_10px_18px_rgba(0,0,0,0.45)] transition-[rotate,translate,box-shadow] duration-200 hover:rotate-0 hover:-translate-y-1.5 hover:shadow-[0_0_0_3px_#E1C380,0_16px_24px_rgba(0,0,0,0.5)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E1C380]"
    >
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 size-3.5 rounded-full bg-[#c81e1e] shadow-[0_2px_0_#5a0d0d]" aria-hidden />
      <span className="text-[10px] leading-relaxed">{note.title}</span>
      <span className="font-mono text-sm leading-snug">{note.synopsis}</span>
      <span className="self-end mt-1 px-2 py-1 border-[3px] border-double border-[#b91c1c] text-[#b91c1c] text-[8px] rotate-[-6deg]">ABIERTO</span>
    </Link>
  );
}
