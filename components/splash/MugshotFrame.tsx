"use client";

import Image from "next/image";

// Cuadro de un retrato en la ruleta de comparación de huellas
export default function MugshotFrame({ src }: { src: string }) {
  return (
    <div className="relative aspect-square w-full">
      <Image src={src} alt="" fill sizes="240px" className="object-cover grayscale-[0.4] contrast-125" />
    </div>
  );
}
