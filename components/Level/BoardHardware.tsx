// Escuadras de acero y tornillos en las cuatro esquinas de una pizarra (como en el tablero de investigación)
const CORNERS = [
  { bracket: "top-0 left-0 border-t-4 border-l-4 rounded-tl", screw: "top-2.5 left-2.5" },
  { bracket: "top-0 right-0 border-t-4 border-r-4 rounded-tr", screw: "top-2.5 right-2.5" },
  { bracket: "bottom-0 left-0 border-b-4 border-l-4 rounded-bl", screw: "bottom-2.5 left-2.5" },
  { bracket: "bottom-0 right-0 border-b-4 border-r-4 rounded-br", screw: "bottom-2.5 right-2.5" },
];

export default function BoardHardware() {
  return (
    <>
      {CORNERS.map((c) => (
        <span key={c.screw} aria-hidden>
          <span className={`pointer-events-none absolute size-8 border-slate-500/60 ${c.bracket}`} />
          <span
            className={`pointer-events-none absolute size-3.5 rounded-full border border-slate-400 bg-gradient-to-br from-slate-300 via-slate-600 to-slate-900 shadow-md ${c.screw}`}
          />
        </span>
      ))}
    </>
  );
}
