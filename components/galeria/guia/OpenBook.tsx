import GuidePageView from "./GuidePageView";
import LetterIndex from "./LetterIndex";
import { initialOf, type GuidePage } from "./guiaPages";
import styles from "./guia.module.css";

type Props = {
  pages: GuidePage[];
  view: number;
  perView: number;
  turn: { dir: "next" | "prev"; n: number };
  found: Set<string>;
  letters: Map<string, number>;
  onJump: (page: number) => void;
  newEdition: boolean;
};

// Libro abierto: tapas azules, una o dos páginas con el lomo al medio y el uñero en el canto.
// La hoja que llega gira sobre el lomo según hacia dónde se hojea.
export default function OpenBook({ pages, view, perView, turn, found, letters, onJump, newEdition }: Props) {
  const visible = pages.slice(view, view + perView);
  const current = new Set(visible.flatMap((p) => (p.kind === "guia" ? p.entries.map((e) => initialOf(e.suspect.name)) : [])));
  const turning = turn.n > 0 ? (turn.dir === "next" ? styles.turnNext : styles.turnPrev) : "";

  return (
    <div className="relative">
      <div className="relative flex rounded-lg bg-[#1d3f8a] p-2 sm:p-3 shadow-[0_30px_60px_rgba(0,0,0,0.75)]">
        <div key={`${view}-${turn.n}`} className={`flex-1 min-w-0 grid ${perView === 2 ? "grid-cols-2" : "grid-cols-1"} [perspective:1600px]`}>
          {visible.map((p, i) => {
            // Con doble página gira la hoja del lado hacia el que se avanza; con una sola, la única
            const flips = perView === 1 || (turn.dir === "next" ? i === 1 : i === 0);
            return (
              <div key={p.folio} className={flips ? turning : ""}>
                <GuidePageView page={p} side={perView === 2 && i === 0 ? "left" : "right"} found={found} />
              </div>
            );
          })}
        </div>

        {/* Uñero en el canto (tablet y escritorio) */}
        <div className="hidden sm:block -mr-2 sm:-mr-3 pl-1">
          <LetterIndex letters={letters} current={current} onJump={onJump} vertical />
        </div>

        {/* Faja de la edición nueva */}
        {newEdition && (
          <span className="pointer-events-none absolute -top-1 -right-1 size-32 overflow-hidden" aria-hidden>
            <span className={`absolute top-7 -right-10 w-48 rotate-45 bg-[#c81e1e] py-1 text-center text-[10px] text-white shadow-md ${styles.band}`}>
              ¡NUEVA EDICIÓN!
            </span>
          </span>
        )}
      </div>
      {/* Grosor de las hojas debajo */}
      <div className="mx-4 h-2 rounded-b-sm bg-[repeating-linear-gradient(180deg,#e6d690_0_1px,#f6e7a1_1px_2px)] shadow-[0_6px_10px_rgba(0,0,0,0.5)]" aria-hidden />
    </div>
  );
}
