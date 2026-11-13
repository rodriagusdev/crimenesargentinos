"use client";

import { audioManager } from "@/lib/audioManager";

// Interruptor de los bocetos: agrega un release de muestra para ver cómo se destacan los sospechosos nuevos
export default function ReleasePreviewToggle({ preview, onToggle }: { preview: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        audioManager.play("click");
        onToggle();
      }}
      aria-pressed={preview}
      className={`fixed bottom-4 right-4 z-30 px-4 py-3 rounded-xl border text-[10px] shadow-[0_8px_20px_rgba(0,0,0,0.6)] backdrop-blur-sm cursor-pointer ${
        preview
          ? "bg-[#c81e1e] border-[#ffb4b4] text-white"
          : "bg-[#070c16]/90 border-[#E1C380]/60 text-[#FFF3C7] hover:border-[#E1C380] hover:text-[#E1C380]"
      }`}
    >
      {preview ? "✕ QUITAR RELEASE 2" : "＋ SIMULAR RELEASE 2"}
    </button>
  );
}
