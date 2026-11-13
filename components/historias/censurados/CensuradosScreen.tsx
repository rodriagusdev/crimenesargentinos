"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { CASE_STORIES, type CaseStory } from "@/lib/caseStories";
import { audioManager } from "@/lib/audioManager";
import GameBackdrop, { CautionBar, GAME_BG } from "@/components/galeria/GameBackdrop";
import CaseDossier from "./CaseDossier";
import ClassifiedFolder from "./ClassifiedFolder";
import DeskDecor from "./DeskDecor";

type Dossier = { phase: "closed" } | { phase: "open" | "closing"; story: CaseStory };

// Propuesta "Expedientes censurados": un escritorio en penumbra con una lámpara de brazo y las carpetas manila
// selladas "CLASIFICADO". Al abrir una sale el parte policial tipeado a máquina (lo que el juego cuenta al
// empezar) y el resto del informe aparece tachado con barras negras, sin nada real debajo.
export default function CensuradosScreen() {
  const [dossier, setDossier] = useState<Dossier>({ phase: "closed" });
  const [read, setRead] = useState<string[]>([]);

  const open = (story: CaseStory) => {
    audioManager.play("stamp");
    setDossier({ phase: "open", story });
    setRead((r) => (r.includes(story.id) ? r : [...r, story.id]));
  };
  const close = useCallback(() => {
    audioManager.play("click");
    setDossier((d) => (d.phase === "open" ? { phase: "closing", story: d.story } : d));
  }, []);
  const clear = useCallback(() => setDossier({ phase: "closed" }), []);

  return (
    <div className={`relative ${GAME_BG} min-h-svh overflow-x-clip px-3 pb-14 text-[#FFF3C7] sm:px-6`}>
      <GameBackdrop glow="179,25,28" />
      <CautionBar className="max-w-5xl" />

      <div className="relative mx-auto max-w-5xl pt-24 sm:pt-28">
        <header className="mb-8 text-center">
          <p className="text-[9px] tracking-[0.3em] text-[#E1C380] sm:text-[10px]">ARCHIVO RESERVADO DE LA CENTRAL</p>
          <h1 className="mt-3 text-lg leading-relaxed sm:text-3xl">EXPEDIENTES CENSURADOS</h1>
          <p className="mx-auto mt-3 max-w-xl font-mono text-xs leading-relaxed text-[#E1C380]/80 sm:text-sm">
            Abrí una carpeta y leé el parte del hecho. Lo demás está tachado: eso se investiga adentro del juego.
          </p>
          <p className="mt-4 inline-block rounded border-2 border-[#b08a3e] bg-[#2b2117] px-3 py-1.5 font-mono text-xs font-bold text-[#ffe9b0] tabular-nums">
            LEÍDOS {read.length}/{CASE_STORIES.length}
          </p>
        </header>

        {/* Escritorio de madera */}
        <div className="relative overflow-y-auto overflow-x-hidden rounded-2xl border-4 border-[#2a1a0e] bg-[linear-gradient(170deg,#4a2f1a,#3a2413_45%,#2b1a0d)] px-3 pb-16 pt-14 shadow-[0_30px_70px_rgba(0,0,0,0.75)] sm:px-8 sm:pb-20 sm:pt-16">
          <span
            className="pointer-events-none absolute inset-0 rounded-xl opacity-25 bg-[repeating-linear-gradient(178deg,transparent_0_9px,rgba(0,0,0,0.35)_9px_10px,transparent_10px_23px)]"
            aria-hidden
          />
          <div className="relative z-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {CASE_STORIES.map((story, i) => (
              <ClassifiedFolder key={story.id} story={story} order={i} read={read.includes(story.id)} onOpen={() => open(story)} />
            ))}
          </div>
          <DeskDecor />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="font-mono text-xs text-[#E1C380]/80 sm:text-sm">Ocho expedientes. Ninguno se cierra solo.</p>
          <Link
            href="/login?registro"
            onClick={() => audioManager.play("typewriter")}
            className="border-2 border-[#FFF3C7] bg-[#b3191c] px-5 py-3.5 text-[10px] leading-relaxed text-[#FFF3C7] shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 sm:text-xs"
          >
            DESCLASIFICAR EN EL JUEGO
          </Link>
        </div>
      </div>

      {dossier.phase !== "closed" && (
        <CaseDossier key={dossier.story.id} story={dossier.story} closing={dossier.phase === "closing"} onClose={close} onClosed={clear} />
      )}
    </div>
  );
}
