"use client";

import type { RefObject } from "react";
import { useT } from "@/hooks/useT";
import { travelAnimationOverlayMessages } from "./TravelAnimationOverlay.messages";

interface TravelVehicleSpriteProps {
  vehicleRef: RefObject<HTMLDivElement | null>;
  mode: "plane" | "car";
}

// Silueta animada del vehículo (avión policial o patrullero); la posición la maneja useTravelPathAnimation por ref
export default function TravelVehicleSprite({ vehicleRef, mode }: TravelVehicleSpriteProps) {
  const tr = useT(travelAnimationOverlayMessages);

  return (
    <div ref={vehicleRef} className="absolute z-20 pointer-events-none transition-transform">
      {mode === "plane" ? (
        /* Sleek Tactical Police Transport Aircraft */
        <div className="relative flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(225,195,128,0.85)]">
          <svg
            viewBox="0 0 64 64"
            className="w-10 h-10 sm:w-12 sm:h-12"
            aria-label={tr("planeLabel")}
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
            aria-label={tr("carLabel")}
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
  );
}
