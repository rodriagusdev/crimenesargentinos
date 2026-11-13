import styles from "./cartelera.module.css";

// Rosas que tira el público en la noche de estreno (posiciones fijas, así no hay diferencias de hidratación)
const ROSES = [6, 17, 29, 41, 52, 63, 74, 86, 94, 12, 36, 58, 81];

export default function RosePetals() {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none" aria-hidden>
      {ROSES.map((left, i) => (
        <span
          key={i}
          className={`${styles.petal} absolute top-0 text-lg sm:text-2xl`}
          style={{ left: `${left}%`, animationDelay: `${1.6 + (i % 5) * 0.25 + (i > 8 ? 0.6 : 0)}s` }}
        >
          🌹
        </span>
      ))}
    </div>
  );
}
