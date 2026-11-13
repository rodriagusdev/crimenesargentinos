import DeckBox from "./DeckBox";
import MateCup from "./MateCup";
import ScorePad from "./ScorePad";
import styles from "./naipes.module.css";
import type { Suit } from "./PlayingCard";

type Props = {
  /** Palo que se acaba de repartir (si hay release nuevo) */
  newSuit: { suit: Suit; cards: number } | null;
  flips: number;
  shuffles: number;
  onShuffle: () => void;
};

// Cabecera de la mesa: el mazo con su caja, el título, el cartel del palo nuevo, el mate y el anotador
export default function TableTop({ newSuit, flips, shuffles, onShuffle }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <header className="text-center">
        <p className="text-[10px] tracking-[0.3em] text-[#E1C380]">MESA DE TRUCO · MAZO OFICIAL</p>
        <h1 className="mt-2 text-lg sm:text-2xl leading-relaxed [text-shadow:0_3px_0_#062616]">EL MAZO DE LA CENTRAL</h1>
        <p className="mt-2 font-mono text-sm text-[#FFF3C7]/70">Tocá un naipe para darlo vuelta. Tocá el mazo para mezclar.</p>
      </header>

      <div className="flex flex-wrap items-end justify-center sm:justify-between gap-x-6 gap-y-8 pb-4">
        <DeckBox open={!!newSuit} shuffleSeq={shuffles} onShuffle={onShuffle} />

        {newSuit && (
          <div
            className={`order-first sm:order-none w-full sm:w-auto rounded-md border-2 border-[#ffd447] bg-[#1b1813]/80 px-4 py-3 text-center shadow-[0_0_24px_rgba(255,212,71,0.35)] ${styles.banner}`}
          >
            <p className="text-[10px] text-[#ffd447]">¡SE REPARTE UN PALO NUEVO!</p>
            <p className="mt-1 text-sm sm:text-base">
              <span aria-hidden>{newSuit.suit.icon} </span>
              {newSuit.suit.name.toUpperCase()} · {newSuit.cards} NAIPES
            </p>
          </div>
        )}

        <div className="flex items-end gap-4">
          <MateCup />
          <ScorePad nos={flips} ellos={shuffles} />
        </div>
      </div>
    </div>
  );
}
