// Rulo de fileteado porteño dibujado a mano (se espeja para el otro lado)
function Rulo({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 48 32" className={`h-6 w-9 sm:h-9 sm:w-14 shrink-0 ${flip ? "-scale-x-100" : ""}`} aria-hidden>
      <path d="M46 16 C34 16 30 4 18 6 C8 8 6 22 16 24 C24 26 26 16 20 14 C16 13 14 18 18 19" fill="none" stroke="#e8c25a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 12 C33 4 41 3 44 6 C40 6 35 8 30 12 Z" fill="#2f9e5b" />
      <path d="M30 20 C33 28 41 29 44 26 C40 26 35 24 30 20 Z" fill="#c8323a" />
      <circle cx="18" cy="19" r="2" fill="#5ab4e8" />
    </svg>
  );
}

// Cartel pintado a pincel, con filetes de colores y rulos en los costados
export default function FileteSign({ count }: { count: number }) {
  return (
    <div className="relative mx-auto w-fit max-w-[92%] rounded-md border-4 border-double border-[#e8c25a] bg-[#14100c]/90 px-2 sm:px-4 py-2 sm:py-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
      <span className="absolute inset-1 rounded-sm border border-[#c8323a]/70 pointer-events-none" aria-hidden />
      <div className="flex items-center gap-1 sm:gap-3">
        <Rulo />
        <div className="text-center">
          <h1 className="text-xs sm:text-2xl leading-relaxed text-[#fff1c9] [text-shadow:2px_2px_0_#c8323a,4px_4px_0_#000]">PERSONAS DE INTERÉS</h1>
          <p className="mt-1 text-[8px] sm:text-[10px] tracking-[0.2em] text-[#7fd0a0]">{count} CARTELES EN EL MURO</p>
        </div>
        <Rulo flip />
      </div>
    </div>
  );
}
