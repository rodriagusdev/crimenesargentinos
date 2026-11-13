import styles from "./naipes.module.css";

const BACK =
  "absolute inset-0 rounded-md border-2 border-[#fbf7ec] bg-[#8b1d1d] bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.14)_0,rgba(255,255,255,0.14)_3px,transparent_3px,transparent_8px)] shadow-[0_3px_6px_rgba(0,0,0,0.4)]";

type Props = {
  /** Hay un palo nuevo: la caja está abierta */
  open: boolean;
  /** Cambia con cada mezcla: vuelve a abrir el abanico */
  shuffleSeq: number;
  onShuffle: () => void;
};

// Caja del mazo (se abre cuando llega un palo nuevo) y el mazo, que se mezcla al tocarlo
export default function DeckBox({ open, shuffleSeq, onShuffle }: Props) {
  return (
    <div className="flex items-end gap-4">
      {/* Caja */}
      <div className="relative w-14 h-20" aria-hidden>
        <div className="absolute inset-0 rounded-sm bg-[linear-gradient(160deg,#c8a24a,#8a6a1f)] border border-[#5a4512] shadow-[0_6px_12px_rgba(0,0,0,0.5)] flex items-center justify-center">
          <span className="rotate-[-90deg] whitespace-nowrap text-[7px] text-[#2a1f08]">NAIPES</span>
        </div>
        <div
          className={`absolute inset-x-0 top-0 h-5 rounded-t-sm bg-[#b08d38] border border-[#5a4512] ${styles.lid} ${open ? styles.lidOpen : ""}`}
        />
      </div>

      {/* Mazo: tocarlo lo mezcla */}
      <button
        type="button"
        onClick={onShuffle}
        aria-label="Mezclar el mazo"
        className="group relative w-14 h-20 cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-[#ffd447]"
      >
        <span className={`${BACK} translate-x-1 translate-y-1`} aria-hidden />
        <span className={`${BACK} translate-x-0.5 translate-y-0.5`} aria-hidden />
        <span key={`l-${shuffleSeq}`} className={`${BACK} ${shuffleSeq > 0 ? styles.fanLeft : ""}`} aria-hidden />
        <span key={`r-${shuffleSeq}`} className={`${BACK} ${shuffleSeq > 0 ? styles.fanRight : ""}`} aria-hidden />
        <span className={`${BACK} ${styles.peek}`} aria-hidden />
        <span className="absolute -bottom-5 inset-x-0 text-center text-[8px] text-[#FFF3C7]/80 group-hover:text-[#ffd447]">MEZCLAR</span>
      </button>
    </div>
  );
}
