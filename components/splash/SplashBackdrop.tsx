"use client";

// Fondo del splash: ventana de la oficina con el skyline porteño bajo la lluvia y la sombra de la persiana
export default function SplashBackdrop({ lampOn }: { lampOn: boolean }) {
  return (
    <div className="absolute inset-0" aria-hidden>
      {/* Ventana */}
      <div className="absolute top-[6%] left-1/2 -translate-x-1/2 w-[min(92vw,1100px)] h-[58%] border-[10px] border-[#140d08] bg-gradient-to-b from-[#0b1426] via-[#13203a] to-[#22283f] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)]">
        {/* Luna velada */}
        <div className="absolute top-[10%] right-[14%] size-16 rounded-full bg-[#dfe6f5]/25 blur-[2px] shadow-[0_0_60px_rgba(200,215,255,0.25)]" />

        {/* Skyline con el Obelisco */}
        <svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMax slice" className="absolute bottom-0 inset-x-0 h-[70%] w-full">
          <path
            fill="#070b14"
            d="M0 300V190h40v-40h50v60h30V120h60v90h25v-50h45v140zM250 300V170h55v-30h40v160zM345 300V200h40v-60h20V40l12-20 12 20v100h20v60h40v100zM489 300V150h70v40h30v-90h60v200zM649 300V180h45v-50h55v170zM749 300V140h40v-30h60v60h35v-40h55v80h30v-20h31v110z"
          />
          {/* Ventanas encendidas */}
          <g fill="#f3c46b" className="splash-windows">
            <rect x="140" y="140" width="6" height="8" />
            <rect x="160" y="170" width="6" height="8" />
            <rect x="270" y="190" width="6" height="8" />
            <rect x="510" y="170" width="6" height="8" />
            <rect x="610" y="130" width="6" height="8" />
            <rect x="620" y="200" width="6" height="8" />
            <rect x="710" y="160" width="6" height="8" />
            <rect x="810" y="150" width="6" height="8" />
            <rect x="900" y="210" width="6" height="8" />
          </g>
        </svg>

        {/* Lluvia corriendo por el vidrio */}
        <div className="splash-glass-rain absolute inset-0" />

        {/* Marco en cruz */}
        <div className="absolute inset-y-0 left-1/2 w-[10px] -translate-x-1/2 bg-[#140d08]" />
        <div className="absolute inset-x-0 top-[45%] h-[10px] bg-[#140d08]" />
      </div>

      {/* Sombra de persiana proyectada sobre la escena */}
      <div
        className={`splash-blinds absolute inset-0 transition-opacity duration-700 ${lampOn ? "opacity-100" : "opacity-40"}`}
      />
    </div>
  );
}
