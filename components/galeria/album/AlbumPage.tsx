import StickerCard from "./StickerCard";
import StickerSlot from "./StickerSlot";
import StickerPacket from "./StickerPacket";
import styles from "./album.module.css";
import type { SuspectRelease } from "@/lib/suspectReleases";

export type PacketState = "cerrado" | "abriendo" | "pegando" | "pegado";

type Props = {
  page: SuspectRelease;
  start: number;
  isNew: boolean;
  /** Estado del sobre de esta página (solo cuenta en la del release nuevo) */
  packet: PacketState;
  turn: "next" | "prev";
  pageNumber: number;
  pageCount: number;
  onOpenPacket: () => void;
  onTurn: (dir: "next" | "prev") => void;
};

// Página del álbum: lomo con sombra, encabezado, casilleros/figuritas y pie con número de página y flechas
export default function AlbumPage({ page, start, isNew, packet, turn, pageNumber, pageCount, onOpenPacket, onTurn }: Props) {
  const sealed = isNew && (packet === "cerrado" || packet === "abriendo");
  const count = page.suspects.length;

  return (
    <section
      className={`${turn === "next" ? styles.turnNext : styles.turnPrev} relative rounded-xl rounded-tl-none bg-[#f3ead2] p-3 pl-5 sm:p-6 sm:pl-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[repeating-linear-gradient(0deg,transparent,transparent_23px,rgba(29,78,137,0.06)_24px)]`}
    >
      {/* Sombra del lomo y agujeritos de la encuadernación */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-4 sm:w-7 bg-[linear-gradient(90deg,rgba(0,0,0,0.22),transparent)]" aria-hidden />
      <div className="pointer-events-none absolute inset-y-6 left-1 sm:left-2 flex flex-col justify-around" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="size-2 sm:size-2.5 rounded-full bg-[#123a6b] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]" />
        ))}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-2 border-b-2 border-dashed border-[#1d4e89]/30 pb-3 mb-4">
        <h2 className="text-sm sm:text-base text-[#1d4e89]">{page.name.toUpperCase()}</h2>
        <span className="font-mono text-sm font-bold text-[#1d4e89]">
          Figuritas {start} a {start + count - 1} · {sealed ? 0 : count}/{count}
        </span>
      </div>

      <div className="relative">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
          {page.suspects.map((s, i) =>
            sealed ? (
              <StickerSlot key={s.name} number={start + i} />
            ) : (
              <StickerCard key={s.name} suspect={s} number={start + i} isNew={isNew} pasting={isNew && packet === "pegando"} order={i} />
            ),
          )}
        </div>
        {sealed && <StickerPacket count={count} opening={packet === "abriendo"} onOpen={onOpenPacket} />}
      </div>

      {/* Pie de página */}
      <div className="mt-5 flex items-center justify-between border-t-2 border-dashed border-[#1d4e89]/30 pt-3 text-[#1d4e89]">
        <button
          type="button"
          onClick={() => onTurn("prev")}
          aria-label="Página anterior"
          disabled={pageNumber === 1}
          className="px-2 py-1 text-[10px] cursor-pointer disabled:opacity-25 disabled:cursor-default hover:-translate-x-0.5 transition-transform"
        >
          ◀<span className="hidden sm:inline"> ANTERIOR</span>
        </button>
        <span className="font-mono text-xs font-bold">
          — Pág. {pageNumber} de {pageCount} —
        </span>
        <button
          type="button"
          onClick={() => onTurn("next")}
          aria-label="Página siguiente"
          disabled={pageNumber === pageCount}
          className="px-2 py-1 text-[10px] cursor-pointer disabled:opacity-25 disabled:cursor-default hover:translate-x-0.5 transition-transform"
        >
          <span className="hidden sm:inline">SIGUIENTE </span>▶
        </button>
      </div>
    </section>
  );
}
