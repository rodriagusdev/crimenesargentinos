"use client";

import Image from "next/image";
import Link from "next/link";
import { audioManager } from "@/lib/audioManager";

const playKey = () => audioManager.play("typewriter");

// Barra superior de las portadas públicas: logo, reglas, entrar y registrarse
export default function HomeNav({ className = "" }: { className?: string }) {
  return (
    <header
      className={`relative z-20 flex flex-wrap items-center justify-between gap-4 px-4 sm:px-8 py-4 bg-[#070c16]/75 border-b border-[#E1C380]/20 text-[#FFF3C7] ${className}`}
    >
      <Link href="/" className="flex items-center gap-3">
        <Image src="/images/logofinal.png" alt="" width={66} height={44} priority className="h-11 w-auto" />
        <span className="text-[10px] sm:text-xs tracking-widest text-[#E1C380]">CRÍMENES ARGENTINOS</span>
      </Link>
      <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Link href="/reglas" onMouseEnter={playKey} className="text-[9px] sm:text-[10px] px-3 py-3.5 hover:text-[#E1C380]">
          ¿CÓMO SE JUEGA?
        </Link>
        <Link
          href="/login"
          onMouseEnter={playKey}
          className="text-[9px] sm:text-[10px] px-4 py-3.5 border-2 border-[#E1C380] rounded-xl hover:bg-[#E1C380]/10"
        >
          ENTRAR
        </Link>
        <Link
          href="/login?registro"
          onMouseEnter={playKey}
          className="text-[9px] sm:text-[10px] px-4 py-3.5 bg-[#c81e1e] rounded-xl hover:bg-[#a51818]"
        >
          REGISTRARSE
        </Link>
      </nav>
    </header>
  );
}
