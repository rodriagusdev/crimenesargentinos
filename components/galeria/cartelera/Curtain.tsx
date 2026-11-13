import styles from "./cartelera.module.css";

// Telón rojo que cubre el escenario al montarse y se abre hacia los costados
export default function Curtain() {
  return (
    <div className="absolute inset-0 z-10 flex pointer-events-none" aria-hidden>
      <span className={`${styles.curtainLeft} h-full w-1/2 shadow-[8px_0_20px_rgba(0,0,0,0.6)]`} />
      <span className={`${styles.curtainRight} h-full w-1/2 shadow-[-8px_0_20px_rgba(0,0,0,0.6)]`} />
    </div>
  );
}
