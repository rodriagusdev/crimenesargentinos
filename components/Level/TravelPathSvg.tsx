"use client";

import type { RefObject } from "react";

interface TravelPathSvgProps {
  pathRef: RefObject<SVGPathElement | null>;
  pathD: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

// Trazado del viaje sobre el mapa (ruta planeada, tramo recorrido y marcadores de origen/destino)
export default function TravelPathSvg({ pathRef, pathD, startX, startY, endX, endY }: TravelPathSvgProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    >
      <defs>
        <linearGradient id="travelPathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C29B38" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFF3C7" stopOpacity="0.95" />
        </linearGradient>
        <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      {/* Planned Path (Subtle Dashed) */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255, 243, 199, 0.2)"
        strokeWidth="0.6"
        strokeDasharray="2 2"
      />

      {/* Active Animated Path Traversed */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#travelPathGrad)"
        strokeWidth="0.8"
        filter="url(#glowEffect)"
      />

      {/* Origin Marker */}
      <circle
        cx={startX}
        cy={startY}
        r="1.4"
        fill="#1e2a36"
        stroke="#E1C380"
        strokeWidth="0.5"
      />
      <circle
        cx={startX}
        cy={startY}
        r="0.6"
        fill="#E1C380"
      />

      {/* Destination Target Pulse Marker */}
      <circle
        cx={endX}
        cy={endY}
        r="2.8"
        fill="none"
        stroke="#E1C380"
        strokeWidth="0.4"
        className="animate-ping origin-center"
        style={{ transformOrigin: `${endX}% ${endY}%` }}
      />
      <circle
        cx={endX}
        cy={endY}
        r="1.4"
        fill="#1e2a36"
        stroke="#FFF3C7"
        strokeWidth="0.5"
      />
      <circle
        cx={endX}
        cy={endY}
        r="0.6"
        fill="#FFF3C7"
      />
    </svg>
  );
}
