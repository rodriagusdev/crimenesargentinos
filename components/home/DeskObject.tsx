"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { audioManager } from "@/lib/audioManager";

type DeskObjectProps = {
  /** Destino del objeto; sin href se comporta como botón (onClick) */
  href?: string;
  onClick?: () => void;
  /** Cartelito que aparece al pasar el mouse */
  hint: string;
  /** Inclinación con la que quedó apoyado en la mesa (grados) */
  tilt: number;
  /** Orden en que cae sobre la mesa al cargar */
  dropDelayMs: number;
  featured?: boolean;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
};

// Objeto apoyado en la mesa del detective: cae al cargar, se endereza y brilla al pasar el mouse
export default function DeskObject({
  href,
  onClick,
  hint,
  tilt,
  dropDelayMs,
  featured = false,
  className = "",
  ariaLabel,
  children,
}: DeskObjectProps) {
  const style = { "--tilt": `${tilt}deg`, animationDelay: `${dropDelayMs}ms` } as CSSProperties;
  const classes = `home-drop group relative flex flex-col gap-3 text-left cursor-pointer select-none rotate-(--tilt) transition-[rotate,translate,box-shadow] duration-200 hover:rotate-0 hover:-translate-y-2 focus-visible:rotate-0 focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E1C380] ${
    featured
      ? "shadow-[0_0_0_4px_#E1C380,0_0_40px_rgba(225,195,128,0.55),0_18px_30px_rgba(0,0,0,0.6)] -translate-y-2"
      : "shadow-[0_14px_24px_rgba(0,0,0,0.55)] hover:shadow-[0_0_0_3px_rgba(225,195,128,0.8),0_0_30px_rgba(225,195,128,0.35),0_20px_30px_rgba(0,0,0,0.6)]"
  } ${className}`;

  const content = (
    <>
      <span
        className={`absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-2 rounded-lg bg-[#070c16] border border-[#E1C380] text-[#FFF3C7] text-[9px] tracking-widest pointer-events-none transition-opacity duration-200 ${
          featured ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        }`}
        aria-hidden
      >
        {hint}
      </span>
      {children}
    </>
  );

  const onHover = () => audioManager.play("opencasefile", { volume: 0.5 });

  if (href) {
    return (
      <Link href={href} style={style} className={classes} onMouseEnter={onHover} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" style={style} className={classes} onMouseEnter={onHover} onClick={onClick} aria-label={ariaLabel}>
      {content}
    </button>
  );
}
