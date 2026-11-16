"use client";

import IDialog from "@/models/IDialog";
import GameButton from "../buttons/GameButton";
import { LevelScreenTopBar } from "../Level/LevelScreenTopBar";
import { useEffect } from "react";
import { dialogLogKey, IDialogLogLine, useGameSessionStore } from "@/stores/useGameSessionStore";
import CostFeedbackToast from "../Level/CostFeedbackToast";
import { useAvatarStore } from "@/stores/useAvatarStore";
import { useT } from "@/hooks/useT";
import { useDialogQuestions } from "@/hooks/useDialogQuestions";
import { dialogBoxMessages } from "./DialogBox.messages";
import DialogPortraitColumn from "./DialogPortraitColumn";
import DialogConversationLog from "./DialogConversationLog";
import DialogSceneBackdrop from "./DialogSceneBackdrop";

interface DialogProps {
  dialog: IDialog;
  onClose?: () => void;
}

const EMPTY_LOG: IDialogLogLine[] = [];

export default function DialogBox({ dialog, onClose }: DialogProps) {
  const t = useT(dialogBoxMessages);
  const { costToast, clueToast, askingQuestionId, askedQuestions, availableQuestions, onQuestionClicked } =
    useDialogQuestions(dialog);

  const sessionId = useGameSessionStore((state) => state.session?.sessionId);
  const loadDialogLog = useGameSessionStore((state) => state.loadDialogLog);
  // Chat de esta locación: lo guarda el store (LevelLocation ya lo pidió en paralelo con el diálogo)
  const log = useGameSessionStore((state) =>
    sessionId ? state.dialogLogs[dialogLogKey(sessionId, dialog.locationId)] ?? EMPTY_LOG : EMPTY_LOG,
  );

  const currentAvatar = useAvatarStore((state) => state.currentAvatar);
  const initAvatar = useAvatarStore((state) => state.initAvatar);

  useEffect(() => {
    void initAvatar();
  }, [initAvatar]);

  // La conversación guardada de esta locación: se retoma donde había quedado
  // (si ya se trajo o está en camino, no se vuelve a pedir)
  useEffect(() => {
    if (!sessionId) return;
    void loadDialogLog(dialog.locationId);
  }, [sessionId, dialog.locationId, loadDialogLog]);

  const background =
    dialog.npcCompleteUrl ?? "/images/slate_board.webp";

  return (
    <div className="no-desktop-zoom relative w-screen h-dvh flex flex-col bg-[#080e18] select-none overflow-hidden">
      {/* Toast de Feedback de Costo y Pista Desbloqueada */}
      <CostFeedbackToast cost={costToast} unlockedClue={clueToast} />
      {/* ── Top Bar ── (en celular baja por debajo de la barra del menú de investigación) */}
      <div className="shrink-0 pt-[68px] md:pt-0">
      {onClose ? (
        <LevelScreenTopBar
          label={t("backToProvince")}
          badgeText={t("interrogation")}
          onBack={onClose}
          showDot
        />
      ) : (
        <div className="relative z-20 p-4 md:p-6" />
      )}
      </div>

      {/* ── Content area (Dialog panel + Background Scene) ── */}
      <div className="flex-1 flex flex-col-reverse xl:flex-row-reverse min-h-0 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 gap-3 sm:gap-4 md:gap-6">
        {/* Right / Bottom on tablet: Dialog panel */}
        <div className="flex-1 flex items-center justify-center min-h-0 w-full xl:flex-1">
          <div
            className="
              relative z-10 w-full max-w-4xl xl:max-w-2xl h-full flex flex-col
              backdrop-blur-xs
              border border-[rgba(255,243,199,0.18)]
              shadow-[0_20px_50px_rgba(0,0,0,0.6)]
              rounded-2xl
              overflow-hidden
              text-[#FFF3C7]
            "
          >
            {/* Body: portrait + content */}
            <div className="flex flex-col sm:flex-row flex-1 min-h-0">
              <DialogPortraitColumn npc={dialog.npc} portraitUrl={dialog.portraitUrl} avatar={currentAvatar} />

              {/* Right column: log + questions */}
              <div className="flex-1 flex flex-col min-h-0">
                {/* Conversation log — scrollable, grows to fill space */}
                <DialogConversationLog npc={dialog.npc} intro={dialog.intro} log={log} avatar={currentAvatar} />

                {/* Divider */}
                <div className="h-px bg-[rgba(255,243,199,0.12)] mx-3 sm:mx-5" />

                {/* Questions — pinned to bottom */}
                <div className="px-3 sm:px-5 py-3 sm:py-4 flex flex-col gap-2 shrink-0 max-h-[30svh] overflow-y-auto overflow-x-hidden sm:max-h-none sm:overflow-visible">
                  {availableQuestions.map((q) => {
                    const isAsked = askedQuestions.includes(q.id);
                    const isThisAsking = askingQuestionId === q.id;
                    const isAnyAsking = Boolean(askingQuestionId);

                    return (
                      <GameButton
                        key={q.id}
                        icon=""
                        label={q.text}
                        onClick={() => onQuestionClicked(q)}
                        loading={isThisAsking}
                        disabled={isAsked || (isAnyAsking && !isThisAsking)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left / Top on tablet: Background image box */}
        <DialogSceneBackdrop src={background} />
      </div>
    </div>
  );
}
