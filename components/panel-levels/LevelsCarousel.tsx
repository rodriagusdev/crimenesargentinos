"use client";

import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ICardLevelPreview } from "@/models/ICardLevelPreview";
import { audioManager } from "@/lib/audioManager";
import CarouselDot, { CarouselDotState } from "../buttons/CarouselDot";
import LevelCard from "./LevelCard";

interface Props {
  levels: ICardLevelPreview[];
}

// Posición del carrusel: tarjeta más a la izquierda, tarjetas enteras en la vista y si se puede desplazar hacia cada lado
interface CarouselPosition {
  active: number;
  visible: number[];
  atStart: boolean;
  atEnd: boolean;
}

// Modo carrusel: solo entre 600px y 1920px de pantalla (el prefijo se repite literal porque Tailwind no arma clases dinámicas)
// En celular las flechas van adentro y más chicas (no se salen de la pantalla); desde sm, afuera del track
const arrowClass =
  "absolute top-1/2 -translate-y-1/2 z-20 flex size-9 sm:size-11 items-center justify-center rounded-full " +
  "border border-amber-300/80 bg-[#0d1724]/95 text-amber-200 text-base sm:text-lg font-bold cursor-pointer " +
  "shadow-[0_10px_28px_rgba(0,0,0,0.75)] transition-all duration-200 " +
  "hover:bg-amber-300 hover:text-[#0d1724] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] active:scale-95 " +
  "disabled:opacity-0 disabled:pointer-events-none";

const fadeClass = "hidden min-[600px]:max-[1921px]:block pointer-events-none absolute top-0 bottom-0 w-12 z-10 transition-opacity duration-300";

function dotState(level: ICardLevelPreview): CarouselDotState {
  if (level.completed) return "completed";
  return level.canPlay ? "current" : "locked";
}

// Niveles de /principal: entre 600px y 1920px de pantalla es un carrusel horizontal (scroll snap, flechas, paginador y teclado);
// en celulares (< 600px) y pantallas muy anchas (> 1920px) se mantiene la grilla.
// Cuántas tarjetas entran por vista depende del ancho de la columna (container queries), no de la pantalla.
// Excepción a la regla de overflow-x: un carrusel horizontal lo necesita; la barra está oculta y p-3.5 deja lugar al hover.
export default function LevelsCarousel({ levels }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isCarousel = true;

  const initialIndex = useMemo(() => {
    const idx = levels.findIndex((l) => l.canPlay && !l.completed);
    return idx >= 0 ? idx : 0;
  }, [levels]);

  const [position, setPosition] = useState<CarouselPosition>(() => ({
    active: initialIndex,
    visible: [initialIndex],
    atStart: initialIndex === 0,
    atEnd: false,
  }));
  const { active, visible, atStart, atEnd } = position;

  // Lee la geometría del track: qué tarjeta está más a la izquierda y cuáles se ven enteras
  const updatePosition = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const viewStart = track.scrollLeft;
    const viewEnd = viewStart + track.clientWidth - 2 * padding;
    const items = Array.from(track.children) as HTMLElement[];
    const starts = items.map((item) => item.offsetLeft - track.offsetLeft - padding);

    let nearest = 0;
    starts.forEach((start, i) => {
      if (Math.abs(start - viewStart) < Math.abs(starts[nearest] - viewStart)) nearest = i;
    });
    const fullyVisible = starts
      .map((start, i) => ({ i, start, end: start + items[i].offsetWidth }))
      .filter(({ start, end }) => start >= viewStart - 4 && end <= viewEnd + 4)
      .map(({ i }) => i);

    setPosition({
      active: nearest,
      visible: fullyVisible.length > 0 ? fullyVisible : [nearest],
      atStart: viewStart <= 4,
      atEnd: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
    });
  }, []);

  const goTo = useCallback((index: number, smooth = true) => {
    const track = trackRef.current;
    const item = (Array.from(track?.children ?? []) as HTMLElement[])[index];
    if (!track || !item) return;
    const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    track.scrollTo({ left: item.offsetLeft - track.offsetLeft - padding, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Desplaza una "página": lo que entra en la vista
  const page = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    audioManager.play("slide");
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  };

  const jump = (index: number) => {
    audioManager.play("mechanickey");
    setPosition((prev) => ({ ...prev, active: index }));
    goTo(index);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    audioManager.play("slide");
    const next = e.key === "ArrowRight" ? Math.min(active + 1, levels.length - 1) : Math.max(active - 1, 0);
    setPosition((prev) => ({ ...prev, active: next }));
    goTo(next);
  };

  // Al cargar, el carrusel arranca en el nivel habilitado (el primero que se puede jugar y no está resuelto)
  useEffect(() => {
    const current = levels.findIndex((l) => l.canPlay && !l.completed);
    if (current > 0) goTo(current, false);
    updatePosition();
  }, [levels, goTo, updatePosition]);

  // Recalcula si cambia el ancho (rotar, redimensionar, pasar de grilla a carrusel)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => updatePosition());
    observer.observe(track);
    return () => observer.disconnect();
  }, [updatePosition]);

  return (
    <div className="@container relative">
      <div className="relative">
        <div className={`${fadeClass} left-0 bg-gradient-to-r from-[#080e18] to-transparent ${atStart ? "opacity-0" : "opacity-100"}`} />
        <div className={`${fadeClass} right-0 bg-gradient-to-l from-[#080e18] to-transparent ${atEnd ? "opacity-0" : "opacity-100"}`} />

        <button type="button" className={`${arrowClass} left-1 sm:-left-5`} onClick={() => page(-1)} disabled={atStart} aria-label="Niveles anteriores">
          ‹
        </button>
        <button type="button" className={`${arrowClass} right-1 sm:-right-5`} onClick={() => page(1)} disabled={atEnd} aria-label="Niveles siguientes">
          ›
        </button>

        <div
          ref={trackRef}
          onScroll={updatePosition}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Niveles de investigación"
          className="flex gap-4 sm:gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth p-3.5 scroll-px-3.5 outline-none rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:ring-2 focus-visible:ring-amber-400/50"
        >
          {levels.map((level, i) => (
            <div
              key={level.id}
              className={
                "min-w-0 shrink-0 snap-start basis-[min(300px,82cqw)] max-w-[300px] transition-all duration-300" +
                (visible.includes(i) ? "" : " brightness-75 scale-[0.98]")
              }
            >
              <LevelCard preview={level} />
            </div>
          ))}
        </div>
      </div>

      <nav aria-label="Niveles" className="flex justify-center mt-4">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 max-w-full rounded-2xl bg-[#0c1421] border-2 border-[#1c2c3e] shadow-[0_12px_32px_rgba(0,0,0,0.85)]">
          {levels.map((level, i) => (
            <CarouselDot key={level.id} number={level.id} state={dotState(level)} active={active === i} onClick={() => jump(i)} />
          ))}
        </div>
      </nav>
    </div>
  );
}
