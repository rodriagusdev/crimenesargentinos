"use client";

import Image from "next/image";

interface ProvinceMapFrameProps {
  backgroundUrl: string;
  provinceName: string;
  provinceId: string;
}

export function ProvinceMapFrame({
  backgroundUrl,
  provinceName,
  provinceId,
}: ProvinceMapFrameProps) {
  return (
    <div className="h-48 md:h-60 xl:h-auto xl:flex-[2] p-3 md:p-4 xl:p-6 backdrop-blur-xs flex items-center justify-center border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-2xl shrink-0 xl:shrink">
      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <Image
          src={backgroundUrl}
          alt={`Mapa provincia ${provinceName}`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 60vw"
          className="object-cover object-center"
        />
        {/* Viñeta sutil interior (idéntica a DialogBox) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080e18]/40 via-transparent to-transparent pointer-events-none" />
        {/* Gradiente inferior para profundidad y cinematografía */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#080e18]/90 via-[#080e18]/50 to-transparent pointer-events-none" />

        {/* Marca de agua cartográfica oficial en esquina inferior izquierda */}
        <div className="absolute bottom-4 left-5 flex flex-col pointer-events-none">
          <span className="text-[10px] font-mono tracking-widest text-[#E1C380]/80 uppercase font-semibold">
            CARTOGRAFÍA REGIONAL // {provinceName.toUpperCase()}
          </span>
          <span className="text-xs font-mono text-[#FFF3C7]/90 font-bold">
            SECTOR OPERATIVO #{provinceId.slice(0, 8).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
