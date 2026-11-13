import type { AnimationEvent } from "react";
import StickerCard from "./StickerCard";
import StickerSlot from "./StickerSlot";
import StickerPacket from "./StickerPacket";
import styles from "./album.module.css";
import { PER_PAGE, type AlbumLeaf } from "./albumPages";
import type { TurnDir } from "./useAlbumPager";

export type PacketState = "cerrado" | "abriendo" | "pegando" | "pegado";

type Props = {
  leaf: AlbumLeaf;
  isNew: boolean;
  /** Estado del sobre (solo cuenta en las hojas del release nuevo) */
  packet: PacketState;
  onOpenPacket: () => void;
  /** Hoja que está girando sobre el lomo (se dibuja encima, ocupando el mismo lugar) */
  flip?: TurnDir;
  /** Hoja de abajo mientras otra gira: recibe su sombra */
  cast?: TurnDir;
  onFlipEnd?: () => void;
};

// Hoja del álbum: lomo con sombra, encabezado del release y 10 casilleros (los que sobran quedan en blanco)
export default function AlbumPage({ leaf, isNew, packet, onOpenPacket, flip, cast, onFlipEnd }: Props) {
  const { release, suspects, start, part, parts } = leaf;
  const sealed = isNew && (packet === "cerrado" || packet === "abriendo");
  const blanks = PER_PAGE - suspects.length;
  const flipClass = flip ? `${styles.leaf} ${flip === "next" ? styles.flipOut : styles.flipIn} absolute inset-0 z-10` : "relative";

  // Solo la animación de la hoja termina el giro (las de adentro, como el brillo, también burbujean)
  const handleEnd = (e: AnimationEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) onFlipEnd?.();
  };

  return (
    <section
      onAnimationEnd={flip ? handleEnd : undefined}
      className={`${flipClass} rounded-xl rounded-tl-none bg-[#f3ead2] p-3 pl-5 sm:p-6 sm:pl-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[repeating-linear-gradient(0deg,transparent,transparent_23px,rgba(29,78,137,0.06)_24px)]`}
      aria-hidden={flip === "next" ? true : undefined}
    >
      {/* Sombra del lomo y agujeritos de la encuadernación */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-4 sm:w-7 bg-[linear-gradient(90deg,rgba(0,0,0,0.22),transparent)]" aria-hidden />
      <div className="pointer-events-none absolute inset-y-6 left-1 sm:left-2 flex flex-col justify-around" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="size-2 sm:size-2.5 rounded-full bg-[#123a6b] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]" />
        ))}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-2 border-b-2 border-dashed border-[#1d4e89]/30 pb-3 mb-4">
        <h2 className="text-sm sm:text-base text-[#1d4e89]">
          {release.name.toUpperCase()}
          {parts > 1 && <span className="ml-2 text-[10px] text-[#1d4e89]/60">({part}/{parts})</span>}
        </h2>
        <span className="font-mono text-sm font-bold text-[#1d4e89]">
          Figuritas {start} a {start + suspects.length - 1}
        </span>
      </div>

      <div className="relative">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
          {suspects.map((s, i) =>
            sealed ? (
              <StickerSlot key={s.name} number={start + i} />
            ) : (
              <StickerCard key={s.name} suspect={s} number={start + i} isNew={isNew} pasting={isNew && packet === "pegando"} order={i} />
            ),
          )}
          {/* Casilleros en blanco para que todas las hojas midan lo mismo */}
          {Array.from({ length: blanks }, (_, i) => (
            <StickerSlot key={`blank-${i}`} number={0} blank />
          ))}
        </div>
        {sealed && <StickerPacket count={release.suspects.length} opening={packet === "abriendo"} onOpen={onOpenPacket} />}
      </div>

      {/* Sombreado de la hoja que gira y sombra que cae sobre la de abajo */}
      {flip && <span className={`${styles.leafShade} pointer-events-none absolute inset-0 rounded-xl rounded-tl-none`} aria-hidden />}
      {cast && (
        <span
          className={`${styles.castShadow} ${cast === "next" ? styles.castOut : styles.castIn} pointer-events-none absolute inset-0 rounded-xl rounded-tl-none`}
          aria-hidden
        />
      )}
    </section>
  );
}
