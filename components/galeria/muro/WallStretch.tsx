import InterestPoster from "./InterestPoster";
import type { SuspectRelease } from "@/lib/suspectReleases";
import styles from "./muro.module.css";

// Pintadas del barrio que quedan detrás de los carteles (nada que ver con los sospechosos)
const GRAFFITI = [
  { text: "AGUANTE EL BARRIO", className: "top-[18%] left-[4%] -rotate-6 text-[#3fd0c9]/25" },
  { text: "TANGO Y FERNET", className: "bottom-[10%] right-[3%] rotate-3 text-[#ff7ac8]/20" },
  { text: "M ♥ J", className: "top-[48%] right-[10%] -rotate-12 text-[#ffd447]/25" },
];

type Props = {
  release: SuspectRelease;
  fresh: boolean;
  gust: string | null;
  onFlutter: (name: string) => void;
};

// Tramo de pared de un release: cartelón arriba, pintadas de fondo y los carteles pegados
export default function WallStretch({ release, fresh, gust, onFlutter }: Props) {
  return (
    <section className="relative flex flex-col gap-6">
      {!fresh &&
        GRAFFITI.map((g) => (
          <span
            key={g.text}
            className={`absolute pointer-events-none select-none font-mono italic font-black text-3xl sm:text-6xl whitespace-nowrap [text-shadow:0_0_8px_currentColor] ${g.className}`}
            aria-hidden
          >
            {g.text}
          </span>
        ))}

      <div className="relative flex flex-wrap items-center justify-center gap-3">
        {fresh ? (
          <div className={`${styles.slap} relative`}>
            <h2 className="px-4 py-2 bg-[#ffd447] text-[#1b1813] text-xs sm:text-sm shadow-[0_6px_14px_rgba(0,0,0,0.5)]">
              ¡RECIÉN LLEGADOS A LA CIUDAD!
            </h2>
            <span className="absolute -top-2 -left-3 h-4 w-10 -rotate-12 bg-[#e8dcb5]/85" aria-hidden />
            <span className="absolute -bottom-2 -right-3 h-4 w-10 -rotate-12 bg-[#e8dcb5]/85" aria-hidden />
            <p className="mt-2 text-center font-mono text-[11px] text-[#ffd447]/90">Engrudo fresco · pegados esta noche</p>
          </div>
        ) : (
          <h2 className="px-4 py-2 bg-[#111]/75 text-[#FFF3C7]/80 text-[10px] sm:text-xs [clip-path:polygon(0_0,100%_6%,98%_100%,2%_94%)]">
            {release.name.toUpperCase()} · {release.suspects.length} CARTELES
          </h2>
        )}
      </div>

      <div className="relative grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-7 sm:gap-x-6">
        {release.suspects.map((s, i) => (
          <InterestPoster key={s.name} suspect={s} index={i} isNew={fresh} gust={gust === s.name} onFlutter={() => onFlutter(s.name)} />
        ))}
      </div>
    </section>
  );
}
