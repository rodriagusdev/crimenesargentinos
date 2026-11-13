"use client";

import Image from "next/image";
import Link from "next/link";
import { audioManager } from "@/lib/audioManager";

const playKey = () => audioManager.play("typewriter");

// Barra superior de las portadas públicas: logo, reglas, entrar y registrarse.
// En celular va en una sola fila: logo sin nombre, "?" para las reglas y los dos botones.
export default function HomeNav({ className = "" }: { className?: string }) {
  return (
    <header
      className={`relative z-20 flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-8 py-2.5 sm:py-4 bg-[#070c16]/75 border-b border-[#E1C380]/20 text-[#FFF3C7] ${className}`}
    >
      <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Crímenes Argentinos, inicio">
        <Image src="/images/logofinal.png" alt="" width={66} height={44} priority className="h-9 sm:h-11 w-auto" />
        <span className="hidden md:inline text-xs tracking-widest text-[#E1C380]">CRÍMENES ARGENTINOS</span>
      </Link>
      <nav className="flex items-center gap-1.5 sm:gap-3">
        <Link
          href="/reglas"
          onMouseEnter={playKey}
          aria-label="¿Cómo se juega?"
          className="flex items-center justify-center size-10 sm:size-auto rounded-xl border border-[#FFF3C7]/25 sm:border-0 text-xs sm:text-[10px] sm:px-3 sm:py-3.5 hover:text-[#E1C380]"
        >
          <span className="sm:hidden">?</span>
          <span className="hidden sm:inline">¿CÓMO SE JUEGA?</span>
        </Link>
        <Link
          href="/login"
          onMouseEnter={playKey}
          className="text-[10px] px-3 sm:px-4 py-3 sm:py-3.5 border-2 border-[#E1C380] rounded-xl hover:bg-[#E1C380]/10"
        >
          ENTRAR
        </Link>
        <Link
          href="/login?registro"
          onMouseEnter={playKey}
          className="text-[10px] px-3 sm:px-4 py-3 sm:py-3.5 bg-[#c81e1e] rounded-xl hover:bg-[#a51818]"
        >
          <span className="sm:hidden">REGISTRO</span>
          <span className="hidden sm:inline">REGISTRARSE</span>
        </Link>
      </nav>
    </header>
  );
}
