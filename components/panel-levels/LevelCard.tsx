import { ICardLevelPreview } from "@/models/ICardLevelPreview";
import Image from "next/image";
import { createPortal } from "react-dom";
import { usePreviewVideoHandler } from "@/hooks/usePreviewVideoHandler";

type LevelCardProps = {
  preview: ICardLevelPreview;
};

export default function LevelCard({ preview }: LevelCardProps) {
  // Cada tarjeta pide su nivel: retoma la partida en curso o sortea el caso
  const {
    handleShowVideo,
    showVideo,
    videoURL,
    goToLevel,
    loadingLevel,
    pendingAbandon,
    abandoning,
    confirmAbandon,
    cancelAbandon,
  } = usePreviewVideoHandler(preview.videoURL, preview.id);

  const handleCardClick = () => {
    if (!preview.canPlay || loadingLevel) return;

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
        group relative flex flex-col rounded-2xl overflow-hidden
        border-2 transition-all duration-200
        ${preview.canPlay && !loadingLevel
          ? "border-[#1c2c3e] bg-[#0c1421] hover:border-amber-400/60 hover:-translate-y-1 active:scale-[0.98] hover:shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_20px_rgba(245,158,11,0.15)] cursor-pointer"
          : loadingLevel
            ? "border-amber-400/80 bg-[#0c1421] shadow-[0_0_25px_rgba(245,158,11,0.3)] cursor-wait"
            : "border-[#141e2b] bg-[#080d15] opacity-60 cursor-not-allowed"
        }
        shadow-[0_12px_32px_rgba(0,0,0,0.65)]
      `}
    >
      {/* 1. Header con título del caso/nivel */}
      <div className="px-3.5 py-2.5 flex flex-col items-center justify-between border-b border-[#1c2c3e]/80 bg-[#0e1724]">
        <h3
          className={`
            font-mono font-bold text-xs sm:text-sm tracking-wider uppercase text-center
            ${preview.canPlay ? "text-[#f1f5f9] group-hover:text-amber-300 transition-colors" : "text-slate-500"}
          `}
        >
          {preview.title}
        </h3>
        <div>
          {preview.completed ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-500/50 text-emerald-300">
              RESUELTO
            </span>
          ) : preview.canPlay ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-950/50 border border-amber-500/40 text-amber-300">
              DISPONIBLE
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-500">
              BLOQUEADO
            </span>
          )}
        </div>
      </div>

      {/* 2. Artwork central con protagonismo visual (Hero image) */}
      <div className="relative aspect-[4/3] w-full bg-[#060a10] overflow-hidden">
        <Image
          src={preview.imageURL}
          alt={preview.title}
          fill
          className={`
            object-cover transition-transform duration-500
            ${preview.canPlay ? "group-hover:scale-105" : " contrast-200"}
          `}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradiente sutil para profundidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1421] via-transparent to-black/30 pointer-events-none" />

        {/* OVERLAYS SEGÚN ESTADO */}

        {/* Estado: Iniciando caso (feedback de click instantáneo) */}
        {loadingLevel && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2.5 select-none animate-fade-in z-10">
            <span className="inline-flex items-center animate-spin text-amber-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </span>
            <span className="font-mono text-[10px] font-bold tracking-widest text-amber-300 uppercase bg-black/70 px-3 py-1 rounded-full border border-amber-500/40">
              INICIANDO CASO...
            </span>
          </div>
        )}

        {/* Estado B: Bloqueado - Candado */}
        {!preview.canPlay && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 select-none">
            <div className="w-12 h-12 rounded-full bg-slate-900/90 border-2 border-slate-700/80 flex items-center justify-center text-2xl shadow-inner text-slate-400">
              🔒
            </div>
            <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-black/60 px-2 py-0.5 rounded border border-slate-800">
              BLOQUEADO
            </span>
          </div>
        )}
      </div>

      {/* 3. Descripción y acción del caso */}
      <div className="p-3.5 bg-[#0c1421] border-t border-[#1c2c3e]/80 flex flex-col justify-between gap-3 flex-1">
        <p className="text-xs text-[#FFF3C7]/75 font-mono line-clamp-2 leading-relaxed">
          {preview.description}
        </p>

        <div className="pt-1">
          {preview.completed ? (
            <div className="w-full py-2 px-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center gap-2 group-hover:bg-emerald-900/60 transition-colors">
              <span>★ RESUELTO</span>
              <span className="text-[10px] text-emerald-400/70 font-normal">· REJUGAR ➔</span>
            </div>
          ) : preview.canPlay ? (
            <div className="w-full py-2 px-3 rounded-xl border border-amber-400/60 bg-amber-500/15 text-amber-200 font-mono font-bold text-xs flex items-center justify-center gap-2 group-hover:bg-amber-500/25 group-hover:border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)] transition-all">
              <span>INVESTIGAR</span>
            </div>
          ) : (
            <div className="w-full py-2 px-3 rounded-xl border border-[#1c2c3e]/50 bg-[#080d15]/60 text-slate-600 font-mono font-bold text-xs flex items-center justify-center gap-2">
              <span>BLOQUEADO</span>
            </div>
          )}
        </div>
      </div>

      {/* Partida en curso de otro nivel: confirmar abandono */}
      {pendingAbandon &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
            onClick={(e) => {
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
          document.body
        )}
    </div>
  );
}
