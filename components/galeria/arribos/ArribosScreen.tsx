"use client";

import { useEffect, useState } from "react";
import ArrivalRow, { ROW_COLUMNS } from "./ArrivalRow";
import ArrivalsHero from "./ArrivalsHero";
import ArrivalsTicker from "./ArrivalsTicker";
import ReleasePreviewToggle from "../ReleasePreviewToggle";
import { audioManager } from "@/lib/audioManager";
import { useGalleryReleases } from "@/hooks/useGalleryReleases";

// Cada cuánto el tablero "actualiza" una fila al azar (vuelve a girar sus letras)
const REFRESH_MS = 4500;

// Propuesta "Tablero de arribos": ventanal con el avión, tablero de paletas y anuncios; el release nuevo "ATERRIZÓ"
export default function ArribosScreen() {
  const { preview, togglePreview, releases, isNew, firstNumber } = useGalleryReleases();
  // Vueltas de cada fila: al cambiar, la fila se vuelve a montar y sus letras giran de nuevo
  const [flips, setFlips] = useState<Record<string, number>>({});
  const newRelease = releases.find(isNew);
  const flight = newRelease ? `AR${2000 + newRelease.id}` : "";

  // La lista se arma en cada render: el efecto depende del texto para no reiniciar el intervalo con cada vuelta
  const namesKey = releases.flatMap((r) => r.suspects.map((s) => s.name)).join("|");

  useEffect(() => {
    const names = namesKey.split("|");
    const id = setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)];
      setFlips((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + 1 }));
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [namesKey]);

  return (
    <div className="min-h-svh bg-[#0a0c10] bg-[radial-gradient(ellipse_at_top,rgba(255,159,67,0.12),transparent_55%)] px-3 sm:px-6 py-8 sm:py-12 text-[#f5f5f0]">
      <div className="max-w-5xl mx-auto">
        <ArrivalsHero />

        {/* Aviso por altavoz cuando aterriza un release nuevo */}
        {newRelease && (
          <div className="galeria-in flex items-center gap-3 border-x-4 border-[#2a2f38] bg-[#ffd447] px-3 py-2.5 text-[#14171c]">
            <span className="text-xl" aria-hidden>
              📢
            </span>
            <p className="text-[10px] sm:text-xs leading-relaxed">
              ATENCIÓN: ATERRIZÓ EL VUELO {flight} CON {newRelease.suspects.length} PASAJEROS NUEVOS
            </p>
          </div>
        )}

        <div className="border-x-4 border-[#2a2f38] bg-[#14171c] shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
          {/* Encabezado de columnas */}
          <div className={`grid ${ROW_COLUMNS} gap-2 sm:gap-3 px-2 sm:px-3 py-2 bg-[#ffd447] text-[#14171c] text-[10px]`}>
            <span className="hidden sm:block">HORA</span>
            <span className="hidden sm:block">VUELO</span>
            <span className="hidden lg:block">DESDE</span>
            <span />
            <span>PASAJERO</span>
            <span className="hidden lg:block">PTA.</span>
            <span className="justify-self-end">ESTADO</span>
          </div>

          {releases.map((r) => {
            const fresh = isNew(r);
            const start = firstNumber(r);
            return (
              <section key={r.id}>
                <h2
                  className={`px-3 py-1.5 text-[10px] tracking-widest ${fresh ? "bg-[#1f7a3a] text-white" : "bg-[#262b33] text-[#9aa3b0]"}`}
                >
                  {fresh ? `▶ VUELO ${flight} · ${r.name.toUpperCase()} · LLEGADAS DE HOY` : `${r.name.toUpperCase()} · ${r.suspects.length} PASAJEROS`}
                </h2>
                <ol>
                  {r.suspects.map((s, i) => (
                    <ArrivalRow
                      key={`${s.name}-${flips[s.name] ?? 0}`}
                      suspect={s}
                      number={start + i}
                      isNew={fresh}
                      row={flips[s.name] ? 0 : i}
                      animate
                    />
                  ))}
                </ol>
              </section>
            );
          })}
        </div>

        <ArrivalsTicker highlight={newRelease ? `ÚLTIMO MOMENTO: ATERRIZÓ EL VUELO ${flight}` : undefined} />
      </div>

      <ReleasePreviewToggle
        preview={preview}
        onToggle={() => {
          audioManager.play(preview ? "click" : "hint");
          togglePreview();
        }}
      />
    </div>
  );
}
