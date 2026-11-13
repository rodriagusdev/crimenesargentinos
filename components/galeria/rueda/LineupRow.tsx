import LineupPerson from "./LineupPerson";
import styles from "./rueda.module.css";
import type { SuspectRelease } from "@/lib/suspectReleases";

// Líneas de altura pintadas en la pared, de arriba hacia abajo (en centímetros)
const HEIGHTS = [210, 200, 190, 180, 170, 160, 150, 140, 130];

type Props = {
  release: SuspectRelease;
  fresh: boolean;
  start: number;
  steppedName: string | null;
  onCall: (number: number, name: string) => void;
};

// Una rueda (un release) vista a través del vidrio espejado: pared con escala de altura, tubo que titila y reflejos
export default function LineupRow({ release, fresh, start, steppedName, onCall }: Props) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <h2 className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
          <span className={`size-2.5 rounded-full ${fresh ? "bg-[#ff5a4d] shadow-[0_0_8px_#ff5a4d] galeria-blink" : "bg-[#3d7a4f]"}`} aria-hidden />
          {release.name.toUpperCase()}
          {fresh && <span className="px-2 py-1 rounded bg-[#c81e1e] text-white text-[10px]">NUEVA RUEDA</span>}
        </h2>
        <span className="font-mono text-sm text-[#FFF3C7]/60">{release.suspects.length} personas · deslizá →</span>
      </div>

      {/* Marco del vidrio */}
      <div className="relative rounded-lg overflow-hidden border-[6px] border-[#0a0b0d] bg-[#4b5361] shadow-[0_0_0_2px_#2a2f38,0_18px_40px_rgba(0,0,0,0.7)]">
        {/* Escala de altura */}
        <div className="absolute inset-0 flex flex-col pointer-events-none" aria-hidden>
          {HEIGHTS.map((h) => (
            <div key={h} className="h-8 shrink-0 border-t-2 border-[rgba(230,236,244,0.3)]">
              <span className="ml-1.5 font-mono text-[10px] text-[#e6ecf4]/70">{h}</span>
            </div>
          ))}
        </div>
        {/* Piso */}
        <div className="absolute inset-x-0 bottom-0 h-7 bg-[linear-gradient(180deg,#2b3038,#1c2026)]" aria-hidden />

        {/* Reflector de la rueda nueva; la vieja queda en penumbra */}
        {fresh ? (
          <div className="galeria-spot absolute inset-0 pointer-events-none" aria-hidden />
        ) : (
          <div className="absolute inset-0 bg-black/25 pointer-events-none" aria-hidden />
        )}

        <div className="relative flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden snap-x pl-10 pr-6 pt-10 pb-3 [scrollbar-width:thin]">
          {release.suspects.map((s, i) => (
            <LineupPerson
              key={s.name}
              suspect={s}
              number={start + i}
              order={i}
              walkIn={fresh}
              stepped={steppedName === s.name}
              onCall={() => onCall(start + i, s.name)}
            />
          ))}
        </div>

        {/* Tubo que titila, reflejo del vidrio y el oscuro del lado de observación */}
        <div className={`absolute inset-0 bg-black pointer-events-none ${styles.flicker}`} aria-hidden />
        <div className={`absolute inset-0 pointer-events-none ${styles.mirror}`} aria-hidden />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.75)]" aria-hidden />
      </div>
    </section>
  );
}
