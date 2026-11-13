import SuspectPhoto from "../SuspectPhoto";
import type { GallerySuspect } from "@/lib/suspectReleases";

// Ficha de prontuario: número de legajo, foto y nombre; las del release nuevo llevan sello "NUEVO"
export default function RecordCard({ suspect, number, isNew }: { suspect: GallerySuspect; number: number; isNew: boolean }) {
  return (
    <article className="relative bg-[#f6f0de] text-[#2b2117] rounded-sm border border-[#cdbf9f] p-2 shadow-[0_6px_14px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-1.5">
      {/* Solapa superior de la ficha */}
      <div className="absolute -top-2.5 left-3 h-3 w-14 rounded-t-sm bg-[#e9dfc4] border border-b-0 border-[#cdbf9f]" aria-hidden />
      <div className="flex items-center justify-between font-mono text-[10px] font-bold text-[#7a6a50] border-b border-[#d9cdb2] pb-1 mb-2">
        <span>LEGAJO</span>
        <span>N° {String(number).padStart(4, "0")}</span>
      </div>
      <div className="relative aspect-square overflow-hidden border border-[#b9ab8c] bg-[#3a4250]">
        <SuspectPhoto suspect={suspect} index={number} className="grayscale-[0.35] contrast-110" />
        {isNew && (
          <span className="absolute bottom-2 right-1 px-2 py-0.5 border-2 border-[#c81e1e] text-[#c81e1e] bg-[#f6f0de]/85 text-[10px] -rotate-12">
            NUEVO
          </span>
        )}
      </div>
      <h3 className="mt-2 font-mono text-xs sm:text-sm font-bold uppercase leading-tight text-center">{suspect.name}</h3>
    </article>
  );
}
