import styles from "./radioteatro.module.css";

const BARS = [0.42, 0.31, 0.55, 0.27, 0.48, 0.36, 0.6, 0.33, 0.45, 0.29];

// Vúmetro de válvulas: barras verdes que pasan a ámbar y rojo; se mueven solo mientras la radio está al aire
export default function VuMeter({ on }: { on: boolean }) {
  return (
    <div className="flex h-10 items-end gap-0.5 rounded border-2 border-[#2b1d10] bg-[#0d0a06] px-1.5 py-1 shadow-[inset_0_0_8px_rgba(0,0,0,0.9)]" aria-hidden>
      {BARS.map((d, i) => (
        <span
          key={i}
          style={{ animationDuration: `${d}s`, animationDelay: `${-i * 0.07}s` }}
          className={`${styles.vuBar} ${on ? styles.vuOn : ""} block h-full w-1.5 rounded-sm ${
            i > 7 ? "bg-red-500" : i > 5 ? "bg-amber-400" : "bg-lime-400"
          } ${on ? "shadow-[0_0_6px_currentColor]" : "opacity-50"}`}
        />
      ))}
    </div>
  );
}
