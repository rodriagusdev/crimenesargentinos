"use client";

// Objetos sobre el escritorio: hilo rojo entre las fotos, recorte de diario, mate y cenicero humeante
export default function SplashDeskProps({ lampOn }: { lampOn: boolean }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 delay-500 ${lampOn ? "opacity-100" : "opacity-0"}`}
      aria-hidden
    >
      {/* Hilo rojo uniendo la evidencia (las coordenadas siguen a las polaroids) */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        <g className="splash-string" fill="none" stroke="#c81e1e" strokeWidth="0.25" vectorEffect="non-scaling-stroke">
          <path d="M12 10 Q50 22 89 12" pathLength={1} />
          <path d="M12 10 Q8 50 14 74" pathLength={1} className="hidden md:inline" />
          <path d="M89 12 Q94 50 87 78" pathLength={1} className="hidden md:inline" />
          <path d="M14 74 Q50 88 87 78" pathLength={1} className="hidden md:inline" />
        </g>
      </svg>

      {/* Recorte de diario */}
      <div className="absolute bottom-[3%] left-[22%] hidden lg:block w-44 p-2 rotate-[-4deg] bg-[#e8e0cc] text-[#222] shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
        <p className="text-[7px] tracking-widest border-b border-[#222]/50 pb-1">EL VESPERTINO · EDICIÓN NOCHE</p>
        <p className="text-[10px] leading-snug mt-1">OLA DE GOLPES SACUDE AL PAÍS</p>
        <div className="mt-1 space-y-[3px]">
          <div className="h-[3px] bg-[#222]/30" />
          <div className="h-[3px] w-5/6 bg-[#222]/30" />
          <div className="h-[3px] w-4/6 bg-[#222]/30" />
        </div>
      </div>

      {/* Mate con bombilla */}
      <div className="absolute bottom-[6%] right-[24%] hidden lg:block">
        <div className="splash-steam absolute -top-10 left-3 h-10 w-6" />
        <div className="absolute -top-7 left-8 h-9 w-[3px] rotate-[18deg] bg-gradient-to-b from-[#e5e5e5] to-[#9a9a9a]" />
        <div className="relative w-12 h-12 rounded-b-[45%] rounded-t-[30%] bg-gradient-to-br from-[#6b4423] to-[#2e1a0b] shadow-[0_8px_14px_rgba(0,0,0,0.6)]">
          <div className="absolute -top-1 inset-x-0 h-3 rounded-full bg-[#c7c7c7] border-2 border-[#8d8d8d]" />
          <div className="absolute top-0.5 inset-x-1.5 h-1.5 rounded-full bg-[#4f7a2a]" />
        </div>
      </div>

      {/* Cenicero con cigarrillo humeante */}
      <div className="absolute bottom-[14%] left-[40%] hidden md:block">
        <div className="splash-smoke absolute -top-24 left-8 h-24 w-8" />
        <div className="relative w-16 h-5 rounded-[50%] bg-gradient-to-b from-[#5c6670] to-[#252b31] shadow-[0_6px_10px_rgba(0,0,0,0.6)]">
          <div className="absolute top-1 inset-x-2 h-2 rounded-[50%] bg-[#15191d]" />
          <div className="absolute -top-0.5 left-7 w-9 h-1.5 rotate-[-8deg] bg-[#f1ece2] rounded-r-sm">
            <span className="splash-ember absolute -right-0.5 top-0 h-full w-1.5 rounded-r-sm bg-orange-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
