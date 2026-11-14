// Fondo de las propuestas con la estética de /principal: azul noche casi negro, viñeta, un resplandor arriba
// (ámbar por defecto, o el color de cada propuesta) y cintas de precaución cruzadas detrás del contenido.
// Va como primer hijo de un contenedor `relative`; el contenido que sigue tiene que ser `relative` para quedar encima.

const CAUTION_STRIPES = "bg-[repeating-linear-gradient(45deg,#eab308,#eab308_14px,#090d16_14px,#090d16_28px)]";

const TAPE = `absolute -left-[15%] -right-[15%] h-6 sm:h-8 shadow-[0_6px_16px_rgba(0,0,0,0.8)] border-y border-yellow-500/40 ${CAUTION_STRIPES}`;

/** Color de fondo de la página (va en el contenedor, junto con `relative`) */
export const GAME_BG = "bg-[#070c16]";

/**
 * `bright`: fondo más iluminado (viñeta más suave, resplandor más fuerte y más alto, y una luz difusa al centro)
 */
export default function GameBackdrop({ glow = "245,158,11", bright = false }: { glow?: string; bright?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className={`absolute inset-0 ${
          bright
            ? "bg-[radial-gradient(ellipse_at_center,rgba(30,44,70,0.55)_0%,rgba(10,16,28,0.9)_70%,#05080f_100%)]"
            : "bg-[radial-gradient(ellipse_at_center,rgba(8,14,24,0.4)_0%,#03060c_90%)]"
        }`}
      />
      {bright && (
        <div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[70%] w-[80%] rounded-full blur-3xl"
          style={{ background: `radial-gradient(ellipse at center, rgba(${glow},0.12), transparent 70%)` }}
        />
      )}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl blur-3xl ${bright ? "h-80" : "h-52"}`}
        style={{
          background: `linear-gradient(180deg, rgba(${glow},${bright ? 0.28 : 0.16}), rgba(${glow},${bright ? 0.1 : 0.05}), transparent)`,
        }}
      />
      <div className={`${TAPE} top-16 -rotate-[8deg] opacity-80`} />
      <div className={`${TAPE} bottom-24 rotate-[6deg] opacity-60`} />
    </div>
  );
}

/** Barra de precaución arriba del contenido, igual que la de los niveles en /principal */
export function CautionBar({ className = "max-w-5xl" }: { className?: string }) {
  return (
    <div
      className={`relative mx-auto mb-6 h-3 rounded-full border border-yellow-500/50 shadow-[0_0_12px_rgba(234,179,8,0.3)] ${CAUTION_STRIPES} ${className}`}
      aria-hidden
    />
  );
}
