"use client";

import IDialog from "@/models/IDialog";
import GameButton from "../../components/buttons/GameButton";
import Image from "next/image";
import { useState } from "react";

interface DialogProps {
  dialog: IDialog;
  onClose?: () => void;
}

export default function DialogBox({ dialog, onClose }: DialogProps) {
  const [textBox, setTextbox] = useState<string | null>(null);
  const limitedQuestions = dialog.questions.slice(0, 3);

  const onQuestionClicked = (i: number) => {
    setTextbox(dialog.answers[i] ?? null);
  }

  const background =
    dialog.overlayBackgroundUrl ?? "/images/default-dialog-overlay.jpg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4">
      {/* Background */}
      <Image src={background} alt="" fill priority className="object-cover" />

      {/* Dark overlay */}
      <div className="absolute inset-0 " />

      {/* Main container */}
      <div
        className="
          relative z-10 w-full max-w-3xl
          bg-[rgba(42,58,74,0.35)]
          backdrop-blur-[10px]
          border border-[rgba(255,243,199,0.15)]
          shadow-[0_10px_40px_rgba(0,0,0,0.4)]
          rounded-2xl
          overflow-hidden
          text-[#FFF3C7]
        "
      >
        {/* Botón cerrar */}
        <GameButton onClick={onClose} icon="" label="CERRAR" />

        <div className="flex flex-col md:flex-row">
          {/* Portrait */}
          <div className="md:w-56 shrink-0 p-5 flex flex-col items-center">
            <div
              className="
                relative w-40 h-40 md:w-48 md:h-48
                rounded-xl overflow-hidden
                border-2 border-[#E1C380]/60
                shadow-[0_8px_24px_rgba(0,0,0,0.5)]
              "
            >
              <Image
                src={dialog.portraitUrl}
                alt={dialog.npc}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 160px, 192px"
                priority
              />
            </div>

            <p className="mt-3 text-center tracking-widest text-[#E1C380] font-medium uppercase text-sm">
              {dialog.npc}
            </p>
          </div>

          {/* Contenido */}
          <div className="flex-1 p-6 pt-4 md:pt-6 flex flex-col">
            <div
              className="
                mb-6
                p-4
                rounded-xl
                bg-[rgba(255,243,199,0.08)]
                border border-[rgba(255,243,199,0.12)]
              "
            >
              <p className="text-[#FFF3C7] leading-relaxed tracking-wide text-[15px]">
                {textBox ?? dialog.introText}
              </p>
            </div>

            {/* Preguntas */}
            <div className="space-y-3 mt-auto">
              {limitedQuestions.map((question, index) => (
                <GameButton key={index} icon="" label={question} onClick={() => onQuestionClicked(index)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
