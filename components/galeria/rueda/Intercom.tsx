import styles from "./rueda.module.css";

type Props = { message: string; seq: number; speaking: boolean };

// Intercomunicador de la sala: parlante con rejilla, luz de "hablando" y la última orden dada
export default function Intercom({ message, seq, speaking }: Props) {
  return (
    <div className="flex items-center gap-3 border-x-4 border-[#1d2026] bg-[#1a1d22] bg-[linear-gradient(180deg,#22262c,#16191d)] px-3 py-2.5">
      {/* Rejilla del parlante */}
      <div
        className="shrink-0 size-11 rounded-full border-2 border-[#3a3f48] bg-[#0d0f12] bg-[radial-gradient(circle,#3a3f48_1.2px,transparent_1.6px)] bg-[length:6px_6px]"
        aria-hidden
      />
      <div key={seq} className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-[9px] tracking-widest text-[#9aa3b0]">
          <span
            className={`size-2 rounded-full ${speaking ? `bg-[#ff5a4d] shadow-[0_0_8px_#ff5a4d] ${styles.speaking}` : "bg-[#3d7a4f]"}`}
            aria-hidden
          />
          INTERCOMUNICADOR
          {speaking && (
            <span className="ml-1 flex items-end gap-[2px] h-2.5" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`w-[3px] h-full bg-[#ff9a8f] ${styles.bar}`} style={{ animationDelay: `${i * 70}ms` }} />
              ))}
            </span>
          )}
        </p>
        <p className={`mt-1 font-mono text-sm sm:text-base text-[#FFF3C7] ${styles.message}`} aria-live="polite">
          «{message}»
        </p>
      </div>
    </div>
  );
}
