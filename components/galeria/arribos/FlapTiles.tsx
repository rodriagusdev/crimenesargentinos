// Texto en casilleros de tablero electromecánico: cada letra en su paleta oscura con la línea de corte al medio.
// Con `animate`, las letras giran en cascada (cambiar `key` desde afuera vuelve a hacerlas girar).
type Props = { text: string; animate?: boolean; delayMs?: number; size?: "sm" | "md"; color?: string };

export default function FlapTiles({ text, animate = false, delayMs = 0, size = "md", color = "#ffd447" }: Props) {
  const tile = size === "sm" ? "w-[1.05em] h-[1.5em] text-[10px]" : "w-[1.1em] h-[1.55em] text-[11px] sm:text-sm";
  return (
    <span className="inline-flex flex-wrap gap-[2px]" aria-label={text}>
      {Array.from(text.toUpperCase()).map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className={`relative inline-flex items-center justify-center rounded-[2px] bg-[#1c1f24] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_0_rgba(0,0,0,0.8)] ${tile}`}
          style={{ color }}
        >
          <span className={animate ? "galeria-flap" : undefined} style={animate ? { animationDelay: `${delayMs + i * 40}ms` } : undefined}>
            {ch === " " ? " " : ch}
          </span>
          {/* Línea de corte de la paleta */}
          <span className="absolute inset-x-0 top-1/2 h-px bg-black/70" />
        </span>
      ))}
    </span>
  );
}
