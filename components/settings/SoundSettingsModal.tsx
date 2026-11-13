"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useAudioStore } from "@/stores/useAudioStore";
import GameButton from "../buttons/GameButton";
import { useT } from "@/hooks/useT";
import { soundSettingsMessages } from "./SoundSettingsModal.messages";

interface SoundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SoundSettingsModal({ isOpen, onClose }: SoundSettingsModalProps) {
  const [mounted, setMounted] = useState(false);
  const t = useT(soundSettingsMessages);
  const masterVolume = useAudioStore((state) => state.masterVolume);
  const sfxVolume = useAudioStore((state) => state.sfxVolume);
  const musicVolume = useAudioStore((state) => state.musicVolume);
  const isMuted = useAudioStore((state) => state.isMuted);
  const setMasterVolume = useAudioStore((state) => state.setMasterVolume);
  const setSfxVolume = useAudioStore((state) => state.setSfxVolume);
  const setMusicVolume = useAudioStore((state) => state.setMusicVolume);
  const toggleMute = useAudioStore((state) => state.toggleMute);
  const playSfx = useAudioStore((state) => state.playSfx);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen || typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="
          relative w-full max-w-md
          max-h-[90svh] overflow-y-auto
          p-5 sm:p-7 rounded-2xl
          border border-[rgba(255,243,199,0.2)]
          bg-[rgba(15,23,34,0.95)]
          shadow-[0_20px_50px_rgba(0,0,0,0.8)]
          text-[#FFF3C7]
          flex flex-col gap-4
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-[rgba(255,243,199,0.12)] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⚙️</span>
            <div>
              <h2 className="text-lg font-bold font-mono text-[#FFF3C7]">
                {t("title")}
              </h2>
              <p className="text-[11px] text-[#E1C380]/75 font-mono">
                {t("subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t("close")}
            className="w-9 h-9 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-[rgba(255,243,199,0.06)] border border-[rgba(255,243,199,0.15)] flex items-center justify-center text-[#FFF3C7]/70 hover:text-white hover:border-[#E1C380] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Mute Master Toggle */}
        <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[rgba(255,243,199,0.04)] border border-[rgba(255,243,199,0.1)]">
          <div className="flex items-center gap-3">
            <span className="text-xl">{isMuted ? "🔇" : "🔊"}</span>
            <div>
              <div className="text-xs font-mono font-bold text-[#FFF3C7]">
                {t("muteAll")}
              </div>
              <div className="text-[10px] font-mono text-[#FFF3C7]/50">
                {isMuted ? t("mutedDescription") : t("enabledDescription")}
              </div>
            </div>
          </div>
          <button
            onClick={toggleMute}
            className={`
              shrink-0 px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all cursor-pointer
              ${
                isMuted
                  ? "bg-red-900/80 border border-red-500 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  : "bg-emerald-900/80 border border-emerald-500 text-emerald-200"
              }
            `}
          >
            {isMuted ? t("muted") : t("active")}
          </button>
        </div>

        {/* Master Volume Slider */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[rgba(255,243,199,0.04)] border border-[rgba(255,243,199,0.1)]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold text-[#FFF3C7] flex items-center gap-1.5">
              <span>🎚️</span> {t("masterVolume")}
            </label>
            <span className="text-xs font-mono font-bold text-amber-300">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            disabled={isMuted}
            value={masterVolume}
            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-[#E1C380] disabled:opacity-40"
          />
        </div>

        {/* Music Volume Slider */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[rgba(255,243,199,0.04)] border border-[rgba(255,243,199,0.1)]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold text-[#FFF3C7] flex items-center gap-1.5">
              <span>🎵</span> {t("music")}
            </label>
            <span className="text-xs font-mono font-bold text-amber-300">
              {Math.round(musicVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            disabled={isMuted}
            value={musicVolume}
            onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-[#E1C380] disabled:opacity-40"
          />
        </div>

        {/* SFX Volume Slider */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[rgba(255,243,199,0.04)] border border-[rgba(255,243,199,0.1)]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold text-[#FFF3C7] flex items-center gap-1.5">
              <span>🔔</span> {t("sfx")}
            </label>
            <span className="text-xs font-mono font-bold text-amber-300">
              {Math.round(sfxVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            disabled={isMuted}
            value={sfxVolume}
            onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-[#E1C380] disabled:opacity-40"
          />
        </div>

        {/* Test Sounds */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
          <button
            onClick={() => playSfx("opencasefile")}
            disabled={isMuted}
            className="px-2 py-2.5 sm:py-2 rounded-lg bg-[rgba(255,243,199,0.06)] border border-[rgba(255,243,199,0.15)] text-[10px] font-mono hover:border-[#E1C380] hover:text-[#FFF3C7] transition-all cursor-pointer disabled:opacity-40"
          >
            {t("testFolder")}
          </button>
          <button
            onClick={() => playSfx("arrest")}
            disabled={isMuted}
            className="px-2 py-2.5 sm:py-2 rounded-lg bg-[rgba(255,243,199,0.06)] border border-[rgba(255,243,199,0.15)] text-[10px] font-mono hover:border-[#E1C380] hover:text-[#FFF3C7] transition-all cursor-pointer disabled:opacity-40"
          >
            {t("testArrest")}
          </button>
          <button
            onClick={() => playSfx("hint")}
            disabled={isMuted}
            className="px-2 py-2.5 sm:py-2 rounded-lg bg-[rgba(255,243,199,0.06)] border border-[rgba(255,243,199,0.15)] text-[10px] font-mono hover:border-[#E1C380] hover:text-[#FFF3C7] transition-all cursor-pointer disabled:opacity-40"
          >
            {t("testClue")}
          </button>
          <button
            onClick={() => playSfx("plane")}
            disabled={isMuted}
            className="px-2 py-2.5 sm:py-2 rounded-lg bg-[rgba(255,243,199,0.06)] border border-[rgba(255,243,199,0.15)] text-[10px] font-mono hover:border-[#E1C380] hover:text-[#FFF3C7] transition-all cursor-pointer disabled:opacity-40"
          >
            {t("testPlane")}
          </button>
        </div>

        {/* Close button */}
        <div className="pt-2">
          <GameButton
            icon="✓"
            label={t("saveAndClose")}
            variant="primary"
            onClick={onClose}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
