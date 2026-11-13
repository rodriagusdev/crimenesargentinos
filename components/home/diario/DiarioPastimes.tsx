"use client";

import Link from "next/link";
import { useState } from "react";
import { audioManager } from "@/lib/audioManager";

const ANSWER = "MISIONES";

// Pasatiempos y clasificados del pie del diario: crucigrama jugable, horóscopo y avisos
export default function DiarioPastimes() {
  const [guess, setGuess] = useState("");
  const solved = guess.trim().toUpperCase() === ANSWER;

  const onChange = (value: string) => {
    const next = value.toUpperCase().replace(/[^A-ZÑ]/g, "").slice(0, ANSWER.length);
    if (next.length > guess.length) audioManager.play("typewriter");
    if (next === ANSWER) audioManager.play("stamp");
    setGuess(next);
  };

  return (
    <section className="mt-8 border-t-[6px] border-double border-[#1b1813] pt-5">
      <p className="text-center text-[11px] tracking-[0.2em]">PASATIEMPOS · CLASIFICADOS</p>

      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-[9px] text-[#7a1212]">CRUCIGRAMA</p>
          <label htmlFor="crucigrama" className="font-mono text-base">
            <strong>1 horizontal:</strong> provincia de la yerba y las cataratas (8)
          </label>
          <div className="relative">
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: ANSWER.length }, (_, i) => (
                <span
                  key={i}
                  className={`relative size-8 flex items-center justify-center border-2 border-[#1b1813] text-sm ${solved ? "bg-[#d9f2dd]" : "bg-[#f6efdc]"}`}
                >
                  {i === 0 && <span className="absolute top-0 left-0.5 text-[6px]">1</span>}
                  {guess[i] ?? ""}
                </span>
              ))}
            </div>
            <input
              id="crucigrama"
              value={guess}
              onChange={(e) => onChange(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="absolute inset-0 w-full opacity-0 cursor-text"
            />
          </div>
          <p className={`font-mono text-sm ${solved ? "text-[#1d6b34]" : "text-[#1b1813]/70"}`} aria-live="polite">
            {solved ? "¡Correcto, agente! Tenés madera de detective." : "Tocá los casilleros y escribí la respuesta."}
          </p>
          {solved && (
            <Link href="/login?registro" className="self-start px-3 py-3 bg-[#7a1212] text-[#f6efdc] text-[9px]">
              SUMATE A LA CENTRAL →
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[9px] text-[#7a1212]">HORÓSCOPO DEL DETECTIVE</p>
          <p className="font-mono text-base leading-snug">
            <strong>Escorpio:</strong> una pista falsa te hará viajar de más. Revisá dos veces antes de subir al avión.
          </p>
          <p className="font-mono text-base leading-snug">
            <strong>Leo:</strong> hoy un testigo te va a decir la verdad a medias. Número de la suerte: 86.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[9px] text-[#7a1212]">AVISOS</p>
          <div className="p-3 border border-dashed border-[#1b1813] font-mono text-sm">
            <strong>VENDO MATE.</strong> Poco uso. Ideal guardias largas. Tratar en San Telmo.
          </div>
          <div className="p-3 border border-dashed border-[#1b1813] font-mono text-sm">
            <strong>SE ALQUILA LUPA.</strong> Aumento x10. Encontró tres coartadas falsas. Consultar en la Central.
          </div>
        </div>
      </div>
    </section>
  );
}
