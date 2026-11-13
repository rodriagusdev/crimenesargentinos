import FlapTiles from "./FlapTiles";
import SuspectPhoto from "../SuspectPhoto";
import type { GallerySuspect } from "@/lib/suspectReleases";

const ORIGINS = ["MONTEVIDEO", "ASUNCIÓN", "SANTIAGO", "LIMA", "SAN PABLO", "MADRID", "ROMA", "BOGOTÁ", "LA PAZ", "MIAMI", "MÉXICO", "PARÍS"];

// Columnas compartidas con el encabezado del tablero
export const ROW_COLUMNS = "grid-cols-[3rem_1fr_auto] sm:grid-cols-[3.5rem_4.5rem_3rem_1fr_7rem] lg:grid-cols-[3.5rem_4.5rem_8rem_3rem_1fr_3rem_8rem]";

type Props = { suspect: GallerySuspect; number: number; isNew: boolean; row: number; animate: boolean };

// Fila del tablero: hora, vuelo, origen, foto, nombre, puerta y estado con su lámpara
export default function ArrivalRow({ suspect, number, isNew, row, animate }: Props) {
  const delay = row * 90;
  const minutes = (number * 7) % 60;
  const time = `${String(6 + Math.floor(number / 3)).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  return (
    <li
      className={`grid ${ROW_COLUMNS} items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 border-b border-[#23272e] ${
        isNew ? "bg-[#10241a] shadow-[inset_4px_0_0_#2fd36a]" : "bg-[#14171c] odd:bg-[#111419]"
      }`}
    >
      <span className="hidden sm:block">
        <FlapTiles text={time} size="sm" animate={animate} delayMs={delay} />
      </span>
      <span className="hidden sm:block">
        <FlapTiles text={`AR${1000 + number}`} size="sm" animate={animate} delayMs={delay} color="#e9edf2" />
      </span>
      <span className="hidden lg:block">
        <FlapTiles text={ORIGINS[number % ORIGINS.length].slice(0, 7)} size="sm" animate={animate} delayMs={delay} color="#e9edf2" />
      </span>
      <div className="relative size-11 sm:size-12 overflow-hidden rounded-sm border border-[#2a2f38] bg-[#3a4250]">
        <SuspectPhoto suspect={suspect} index={number} />
      </div>
      <span className="min-w-0">
        <FlapTiles text={suspect.name} animate={animate} delayMs={delay + 120} />
      </span>
      <span className="hidden lg:block">
        <FlapTiles text={`A${(number % 12) + 1}`} size="sm" animate={animate} delayMs={delay} />
      </span>
      <span className="justify-self-end flex items-center gap-1.5 text-[10px]">
        <span
          className={`size-2.5 rounded-full ${isNew ? "bg-[#2fd36a] shadow-[0_0_8px_#2fd36a] galeria-blink" : "bg-[#5b6270]"}`}
          aria-hidden
        />
        <span className={isNew ? "text-[#7dffaa]" : "text-[#9aa3b0]"}>{isNew ? "ATERRIZÓ" : "ARRIBADO"}</span>
      </span>
    </li>
  );
}
