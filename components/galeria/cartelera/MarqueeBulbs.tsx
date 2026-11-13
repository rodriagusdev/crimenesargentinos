import styles from "./cartelera.module.css";

// Fila de bombitas de marquesina: encendidas y corriendo (temporada en cartel) o apagadas (temporadas anteriores)
export default function MarqueeBulbs({ on, count = 18, vertical = false }: { on: boolean; count?: number; vertical?: boolean }) {
  return (
    <div className={`flex justify-between ${vertical ? "flex-col py-2" : "px-2"}`} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`size-2.5 sm:size-3 rounded-full ${
            on ? `bg-[#fff1b8] shadow-[0_0_10px_3px_rgba(255,214,102,0.8)] ${styles.chase}` : "bg-[#5b5347] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
          }`}
          style={on ? { animationDelay: `${(i % 3) * 300}ms` } : undefined}
        />
      ))}
    </div>
  );
}
