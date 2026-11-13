"use client";

import Image from "next/image";
import Link from "next/link";
import PortadaCard from "./PortadaCard";
import { CURRENT_PORTADA, PORTADAS } from "./portadas";

// Galería de portadas: un botón por cada propuesta de home para compararlas
export default function PortadasGallery() {
  return (
    <div className="min-h-screen bg-[#070c16] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(225,195,128,0.12),transparent_70%)] text-[#FFF3C7]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col gap-10">
        <header className="flex flex-col items-center gap-4 text-center">
          <Image src="/images/logofinal.png" alt="Crímenes Argentinos" width={600} height={400} priority className="w-56 h-auto" />
          <h1 className="text-lg sm:text-xl leading-relaxed">Portadas de la home</h1>
          <p className="max-w-2xl font-mono text-lg text-[#FFF3C7]/70">
            Cinco propuestas para la página de inicio. Abrí cada una para verla funcionando; desde adentro, el botón “← PORTADAS”
            (arriba a la derecha) vuelve acá.
          </p>
        </header>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {PORTADAS.map((p, i) => (
            <PortadaCard key={p.id} portada={p} index={i} current={p.id === CURRENT_PORTADA} />
          ))}
        </div>

        <p className="text-center font-mono text-sm text-[#FFF3C7]/50">
          La home real (<Link href="/" className="underline hover:text-[#E1C380]">/</Link>) muestra hoy la portada marcada como “EN LA HOME”
          y, con sesión iniciada, redirige al juego.
        </p>
      </main>
    </div>
  );
}
