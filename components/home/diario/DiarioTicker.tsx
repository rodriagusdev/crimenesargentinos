"use client";

const NEWS = [
  "Robaron el bandoneón de oro en plena milonga",
  "La camiseta del 86 sigue sin aparecer",
  "Desapareció un camión de alfajores en Cuyo",
  "Hinchas estafados con entradas truchas para la selección",
  "La Central convoca agentes con urgencia",
];

// Cinta roja de ÚLTIMO MOMENTO que corre como marquesina (el contenido va duplicado para el loop sin cortes)
export default function DiarioTicker() {
  const items = [...NEWS, ...NEWS];
  return (
    <div className="flex items-stretch overflow-hidden bg-[#7a1212] text-[#f6efdc] border-y-2 border-[#1b1813]">
      <span className="shrink-0 z-10 px-3 py-2 bg-[#1b1813] text-[9px] sm:text-[10px] flex items-center">ÚLTIMO MOMENTO</span>
      <div className="relative flex-1 overflow-hidden">
        <div className="home-ticker flex w-max gap-10 py-2 pl-6 font-mono text-sm sm:text-base whitespace-nowrap" aria-hidden>
          {items.map((n, i) => (
            <span key={i}>▸ {n}</span>
          ))}
        </div>
        <p className="sr-only">{NEWS.join(". ")}</p>
      </div>
    </div>
  );
}
