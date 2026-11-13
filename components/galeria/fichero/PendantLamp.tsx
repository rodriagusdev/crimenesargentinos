import styles from "./fichero.module.css";

// Posiciones fijas de las motas de polvo (sin azar en el render, para no romper la hidratación)
const MOTES = [
  { left: "38%", top: "42%", delay: "0s" },
  { left: "47%", top: "60%", delay: "2.4s" },
  { left: "55%", top: "35%", delay: "4.1s" },
  { left: "62%", top: "70%", delay: "6.3s" },
  { left: "43%", top: "78%", delay: "8s" },
  { left: "58%", top: "52%", delay: "1.2s" },
];

// Lámpara colgante de oficina: cable, pantalla metálica, foco que titila y el cono de luz con polvo en el aire.
// Va encima del mueble, sin capturar clics.
export default function PendantLamp() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden>
      {/* Cono de luz */}
      <div className={`absolute left-1/2 top-16 bottom-0 w-[min(100%,56rem)] -translate-x-1/2 ${styles.cone}`} />
      {MOTES.map((m) => (
        <span
          key={m.left + m.top}
          className={`absolute size-1 rounded-full bg-[#ffe9b0] ${styles.mote}`}
          style={{ left: m.left, top: m.top, animationDelay: m.delay }}
        />
      ))}

      {/* Lámpara */}
      <div className={`absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center ${styles.lamp}`}>
        <span className="h-6 w-0.5 bg-[#111]" />
        <span className="h-2 w-4 rounded-t-sm bg-[#2c3a2f]" />
        <span className="relative h-8 w-24 [clip-path:polygon(28%_0,72%_0,100%_100%,0_100%)] bg-gradient-to-b from-[#3f5a45] to-[#24352a]">
          <span className="absolute inset-x-0 bottom-0 h-1 bg-[#ffe9b0]/50" />
        </span>
        <span className={`-mt-2 size-5 rounded-full bg-[#fff6d6] shadow-[0_0_24px_10px_rgba(255,226,150,0.55)] ${styles.bulb}`} />
      </div>
    </div>
  );
}
