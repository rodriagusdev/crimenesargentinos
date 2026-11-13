import Postmark from "./Postmark";
import StampCard from "./StampCard";
import type { SuspectRelease } from "@/lib/suspectReleases";

type Props = { release: SuspectRelease; start: number; isNew: boolean; page: number };

// Hoja del clasificador: papel cuadriculado, una serie por hoja; la nueva entra con colores vivos y el matasellos
export default function StampSheet({ release, start, isNew, page }: Props) {
  return (
    <section
      className={`relative p-3 pt-4 sm:p-6 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#f4efe3] bg-[linear-gradient(rgba(90,79,64,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(90,79,64,0.07)_1px,transparent_1px)] bg-[size:12px_12px] ${
        isNew ? "galeria-in" : "opacity-95"
      }`}
    >
      {/* Ribete de la hoja del clasificador */}
      <div className="pointer-events-none absolute inset-1.5 sm:inset-2.5 border border-[#5a4f40]/30" aria-hidden />

      <div className="relative flex flex-wrap items-baseline justify-between gap-2 mb-5 text-[#1b1813]">
        <div className="flex items-baseline gap-3">
          <h2 className="font-serif text-lg sm:text-2xl font-black uppercase">Serie {release.id}</h2>
          {isNew && <span className="rounded-sm bg-[#c81e1e] px-1.5 py-0.5 text-[10px] text-white -rotate-3">NUEVA EMISIÓN</span>}
        </div>
        <span className="font-mono text-sm">
          {release.suspects.length} valores · {release.name}
        </span>
      </div>

      <div className="relative grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6">
        {release.suspects.map((s, i) => (
          <StampCard key={s.name} suspect={s} number={start + i} isNew={isNew} />
        ))}
      </div>

      {/* Matasellos sobre la serie nueva */}
      {isNew && (
        <div className="pointer-events-none absolute top-8 right-0 sm:right-6">
          <Postmark series={release.id} />
        </div>
      )}

      <p className="relative mt-5 text-center font-mono text-xs text-[#5a4f40]">— Hoja {page} —</p>
    </section>
  );
}
