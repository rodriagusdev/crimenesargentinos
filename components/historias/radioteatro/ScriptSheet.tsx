"use client";

import Image from "next/image";
import Link from "next/link";
import ScriptLineView from "./ScriptLineView";
import { visibleText, type Broadcast } from "./useBroadcast";
import type { ScriptLine } from "./script";
import type { CaseStory } from "@/lib/caseStories";

type Props = {
  story: CaseStory;
  script: ScriptLine[];
  state: Broadcast;
  onPlay: () => void;
};

// Hoja del libreto del capítulo: encabezado con la escena, líneas que se escriben al aire y el llamado final
export default function ScriptSheet({ story, script, state, onPlay }: Props) {
  const done = state.status === "done";

  return (
    <article className="relative overflow-hidden rounded-sm bg-[#f3ead3] text-[#2a2016] shadow-[0_20px_50px_rgba(0,0,0,0.7)] [background-image:repeating-linear-gradient(180deg,transparent_0_27px,rgba(120,90,40,0.12)_27px_28px)]">
      <div className="relative h-28 sm:h-36">
        <Image src={story.image} alt={`Escena: ${story.place}`} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover sepia-[0.6]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f3ead3] via-[#f3ead3]/30 to-transparent" aria-hidden />
        <span className="absolute right-3 top-3 rotate-6 rounded border-2 border-[#8a1c0c] bg-[#f3ead3]/80 px-2 py-0.5 text-[9px] sm:text-[10px] tracking-widest text-[#8a1c0c]">
          LIBRETO · CAP. {story.level}
        </span>
      </div>

      <div className="px-4 pb-5 font-mono sm:px-6">
        <header className="mb-4 border-b-2 border-dashed border-[#2a2016]/40 pb-2">
          <p className="text-[10px] tracking-[0.25em] text-[#8a1c0c]">RADIO POLICIAL PRESENTA</p>
          <h2 className="text-lg sm:text-2xl font-bold">
            {story.emoji} {story.title}
          </h2>
        </header>

        <div className="space-y-2.5 min-h-40" aria-live="polite">
          {state.status === "idle" ? (
            <button
              type="button"
              onClick={onPlay}
              className="mx-auto mt-6 block rounded border-2 border-dashed border-[#2a2016]/50 px-4 py-3 text-center text-sm hover:bg-[#2a2016]/5"
            >
              ▶ Encendé la radio para escuchar el capítulo
            </button>
          ) : (
            script.map((line, i) => {
              const text = visibleText(state, script, i);
              if (text === null) return null;
              const typing = state.status === "playing" && state.line === i && line.kind !== "efecto";
              return <ScriptLineView key={i} line={line} text={text} typing={typing} />;
            })
          )}
        </div>

        {done && (
          <div className="mt-5 flex flex-col items-center gap-2 border-t-2 border-dashed border-[#2a2016]/40 pt-4 text-center">
            <p className="text-xs text-[#5a4630]">— FIN DEL CAPÍTULO —</p>
            <Link
              href="/login?registro"
              className="rounded-md bg-[#8a1c0c] px-5 py-3 text-sm text-[#f5dd9c] shadow-[0_4px_0_#4a0e06] hover:brightness-110 active:translate-y-0.5 active:shadow-none"
            >
              ¿QUIÉN FUE? JUGAR EL CASO ▶
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
