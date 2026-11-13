import styles from "./muro.module.css";

// Charcos donde caen las gotas (posición en % y desfase de la animación)
const DROPS = [
  { left: 18, top: 40, delay: 0 },
  { left: 37, top: 65, delay: 0.8 },
  { left: 58, top: 35, delay: 1.5 },
  { left: 76, top: 60, delay: 0.4 },
  { left: 90, top: 45, delay: 1.9 },
];

// Vereda mojada: cordón, reflejo del farol y de los carteles, gotas y un diario viejo que vuela
export default function Sidewalk() {
  return (
    <div className="relative h-24 sm:h-28 overflow-hidden border-t-4 border-[#3a3d44] bg-[linear-gradient(180deg,#1d2026,#0b0c10)]" aria-hidden>
      {/* Juntas de las baldosas */}
      <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_100%]" />
      {/* Reflejos */}
      <span className={`${styles.shimmer} absolute top-0 left-[6%] sm:left-[10%] h-full w-24 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,206,120,0.55),transparent_70%)] blur-sm`} />
      <span className="absolute top-0 left-[35%] h-2/3 w-[30%] bg-[linear-gradient(180deg,rgba(255,250,240,0.12),transparent)] blur-md" />
      <span className="absolute top-0 right-[10%] h-1/2 w-[20%] bg-[linear-gradient(180deg,rgba(255,212,71,0.12),transparent)] blur-md" />
      {DROPS.map((d) => (
        <span
          key={d.left}
          className={`${styles.ripple} absolute h-2 w-8 rounded-[50%] border border-[#9fb4d8]/60`}
          style={{ left: `${d.left}%`, top: `${d.top}%`, animationDelay: `${d.delay}s` }}
        />
      ))}
      {/* Diario viejo que cruza con el viento */}
      <span className={`${styles.drift} absolute bottom-5 h-4 w-6 bg-[#d8ccb0] shadow-[0_2px_4px_rgba(0,0,0,0.6)] bg-[repeating-linear-gradient(180deg,#d8ccb0_0_2px,#b9ab8c_2px_3px)]`} />
      <p className="absolute bottom-2 inset-x-0 text-center font-mono text-[10px] text-white/30">Prohibido fijar carteles · Ordenanza municipal</p>
    </div>
  );
}
