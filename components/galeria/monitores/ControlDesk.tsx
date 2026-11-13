import styles from "./monitores.module.css";

type Props = {
  /** Número de cámara en pantalla (0: ninguna) */
  cam: number;
  banks: number;
  onPrev: () => void;
  onNext: () => void;
  onOff: () => void;
};

// Pupitre de control frente a la pared: display de canal, perilla que gira, botones y luces de cada banco
export default function ControlDesk({ cam, banks, onPrev, onNext, onOff }: Props) {
  const button =
    "rounded-md border-b-4 border-[#0d0f12] bg-[#3a3f47] px-3 py-2 text-[10px] text-[#d9dde3] cursor-pointer active:translate-y-0.5 active:border-b-2 hover:bg-[#454b55] focus-visible:outline-2 focus-visible:outline-[#3dff7a]";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border-t-4 border-[#3a3f47] bg-[linear-gradient(180deg,#2a2d33,#1b1d21)] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
      <p className="text-[10px] tracking-[0.25em] text-[#9aa3b0]">PUPITRE DE CONTROL</p>

      {/* Display de canal y perilla */}
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-md border-2 border-[#0d0f12] bg-[#120606] px-3 py-2 shadow-[inset_0_0_12px_rgba(0,0,0,0.9)]">
          <p className="text-[8px] text-[#ff4d4d]/60">CANAL</p>
          <p className="font-mono text-3xl font-bold text-[#ff4d4d] [text-shadow:0_0_10px_rgba(255,77,77,0.8)] tabular-nums">
            {cam > 0 ? String(cam).padStart(2, "0") : "--"}
          </p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div
            className={`relative size-16 rounded-full bg-[radial-gradient(circle_at_35%_30%,#5b616b,#22252a_70%)] border-4 border-[#0d0f12] shadow-[0_4px_10px_rgba(0,0,0,0.7)] ${styles.knob}`}
            style={{ transform: `rotate(${cam * 15 - 120}deg)` }}
            aria-hidden
          >
            <span className="absolute left-1/2 top-1 h-4 w-1 -translate-x-1/2 rounded-full bg-[#ffd447]" />
          </div>
          <span className="text-[8px] text-[#9aa3b0]">SINTONÍA</span>
        </div>
      </div>

      {/* Botones */}
      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={onPrev} className={button} aria-label="Canal anterior">
          ◀ CH
        </button>
        <button type="button" onClick={onNext} className={button} aria-label="Canal siguiente">
          CH ▶
        </button>
        <button type="button" onClick={onOff} className={`${button} text-[#ff8a8a]`}>
          CORTAR
        </button>
      </div>

      {/* Luces de cada banco de monitores */}
      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-3">
        {Array.from({ length: banks }, (_, i) => (
          <span key={i} className="flex items-center gap-1.5 text-[8px] text-[#9aa3b0]">
            <span
              className={`size-2 rounded-full bg-[#3dff7a] shadow-[0_0_6px_#3dff7a] ${i === banks - 1 && banks > 1 ? "galeria-blink" : ""}`}
              aria-hidden
            />
            BANCO {i + 1}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-1.5 text-[8px] text-[#9aa3b0]">
          <span className="size-2 rounded-full bg-[#ffd447] shadow-[0_0_6px_#ffd447]" aria-hidden />
          GRABANDO
        </span>
      </div>
    </div>
  );
}
