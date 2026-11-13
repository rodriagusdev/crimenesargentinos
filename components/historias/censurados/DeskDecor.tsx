import styles from "./censurados.module.css";

// Escritorio en penumbra: lámpara de brazo en la esquina con su cono de luz sobre las carpetas, una taza de café
// humeando, la almohadilla de tinta y un aro de café sobre la madera. Pura decoración: no captura clics.
export default function DeskDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl" aria-hidden>
      {/* Cono de luz */}
      <div className={`absolute left-4 top-6 h-[110%] w-[150%] sm:w-[120%] ${styles.cone}`} />

      {/* Lámpara de brazo */}
      <div className="absolute left-2 top-1 sm:left-4">
        <span className="absolute left-3 top-0 block h-10 w-1.5 origin-bottom rotate-[35deg] rounded bg-[#1d2a22]" />
        <span className="relative block h-7 w-14 -rotate-[25deg] rounded-t-full bg-gradient-to-b from-[#456b52] to-[#24382b] shadow-[0_6px_10px_rgba(0,0,0,0.6)]">
          <span
            className={`absolute -bottom-1.5 left-1/2 size-4 -translate-x-1/2 rounded-full bg-[#fff6d6] shadow-[0_0_26px_12px_rgba(255,222,140,0.55)] ${styles.bulb}`}
          />
        </span>
      </div>

      {/* Aro de café */}
      <span className="absolute bottom-6 left-[38%] size-16 rounded-full border-[3px] border-[#3b2410]/50 blur-[0.5px]" />

      {/* Taza con humo */}
      <div className="absolute -bottom-2 right-3 sm:right-6">
        <span className={`absolute -top-6 left-3 h-6 w-2 rounded-full bg-white/40 blur-sm ${styles.steam}`} />
        <span className={`absolute -top-6 left-6 h-6 w-2 rounded-full bg-white/30 blur-sm ${styles.steam}`} style={{ animationDelay: "2s" }} />
        <span className="relative block h-9 w-11 rounded-b-xl rounded-t-sm bg-gradient-to-b from-[#e8e1d0] to-[#a9a08c] shadow-[0_8px_14px_rgba(0,0,0,0.6)]">
          <span className="absolute inset-x-1 top-0.5 h-2 rounded-full bg-[#2a170a]" />
          <span className="absolute -right-3 top-2 h-5 w-4 rounded-r-full border-[3px] border-l-0 border-[#bdb49f]" />
        </span>
      </div>

      {/* Almohadilla de tinta */}
      <span className="absolute bottom-3 left-3 h-6 w-12 rounded-sm border-2 border-[#1a1a1a] bg-[radial-gradient(circle,#7a1212,#3d0909)] shadow-[0_6px_10px_rgba(0,0,0,0.6)]" />
    </div>
  );
}
