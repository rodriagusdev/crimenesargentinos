import { KeyboardEvent, memo } from "react";
import Image from "next/image";
import { ICardLevelPreview } from "@/models/ICardLevelPreview";
import { usePreviewVideoHandler } from "@/hooks/usePreviewVideoHandler";
import { audioManager } from "@/lib/audioManager";
import AbandonSessionModal from "./AbandonSessionModal";
import PoliceTapeOverlay from "./PoliceTapeOverlay";
import { useT } from "@/hooks/useT";
import { levelCardMessages, type LevelCardMessageKey } from "./LevelCard.messages";

type LevelCardProps = {
  preview: ICardLevelPreview;
};

// closed: ganó todas las variantes del nivel; completed: ganó alguna pero quedan variantes por jugar
type CardState = "closed" | "completed" | "available" | "locked";

// Estilo por estado: franja superior y botón de acción
const theme: Record<
  CardState,
  { card: string; stripe: string; cta: string; ctaLabel: LevelCardMessageKey; ctaIcon: string; report: LevelCardMessageKey }
> = {
  closed: {
    card: "border-emerald-600/60 hover:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    stripe: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
    cta: "border-emerald-500/70 bg-emerald-950/60 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-[#0c1421] group-hover:border-emerald-300 shadow-sm",
    ctaLabel: "ctaReplay",
    ctaIcon: "↻",
    report: "reportArchived",
  },
  completed: {
    card: "border-emerald-600/60 hover:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    stripe: "bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
    cta: "border-emerald-500/70 bg-emerald-950/60 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-[#0c1421] group-hover:border-emerald-300 shadow-sm",
    ctaLabel: "ctaPlay",
    ctaIcon: "▶",
    report: "report",
  },
  available: {
    card: "border-amber-400/55 shadow-[0_0_0_1px_rgba(245,158,11,0.2),0_0_28px_rgba(245,158,11,0.2)] hover:border-amber-400",
    stripe: "bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.7)]",
    cta: "border-amber-400/80 bg-amber-500/20 text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.25)] group-hover:bg-amber-400 group-hover:text-[#0c1421] group-hover:border-amber-300",
    ctaLabel: "ctaInvestigate",
    ctaIcon: "▶",
    report: "report",
  },
  locked: {
    card: "border-[#1a2536] bg-[#080d15]",
    stripe: "bg-[repeating-linear-gradient(45deg,#eab308,#eab308_6px,#111827_6px,#111827_12px)] opacity-60",
    cta: "border-slate-700/80 bg-[#0c1421] text-slate-300 shadow-sm",
    ctaLabel: "ctaLocked",
    ctaIcon: "🔒",
    report: "reportClassified",
  },
};

// Tarjeta de un nivel en /principal, con estética de expediente: estado, sello de caso cerrado y acción
function LevelCard({ preview }: LevelCardProps) {
  const t = useT(levelCardMessages);
  // Cada tarjeta pide su nivel: retoma la partida en curso o sortea el caso
  const { handleShowVideo, goToLevel, loadingLevel, pendingAbandon, abandoning, confirmAbandon, cancelAbandon } =
    usePreviewVideoHandler(preview.videoURL, preview.id, preview.caseId);

  const variantsTotal = preview.variantsTotal ?? 0;
  const variantsWon = preview.variantsWon ?? 0;
  // Sin el dato de variantes (backend viejo) un nivel ganado cuenta como cerrado
  const allVariantsWon = variantsTotal === 0 || variantsWon >= variantsTotal;
  const state: CardState = preview.completed ? (allVariantsWon ? "closed" : "completed") : preview.canPlay ? "available" : "locked";
  const style = theme[state];
  const pending = variantsTotal - variantsWon;
  const report =
    state === "completed" && pending > 0
      ? `${t(style.report)} · ${pending === 1 ? t("oneVariantLeft") : t("variantsLeft", { n: pending })}`
      : t(style.report);
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
      aria-label={t("ariaLabel", { n: preview.displayLevel, title })}
      onClick={open}
      onKeyDown={onKeyDown}
      onMouseEnter={() => preview.canPlay && audioManager.play("opencasefile", { volume: 0.4 })}
      className={`
        group relative flex flex-col h-full rounded-2xl overflow-hidden border-2 outline-none
        bg-[#0c1421] shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-all duration-200
        focus-visible:ring-2 focus-visible:ring-amber-400/70 scale-[0.96]
        ${loadingLevel
          ? "border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.3)] cursor-wait"
          : preview.canPlay
            ? `${style.card} hover:shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_26px_rgba(245,158,11,0.22)] cursor-pointer`
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
          className={`object-cover transition-all duration-500 ${state === "locked"
            ? "grayscale brightness-[0.35] contrast-125"
            : ""
            }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Degradé en la base para nitidez del título inferior sin oscurecer el encabezado */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0c1421] via-[#0c1421]/75 to-transparent pointer-events-none" />
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.6)] pointer-events-none" />
        <div className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_3px)]" />

        {/* Reflejo que barre la imagen y esquinas de visor al apuntar */}
        {preview.canPlay && (
          <>
            <div className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none transition-transform duration-700 group-hover:translate-x-[300%]" />
          </>
        )}

        {/* Sello de caso resuelto: sello de archivo policial sutil en la esquina superior */}
        {(state === "closed" || state === "completed") && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border-2 border-emerald-400/80 bg-[#071610]/95 text-emerald-300 font-mono font-black text-[11px] tracking-wider shadow-[0_4px_12px_rgba(0,0,0,0.6)] backdrop-blur-xs -rotate-2">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{state === "closed" ? t("caseClosed") : t("solved")}</span>
            </span>
          </div>
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
              {t("starting")}
            </span>
          </div>
        )}

        {/* Título del caso sobre el degradé */}
        <h3
          className={`absolute bottom-3 left-3.5 right-3.5 font-mono font-bold text-sm sm:text-base leading-snug tracking-wide uppercase line-clamp-2 drop-shadow-[0_2px_6px_rgba(0,0,0,1)] transition-colors ${preview.canPlay ? "text-[#f8f3e3] group-hover:text-amber-300" : "text-slate-400"
            }`}
        >
          {title}
        </h3>
      </div>

      {/* Informe (clasificado si está bloqueado) y acción */}
      <div className="flex flex-col gap-3 flex-1 p-3 border-t border-[#1c2c3e]/80 bg-gradient-to-b from-[#0e1724] to-[#0c1421]">
        <div className="flex flex-col gap-1 flex-1">
          <span className={`font-mono text-[10px] sm:text-[9px] font-bold tracking-[0.2em] sm:tracking-[0.25em] ${preview.canPlay ? "text-amber-400/70" : "text-slate-600"}`}>
            {report}
          </span>
          <p className={`text-[11px] leading-relaxed line-clamp-3 ${preview.canPlay ? "text-slate-200" : "text-slate-400 blur-[2px] select-none"}`}>
            {preview.description}
          </p>
        </div>
        <div
          className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border-2 font-mono font-bold text-[10px] tracking-widest transition-all duration-200 ${style.cta}`}
        >
          {state === "available" || state === "completed" ? (
            <>
              <span>{t(style.ctaLabel)}</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">{style.ctaIcon}</span>
            </>
          ) : (
            <>
              <span>{style.ctaIcon}</span>
              <span>{t(style.ctaLabel)}</span>
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

// Memo: el carrusel re-renderiza al desplazarse; la tarjeta solo cambia si cambia su nivel
export default memo(LevelCard);
