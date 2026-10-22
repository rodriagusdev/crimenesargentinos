"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAudioStore } from "@/stores/useAudioStore";

const SoundSettingsModal = dynamic(
  () => import("../settings/SoundSettingsModal"),
  { ssr: false }
);

export default function GlobalAudioControl() {
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const isMuted = useAudioStore((state) => state.isMuted);
  const masterVolume = useAudioStore((state) => state.masterVolume);
  const toggleMute = useAudioStore((state) => state.toggleMute);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Floating Audio Gadget */}
      <div
        className="
          fixed bottom-4 left-4 z-[9999]
          flex items-center gap-1 p-1 rounded-2xl
          bg-[rgba(12,19,31,0.85)] hover:bg-[rgba(16,25,40,0.95)]
          border border-[rgba(255,243,199,0.2)] hover:border-[#E1C380]
          backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.65)]
          text-[#FFF3C7] transition-all duration-200 select-none
        "
      >
        {/* Quick Mute Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          title={isMuted ? "Activar audio" : "Silenciar todo"}
          className="
            p-2 rounded-xl hover:bg-[rgba(255,243,199,0.1)]
            text-base transition-transform active:scale-90 cursor-pointer
          "
        >
          {isMuted || masterVolume === 0 ? "🔇" : "🔊"}
        </button>

        <div className="h-4 w-[1px] bg-[rgba(255,243,199,0.15)]" />

        {/* Open Full Audio Settings / Volume Sliders */}
        <button
          type="button"
          onClick={() => setShowSettings(true)}
          title="Ajustes de audio y volumen"
          className="
            flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl
            hover:bg-[rgba(255,243,199,0.1)] transition-colors cursor-pointer group
          "
        >
          <span className="font-mono text-xs font-bold tracking-wider text-[#E1C380]/90 group-hover:text-[#FFF3C7]">
            {isMuted ? "MUTED" : `${Math.round(masterVolume * 100)}%`}
          </span>
          <span className="text-xs text-[#E1C380]/60 group-hover:text-[#E1C380] transition-transform duration-200 group-hover:rotate-45">
            ⚙️
          </span>
        </button>
      </div>

      {/* Global Audio Settings Modal */}
      {showSettings && (
        <SoundSettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}
