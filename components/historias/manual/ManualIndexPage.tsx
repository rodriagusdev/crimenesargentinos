"use client";

import ManualIndexRow from "./ManualIndexRow";
import { VintageCallout } from "./ManualParts";
import { CASE_STORIES } from "@/lib/caseStories";

// Folio 1: índice de los expedientes del archivo
export default function ManualIndexPage({ onOpen }: { onOpen: (folio: number) => void }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div>
        <h2 className="font-serif font-black text-base sm:text-xl text-[#342617] uppercase tracking-wide">Índice de expedientes</h2>
        <p className="mt-1 font-serif text-xs sm:text-[13px] leading-relaxed text-[#3d3124] max-w-3xl">
          Este cuadernillo reúne los partes policiales de los <strong className="text-[#1f1710]">ocho casos</strong> abiertos en la
          Central. Cada folio cuenta qué pasó y dónde empieza la investigación. Nada más.
        </p>
      </div>

      <ol className="overflow-hidden rounded border-2 border-[#b5a180] bg-[#fbf8f0] shadow-sm divide-y divide-[#dfd3bc]">
        {CASE_STORIES.map((s, i) => (
          <ManualIndexRow key={s.id} story={s} folio={i + 1} onOpen={onOpen} />
        ))}
      </ol>

      <VintageCallout label="Cómo leer este manual">
        Usá las pestañas o las flechas del teclado para pasar de folio. Los partes son públicos: lo que viene después
        (testigos, pistas y sospechosos) solo se abre cuando tomás el caso.
      </VintageCallout>
    </div>
  );
}
