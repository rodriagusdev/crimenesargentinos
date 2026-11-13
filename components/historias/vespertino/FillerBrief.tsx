import type { Brief } from "./vespertino";

// Nota chica de relleno en la columna lateral: volanta, título y "texto" ilegible de imprenta
export default function FillerBrief({ brief, lines = 6 }: { brief: Brief; lines?: number }) {
  return (
    <article className="border-t border-[#1b1813] pt-2">
      <p className="font-serif text-[9px] uppercase tracking-widest text-[#7a1212]">{brief.kicker}</p>
      <h4 className="mt-0.5 font-serif font-bold text-sm leading-tight">{brief.title}</h4>
      <FakeText lines={lines} />
    </article>
  );
}

// Líneas de texto de diario demasiado chicas para leerse
export function FakeText({ lines }: { lines: number }) {
  return (
    <span
      className="mt-1.5 block w-full opacity-45 bg-[repeating-linear-gradient(180deg,#3d3124_0_2px,transparent_2px_6px)] [mask-image:linear-gradient(90deg,#000_88%,transparent)]"
      style={{ height: lines * 6 }}
      aria-hidden
    />
  );
}
