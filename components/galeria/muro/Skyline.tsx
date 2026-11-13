import styles from "./muro.module.css";

// Edificios del barrio: ancho y alto en %, y cuántas filas de ventanas tienen
const BUILDINGS = [
  { w: 14, h: 62, rows: 4 },
  { w: 10, h: 82, rows: 6 },
  { w: 16, h: 50, rows: 3 },
  { w: 12, h: 70, rows: 5 },
  { w: 9, h: 90, rows: 7 },
  { w: 15, h: 58, rows: 4 },
  { w: 13, h: 76, rows: 5 },
  { w: 11, h: 54, rows: 3 },
];

// Siluetas de edificios con ventanas que se prenden y apagan a destiempo
export default function Skyline() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-[70%] flex items-end gap-1 px-1 opacity-90" aria-hidden>
      {BUILDINGS.map((b, bi) => (
        <div key={bi} className="relative bg-[#0c0f1c] grid grid-cols-3 gap-1.5 p-1.5 content-start" style={{ width: `${b.w}%`, height: `${b.h}%` }}>
          {Array.from({ length: b.rows * 3 }, (_, wi) => {
            const n = bi * 7 + wi * 3;
            const lit = n % 4 !== 0;
            return (
              <span
                key={wi}
                className={`h-1.5 sm:h-2 ${lit ? `bg-[#ffcf7a]/70 ${styles.window}` : "bg-[#1a1f33]"}`}
                style={lit ? { animationDelay: `-${(n * 1.9) % 14}s`, animationDuration: `${10 + (n % 9)}s` } : undefined}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
