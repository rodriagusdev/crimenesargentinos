"use client";

import Link from "next/link";
import { useState } from "react";
import { diarioPastimesMessages } from "./DiarioPastimes.messages";
import { useT } from "@/hooks/useT";
import { audioManager } from "@/lib/audioManager";

const ANSWER = "MISIONES";

// Pasatiempos y clasificados del pie del diario: crucigrama jugable, horóscopo y avisos
export default function DiarioPastimes() {
  const t = useT(diarioPastimesMessages);
  const [guess, setGuess] = useState("");
  const solved = guess.trim().toUpperCase() === ANSWER;

  const onChange = (value: string) => {
    const next = value.toUpperCase().replace(/[^A-ZÑ]/g, "").slice(0, ANSWER.length);
    if (next.length > guess.length) audioManager.play("typewriter");
    if (next === ANSWER) audioManager.play("stamp");
    setGuess(next);
  };

  return (
    <section className="mt-8 border-t-[6px] border-double border-[#1b1813] pt-5">
      <p className="text-center text-[11px] tracking-[0.2em]">{t("section")}</p>

      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-[9px] text-[#7a1212]">{t("crossword")}</p>
          <label htmlFor="crucigrama" className="font-mono text-base">
            <strong>{t("clueNumber")}</strong> {t("clue")}
          </label>
          <div className="relative">
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: ANSWER.length }, (_, i) => (
                <span
                  key={i}
                  className={`relative size-8 flex items-center justify-center border-2 border-[#1b1813] text-sm ${solved ? "bg-[#d9f2dd]" : "bg-[#f6efdc]"}`}
                >
                  {i === 0 && <span className="absolute top-0 left-0.5 text-[6px]">1</span>}
                  {guess[i] ?? ""}
                </span>
              ))}
            </div>
            <input
              id="crucigrama"
              value={guess}
              onChange={(e) => onChange(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="absolute inset-0 w-full opacity-0 cursor-text"
            />
          </div>
          <p className={`font-mono text-sm ${solved ? "text-[#1d6b34]" : "text-[#1b1813]/70"}`} aria-live="polite">
            {solved ? t("solved") : t("hint")}
          </p>
          {solved && (
            <Link href="/login?registro" className="self-start px-3 py-3 bg-[#7a1212] text-[#f6efdc] text-[9px]">
              {t("join")}
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[9px] text-[#7a1212]">{t("horoscope")}</p>
          <p className="font-mono text-base leading-snug">
            <strong>{t("scorpio")}</strong> {t("scorpioText")}
          </p>
          <p className="font-mono text-base leading-snug">
            <strong>{t("leo")}</strong> {t("leoText")}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[9px] text-[#7a1212]">{t("ads")}</p>
          <div className="p-3 border border-dashed border-[#1b1813] font-mono text-sm">
            <strong>{t("ad1Title")}</strong> {t("ad1Text")}
          </div>
          <div className="p-3 border border-dashed border-[#1b1813] font-mono text-sm">
            <strong>{t("ad2Title")}</strong> {t("ad2Text")}
          </div>
        </div>
      </div>
    </section>
  );
}
