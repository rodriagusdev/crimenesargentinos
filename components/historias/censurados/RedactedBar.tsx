"use client";

import { useState } from "react";
import { audioManager } from "@/lib/audioManager";
import styles from "./censurados.module.css";

type Props = { width: number; delayMs: number };

// Barra negra de censura. Debajo NO hay texto del caso: solo el aviso "¿?" o "VER EN EL JUEGO".
// Al pasar el mouse se despega apenas; en pantallas táctiles (o con teclado), con un toque.
export default function RedactedBar({ width, delayMs }: Props) {
  const [lifted, setLifted] = useState(false);
  const label = width < 40 ? "¿?" : "VER EN EL JUEGO";
  return (
    <button
      type="button"
      data-lifted={lifted}
      onClick={() => {
        audioManager.play("slide");
        setLifted((l) => !l);
      }}
      aria-label="Información censurada: se ve en el juego"
      className={`relative block h-4 cursor-help outline-none sm:h-5 ${styles.barWrap}`}
      style={{ width: `${width}%` }}
    >
      <span
        className="absolute inset-0 flex items-center overflow-hidden whitespace-nowrap px-1.5 font-mono text-[9px] font-bold tracking-widest text-[#b3191c] sm:text-[10px]"
        aria-hidden
      >
        {label}
      </span>
      <span className={`absolute inset-0 block ${styles.barIn}`} style={{ animationDelay: `${delayMs}ms` }} aria-hidden>
        <span className={`absolute inset-0 block rounded-[1px] bg-[#111] ${styles.bar}`} />
      </span>
    </button>
  );
}
