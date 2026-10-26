"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioStore } from "@/stores/useAudioStore";

interface TravelAnimationOverlayProps {
  mode?: "plane" | "car";
  fromName?: string;
  toName?: string;
  fromCoord?: { top?: string; left?: string } | null;
  toCoord?: { top?: string; left?: string } | null;
  // Backward compatibility with previous props
  fromProvince?: {
    name: string;
    top?: string;
    left?: string;
  } | null;
  toProvince?: {
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
  mode = "plane",
  fromName,
  toName,
  fromCoord,
  toCoord,
  fromProvince,
  toProvince,
}: TravelAnimationOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [pathLength, setPathLength] = useState(1000);
  const pathRef = useRef<SVGPathElement>(null);
  const playSfx = useAudioStore((state) => state.playSfx);

  // Normalize inputs between new generic API and legacy province API
  let originName = fromName ?? fromProvince?.name ?? (mode === "plane" ? "Base de Despegue" : "Punto Operativo");
  const destName = toName ?? toProvince?.name ?? "Destino";
  if (originName.trim().toLowerCase() === destName.trim().toLowerCase()) {
    originName = mode === "plane" ? "Base de Despegue" : "Punto de Partida";
  }

  const startX = parsePercent(fromCoord?.left ?? fromProvince?.left, 42);
  const startY = parsePercent(fromCoord?.top ?? fromProvince?.top, 58);
  const endX = parsePercent(toCoord?.left ?? toProvince?.left, 62);
  const endY = parsePercent(toCoord?.top ?? toProvince?.top, 38);

  // Parabolic Curve Control Point
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const dx = endX - startX;
  const dy = endY - startY;
  const dist = Math.hypot(dx, dy) || 1;

  // Curvature factor: bend subtly across the flight path
  const curveFactor = mode === "plane" ? 0.22 : 0.12;
  const perpX = (-dy / dist) * (dist * curveFactor);
  const perpY = (dx / dist) * (dist * curveFactor);
  const ctrlX = midX + perpX;
  const ctrlY = midY + perpY;

  // Measure path length once mounted for smooth SVG stroke-dashoffset animation
  useEffect(() => {
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (len > 0) setPathLength(len);
      } catch {}
    }
  }, [startX, startY, endX, endY, ctrlX, ctrlY]);

  // Audio & Animation loop
  useEffect(() => {
    if (mode === "plane") {
      playSfx("plane");
    } else {
      playSfx("swoosh");
    }

    const startTime = performance.now();
    const duration = mode === "plane" ? 1750 : 1400;

    let animationFrame: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Smooth easeInOutCubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(eased);

      if (t < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [mode, playSfx]);

  // Quadratic Bezier interpolation at current progress t
  const t = progress;
  const currentX =
    (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ctrlX + t * t * endX;
  const currentY =
    (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * ctrlY + t * t * endY;

  // Tangent vector for natural vehicle heading rotation
  const vx = 2 * (1 - t) * (ctrlX - startX) + 2 * t * (endX - ctrlX);
  const vy = 2 * (1 - t) * (ctrlY - startY) + 2 * t * (endY - ctrlY);
  const angleDeg = (Math.atan2(vy, vx) * 180) / Math.PI + 90;

  // Estimated tactical mileage
  const estimatedKm = Math.round(dist * 24) + 120;
  const flightStatus =
    t < 0.25
      ? "DESPEGUE Y RUTA DE SALIDA"
      : t < 0.8
      ? "EN TRÁNSITO OPERATIVO"
      : "APROXIMACIÓN Y DESCENSO";

  const pathD = `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto bg-black/65 backdrop-blur-[3px] flex flex-col justify-between p-4 sm:p-6 select-none animate-fade-in font-sans">
      {/* Top Tactical Telemetry HUD */}
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-[rgba(16,24,34,0.95)] border border-[#E1C380]/40 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-[#FFF3C7] text-center">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#E1C380] uppercase">
          <span className="inline-block size-2 rounded-full bg-[#E1C380] animate-ping" />
          <span>
            {mode === "plane"
              ? "POLICÍA FEDERAL · DESPLAZAMIENTO AÉREO"
              : "POLICÍA FEDERAL · TRASLADO MÓVIL URBANO"}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 w-full font-mono text-sm sm:text-base font-bold text-[#FFF3C7] pt-0.5">
          <span className="text-[#FFF3C7]/75 uppercase">{originName}</span>
          <span className="text-[#E1C380]">➔</span>
          <span className="text-[#E1C380] underline decoration-[#E1C380]/50 underline-offset-4 uppercase">
            {destName}
          </span>
        </div>

        {/* Tactical Sub-Telemetry */}
        <div className="flex items-center justify-between w-full text-[10px] sm:text-[11px] font-mono text-[#FFF3C7]/60 px-1 pt-1 border-t border-[#E1C380]/15">
          <span>{flightStatus}</span>
          <span className="text-[#E1C380] font-semibold">
            {mode === "plane" ? `~${estimatedKm} KM` : "TRASLADO LOCAL"}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/70 rounded-full h-1.5 overflow-hidden border border-[#E1C380]/20 mt-1">
          <div
            className="h-full bg-gradient-to-r from-[#C29B38] via-[#E1C380] to-[#FFF3C7] transition-all duration-75 shadow-[0_0_12px_rgba(225,195,128,0.8)]"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>

      {/* SVG Map Flight Path & Markers */}
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
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - progress)}
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

      {/* Animated Vehicle Sprite (Vector silhouette with no emojis) */}
      <div
        className="absolute z-20 pointer-events-none transition-transform"
        style={{
          left: `${currentX}%`,
          top: `${currentY}%`,
          transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
        }}
      >
        {mode === "plane" ? (
          /* Sleek Tactical Police Transport Aircraft */
          <div className="relative flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(225,195,128,0.85)]">
            <svg
              viewBox="0 0 64 64"
              className="w-10 h-10 sm:w-12 sm:h-12"
              aria-label="Avión policial"
            >
              {/* Afterburner Thruster Flame */}
              <ellipse
                cx="32"
                cy="56"
                rx="3.5"
                ry="8"
                fill="#fbbf24"
                opacity="0.9"
                className="animate-pulse"
              />
              <ellipse
                cx="32"
                cy="53"
                rx="1.8"
                ry="4"
                fill="#ffffff"
                opacity="0.95"
              />

              {/* Aircraft Fuselage & Wings */}
              <path
                d="M32 4 L37 20 L58 36 L58 41 L37 34 L37 49 L46 56 L46 60 L32 55 L18 60 L18 56 L27 49 L27 34 L6 41 L6 36 L27 20 Z"
                fill="#E1C380"
                stroke="#FFF3C7"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Cockpit Canopy */}
              <ellipse
                cx="32"
                cy="18"
                rx="2"
                ry="5"
                fill="#0f172a"
                stroke="#FFF3C7"
                strokeWidth="0.8"
              />
              {/* Navigation wingtip lights */}
              <circle cx="58" cy="38" r="1.5" fill="#22c55e" />
              <circle cx="6" cy="38" r="1.5" fill="#ef4444" />
            </svg>
          </div>
        ) : (
          /* Sleek Detective Patrol Car with Flashing Beacons */
          <div className="relative flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(59,130,246,0.7)]">
            <svg
              viewBox="0 0 64 64"
              className="w-9 h-9 sm:w-11 sm:h-11"
              aria-label="Móvil policial"
            >
              {/* Tires */}
              <rect x="10" y="10" width="6" height="12" rx="2" fill="#0f172a" stroke="#E1C380" strokeWidth="0.5" />
              <rect x="48" y="10" width="6" height="12" rx="2" fill="#0f172a" stroke="#E1C380" strokeWidth="0.5" />
              <rect x="10" y="42" width="6" height="12" rx="2" fill="#0f172a" stroke="#E1C380" strokeWidth="0.5" />
              <rect x="48" y="42" width="6" height="12" rx="2" fill="#0f172a" stroke="#E1C380" strokeWidth="0.5" />

              {/* Main Chassis */}
              <rect x="14" y="6" width="36" height="52" rx="8" fill="#1e293b" stroke="#E1C380" strokeWidth="1.5" />

              {/* Windshields */}
              <path d="M19 20 L45 20 L43 28 L21 28 Z" fill="#0f172a" stroke="#E1C380" strokeWidth="0.8" />
              <path d="M21 38 L43 38 L45 44 L19 44 Z" fill="#0f172a" stroke="#E1C380" strokeWidth="0.8" />

              {/* Police Strobe Light Bar (Blue & Red) */}
              <rect x="23" y="31" width="9" height="4" rx="1" fill="#3b82f6" className="animate-pulse" />
              <rect x="32" y="31" width="9" height="4" rx="1" fill="#ef4444" className="animate-pulse" />

              {/* Headlights */}
              <ellipse cx="20" cy="5" rx="3" ry="1.5" fill="#fef08a" />
              <ellipse cx="44" cy="5" rx="3" ry="1.5" fill="#fef08a" />
            </svg>
          </div>
        )}
      </div>

      {/* Bottom Dispatch Radar Footnote */}
      <div className="w-full text-center text-[11px] font-mono text-[#FFF3C7]/60 tracking-wider">
        {mode === "plane"
          ? "Ruta federal trazada · Control de tráfico aéreo PFA"
          : "Despacho de móvil policial en curso · Frecuencia operativa PFA"}
      </div>
    </div>
  );
}
