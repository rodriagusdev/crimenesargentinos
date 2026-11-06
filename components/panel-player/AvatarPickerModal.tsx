"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AVAILABLE_AVATARS, useAvatarStore } from "@/stores/useAvatarStore";
import { audioManager } from "@/lib/audioManager";
import GameButton from "../buttons/GameButton";

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AvatarPickerModal({ isOpen, onClose }: AvatarPickerModalProps) {
  const [mounted, setMounted] = useState(false);
  const currentAvatar = useAvatarStore((state) => state.currentAvatar);
  const setAvatar = useAvatarStore((state) => state.setAvatar);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen || typeof window === "undefined") return null;

  const handleSelect = (src: string | null) => {
    audioManager.play("click");
    setAvatar(src);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="
          relative w-full max-w-2xl
          p-6 sm:p-8 rounded-2xl
          backdrop-blur-xs bg-[#0c1421]
          border-2 border-[#1c2c3e]
          shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(245,158,11,0.2)]
          text-[#FFF3C7]
          flex flex-col gap-6
          cursor-default
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado táctico */}
        <div className="flex items-center justify-between border-b border-[#1c2c3e]/90 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📸</span>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#E1C380]/80 font-mono">
                Legajo de Identidad Policial
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#E1C380] tracking-wider font-mono">
                ELEGIR FOTOGRAFÍA DE AGENTE
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg border border-[#1c2c3e] bg-[#0e1724] hover:border-amber-400/60 text-slate-400 hover:text-amber-300 font-mono text-sm flex items-center justify-center transition-all cursor-pointer"
            aria-label="Cerrar selección de avatar"
          >
            ✕
          </button>
        </div>

        {/* Lista de Avatares Grandes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
          {AVAILABLE_AVATARS.map((avatar) => {
            const isSelected = currentAvatar === avatar.src;
            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => handleSelect(avatar.src)}
                className={`
                  group relative flex flex-col items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 w-full max-w-[270px]
                  ${
                    isSelected
                      ? "border-amber-400 bg-amber-400/10 shadow-[0_0_25px_rgba(245,158,11,0.4)] ring-2 ring-amber-400/50 scale-[1.02]"
                      : "border-[#1c2c3e] bg-[#0e1724] hover:border-amber-400/60 hover:bg-[#121d2d] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-[1.02]"
                  }
                `}
              >
                {/* Marco de fotografía grande (240x240px) */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-[#1c2c3e] bg-[#0c1421] shadow-inner">
                  <Image
                    src={avatar.src}
                    alt={avatar.name}
                    fill
                    sizes="(max-width: 640px) 240px, 260px"
                    priority
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`
                      font-mono text-sm tracking-wider uppercase font-bold
                      ${isSelected ? "text-amber-300" : "text-slate-200 group-hover:text-amber-200"}
                    `}
                  >
                    {avatar.name}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-[#E1C380]/60 uppercase">
                    {isSelected ? "ACTUALMENTE ASIGNADO" : "CLIC PARA SELECCIONAR"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {currentAvatar && (
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className="text-xs font-mono text-slate-400 hover:text-red-300 underline underline-offset-4 transition-colors cursor-pointer"
            >
              Restablecer a sin foto
            </button>
          </div>
        )}

        {/* Botón de cierre */}
        <div className="w-full pt-1">
          <GameButton
            icon="✓"
            label="LISTO"
            onClick={() => {
              audioManager.play("click");
              onClose();
            }}
            variant="primary"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

