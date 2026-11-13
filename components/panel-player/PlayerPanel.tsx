"use client";

import Image from "next/image";
import Link from "next/link";
import UserInfo from "./UserInfo";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useAudioStore } from "@/stores/useAudioStore";

export default function PlayerPanel() {
  const { logout } = useAuth();
  const playSfx = useAudioStore((state) => state.playSfx);

  const handleLogout = () => {
    playSfx("click");
    logout();
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {/* 1. FICHA DEL USUARIO */}
      <div>
        <UserInfo />
      </div>

      {/* 2. REGLAS DEL JUEGO (el mismo manual que se ve desde el login) */}
      <div>
        <Link
          href="/reglas?desde=principal"
          onClick={() => playSfx("click")}
          onMouseEnter={() => playSfx("typewriter")}
          className="
            w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
            border-2 border-[#1c2c3e] bg-[#0c1421]
            hover:border-amber-400/60 hover:bg-amber-950/20
            text-slate-300 hover:text-amber-200
            font-mono font-bold text-xs tracking-wider uppercase
            shadow-[0_12px_32px_rgba(0,0,0,0.65)]
            hover:shadow-[0_16px_36px_rgba(0,0,0,0.8),0_0_15px_rgba(245,158,11,0.2)]
            hover:-translate-y-0.5
            transition-all duration-200 cursor-pointer select-none
          "
        >
          <span>¿CÓMO SE JUEGA?</span>
        </Link>
      </div>

      {/* IDIOMA */}
      <div className="flex justify-center">
        <LanguageSwitcher />
      </div>

      {/* 3. BOTON SALIR / CERRAR SESION */}
      <div>
        <button
          type="button"
          onClick={handleLogout}
          onMouseEnter={() => playSfx("typewriter")}
          className="
            group w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl
            border-2 border-[#1c2c3e] bg-[#0c1421]
            hover:border-red-500/60 hover:bg-red-950/25
            text-slate-300 hover:text-red-300
            font-mono font-bold text-xs tracking-wider uppercase
            shadow-[0_12px_32px_rgba(0,0,0,0.65)]
            hover:shadow-[0_16px_36px_rgba(0,0,0,0.8),0_0_15px_rgba(239,68,68,0.2)]
            hover:-translate-y-0.5
            transition-all duration-200 cursor-pointer select-none
          "
        >
          <span>CERRAR SESION</span>
        </button>
      </div>

      {/* 4. LOGO DEL JUEGO */}
      <div className="flex justify-center items-center p-2">
        <Image
          src="/images/logofinal.png"
          alt="Crimenes Argentinos"
          width={220}
          height={220}
          priority
          className="
            h-auto
            max-h-24 md:max-h-28 xl:max-h-32
            w-36 md:w-44 xl:w-52
            object-contain
            opacity-90
            hover:opacity-100
            hover:scale-105
            transition-all duration-300
            drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]
          "
        />
      </div>
    </div>
  );
}
