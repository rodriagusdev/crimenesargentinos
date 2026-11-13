"use client";

import Image from "next/image";
import { Fragment, ReactNode } from "react";
import { useAudioStore } from "@/stores/useAudioStore";

// Piezas visuales del manual de reglas (tarjetas, tablas, avisos y polaroids)

export const Strong = ({ children }: { children: ReactNode }) => (
  <strong className="font-bold text-[#1f1710]">{children}</strong>
);
export const Win = ({ children }: { children: ReactNode }) => (
  <span className="font-bold text-[#1b6b3e]">{children}</span>
);
export const Lose = ({ children }: { children: ReactNode }) => (
  <span className="font-bold text-[#9e1c1c]">{children}</span>
);

export function PolaroidCard({
  imageSrc,
  caption,
  subCaption,
  rotation = "rotate-[-1deg]",
  stamp,
  pinColor = "red",
  className = "",
}: {
  imageSrc: string;
  caption: string;
  subCaption?: string;
  rotation?: string;
  stamp?: string;
  pinColor?: "red" | "gold";
  className?: string;
}) {
  const playSfx = useAudioStore((state) => state.playSfx);

  return (
    <div
      onMouseEnter={() => {
        try {
          playSfx("opencasefile");
        } catch {}
      }}
      className={`relative p-2.5 pb-4 bg-[#faf8f5] text-zinc-900 border border-[#d6c7b2] shadow-[0_10px_24px_rgba(40,30,20,0.18)] rounded-xs select-none transition-all duration-200 hover:scale-105 hover:rotate-0 hover:z-20 hover:shadow-[0_16px_32px_rgba(40,30,20,0.28)] flex flex-col justify-between shrink-0 ${rotation} ${className}`}
    >
      {/* Top Push-pin */}
      <div
        className={`absolute -top-2 left-1/2 -translate-x-1/2 size-4 rounded-full border shadow-sm flex items-center justify-center z-20 ${
          pinColor === "gold"
            ? "bg-amber-400 border-amber-100 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
            : "bg-red-600 border-red-200 shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
        }`}
      >
        <span className="size-1 rounded-full bg-white/80" />
      </div>

      {/* Photo Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-950 border border-zinc-300 rounded-xs">
        <Image
          src={imageSrc}
          alt={caption}
          fill
          sizes="(max-width: 768px) 140px, 200px"
          className="object-cover contrast-[1.05]"
        />

        {stamp && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1">
            <span className="px-2 py-0.5 border-2 border-red-600 text-red-600 bg-red-950/20 font-serif font-black text-[10px] sm:text-xs tracking-widest uppercase rotate-[-12deg] shadow-sm [text-shadow:_0_1px_2px_rgba(255,255,255,0.85)]">
              {stamp}
            </span>
          </div>
        )}
      </div>

      {/* Caption underneath like handwritten Polaroid note */}
      <div className="pt-2 text-center">
        <div className="font-mono text-[11px] sm:text-xs font-bold text-[#2d2116] tracking-tight leading-tight uppercase">
          {caption}
        </div>
        {subCaption && (
          <div className="font-serif text-[10px] text-[#705c47] italic mt-0.5 leading-none">
            {subCaption}
          </div>
        )}
      </div>
    </div>
  );
}

export function BookletCard({
  num,
  title,
  children,
}: {
  num?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative rounded border border-[#c4b395] bg-[#fdfbf5] p-3.5 sm:p-4 shadow-[0_2px_5px_rgba(40,30,20,0.06)] flex flex-col gap-1.5 transition-colors hover:border-[#9e835c]">
      <div className="flex items-center gap-2 border-b border-[#ded3be] pb-2">
        {num && (
          <span className="font-mono text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#e8deca] text-[#4a3a28] border border-[#c5b597]">
            {num}
          </span>
        )}
        <h4 className="font-serif font-bold text-xs sm:text-[14px] tracking-wide text-[#2b2117] uppercase">
          {title}
        </h4>
      </div>
      <div className="text-xs sm:text-[13px] leading-relaxed text-[#3d3124]">
        {children}
      </div>
    </div>
  );
}

export function VintageTable({
  head,
  rows,
}: {
  head: [string, string];
  rows: [ReactNode, ReactNode][];
}) {
  return (
    <div className="overflow-hidden rounded border-2 border-[#b5a180] bg-[#fbf8f0] shadow-sm">
      <table className="w-full text-left text-xs sm:text-[13px]">
        <thead className="bg-[#ede2cb] text-[#3a2d1d] border-b-2 border-[#b5a180]">
          <tr>
            <th className="px-2.5 sm:px-5 py-2 sm:py-2.5 font-serif font-bold tracking-wider uppercase text-[10px] sm:text-xs">
              {head[0]}
            </th>
            <th className="px-2.5 sm:px-5 py-2 sm:py-2.5 font-serif font-bold tracking-wider uppercase text-[10px] sm:text-xs">
              {head[1]}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#dfd3bc]">
          {rows.map(([a, b], idx) => (
            <tr
              key={idx}
              className="hover:bg-[#f3ead6]/80 transition-colors odd:bg-transparent even:bg-[#f6efe0]/60"
            >
              <td className="px-2.5 sm:px-5 py-2.5 sm:py-3 align-middle text-[#2d2319] font-medium">
                {a}
              </td>
              <td className="px-2.5 sm:px-5 py-2.5 sm:py-3 align-middle text-[#3a2e22]">
                {b}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function VintageCallout({
  label,
  children,
  isDanger = false,
}: {
  label: string;
  children: ReactNode;
  isDanger?: boolean;
}) {
  return (
    <div
      className={`relative rounded border-2 p-3.5 sm:p-4 shadow-sm ${
        isDanger
          ? "border-[#a83232] bg-[#fcf2f2] text-[#3a1515]"
          : "border-[#b59e75] bg-[#f7f1e1] text-[#3d3122]"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-sm">{isDanger ? "⚠️" : "📌"}</span>
        <span
          className={`font-serif text-[11px] sm:text-xs font-bold tracking-widest uppercase ${
            isDanger ? "text-[#992222]" : "text-[#5e492f]"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="text-xs sm:text-[13px] leading-relaxed font-serif">
        {children}
      </div>
    </div>
  );
}

// Texto con marcas simples de los mensajes: **negrita**, ++victoria++ (verde), !!derrota!! (rojo)
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*.+?\*\*|\+\+.+?\+\+|!!.+?!!)/).map((part, i) => {
        const inner = part.slice(2, -2);
        if (part.startsWith("**") && part.endsWith("**")) return <Strong key={i}>{inner}</Strong>;
        if (part.startsWith("++") && part.endsWith("++")) return <Win key={i}>{inner}</Win>;
        if (part.startsWith("!!") && part.endsWith("!!")) return <Lose key={i}>{inner}</Lose>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
