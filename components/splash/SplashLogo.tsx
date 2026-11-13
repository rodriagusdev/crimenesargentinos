"use client";

import Image from "next/image";

type SplashLogoProps = {
  visible: boolean;
  className?: string;
  rays?: boolean;
};

// Logo del juego: sube desde abajo, destello dorado al aparecer y rayos del Sol de Mayo girando detrás
export default function SplashLogo({ visible, className = "", rays = true }: SplashLogoProps) {
  return (
    <div className={`relative aspect-[3/2] ${className}`}>
      {visible && rays && <div className="splash-sunrays absolute left-1/2 top-1/2 size-[160%]" aria-hidden />}
      {visible && <div className="splash-bloom absolute -inset-[20%]" aria-hidden />}

      <div className={`splash-logo absolute inset-0 ${visible ? "splash-logo--visible" : ""}`}>
        <Image
          src="/images/logofinal.png"
          alt="Crímenes Argentinos"
          fill
          priority
          sizes="(max-width: 720px) 80vw, 560px"
          className="object-contain drop-shadow-[0_6px_0_rgba(30,42,54,0.55)]"
        />
        <span className="splash-shine absolute inset-0" aria-hidden />
      </div>
    </div>
  );
}
