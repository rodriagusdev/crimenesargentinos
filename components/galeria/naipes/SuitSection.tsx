import PlayingCard, { type Suit } from "./PlayingCard";
import type { SuspectRelease } from "@/lib/suspectReleases";

type Props = { release: SuspectRelease; suit: Suit; fresh: boolean; onFlip: () => void };

// Un palo (un release) desplegado sobre el paño; el nuevo sale repartido desde el mazo
export default function SuitSection({ release, suit, fresh, onFlip }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex flex-wrap items-center gap-3 text-xs sm:text-sm [text-shadow:0_2px_0_#062616]">
        <span className="flex size-8 items-center justify-center rounded-full bg-[#fbf7ec] text-base shadow-[0_3px_6px_rgba(0,0,0,0.4)]" aria-hidden>
          {suit.icon}
        </span>
        {suit.name.toUpperCase()} · {release.name.toUpperCase()}
        {fresh && <span className="px-2 py-1 rounded bg-[#ffd447] text-[#1b1813] text-[10px] [text-shadow:none]">PALO NUEVO · RECIÉN REPARTIDO</span>}
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
        {release.suspects.map((s, i) => (
          <PlayingCard key={`${release.id}-${s.name}`} suspect={s} number={i + 1} suit={suit} dealt={fresh} order={i} onFlip={onFlip} />
        ))}
      </div>
    </section>
  );
}
