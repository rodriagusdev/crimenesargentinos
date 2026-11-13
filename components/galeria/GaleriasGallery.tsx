import Image from "next/image";
import GaleriaCard from "./GaleriaCard";
import { GALERIAS } from "./galerias";

// Galería de propuestas para la pantalla de sospechosos por release: un botón por cada una para compararlas
export default function GaleriasGallery() {
  return (
    <div className="min-h-svh bg-[#070c16] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(225,195,128,0.12),transparent_70%)] text-[#FFF3C7]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col gap-10">
        <header className="flex flex-col items-center gap-4 text-center">
          <Image src="/images/logofinal.png" alt="Crímenes Argentinos" width={600} height={400} priority className="w-48 sm:w-56 h-auto" />
          <h1 className="text-base sm:text-xl leading-relaxed">Pantalla de sospechosos</h1>
          <p className="max-w-2xl font-mono text-base sm:text-lg text-[#FFF3C7]/70">
            Tres propuestas para mostrar a los sospechosos de cada release (solo foto y nombre). Adentro de cada una, el botón
            “SIMULAR RELEASE 2” agrega un release de muestra para ver cómo se destacan los nuevos.
          </p>
        </header>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {GALERIAS.map((g, i) => (
            <GaleriaCard key={g.id} galeria={g} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
