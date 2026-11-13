"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BookletCard, PinnedPolaroid, VintageCallout } from "./ManualParts";
import type { CaseStory } from "@/lib/caseStories";

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="grid grid-cols-[6.5rem_1fr] sm:grid-cols-[8rem_1fr] gap-2 py-1.5 border-b border-dashed border-[#ded3be] last:border-b-0">
    <dt className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#7d6850] pt-0.5">{label}</dt>
    <dd className="font-serif text-xs sm:text-[13px] text-[#2d2319]">{children}</dd>
  </div>
);

// Folio de un caso: el parte policial, la foto del lugar clavada al costado y el aviso de que el resto se abre al jugar
export default function ManualCasePage({ story }: { story: CaseStory }) {
  const num = String(story.level).padStart(2, "0");
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex items-start gap-3">
        <span className="text-2xl sm:text-3xl" aria-hidden>
          {story.emoji}
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-widest text-[#9e1c1c] uppercase">Expediente N.º {num} · Nivel {story.level}</p>
          <h2 className="font-serif font-black text-base sm:text-xl text-[#342617] uppercase tracking-wide">{story.title}</h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <BookletCard num={num} title="Parte policial">
            <p className="font-serif font-bold text-sm sm:text-base text-[#1f1710] leading-snug">{story.headline}</p>
            <p className="mt-2 font-serif">{story.synopsis}</p>
            <dl className="mt-3">
              <Field label="Lugar">{story.place}</Field>
              <Field label="Provincia">{story.province}</Field>
              <Field label="Se busca">
                <strong className="font-bold text-[#9e1c1c] uppercase tracking-wide">{story.wanted}</strong>
              </Field>
            </dl>
          </BookletCard>

          <p className="font-serif italic text-sm sm:text-base text-[#544330] border-l-4 border-[#9e835c] pl-3">“{story.tagline}”</p>
        </div>

        <div className="shrink-0 flex justify-center pt-2 md:pt-3">
          <PinnedPolaroid src={story.image} caption={story.place} subCaption={story.province} stamp="Abierto" />
        </div>
      </div>

      <VintageCallout label="El resto del expediente se abre al jugar" icon="🔒">
        Testigos, pistas y sospechosos quedan bajo llave hasta que tomes el caso.{" "}
        <Link href="/login?registro" className="font-bold text-[#9e1c1c] underline underline-offset-2 hover:text-[#6e1414]">
          Tomar el caso →
        </Link>
      </VintageCallout>
    </div>
  );
}
