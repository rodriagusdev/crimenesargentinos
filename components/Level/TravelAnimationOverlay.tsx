"use client";

import { useTravelPathAnimation } from "@/hooks/useTravelPathAnimation";
import { useT } from "@/hooks/useT";
import { travelAnimationOverlayMessages } from "./TravelAnimationOverlay.messages";
import TravelPathSvg from "./TravelPathSvg";
import TravelVehicleSprite from "./TravelVehicleSprite";

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
  const tr = useT(travelAnimationOverlayMessages);

  // Normalize inputs between new generic API and legacy province API
  let originName = fromName ?? fromProvince?.name ?? (mode === "plane" ? tr("takeoffBase") : tr("fieldBase"));
  const destName = toName ?? toProvince?.name ?? tr("destination");
  if (originName.trim().toLowerCase() === destName.trim().toLowerCase()) {
    originName = mode === "plane" ? tr("takeoffBase") : tr("startPoint");
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

  // Vehículo, estela y barra se animan por refs (sin re-render por frame); solo cambia la fase
  const { pathRef, vehicleRef, barRef, phase } = useTravelPathAnimation({ mode, startX, startY, ctrlX, ctrlY, endX, endY });

  // Estimated tactical mileage
  const estimatedKm = Math.round(dist * 24) + 120;
  const flightStatus =
    phase === "takeoff"
      ? tr("statusTakeoff")
      : phase === "transit"
      ? tr("statusTransit")
      : tr("statusApproach");

  const pathD = `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto bg-black/65 backdrop-blur-[3px] flex flex-col justify-between p-4 sm:p-6 select-none animate-fade-in font-sans">
      {/* Top Tactical Telemetry HUD */}
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 rounded-2xl bg-[rgba(16,24,34,0.95)] border border-[#E1C380]/40 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-[#FFF3C7] text-center">
        <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-center leading-snug font-mono font-bold tracking-normal sm:tracking-widest text-[#E1C380] uppercase">
          <span className="inline-block size-2 shrink-0 rounded-full bg-[#E1C380] animate-ping" />
          <span>
            {mode === "plane"
              ? tr("headerPlane")
              : tr("headerCar")}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 w-full font-mono text-xs sm:text-base text-center leading-snug font-bold text-[#FFF3C7] pt-0.5">
          <span className="text-[#FFF3C7]/75 uppercase break-words min-w-0">{originName}</span>
          <span className="text-[#E1C380] shrink-0">➔</span>
          <span className="text-[#E1C380] underline decoration-[#E1C380]/50 underline-offset-4 uppercase break-words min-w-0">
            {destName}
          </span>
        </div>

        {/* Tactical Sub-Telemetry */}
        <div className="flex items-center justify-between gap-2 w-full text-[10px] sm:text-[11px] leading-snug font-mono text-[#FFF3C7]/60 px-1 pt-1 border-t border-[#E1C380]/15">
          <span>{flightStatus}</span>
          <span className="text-[#E1C380] font-semibold shrink-0 text-right">
            {mode === "plane" ? tr("km", { n: estimatedKm }) : tr("localTransfer")}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/70 rounded-full h-1.5 overflow-hidden border border-[#E1C380]/20 mt-1">
          <div
            ref={barRef}
            className="h-full bg-gradient-to-r from-[#C29B38] via-[#E1C380] to-[#FFF3C7] transition-all duration-75 shadow-[0_0_12px_rgba(225,195,128,0.8)]"
          />
        </div>
      </div>

      {/* SVG Map Flight Path & Markers */}
      <TravelPathSvg pathRef={pathRef} pathD={pathD} startX={startX} startY={startY} endX={endX} endY={endY} />

      {/* Animated Vehicle Sprite (Vector silhouette with no emojis) */}
      <TravelVehicleSprite vehicleRef={vehicleRef} mode={mode} />

      {/* Bottom Dispatch Radar Footnote */}
      <div className="w-full text-center text-[10px] sm:text-[11px] leading-snug font-mono text-[#FFF3C7]/60 tracking-normal sm:tracking-wider">
        {mode === "plane"
          ? tr("footerPlane")
          : tr("footerCar")}
      </div>
    </div>
  );
}
