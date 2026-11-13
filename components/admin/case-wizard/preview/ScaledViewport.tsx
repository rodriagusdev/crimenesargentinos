"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Muestra una pantalla del juego (que ocupa w-screen / h-screen) achicada al ancho del panel.
// Se dibuja al tamaño real de la ventana y se escala; adentro no se puede hacer clic ni enfocar nada
export default function ScaledViewport({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ width: 1440, height: 900, scale: 0.4 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setView({ width, height, scale: el.clientWidth / width });
    };
    // El observer avisa apenas empieza a observar, y en cada cambio de tamaño del panel
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-black" style={{ height: view.height * view.scale }}>
      <div
        inert
        className="pointer-events-none absolute left-0 top-0 origin-top-left select-none"
        style={{ width: view.width, height: view.height, transform: `scale(${view.scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
