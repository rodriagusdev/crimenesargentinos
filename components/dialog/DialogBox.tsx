"use client";

import IDialog, { IDialogQuestion } from "@/models/IDialog";
import GameButton from "../buttons/GameButton";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFlagStore } from "@/stores/useFlagStore";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { useHintSound } from "@/hooks/useHintSound";
import CostFeedbackToast from "../Level/CostFeedbackToast";

interface DialogProps {
  dialog: IDialog;
  onClose?: () => void;
}

export default function DialogBox({ dialog, onClose }: DialogProps) {
  const [log, setLog] = useState<{ question: string; answer: string }[]>([]);
  const [askedIds, setAskedIds] = useState<Set<string>>(new Set());
  const [costToast, setCostToast] = useState<{ time: number; pi: number } | null>(null);
  const [clueToast, setClueToast] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playHintSound = useHintSound();

  const flags = useFlagStore((state) => state.flags);
  const addFlag = useFlagStore((state) => state.addFlag);
  const askCost = useGameSessionStore((state) => state.costs?.askQuestion);
  const consumeAskQuestion = useGameSessionStore(
    (state) => state.consumeAskQuestion
  );
  const addClue = useGameSessionStore((state) => state.addClue);
  const hasClue = useGameSessionStore((state) => state.hasClue);
  const isQuestionAsked = useGameSessionStore((state) => state.isQuestionAsked);
  const markQuestionAsked = useGameSessionStore((state) => state.markQuestionAsked);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Filtra las preguntas: solo muestra las que no tienen requiredFlag o si todos los flags requeridos ya fueron desbloqueados
  const availableQuestions = dialog.questions.filter((q) => {
    if (!q.requiredFlag) return true;
    const required = Array.isArray(q.requiredFlag) ? q.requiredFlag : [q.requiredFlag];
    return required.every((flag) => flags.includes(flag));
  });

  const onQuestionClicked = (q: IDialogQuestion) => {
    if (!q.answer) return;

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("close-investigation-menu"));
    }

    const alreadyAsked = isQuestionAsked(q.id);

    // Solo descuenta recursos y activa pistas la primera vez que se selecciona la pregunta
    if (!alreadyAsked) {
      markQuestionAsked(q.id);
      consumeAskQuestion();

      // Si la pregunta otorga una pista que aún no fue desbloqueada
      if (q.unlocksClue && !hasClue(q.unlocksClue)) {
        addClue(q.unlocksClue);
        setClueToast(q.unlocksClue);
        playHintSound();
      }

      // Mostrar feedback visual de costo solo cuando se descuenta
      if (askCost) setCostToast(askCost);

      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setCostToast(null);
        setClueToast(null);
      }, 3000);
    }

    // Desbloquear flag(s) si la pregunta lo otorga
    if (q.unlocksFlag) {
      addFlag(q.unlocksFlag);
    }

    setLog((prev) => [...prev, { question: q.text, answer: q.answer }]);
    setAskedIds((prev) => new Set(prev).add(q.id));
  };

  // Auto-scroll log para cuando se agrega a la conversacion
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  const background =
    dialog.npcCompleteUrl ?? "/images/default-dialog-overlay.jpg";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080e18] select-none">
      {/* Toast de Feedback de Costo y Pista Desbloqueada */}
      <CostFeedbackToast cost={costToast} unlockedClue={clueToast} />
      {/* ── Top Bar ── */}
      <div className="relative z-20 p-6 flex items-center justify-end">
        {onClose ? (
          <div className="flex flex-row gap-4 flex-row-reverse">
            <GameButton
              icon=""
              label="VOLVER AL MAPA DE LA PROVINCIA"
              onClick={onClose}
              variant="secondary"
            />

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-[#FFF3C7]">
              <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-[#E1C380] font-semibold">
                Interrogatorio
              </span>
            </div>
          </div>
        ) : (
          <div />
        )}


      </div>

      {/* ── Content area (Dialog panel + Background Scene) ── */}
      <div className="flex-1 flex flex-row-reverse min-h-0 px-6 pb-6 gap-6">
        {/* Right: Dialog panel */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="
              relative z-10 w-full max-w-2xl h-full flex flex-col
              backdrop-blur-xs
              border border-[rgba(255,243,199,0.18)]
              shadow-[0_20px_50px_rgba(0,0,0,0.6)]
              rounded-2xl
              overflow-hidden
              text-[#FFF3C7]
            "
          >
            {/* Body: portrait + content */}
            <div className="flex flex-1 min-h-0">
              {/* Portrait column */}
              <div className="w-44 shrink-0 flex flex-col items-center pt-6 pb-4 px-4 border-r border-[rgba(255,243,199,0.12)]">
                <div
                  className="
                    relative w-32 h-32
                    rounded-2xl overflow-hidden
                    border-2 border-[rgba(255,243,199,0.25)]
                    shadow-[0_12px_30px_rgba(0,0,0,0.7)]
                    bg-black/40
                  "
                >
                  <Image
                    src={dialog.portraitUrl}
                    alt={dialog.npc}
                    fill
                    className="object-cover"
                    sizes="128px"
                    priority
                  />
                </div>

                {/* NPC name */}
                <p className="mt-4 text-center tracking-widest text-[#E1C380] font-semibold uppercase text-sm">
                  {dialog.npc}
                </p>

                {/* Decorative divider + label */}
                <div className="mt-3 w-10 h-px bg-[rgba(255,243,199,0.18)]" />
                <div className="mt-2 px-3 py-1 rounded-xl bg-[rgba(255,243,199,0.06)] backdrop-blur-xs border border-[rgba(255,243,199,0.12)] text-[10px] text-[#E1C380]/80 uppercase tracking-widest font-mono">
                  Testigo
                </div>
              </div>

              {/* Right column: log + questions */}
              <div className="flex-1 flex flex-col min-h-0">
                {/* Conversation log — scrollable, grows to fill space */}
                <div className="flex-1 overflow-y-auto px-5 pt-5 pb-3 flex flex-col gap-4">
                  {/* Structured Intro messages */}
                  {dialog.intro?.map((msg, idx) => {
                    if (msg.speaker === "narrator") {
                      return (
                        <div key={`intro-${idx}`} className="flex justify-center my-1">
                          <div className="px-3.5 py-1.5 rounded-xl bg-[rgba(225,195,128,0.08)] border border-[rgba(225,195,128,0.18)] backdrop-blur-xs shadow-sm">
                            <p className="text-[11px] italic text-[#E1C380]/90 tracking-wide text-center">
                              * {msg.text} *
                            </p>
                          </div>
                        </div>
                      );
                    }

                    if (msg.speaker === "player") {
                      return (
                        <div key={`intro-${idx}`} className="flex flex-col items-end gap-1">
                          <span className="text-[8px] tracking-widest text-[#FFF3C7]/50">
                            Vos
                          </span>
                          <div className="bg-[rgba(28,42,58,0.7)] backdrop-blur-xs border border-[rgba(255,243,199,0.22)] shadow-[0_10px_30px_rgba(0,0,0,0.4)] rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[85%]">
                            <p className="text-[#E1C380]/90 text-xs leading-relaxed">
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={`intro-${idx}`} className="flex flex-col gap-1">
                        <span className="text-[10px] tracking-widest text-[#E1C380]/70 font-mono font-semibold">
                          {dialog.npc}
                        </span>
                        <div className="bg-[rgba(20,30,42,0.6)] backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-[0_10px_30px_rgba(0,0,0,0.4)] rounded-2xl rounded-tl-none px-4 py-3 max-w-[90%]">
                          <p className="text-[#FFF3C7] text-xs leading-relaxed whitespace-pre-line">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Dynamic log entries */}
                  {log.map((entry, i) => (
                    <div key={i} className="flex flex-col gap-3">
                      {/* Player question — right-aligned */}
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[8px] tracking-widest text-[#FFF3C7]/50 ">
                          Vos
                        </span>
                        <div className="bg-[rgba(28,42,58,0.7)] backdrop-blur-xs border border-[rgba(255,243,199,0.22)] shadow-[0_10px_30px_rgba(0,0,0,0.4)] rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[85%]">
                          <p className="text-[#E1C380]/90 text-xs leading-relaxed">
                            {entry.question}
                          </p>
                        </div>
                      </div>
                      {/* NPC answer — left-aligned */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px]  tracking-widest text-[#E1C380]/70 font-semibold">
                          {dialog.npc}
                        </span>
                        <div className="bg-[rgba(20,30,42,0.6)] backdrop-blur-xs border border-[rgba(255,243,199,0.18)] shadow-[0_10px_30px_rgba(0,0,0,0.4)] rounded-2xl rounded-tl-none px-4 py-3 max-w-[90%]">
                          <p className="text-[#FFF3C7] text-xs leading-relaxed whitespace-pre-line">
                            {entry.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Anchor for auto-scroll */}
                  <div ref={logEndRef} />
                </div>

                {/* Divider */}
                <div className="h-px bg-[rgba(255,243,199,0.12)] mx-5" />

                {/* Questions — pinned to bottom */}
                <div className="px-5 py-4 flex flex-col gap-2">
                  {availableQuestions.map((q) => (
                    <GameButton
                      key={q.id}
                      icon=""
                      label={q.text}
                      onClick={() => onQuestionClicked(q)}
                      disabled={askedIds.has(q.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left: Background image box */}
        <div className="flex-[2] p-6 backdrop-blur-xs flex items-center justify-center border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-2xl">
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <Image
              src={background}
              alt="Escena"
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 60vw"
              className="object-cover object-center"
            />
            {/* subtle inner vignette */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080e18]/40 via-transparent to-transparent" />
            {/* bottom fade for text legibility */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#080e18]/90 via-[#080e18]/50 to-transparent" />

          </div>
        </div>
      </div>
    </div>
  );
}
