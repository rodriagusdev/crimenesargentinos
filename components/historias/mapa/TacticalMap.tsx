"use client";

import Image from "next/image";
import CasePin from "./CasePin";
import styles from "./mapa.module.css";
import { PROVINCE_PINS, ROOM_IMAGE_BOX, VIEW_ASPECT } from "./mapGeometry";

type Props = {
  activeProvince: string | null;
  onSelect: (province: string) => void;
};

// Monitor táctico de la sala de detectives recortado sobre la Argentina, con radar, líneas y un chinche por caso
export default function TacticalMap({ activeProvince, onSelect }: Props) {
  return (
    <div className="relative mx-auto w-full max-w-[min(100%,58svh)] lg:max-w-[min(100%,72svh)]">
      {/* Marco del monitor */}
      <div className="rounded-xl border-4 border-[#1c2a3d] bg-[#0b1220] p-1.5 shadow-[0_0_40px_rgba(56,232,255,0.18),0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="relative overflow-hidden rounded-md" style={{ aspectRatio: VIEW_ASPECT }}>
          <div className="absolute" style={ROOM_IMAGE_BOX}>
            <Image
              src="/images/test_composite.webp"
              alt="Mapa de la Argentina en el monitor de la sala de detectives"
              fill
              priority
              sizes="(min-width: 1024px) 160vh, 340vw"
              className="object-cover brightness-90 saturate-[1.1]"
            />
          </div>

          {/* Oscurece las siluetas de la sala para que resalte el mapa */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(3,6,12,0.75)_100%)]" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#03060c]/80 to-transparent" aria-hidden />
          <div className={styles.radar} aria-hidden />
          <div className={styles.scanlines} aria-hidden />

          {PROVINCE_PINS.map((pin, i) => (
            <CasePin
              key={pin.province}
              pin={pin}
              active={pin.province === activeProvince}
              delayMs={i * 180}
              onSelect={() => onSelect(pin.province)}
            />
          ))}

          {/* Rótulos del monitor */}
          <p className="pointer-events-none absolute top-2 left-2 text-[7px] sm:text-[9px] tracking-[0.25em] text-cyan-300/80">
            SAT-AR · VIGILANCIA
          </p>
          <p className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 text-[7px] sm:text-[9px] tracking-[0.25em] text-red-400">
            <span className={`${styles.blink} block size-1.5 rounded-full bg-red-500`} aria-hidden />
            EN VIVO
          </p>
        </div>
      </div>
    </div>
  );
}
