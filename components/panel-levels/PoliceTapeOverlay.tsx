// Cinta policial cruzada sobre la imagen de un nivel bloqueado
const tape =
  "absolute -left-[10%] -right-[10%] h-7 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.7)] " +
  "bg-[repeating-linear-gradient(45deg,#eab308,#eab308_12px,#111827_12px,#111827_24px)]";

const label = "px-2.5 py-1 bg-black/85 font-['Press_Start_2P'] text-[7px] sm:text-[8px] tracking-widest text-yellow-400 whitespace-nowrap";

export default function PoliceTapeOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
      <div className={`${tape} top-[38%] -rotate-[9deg]`}>
        <span className={label}>NO PASAR · CASO RESTRINGIDO</span>
      </div>
      <div className={`${tape} top-[56%] rotate-[6deg] opacity-85`}>
        <span className={label}>🔒 RESOLVÉ EL NIVEL ANTERIOR</span>
      </div>
    </div>
  );
}
