import SuspectPhoto from "../SuspectPhoto";
import type { GallerySuspect } from "@/lib/suspectReleases";

// Inclinaciones y esquinas rotas que se repiten para que el muro no se vea prolijo
const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0", "-rotate-3"];
const TORN = [
  "polygon(0 0,100% 0,100% 88%,90% 100%,0 100%)",
  "polygon(0 6%,8% 0,100% 0,100% 100%,0 100%)",
  "polygon(0 0,100% 0,100% 100%,12% 100%,0 92%)",
  "polygon(0 0,94% 0,100% 7%,100% 100%,0 100%)",
];

// Cartel de "persona de interés": los viejos, gastados y con cinta; los nuevos, recién pegados y brillantes
export default function InterestPoster({ suspect, index, isNew }: { suspect: GallerySuspect; index: number; isNew: boolean }) {
  return (
    <div className={`relative ${TILTS[index % TILTS.length]} transition-transform duration-200 hover:rotate-0 hover:scale-105 ${isNew ? "galeria-in" : ""}`}>
      {/* Cinta (viejos) o chinche (nuevos) */}
      {isNew ? (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 size-4 rounded-full bg-[#c81e1e] border-2 border-[#ffb4b4] shadow" aria-hidden />
      ) : (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 h-5 w-16 bg-[#e8dcb5]/80 rotate-3 shadow-sm" aria-hidden />
      )}
      <article
        style={isNew ? undefined : { clipPath: TORN[index % TORN.length] }}
        className={`flex flex-col items-center gap-1.5 p-2.5 pb-3 text-center shadow-[0_8px_18px_rgba(0,0,0,0.45)] ${
          isNew ? "bg-[#fffaf0] text-[#1b1813]" : "bg-[#e3d4b0] text-[#3a2c1c] sepia-[0.45]"
        }`}
      >
        <span className={`text-[10px] tracking-wider ${isNew ? "text-[#c81e1e]" : "text-[#6b4a2b]"}`}>PERSONA DE INTERÉS</span>
        <div className={`relative w-full aspect-square overflow-hidden border-2 ${isNew ? "border-[#1b1813]" : "border-[#6b5638]"} bg-[#3a4250]`}>
          <SuspectPhoto suspect={suspect} index={index} className={isNew ? "" : "grayscale-[0.6] contrast-90"} />
        </div>
        <h3 className="font-mono text-xs sm:text-sm font-black uppercase leading-tight">{suspect.name}</h3>
      </article>
    </div>
  );
}
