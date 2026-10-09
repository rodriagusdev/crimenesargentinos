"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAudioStore } from "@/stores/useAudioStore";

interface TravelAnimationOverlayProps {
  fromProvince?: {
    name: string;
    top?: string;
    left?: string;
  } | null;
  toProvince: {
    name: string;
    top?: string;
    left?: string;
    icon?: string;
  };
}

// Convert "44%" -> 44
function parsePercent(val?: string, fallback: number = 50): number {
  if (!val) return fallback;
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
}

export default function TravelAnimationOverlay({
  fromProvince,
  toProvince,
}: TravelAnimationOverlayProps) {
  const [progress, setProgress] = useState(0);
  const playSfx = useAudioStore((state) => state.playSfx);

  const startX = parsePercent(fromProvince?.left, 50);
  const startY = parsePercent(fromProvince?.top, 50);
  const endX = parsePercent(toProvince.left, 50);
  const endY = parsePercent(toProvince.top, 50);

  // Angle for plane rotation
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const angleDeg = (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90; // +90 because default plane emoji faces up/right

  useEffect(() => {
    playSfx("plane");

    const startTime = performance.now();
    const duration = 1800; // 1.8s

    let animationFrame: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // easeInOutCubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(eased);

      if (t < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [playSfx]);

  const currentX = startX + (endX - startX) * progress;
  const currentY = startY + (endY - startY) * progress;

  return (
    <div className="fixed inset-0 z-[999999] pointer-events-auto bg-black/60 backdrop-blur-xs flex flex-col justify-between p-6 select-none animate-fade-in">
      {/* Top flight status telemetry */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-2 p-4 rounded-2xl bg-[rgba(16,24,36,0.92)] border border-[#E1C380]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-[#FFF3C7] text-center">
        <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold uppercase tracking-widest animate-pulse">
          <span className="text-base">✈️</span>
          <span>DESPLAZAMIENTO EN CURSO</span>
        </div>

        <div className="flex items-center justify-center gap-3 w-full font-mono text-sm sm:text-base font-bold text-[#FFF3C7] pt-1">
          <span className="text-[#FFF3C7]/80">{fromProvince?.name ?? "Base"}</span>
          <span className="text-amber-400">➔</span>
          <span className="text-amber-300 underline decoration-amber-400/50 underline-offset-4">
            {toProvince.name}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden mt-2 border border-[rgba(255,243,199,0.15)]">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-75 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>

      {/* SVG Map Flight Path & Markers */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="flightPathGrad" x1={`${startX}%`} y1={`${startY}%`} x2={`${endX}%`} y2={`${endY}%`}>
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Planned Flight Line (Dashed) */}
        <line
          x1={`${startX}%`}
          y1={`${startY}%`}
          x2={`${endX}%`}
          y2={`${endY}%`}
          stroke="rgba(255, 243, 199, 0.25)"
          strokeWidth="3"
          strokeDasharray="6 6"
        />

        {/* Active Flight Progress Line */}
        <line
          x1={`${startX}%`}
          y1={`${startY}%`}
          x2={`${currentX}%`}
          y2={`${currentY}%`}
          stroke="url(#flightPathGrad)"
          strokeWidth="4"
          filter="url(#glow)"
        />

        {/* Origin Marker */}
        <circle
          cx={`${startX}%`}
          cy={`${startY}%`}
          r="8"
          fill="rgba(245, 158, 11, 0.6)"
          stroke="#FFF3C7"
          strokeWidth="2"
        />

        {/* Destination Radar Pulse Marker */}
        <circle
          cx={`${endX}%`}
          cy={`${endY}%`}
          r="14"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          className="animate-ping origin-center"
        />
        <circle
          cx={`${endX}%`}
          cy={`${endY}%`}
          r="8"
          fill="#f59e0b"
          stroke="#FFF3C7"
          strokeWidth="2"
        />
      </svg>

      {/* Animated Airplane Sprite */}
      <div
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform"
        style={{
          left: `${currentX}%`,
          top: `${currentY}%`,
          transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
        }}
      >
        <div className="relative flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(245,158,11,0.9)] scale-125 sm:scale-150">
          <span className="text-3xl sm:text-4xl select-none">✈️</span>
        </div>
      </div>

      {/* Bottom travel indicator */}
      <div className="w-full text-center text-xs font-mono text-[#FFF3C7]/60 tracking-wider">
        Viajando en vuelo oficial de investigación...
      </div>
    </div>
  );
}
