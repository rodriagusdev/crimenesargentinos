// Fila de bombitas de marquesina: encendidas y titilando (estreno) o apagadas (temporadas anteriores)
export default function MarqueeBulbs({ on, count = 18 }: { on: boolean; count?: number }) {
  return (
    <div className="flex justify-between px-2" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`size-2.5 sm:size-3 rounded-full ${
            on ? "bg-[#fff1b8] shadow-[0_0_10px_3px_rgba(255,214,102,0.8)] galeria-blink" : "bg-[#5b5347]"
          }`}
          style={on ? { animationDelay: `${(i % 2) * 550}ms` } : undefined}
        />
      ))}
    </div>
  );
}
