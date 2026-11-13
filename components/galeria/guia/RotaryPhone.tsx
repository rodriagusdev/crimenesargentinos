"use client";

import { useState } from "react";
import { audioManager } from "@/lib/audioManager";
import styles from "./guia.module.css";

const HOLES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// Teléfono de disco hecho en CSS: suena solo cada tanto (sin sonido) y, al tocarlo, se "marca" un número
export default function RotaryPhone() {
  // Cada marcada vuelve a montar el disco para repetir el giro
  const [dials, setDials] = useState(0);

  return (
    <button
      type="button"
      onClick={() => {
        audioManager.play("mechanickey");
        setDials((d) => d + 1);
      }}
      aria-label="Marcar en el teléfono"
      className="relative shrink-0 w-32 sm:w-40 h-28 sm:h-32 cursor-pointer"
    >
      <span className={`absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap font-serif italic font-black text-sm text-[#ffd447] [text-shadow:0_2px_0_#000] ${styles.ringText}`} aria-hidden>
        ¡riiing!
      </span>
      <span className={`absolute inset-0 ${styles.ring}`} aria-hidden>
        {/* Tubo */}
        <span className="absolute top-4 left-1/2 -translate-x-1/2 h-5 w-[88%] rounded-full bg-gradient-to-b from-[#2c2c2c] to-[#0e0e0e] shadow-[0_3px_0_rgba(0,0,0,0.5)]">
          <span className="absolute -bottom-1.5 left-0 h-4 w-7 rounded-b-xl bg-[#121212]" />
          <span className="absolute -bottom-1.5 right-0 h-4 w-7 rounded-b-xl bg-[#121212]" />
        </span>
        {/* Cuerpo */}
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[68%] w-[82%] rounded-t-[45%] rounded-b-lg bg-gradient-to-b from-[#2a2a2a] to-[#0b0b0b] shadow-[0_10px_18px_rgba(0,0,0,0.7),inset_0_2px_0_rgba(255,255,255,0.12)]" />
        {/* Disco */}
        <span
          key={dials}
          className={`absolute bottom-2 left-1/2 -ml-8 sm:-ml-9 size-16 sm:size-18 rounded-full bg-[#d8d2c2] border-2 border-[#8a8478] ${dials ? styles.dial : ""}`}
        >
          {HOLES.map((h) => (
            <span key={h} className="absolute inset-0" style={{ rotate: `${-60 + h * 28}deg` }}>
              <span className="absolute left-1/2 top-0.5 -translate-x-1/2 size-2.5 sm:size-3 rounded-full bg-[#1a1a1a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
            </span>
          ))}
          <span className="absolute inset-[30%] rounded-full bg-[#f7f2e2] border border-[#8a8478]" />
        </span>
      </span>
    </button>
  );
}
