"use client";

import { useEffect, useRef, useState } from "react";
import BoardHardware from "./BoardHardware";
import BriefingSidebar from "./BriefingSidebar";
import TakeCaseStamp from "./TakeCaseStamp";
import TypedText from "./TypedText";
import { audioManager } from "@/lib/audioManager";
import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";
import styles from "./caseBriefing.module.css";

const messages = defineMessages({
  es: {
    plate: "CASO #{n}",
    plateSub: "Informe inicial",
    office: "Policía · Archivo de la Central",
    title: "Caso N.º {n} — Informe",
    to: "Para: detective de turno · De: la Central",
    confidential: "Confidencial",
    tapToSkip: "Tocá el informe para verlo completo",
    signature: "El Comisario",
    takeCase: "TOMAR EL CASO",
    received: "RECIBIDO",
  },
  en: {
    plate: "CASE #{n}",
    plateSub: "Initial report",
    office: "Police · Headquarters archive",
    title: "Case No. {n} — Report",
    to: "To: detective on duty · From: Headquarters",
    confidential: "Confidential",
    tapToSkip: "Tap the report to show it all",
    signature: "The Commissioner",
    takeCase: "TAKE THE CASE",
    received: "RECEIVED",
  },
});

// Pizarra del tablero de investigación (la misma textura y grilla)
const BOARD_STYLE = {
  backgroundImage: `
    linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    radial-gradient(circle at 50% 40%, rgba(18, 24, 38, 0.2) 0%, rgba(6, 10, 18, 0.8) 100%),
    url('/images/slate_board.webp')
  `,
  backgroundSize: "36px 36px, 36px 36px, 100% 100%, cover",
  backgroundPosition: "center",
};

type Props = {
  caseNumber: string;
  /** Recursos con los que arranca la partida */
  hours: number;
  pi: number;
  /** Pistas del informe inicial */
  clues: string[];
  /** Texto completo del informe (mientras `typing`, se escribe a máquina) */
  text: string;
  typing: boolean;
  /** Terminó de escribirse */
  onTyped: () => void;
  onSkip: () => void;
  onClose: () => void;
};

// Informe inicial con el estilo del tablero de investigación: la pizarra misma es el modal, con una placa de bronce
// arriba, el informe en papel manila clavado (sello de goma "CONFIDENCIAL"), los recursos y las pistas al costado,
// y el botón para empezar debajo del informe
export default function CaseBriefingSheet({ caseNumber, hours, pi, clues, text, typing, onTyped, onSkip, onClose }: Props) {
  const t = useT(messages);
  // Al tomar el caso cae el sello "RECIBIDO" sobre el informe y, un instante después, se cierra
  const [taken, setTaken] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const takeCase = () => {
    if (taken) return;
    audioManager.play("stamp");
    setTaken(true);
    closeTimer.current = setTimeout(onClose, 750);
  };
  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <div
      className={`relative w-full max-w-2xl lg:max-w-5xl max-h-[92svh] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl border-[6px] sm:border-[12px] border-[#1e2430] ring-1 ring-[#334155]/80 shadow-[inset_0_0_80px_rgba(0,0,0,0.95),0_30px_70px_rgba(0,0,0,0.9)] ${styles.folderIn}`}
      style={BOARD_STYLE}
      onClick={(e) => e.stopPropagation()}
    >
      <BoardHardware />

      <div className="relative z-10 flex flex-col gap-6 lg:gap-4 p-4 pt-6 sm:p-8 sm:pt-8 lg:p-6">
        {/* Placa de bronce atornillada */}
        <div className="self-center flex items-center gap-3 rounded-md border-2 border-[#7a5a1a] bg-[linear-gradient(180deg,#e8c87a,#b8892a)] px-5 py-2 shadow-[0_6px_14px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.5)]">
          <span className="size-2 rounded-full bg-[#5a3f10] shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" aria-hidden />
          <div className="text-center text-[#2a1a05]">
            <p className="text-sm lg:text-base">{t("plate", { n: caseNumber })}</p>
            <p className="text-[10px] lg:text-xs uppercase tracking-widest">{t("plateSub")}</p>
          </div>
          <span className="size-2 rounded-full bg-[#5a3f10] shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" aria-hidden />
        </div>

        <div className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:gap-6 lg:items-start">
          <div className="flex flex-col gap-5 lg:gap-3">
            {/* Informe en papel manila clavado */}
            <article
              onClick={onSkip}
              className={`relative rounded-xl border-2 border-[#cbb793] bg-[#f0e8d5] p-5 sm:p-7 lg:p-6 text-zinc-900 shadow-[0_14px_30px_rgba(0,0,0,0.6)] bg-[repeating-linear-gradient(180deg,transparent_0_27px,rgba(120,100,70,0.12)_27px_28px)] ${styles.sheetOut} ${
                typing ? "cursor-pointer" : ""
              }`}
            >
              {/* Chincheta dorada */}
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 size-5 rounded-full border border-amber-300 bg-amber-600 shadow-[0_3px_5px_rgba(0,0,0,0.5)]" aria-hidden />
              {/* Sello de goma */}
              <span
                className={`pointer-events-none absolute top-4 right-4 border-[3px] border-[#b3261e] px-2 py-0.5 text-[10px] lg:text-xs uppercase text-[#b3261e] ${styles.stamp}`}
                aria-hidden
              >
                {t("confidential")}
              </span>

              <header className="pr-28 border-b-2 border-double border-zinc-500/50 pb-3">
                <p className="text-[10px] lg:text-xs uppercase tracking-widest text-zinc-600">{t("office")}</p>
                <h2 className={`mt-1.5 text-lg sm:text-xl lg:text-2xl font-bold ${styles.typewriter}`}>{t("title", { n: caseNumber })}</h2>
                <p className={`mt-1 text-xs sm:text-sm lg:text-base text-zinc-600 ${styles.typewriter}`}>{t("to")}</p>
              </header>

              {/* Texto a máquina */}
              <p className={`mt-4 min-h-[8rem] lg:min-h-[6rem] whitespace-pre-line text-base sm:text-lg lg:text-xl leading-7 lg:leading-8 text-zinc-800 ${styles.typewriter}`}>
                {typing ? <TypedText key={text} text={text} onDone={onTyped} /> : text}
              </p>

              <p className={`mt-4 text-right font-serif italic text-lg lg:text-xl text-[#1d3f8a] transition-opacity duration-500 ${typing ? "opacity-0" : "opacity-100"}`}>
                {t("signature")}
              </p>

              {taken && (
                <span
                  className={`pointer-events-none absolute left-1/2 top-1/2 border-[5px] border-[#c81e1e] px-5 py-2 text-2xl sm:text-4xl text-[#c81e1e] ${styles.received}`}
                  aria-hidden
                >
                  {t("received")}
                </span>
              )}
            </article>

            {/* Acción: mientras se escribe, cómo saltar; después, empezar */}
            <div className="min-h-14 flex items-center justify-center">
              {typing ? (
                <p className={`text-center font-mono text-[10px] sm:text-xs lg:text-sm text-[#E1C380]/80 ${styles.hint}`}>{t("tapToSkip")}</p>
              ) : (
                <TakeCaseStamp label={t("takeCase")} pressed={taken} onPress={takeCase} />
              )}
            </div>
          </div>

          <BriefingSidebar hours={hours} pi={pi} clues={clues} revealed={!typing} />
        </div>
      </div>
    </div>
  );
}
