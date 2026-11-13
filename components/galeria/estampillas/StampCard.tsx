import SuspectPhoto from "../SuspectPhoto";
import type { GallerySuspect } from "@/lib/suspectReleases";

// Estampilla: el borde punteado del color de la hoja simula el dentado. Las de la serie nueva, con colores vivos
export default function StampCard({ suspect, number, isNew, sheetColor }: { suspect: GallerySuspect; number: number; isNew: boolean; sheetColor: string }) {
  return (
    <div
      className="bg-white p-2 border-[6px] border-dotted transition-transform duration-200 hover:-translate-y-1 hover:rotate-1"
      style={{ borderColor: sheetColor }}
    >
      <div className={`flex flex-col gap-1 p-1.5 border-2 ${isNew ? "border-[#1d4e89] bg-[#e8f1fb]" : "border-[#8b7d68] bg-[#efe6d4] sepia-[0.4]"}`}>
        <div className="flex justify-between text-[10px] text-[#1b1813]">
          <span>${number}</span>
          <span>ARG</span>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-[#3a4250]">
          <SuspectPhoto suspect={suspect} index={number} className={isNew ? "saturate-125" : "grayscale-[0.4]"} />
        </div>
        <span className="font-serif text-xs font-bold uppercase leading-tight text-center text-[#1b1813]">{suspect.name}</span>
        <span className="text-[10px] text-center text-[#5a4f40]">CORREO · REP. ARGENTINA</span>
      </div>
    </div>
  );
}
