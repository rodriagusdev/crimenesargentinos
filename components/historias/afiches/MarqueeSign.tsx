import styles from "./afiches.module.css";

const BULBS = Array.from({ length: 14 }, (_, i) => i);

// Fila de lamparitas de la marquesina
function BulbRow() {
  return (
    <div className="flex justify-between px-2" aria-hidden>
      {BULBS.map((i) => (
        <span key={i} className={`size-2 sm:size-2.5 rounded-full bg-[#ffd678] ${styles.bulb}`} />
      ))}
    </div>
  );
}

// Marquesina del cine: cartel "PRÓXIMAMENTE" con lamparitas arriba y abajo
export default function MarqueeSign() {
  return (
    <header className="relative mx-auto w-full max-w-3xl">
      <div className="rounded-lg border-4 border-[#b8892e] bg-[linear-gradient(180deg,#3a0b10,#1c0508)] py-2 shadow-[0_0_40px_rgba(255,190,90,0.25),inset_0_0_30px_rgba(0,0,0,0.8)]">
        <BulbRow />
        <div className="px-4 py-4 sm:py-6 text-center">
          <p className="text-[8px] sm:text-[10px] tracking-[0.3em] text-[#ffd678]/80">CINE DE LA CENTRAL · SALA 1</p>
          <h1 className="mt-3 text-2xl sm:text-5xl text-[#fff3c7] [text-shadow:0_0_12px_rgba(255,214,120,0.8),0_4px_0_#7a1212]">
            PRÓXIMAMENTE
          </h1>
          <p className="mt-3 font-mono text-sm sm:text-base text-[#fff3c7]/75">Ocho casos en cartel. Tocá un afiche para leer la contratapa.</p>
        </div>
        <BulbRow />
      </div>
      {/* Soportes de la marquesina */}
      <div className="mx-auto flex w-2/3 justify-between" aria-hidden>
        <span className="h-5 w-2 bg-[#b8892e]/70" />
        <span className="h-5 w-2 bg-[#b8892e]/70" />
      </div>
    </header>
  );
}
