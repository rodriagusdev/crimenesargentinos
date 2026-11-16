"use client";

import { useEffect, useRef } from "react";
import { IDialogMessage } from "@/models/IDialog";
import { IDialogLogLine } from "@/stores/useGameSessionStore";
import { NarratorLine, NpcBubble, PlayerBubble } from "./DialogChatBubbles";

const INTRO_NPC_NAME_CLASS = "text-[10px] tracking-widest text-[#E1C380]/70 font-mono font-semibold";
const LOG_NPC_NAME_CLASS = "text-[10px] sm:text-[8px]  tracking-widest text-[#E1C380]/70 font-semibold";

interface DialogConversationLogProps {
  npc: string;
  intro: IDialogMessage[] | undefined;
  log: IDialogLogLine[];
  avatar: string | null;
}

// Conversación: intro estructurada + preguntas/respuestas guardadas, con auto-scroll al final
export default function DialogConversationLog({ npc, intro, log, avatar }: DialogConversationLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll log para cuando se agrega a la conversacion
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-5 pt-3 sm:pt-5 pb-3 flex flex-col gap-4">
      {/* Structured Intro messages */}
      {intro?.map((msg, idx) => {
        if (msg.speaker === "narrator") return <NarratorLine key={`intro-${idx}`} text={msg.text} />;
        if (msg.speaker === "player") return <PlayerBubble key={`intro-${idx}`} text={msg.text} avatar={avatar} />;
        return <NpcBubble key={`intro-${idx}`} npc={npc} text={msg.text} nameClassName={INTRO_NPC_NAME_CLASS} />;
      })}

      {/* Dynamic log entries */}
      {log.map((entry, i) => (
        <div key={i} className="flex flex-col gap-3">
          {/* Player question — right-aligned */}
          <PlayerBubble text={entry.question} avatar={avatar} />
          {/* NPC answer — left-aligned */}
          <NpcBubble npc={npc} text={entry.answer} nameClassName={LOG_NPC_NAME_CLASS} />
        </div>
      ))}

      {/* Anchor for auto-scroll */}
      <div ref={logEndRef} />
    </div>
  );
}
