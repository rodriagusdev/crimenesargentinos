"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAudioStore } from "@/stores/useAudioStore";

export type TravelPhase = "takeoff" | "transit" | "approach";

interface TravelGeometry {
  mode: "plane" | "car";
  startX: number;
  startY: number;
  ctrlX: number;
  ctrlY: number;
  endX: number;
  endY: number;
}

function phaseFor(t: number): TravelPhase {
  return t < 0.25 ? "takeoff" : t < 0.8 ? "transit" : "approach";
}

// Anima el viaje sobre la curva cuadrática sin estado por frame: el vehículo, la estela y la barra
// se escriben directo en el DOM desde requestAnimationFrame. Solo la fase (3 valores) vive en React.
export function useTravelPathAnimation(geometry: TravelGeometry) {
  const { mode, startX, startY, ctrlX, ctrlY, endX, endY } = geometry;
  const playSfx = useAudioStore((state) => state.playSfx);

  const pathRef = useRef<SVGPathElement>(null);
  const vehicleRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<TravelPhase>("takeoff");
  const progressRef = useRef(0);
  const lengthRef = useRef(1000);
  const geometryRef = useRef(geometry);
  // Pinta el estado del viaje en progreso t (0..1)
  const applyRef = useRef<(t: number) => void>(() => {});

  // Antes de pintar: guarda la geometría, mide la curva y aplica el frame actual
  useLayoutEffect(() => {
    geometryRef.current = { mode, startX, startY, ctrlX, ctrlY, endX, endY };

    applyRef.current = (t: number) => {
      const g = geometryRef.current;
      // Quadratic Bezier interpolation at current progress t
      const currentX = (1 - t) * (1 - t) * g.startX + 2 * (1 - t) * t * g.ctrlX + t * t * g.endX;
      const currentY = (1 - t) * (1 - t) * g.startY + 2 * (1 - t) * t * g.ctrlY + t * t * g.endY;
      // Tangent vector for natural vehicle heading rotation
      const vx = 2 * (1 - t) * (g.ctrlX - g.startX) + 2 * t * (g.endX - g.ctrlX);
      const vy = 2 * (1 - t) * (g.ctrlY - g.startY) + 2 * t * (g.endY - g.ctrlY);
      const angleDeg = (Math.atan2(vy, vx) * 180) / Math.PI + 90;

      const vehicle = vehicleRef.current;
      if (vehicle) {
        vehicle.style.left = `${currentX}%`;
        vehicle.style.top = `${currentY}%`;
        vehicle.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
      }
      const path = pathRef.current;
      if (path) {
        path.setAttribute("stroke-dasharray", String(lengthRef.current));
        path.setAttribute("stroke-dashoffset", String(lengthRef.current * (1 - t)));
      }
      const bar = barRef.current;
      if (bar) bar.style.width = `${Math.round(t * 100)}%`;
    };

    // Measure path length for smooth SVG stroke-dashoffset animation
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (len > 0) lengthRef.current = len;
      } catch {}
    }
    applyRef.current(progressRef.current);
  }, [mode, startX, startY, ctrlX, ctrlY, endX, endY]);

  // Audio & Animation loop
  useEffect(() => {
    playSfx(mode === "plane" ? "plane" : "swoosh");

    const startTime = performance.now();
    const duration = mode === "plane" ? 1750 : 1400;
    let animationFrame: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Smooth easeInOutCubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      progressRef.current = eased;
      applyRef.current(eased);
      const next = phaseFor(eased);
      setPhase((prev) => (prev === next ? prev : next));

      if (t < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [mode, playSfx]);

  return { pathRef, vehicleRef, barRef, phase };
}
