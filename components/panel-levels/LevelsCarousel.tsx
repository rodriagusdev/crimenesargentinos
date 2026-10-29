"use client";

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
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
const arrowClass =
  "hidden min-[600px]:max-[1921px]:flex absolute top-1/2 -translate-y-1/2 z-20 size-12 items-center justify-center rounded-lg " +
  "border-2 border-amber-400/70 bg-[#0c1421]/95 text-amber-300 font-['Press_Start_2P'] text-xs cursor-pointer " +
  "shadow-[0_10px_28px_rgba(0,0,0,0.75)] transition-all duration-200 " +
  "hover:bg-amber-400 hover:text-[#0c1421] hover:shadow-[0_0_22px_rgba(245,158,11,0.55)] active:scale-95 " +
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
  const [position, setPosition] = useState<CarouselPosition>({ active: 0, visible: [0], atStart: true, atEnd: false });
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
    audioManager.play("click");
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  };

  const jump = (index: number) => {
    audioManager.play("click");
    goTo(index);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    jump(e.key === "ArrowRight" ? Math.min(active + 1, levels.length - 1) : Math.max(active - 1, 0));
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
        {/* Bordes difuminados: avisan que hay más niveles hacia ese lado */}
        <div className={`${fadeClass} left-0 bg-gradient-to-r from-[#080e18] to-transparent ${atStart ? "opacity-0" : "opacity-100"}`} />
        <div className={`${fadeClass} right-0 bg-gradient-to-l from-[#080e18] to-transparent ${atEnd ? "opacity-0" : "opacity-100"}`} />

        <button type="button" className={`${arrowClass} -left-4`} onClick={() => page(-1)} disabled={atStart} aria-label="Niveles anteriores">
          ◀
        </button>
        <button type="button" className={`${arrowClass} -right-4`} onClick={() => page(1)} disabled={atEnd} aria-label="Niveles siguientes">
          ▶
        </button>

        {/* Grilla en celular y pantallas muy anchas; carrusel con scroll snap entre 600px y 1920px */}
        <div
          ref={trackRef}
          onScroll={updatePosition}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Niveles de investigación"
          className="
            grid gap-6 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 outline-none rounded-2xl
            min-[600px]:max-[1921px]:flex min-[600px]:max-[1921px]:overflow-x-auto min-[600px]:max-[1921px]:overflow-y-hidden
            min-[600px]:max-[1921px]:snap-x min-[600px]:max-[1921px]:snap-mandatory min-[600px]:max-[1921px]:scroll-smooth
            min-[600px]:max-[1921px]:p-3.5 min-[600px]:max-[1921px]:scroll-px-3.5
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            focus-visible:ring-2 focus-visible:ring-amber-400/50
          "
        >
          {levels.map((level, i) => (
            <div
              key={level.id}
              className={`
                min-w-0 transition-all duration-300
                min-[600px]:max-[1921px]:shrink-0 min-[600px]:max-[1921px]:snap-start
                min-[600px]:max-[1921px]:basis-[85%]
                @2xl:min-[600px]:max-[1921px]:basis-[calc(50%-12px)]
                @5xl:min-[600px]:max-[1921px]:basis-[calc(33.333%-16px)]
                ${visible.includes(i) ? "" : "min-[600px]:max-[1921px]:opacity-40 min-[600px]:max-[1921px]:scale-[0.96]"}
              `}
            >
              <LevelCard preview={level} />
            </div>
          ))}
        </div>
      </div>

      {/* Paginador: una ficha por nivel, marca cuáles están en la vista y permite saltar */}
      <nav aria-label="Niveles" className="hidden min-[600px]:max-[1921px]:flex items-center justify-center gap-3 mt-3">
        {levels.map((level, i) => (
          <CarouselDot key={level.id} number={level.id} state={dotState(level)} active={visible.includes(i)} onClick={() => jump(i)} />
        ))}
      </nav>
    </div>
  );
}
