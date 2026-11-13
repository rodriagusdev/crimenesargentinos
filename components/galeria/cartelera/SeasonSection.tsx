import CastPortrait from "./CastPortrait";
import Curtain from "./Curtain";
import MarqueeBulbs from "./MarqueeBulbs";
import RosePetals from "./RosePetals";
import TicketStub from "./TicketStub";
import type { SuspectRelease } from "@/lib/suspectReleases";
import styles from "./cartelera.module.css";

type Props = { release: SuspectRelease; premiere: boolean; lit: boolean };

// Una temporada en cartel: escenario con bombitas, título, elenco y la entrada. La que está en cartel abre el telón
export default function SeasonSection({ release, premiere, lit }: Props) {
  return (
    <section
      className={`relative overflow-hidden rounded-xl border-4 p-3 sm:p-6 flex flex-col gap-5 ${
        lit
          ? "border-[#e8c25a] bg-[#2a1210] bg-[radial-gradient(ellipse_at_top,rgba(255,214,102,0.18),transparent_65%)]"
          : "border-[#4a3c2a] bg-[#1f1512]"
      }`}
    >
      {lit && <Curtain />}
      {premiere && <RosePetals />}

      <MarqueeBulbs on={lit} />
      <div className="text-center">
        {premiere && <p className={`${styles.pulse} text-sm sm:text-lg text-[#ff6b5b]`}>¡ESTRENO!</p>}
        <h2 className={`mt-1 text-base sm:text-xl ${lit ? "text-[#fff1b8]" : "text-[#b9ad95]"}`}>TEMPORADA {release.id}</h2>
        <p className="mt-1 font-mono text-sm text-[#FFF3C7]/60">
          {release.name} · {release.suspects.length} en escena{lit ? "" : " · luces apagadas"}
        </p>
      </div>

      {/* Escenario: tablas de madera bajo el elenco */}
      <div className="rounded-md p-2 sm:p-3 bg-[linear-gradient(180deg,transparent_60%,rgba(90,50,20,0.35)),repeating-linear-gradient(90deg,rgba(0,0,0,0.12)_0_1px,transparent_1px_60px)]">
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-5">
          {release.suspects.map((s, i) => (
            <CastPortrait key={s.name} suspect={s} index={i} lit={lit} bowOnEnter={lit} />
          ))}
        </div>
      </div>

      <TicketStub season={release.id} lit={lit} />
      <MarqueeBulbs on={lit} />
    </section>
  );
}
