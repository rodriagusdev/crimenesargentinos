import { KeyboardEvent } from "react";
import Image from "next/image";
import { ICardLevelPreview } from "@/models/ICardLevelPreview";
import { usePreviewVideoHandler } from "@/hooks/usePreviewVideoHandler";
import { audioManager } from "@/lib/audioManager";
import AbandonSessionModal from "./AbandonSessionModal";
import PoliceTapeOverlay from "./PoliceTapeOverlay";

type LevelCardProps = {
  preview: ICardLevelPreview;
};

// closed: ganó todas las variantes del nivel; completed: ganó alguna pero quedan variantes por jugar
type CardState = "closed" | "completed" | "available" | "locked";

// Estilo por estado: franja superior, ficha de estado y botón de acción
const theme: Record<
  CardState,
  { card: string; stripe: string; badge: string; badgeText: string; cta: string; ctaLabel: string; ctaIcon: string; report: string }
> = {
  closed: {
    card: "border-emerald-900/70 hover:border-emerald-400/60",
    stripe: "bg-emerald-500",
    badge: "bg-emerald-950/85 border-emerald-500/60 text-emerald-300",
    badgeText: "✓ CERRADO",
    cta: "border-emerald-500/50 bg-emerald-950/50 text-emerald-300 group-hover:bg-emerald-900/70 group-hover:border-emerald-400",
    ctaLabel: "REJUGAR",
    ctaIcon: "↻",
    report: "INFORME DEL CASO · ARCHIVADO",
  },
  completed: {
    card: "border-emerald-900/70 hover:border-emerald-400/60",
    stripe: "bg-emerald-500/70",
    badge: "bg-emerald-950/85 border-emerald-500/60 text-emerald-300",
    badgeText: "✓ RESUELTO",
    cta: "border-emerald-500/50 bg-emerald-950/50 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-[#0c1421] group-hover:border-emerald-300",
    ctaLabel: "JUGAR",
    ctaIcon: "▶",
    report: "INFORME DEL CASO",
  },
  available: {
    card: "border-amber-400/45 shadow-[0_0_0_1px_rgba(245,158,11,0.15),0_0_28px_rgba(245,158,11,0.18)] hover:border-amber-400",
    stripe: "bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.7)]",
    badge: "bg-amber-950/85 border-amber-400/70 text-amber-300 animate-pulse",
    badgeText: "● DISPONIBLE",
    cta: "border-amber-400/70 bg-amber-500/15 text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.2)] group-hover:bg-amber-400 group-hover:text-[#0c1421] group-hover:border-amber-300",
    ctaLabel: "INVESTIGAR",
    ctaIcon: "▶",
    report: "INFORME DEL CASO",
  },
  locked: {
    card: "border-[#141e2b] bg-[#080d15]",
    stripe: "bg-[repeating-linear-gradient(45deg,#eab308,#eab308_6px,#111827_6px,#111827_12px)] opacity-60",
    badge: "bg-slate-950/85 border-slate-700 text-slate-400",
    badgeText: "BLOQUEADO",
    cta: "border-slate-800 bg-[#080d15]/70 text-slate-500",
    ctaLabel: "RESOLVÉ EL NIVEL ANTERIOR",
    ctaIcon: "🔒",
    report: "INFORME CLASIFICADO",
  },
};

// Esquinas de visor que aparecen al apuntar un nivel jugable
const corner = "absolute size-5 border-amber-300/90 opacity-0 transition-all duration-300 group-hover:opacity-100 pointer-events-none";

// Tarjeta de un nivel en /principal, con estética de expediente: estado, sello de caso cerrado y acción
export default function LevelCard({ preview }: LevelCardProps) {
  // Cada tarjeta pide su nivel: retoma la partida en curso o sortea el caso
  const { handleShowVideo, goToLevel, loadingLevel, pendingAbandon, abandoning, confirmAbandon, cancelAbandon } =
    usePreviewVideoHandler(preview.videoURL, preview.id);

  const variantsTotal = preview.variantsTotal ?? 0;
  const variantsWon = preview.variantsWon ?? 0;
  // Sin el dato de variantes (backend viejo) un nivel ganado cuenta como cerrado
  const allVariantsWon = variantsTotal === 0 || variantsWon >= variantsTotal;
  const state: CardState = preview.completed ? (allVariantsWon ? "closed" : "completed") : preview.canPlay ? "available" : "locked";
  const style = theme[state];
  const pending = variantsTotal - variantsWon;
  const badgeText = variantsTotal > 0 && preview.completed ? `${style.badgeText} ${variantsWon}/${variantsTotal}` : style.badgeText;
  const report =
    state === "completed" && pending > 0 ? `${style.report} · ${pending === 1 ? "QUEDA 1 VARIANTE" : `QUEDAN ${pending} VARIANTES`}` : style.report;
  const playable = preview.canPlay && !loadingLevel;
  const title = preview.title;

  const open = () => {
    if (!playable) return;
    audioManager.play("click");
    if (preview.videoURL) handleShowVideo();
    else goToLevel();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  return (
    <div
      role="button"
      tabIndex={preview.canPlay ? 0 : -1}
      aria-disabled={!playable}
      aria-label={`Nivel ${preview.id}: ${title}`}
      onClick={open}
      onKeyDown={onKeyDown}
      onMouseEnter={() => preview.canPlay && audioManager.play("opencasefile", { volume: 0.4 })}
      className={`
        group relative flex flex-col h-full rounded-2xl overflow-hidden border-2 outline-none
        bg-[#0c1421] shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-all duration-200
        focus-visible:ring-2 focus-visible:ring-amber-400/70
        ${
          loadingLevel
            ? "border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.3)] cursor-wait"
            : preview.canPlay
              ? `${style.card} hover:-translate-y-1 active:scale-[0.98] hover:shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_26px_rgba(245,158,11,0.22)] cursor-pointer`
              : `${style.card} cursor-not-allowed`
        }
      `}
    >
      {/* Franja de estado */}
      <div className={`h-1 w-full ${style.stripe}`} />

      {/* Artwork del caso con estado y título */}
      <div className="relative aspect-[4/3] w-full bg-[#060a10] overflow-hidden">
        <Image
          src={preview.imageURL}
          alt={title}
          fill
          className={`object-cover transition-all duration-500 ${
            state === "locked"
              ? "grayscale brightness-[0.35] contrast-125"
              : state === "closed" || state === "completed"
                ? "saturate-[0.6] group-hover:saturate-100 group-hover:scale-105"
                : "group-hover:scale-105"
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Degradé para que el título se lea, viñeta y líneas de monitor CRT */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1421] via-[#0c1421]/20 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.75)] pointer-events-none" />
        <div className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_3px)]" />

        {/* Reflejo que barre la imagen y esquinas de visor al apuntar */}
        {preview.canPlay && (
          <>
            <div className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none transition-transform duration-700 group-hover:translate-x-[300%]" />
            <span className={`${corner} top-2 left-2 border-t-2 border-l-2 rounded-tl group-hover:top-1.5 group-hover:left-1.5`} />
            <span className={`${corner} top-2 right-2 border-t-2 border-r-2 rounded-tr group-hover:top-1.5 group-hover:right-1.5`} />
            <span className={`${corner} bottom-2 left-2 border-b-2 border-l-2 rounded-bl group-hover:bottom-1.5 group-hover:left-1.5`} />
            <span className={`${corner} bottom-2 right-2 border-b-2 border-r-2 rounded-br group-hover:bottom-1.5 group-hover:right-1.5`} />
          </>
        )}

        {/* Estado del nivel */}
        <span className={`absolute top-3.5 right-3.5 px-2 py-1 rounded-md border font-mono text-[10px] font-bold tracking-widest backdrop-blur-sm ${style.badge}`}>
          {badgeText}
        </span>

        {/* Sello de caso cerrado: solo con todas las variantes del nivel ganadas */}
        {state === "closed" && (
          <span className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 px-4 py-2 rounded-md border-4 border-double border-emerald-400/85 font-['Press_Start_2P'] text-[11px] sm:text-xs text-emerald-300/90 tracking-widest bg-black/35 shadow-[0_0_18px_rgba(16,185,129,0.35)] pointer-events-none transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            CASO CERRADO
          </span>
        )}

        {/* Cinta policial de los niveles bloqueados */}
        {state === "locked" && <PoliceTapeOverlay />}

        {/* Iniciando caso: feedback inmediato al click */}
        {loadingLevel && (
          <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2.5 select-none">
            <svg className="w-8 h-8 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span className="font-mono text-[10px] font-bold tracking-widest text-amber-300 bg-black/70 px-3 py-1 rounded-full border border-amber-500/40">
              INICIANDO CASO...
            </span>
          </div>
        )}

        {/* Título del caso sobre el degradé */}
        <h3
          className={`absolute bottom-3 left-3.5 right-3.5 font-mono font-bold text-sm sm:text-base leading-snug tracking-wide uppercase line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-colors ${
            preview.canPlay ? "text-[#f8f3e3] group-hover:text-amber-300" : "text-slate-500"
          }`}
        >
          {title}
        </h3>
      </div>

      {/* Informe (clasificado si está bloqueado) y acción */}
      <div className="flex flex-col gap-3 flex-1 p-3.5 border-t border-[#1c2c3e]/80 bg-gradient-to-b from-[#0e1724] to-[#0c1421]">
        <div className="flex flex-col gap-1.5 flex-1">
          <span className={`font-mono text-[9px] font-bold tracking-[0.25em] ${preview.canPlay ? "text-amber-400/70" : "text-slate-600"}`}>
            {report}
          </span>
          <p className={`text-xs leading-relaxed line-clamp-3 ${preview.canPlay ? "text-slate-300" : "text-slate-500 blur-[3px] select-none"}`}>
            {preview.description}
          </p>
        </div>
        <div
          className={`flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border-2 font-mono font-bold text-xs tracking-widest transition-all duration-200 ${style.cta}`}
        >
          {state === "available" || state === "completed" ? (
            <>
              <span>{style.ctaLabel}</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">{style.ctaIcon}</span>
            </>
          ) : (
            <>
              <span>{style.ctaIcon}</span>
              <span>{style.ctaLabel}</span>
            </>
          )}
        </div>
      </div>

      {pendingAbandon && (
        <AbandonSessionModal
          level={preview.id}
          replay={state === "closed"}
          inProgressLevel={pendingAbandon.level}
          abandoning={abandoning}
          onConfirm={confirmAbandon}
          onCancel={cancelAbandon}
        />
      )}
    </div>
  );
}
