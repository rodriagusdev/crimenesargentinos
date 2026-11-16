"use client";

import Image from "next/image";
import { useT } from "@/hooks/useT";
import { dialogBoxMessages } from "./DialogBox.messages";

// Caja con la imagen de la escena del interrogatorio (arriba en tablet, a la izquierda en escritorio)
export default function DialogSceneBackdrop({ src }: { src: string }) {
  const t = useT(dialogBoxMessages);
  return (
    <div className="h-28 sm:h-44 md:h-52 xl:h-auto [@media(orientation:landscape)_and_(max-height:500px)]:hidden xl:flex-[2] p-3 md:p-4 xl:p-6 backdrop-blur-xs flex items-center justify-center border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-2xl shrink-0 xl:shrink">
      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[rgba(255,243,199,0.18)] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <Image
          src={src}
          alt={t("scene")}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 60vw"
          className="object-cover object-center"
        />
        {/* subtle inner vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080e18]/40 via-transparent to-transparent" />
        {/* bottom fade for text legibility */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#080e18]/90 via-[#080e18]/50 to-transparent" />
      </div>
    </div>
  );
}
