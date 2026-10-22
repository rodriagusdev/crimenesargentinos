import { ICardLevelPreview } from "@/models/ICardLevelPreview";
import Image from "next/image";
import { createPortal } from "react-dom";
import { usePreviewVideoHandler } from "@/hooks/usePreviewVideoHandler";
import { OverlayVideo } from "../overlays/OverlayVideo";

type LevelCardProps = {
  preview: ICardLevelPreview;
};

export default function LevelCard({ preview }: LevelCardProps) {
  // Cada tarjeta pide su nivel: el habilitado retoma o sortea, uno completado se rejuega;
  // si hay una partida en curso de otro nivel, se pide confirmar antes de abandonarla
  const { handleShowVideo, showVideo, videoURL, goToLevel, pendingAbandon, abandoning, confirmAbandon, cancelAbandon } =
    usePreviewVideoHandler(preview.videoURL, preview.id);

  const handleCardClick = () => {
    if (!preview.canPlay) return; // No permitir click si no puede jugar
    
    if (preview.videoURL) {
      handleShowVideo();
    } else {
      goToLevel();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        overflow-hidden rounded-2xl
        backdrop-blur-xs
        border border-[rgba(255,243,199,0.18)]
        shadow-[0_20px_50px_rgba(0,0,0,0.6)]
        transition-all duration-300
        ${preview.canPlay 
          ? "hover:-translate-y-1 hover:border-[#E1C380]/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.75),0_0_20px_rgba(225,195,128,0.15)] cursor-pointer" 
          : "opacity-50 cursor-not-allowed"
        }
      `}
    >
      <div
        className="
          relative
          h-40
          border-b border-[rgba(255,243,199,0.12)]
          bg-gradient-to-b
          from-[rgba(28,42,58,0.8)]
          to-[rgba(16,24,36,0.8)]
          overflow-hidden
        "
      >
        <Image
          src={preview.imageURL}
          alt="Preview"
          fill
          className="object-contain p-2"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {!preview.canPlay && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-4xl">🔒</span>
          </div>
        )}
        {preview.completed && (
          <span className="absolute top-2 right-2 px-2 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[9px] tracking-widest text-emerald-300">
            ✅ RESUELTO · REJUGAR
          </span>
        )}
      </div>
      <div className="p-5">
        <h3
          className={`
            mb-3
            text-xs
            tracking-widest
            ${preview.canPlay ? "text-[#E1C380]" : "text-[#999999]"}
          `}
        >
          {preview.title}
          {!preview.canPlay && " [BLOQUEADO]"}
        </h3>

        <p className={`text-xs line-clamp-3 ${preview.canPlay ? "text-[#FFF3C7]" : "text-[#888888]"}`}>
          {preview.description}
        </p>
      </div>

      {showVideo && (
        <OverlayVideo videoURL={videoURL} onSkip={goToLevel} />
      )}

      {/* Partida en curso de otro nivel: confirmar que se abandona */}
      {pendingAbandon &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
            onClick={(e) => {
              // El portal sigue dentro del árbol de la tarjeta: sin esto el click la vuelve a abrir
              e.stopPropagation();
              if (!abandoning) cancelAbandon();
            }}
          >
            <div
              className="relative w-full max-w-md backdrop-blur-xs border border-red-500/30 bg-[rgba(18,22,32,0.95)] shadow-[0_25px_60px_rgba(0,0,0,0.8)] rounded-2xl p-6 sm:p-7 flex flex-col items-center text-center text-[#FFF3C7] gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-3xl shadow-inner">
                ⚠️
              </div>

              <h3 className="text-lg sm:text-xl font-bold font-mono text-[#FFF3C7]">
                ¿{preview.completed ? "Rejugar" : "Jugar"} el nivel {preview.id}?
              </h3>

              <p className="text-xs text-[#FFF3C7]/80 font-mono bg-[rgba(10,15,25,0.6)] p-3.5 rounded-xl border border-[rgba(255,243,199,0.12)] leading-relaxed">
                Tenés una partida en curso del nivel {pendingAbandon.level}. Si seguís, se abandona y cuenta como perdida.
              </p>

              <div className="flex flex-row gap-3 w-full pt-1">
                <button
                  type="button"
                  onClick={confirmAbandon}
                  disabled={abandoning}
                  className="flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white border border-red-400/60 transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {abandoning ? "ABANDONANDO..." : "SÍ, SEGUIR"}
                </button>

                <button
                  type="button"
                  onClick={cancelAbandon}
                  disabled={abandoning}
                  className="flex-1 py-3 px-4 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-[rgba(20,30,42,0.6)] hover:bg-[rgba(255,243,199,0.1)] text-[#FFF3C7]/80 hover:text-[#FFF3C7] border border-[rgba(255,243,199,0.2)] transition-all duration-200 cursor-pointer"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
