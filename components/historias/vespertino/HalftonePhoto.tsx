import Image from "next/image";

// Foto de diario: la escena en blanco y negro, con trama de puntos y un poco de tinta corrida
export default function HalftonePhoto({ src, alt, sizes, className = "" }: { src: string; alt: string; sizes: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden border border-[#1b1813] bg-[#3a3a36] ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover grayscale contrast-150 brightness-105" />
      <span
        className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-60 bg-[radial-gradient(#1b1813_0.9px,transparent_1.3px)] bg-[size:4px_4px]"
        aria-hidden
      />
      <span className="pointer-events-none absolute inset-0 bg-[#e9dcbc] mix-blend-multiply opacity-70" aria-hidden />
    </div>
  );
}
