import type { CSSProperties } from "react";
import SuspectPhoto from "../SuspectPhoto";
import type { GallerySuspect } from "@/lib/suspectReleases";
import styles from "./muro.module.css";

// Inclinaciones y esquinas rotas que se repiten para que el muro no se vea prolijo
const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0", "-rotate-3"];
const TORN = [
  "polygon(0 0,100% 0,100% 88%,90% 100%,0 100%)",
  "polygon(0 6%,8% 0,100% 0,100% 100%,0 100%)",
  "polygon(0 0,100% 0,100% 100%,12% 100%,0 92%)",
  "polygon(0 0,94% 0,100% 7%,100% 100%,0 100%)",
];
// Restos de carteles anteriores que asoman por debajo de los viejos
const SCRAPS = ["bg-[#c9b37a] rotate-6", "bg-[#a8c3c9] -rotate-6", "bg-[#d9a08a] rotate-3", "bg-[#bfc99a] -rotate-3"];

type Props = { suspect: GallerySuspect; index: number; isNew: boolean; gust: boolean; onFlutter: () => void };

// Cartel de "persona de interés": los viejos, gastados y con cinta sobre restos de otros carteles;
// los nuevos se pegan con engrudo (se despliegan con la brocha) y quedan brillando
export default function InterestPoster({ suspect, index, isNew, gust, onFlutter }: Props) {
  const delay = { "--d": `${index * 260}ms` } as CSSProperties;

  return (
    <button
      type="button"
      onClick={onFlutter}
      aria-label={suspect.name}
      className={`${styles.posterWrap} ${gust ? styles.gust : ""} relative block w-full cursor-pointer ${TILTS[index % TILTS.length]} transition-transform duration-200 hover:rotate-0 hover:scale-105`}
    >
      {!isNew && (
        <span
          className={`absolute inset-x-1 -top-1 bottom-3 z-0 opacity-70 ${SCRAPS[index % SCRAPS.length]}`}
          style={{ clipPath: TORN[(index + 2) % TORN.length] }}
          aria-hidden
        />
      )}

      <span
        style={isNew ? delay : { clipPath: TORN[index % TORN.length] }}
        className={`${styles.paper} ${isNew ? styles.pasted : ""} relative z-10 flex flex-col items-center gap-1.5 p-2.5 pb-3 text-center shadow-[0_8px_18px_rgba(0,0,0,0.55)] ${
          isNew ? "bg-[#fffaf0] text-[#1b1813]" : "bg-[#e3d4b0] text-[#3a2c1c] sepia-[0.45]"
        }`}
      >
        <span className={`text-[10px] tracking-wider ${isNew ? "text-[#c81e1e]" : "text-[#6b4a2b]"}`}>PERSONA DE INTERÉS</span>
        <span className={`relative block w-full aspect-square overflow-hidden border-2 ${isNew ? "border-[#1b1813]" : "border-[#6b5638]"} bg-[#3a4250]`}>
          <SuspectPhoto suspect={suspect} index={index} className={isNew ? "" : "grayscale-[0.6] contrast-90"} />
        </span>
        <span className="block font-mono text-xs sm:text-sm font-black uppercase leading-tight">{suspect.name}</span>
        {/* Manchas de humedad en los viejos, engrudo fresco en los nuevos */}
        {isNew ? (
          <span className={`${styles.wet} absolute inset-0 pointer-events-none`} aria-hidden />
        ) : (
          <span
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_85%,rgba(90,60,20,0.35),transparent_35%),radial-gradient(circle_at_10%_20%,rgba(90,60,20,0.25),transparent_30%)]"
            aria-hidden
          />
        )}
      </span>

      {/* Brocha de engrudo que baja mientras se pega el cartel nuevo */}
      {isNew && (
        <span
          style={delay}
          className={`${styles.brush} absolute -inset-x-2 z-10 h-4 rounded-sm bg-[#8a5a2b] border-b-4 border-[#e8dcb5] shadow-[0_6px_10px_rgba(0,0,0,0.5)] pointer-events-none`}
          aria-hidden
        />
      )}

      {/* Cinta (viejos) o chinche (nuevos) */}
      {isNew ? (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 size-4 rounded-full bg-[#c81e1e] border-2 border-[#ffb4b4] shadow" aria-hidden />
      ) : (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 h-5 w-16 bg-[#e8dcb5]/80 rotate-3 shadow-sm" aria-hidden />
      )}
    </button>
  );
}
