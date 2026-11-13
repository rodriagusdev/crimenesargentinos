// Anotador de truco: los puntos se cuentan con fósforos de a cinco (cuadradito y la diagonal)
const MAX = 30;
// Trazos del cuadradito en el orden en que se ponen los fósforos
const STROKES = [
  [3, 3, 3, 21],
  [3, 3, 21, 3],
  [21, 3, 21, 21],
  [3, 21, 21, 21],
  [3, 21, 21, 3],
];

function Fosforos({ count }: { count: number }) {
  const n = Math.min(count, MAX);
  const groups = Math.ceil(n / 5);
  return (
    <div className="flex flex-wrap gap-1 min-h-6">
      {Array.from({ length: groups }, (_, g) => (
        <svg key={g} viewBox="0 0 24 24" className="size-6" aria-hidden>
          {STROKES.slice(0, Math.min(5, n - g * 5)).map(([x1, y1, x2, y2], i) => (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d9b77a" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx={x2} cy={y2} r="1.8" fill="#b3261e" />
            </g>
          ))}
        </svg>
      ))}
    </div>
  );
}

type Props = { nos: number; ellos: number };

// Hoja del anotador: "NOS" suma una por cada naipe que se da vuelta y "ELLOS" por cada mezcla
export default function ScorePad({ nos, ellos }: Props) {
  return (
    <div className="w-40 rotate-2 rounded-sm bg-[#f4eedc] bg-[repeating-linear-gradient(180deg,transparent_0,transparent_15px,rgba(60,90,160,0.18)_15px,rgba(60,90,160,0.18)_16px)] p-2 text-[#1b1813] shadow-[0_8px_16px_rgba(0,0,0,0.45)]">
      <p className="text-center text-[8px] tracking-widest">ANOTADOR</p>
      <div className="mt-1 grid grid-cols-2 divide-x divide-[#1b1813]/40 border-t border-[#1b1813]/40">
        {[
          { label: "NOS", value: nos },
          { label: "ELLOS", value: ellos },
        ].map((col) => (
          <div key={col.label} className="flex flex-col items-center gap-1 px-1 pt-1">
            <span className="font-mono text-[10px] font-bold">{col.label}</span>
            <Fosforos count={col.value} />
          </div>
        ))}
      </div>
    </div>
  );
}
