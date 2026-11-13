import RotaryPhone from "./RotaryPhone";
import type { SuspectRelease } from "@/lib/suspectReleases";

// Escritorio sobre el que está la guía: el teléfono de disco y un anotador con la novedad de la edición
export default function GuiaDesk({ edition, newRelease }: { edition: number; newRelease?: SuspectRelease }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4">
      <RotaryPhone />
      {/* Anotador con lápiz */}
      <div className="relative w-44 sm:w-56 -rotate-2 bg-[#fffbe8] px-3 pt-4 pb-3 shadow-[0_8px_16px_rgba(0,0,0,0.55)] bg-[repeating-linear-gradient(180deg,transparent_0_17px,#b9d3ef_17px_18px)]">
        <span className="absolute top-0 inset-x-0 h-2.5 bg-[#c81e1e]/80" aria-hidden />
        <p key={newRelease?.id ?? 0} className="galeria-in font-serif italic text-sm leading-[18px] text-[#1d3f8a]">
          {newRelease
            ? `¡Llegó la edición ${edition}! ${newRelease.suspects.length} altas nuevas, marcadas en amarillo.`
            : `Edición ${edition}. Sin altas nuevas por ahora.`}
        </p>
        {/* Lápiz */}
        <span
          className="absolute -bottom-3 -right-4 h-2.5 w-28 rotate-[20deg] rounded-r-sm bg-gradient-to-r from-[#f1b84a] via-[#f1b84a] to-[#e9cfa2] shadow-[0_3px_4px_rgba(0,0,0,0.4)]"
          aria-hidden
        >
          <span className="absolute left-0 inset-y-0 w-3 rounded-l-sm bg-[#e87a8a]" />
        </span>
      </div>
    </div>
  );
}
