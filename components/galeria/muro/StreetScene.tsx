import FileteSign from "./FileteSign";
import Skyline from "./Skyline";
import styles from "./muro.module.css";

// Escena nocturna sobre el muro: cielo, luna, edificios, llovizna y el farol que parpadea
export default function StreetScene({ count }: { count: number }) {
  return (
    <div className="relative h-52 sm:h-64 overflow-hidden bg-[linear-gradient(180deg,#070a18_0%,#1a1838_60%,#3a2440_100%)]">
      {/* Luna con halo */}
      <span className="absolute top-5 right-[12%] size-10 sm:size-14 rounded-full bg-[#f3ecd2] shadow-[0_0_40px_12px_rgba(243,236,210,0.25)]" aria-hidden />
      <Skyline />
      <div className={`${styles.drizzle} absolute inset-0 pointer-events-none`} aria-hidden />

      {/* Farol: poste, brazo, lámpara, cono de luz y cartel de la calle */}
      <div className="absolute bottom-0 left-[4%] sm:left-[10%] h-[55%] sm:h-[88%] w-24" aria-hidden>
        <span className="absolute bottom-0 left-3 h-full w-1.5 bg-[#1b1d22] border-x border-black" />
        <span className="absolute top-0 left-3 h-1.5 w-12 bg-[#1b1d22]" />
        <span className="absolute top-1 left-12 h-4 w-6 bg-[#2a2c33] [clip-path:polygon(15%_0,85%_0,100%_100%,0_100%)]" />
        <div className={styles.flicker}>
          <span className="absolute top-5 left-[3.15rem] size-3 rounded-full bg-[#fff1c9] shadow-[0_0_24px_10px_rgba(255,200,110,0.7)]" />
          <span className="absolute top-6 -left-4 h-56 w-36 bg-[linear-gradient(180deg,rgba(255,206,120,0.45),transparent_85%)] [clip-path:polygon(42%_0,58%_0,100%_100%,0_100%)]" />
        </div>
        <span className="absolute top-[38%] left-4 rounded-sm border border-white bg-[#1d4f9c] px-1.5 py-0.5 font-mono text-[9px] font-bold text-white whitespace-nowrap">
          PJE. DEL FAROL
        </span>
      </div>

      <div className="absolute inset-x-0 top-6 sm:top-8">
        <FileteSign count={count} />
      </div>
    </div>
  );
}
