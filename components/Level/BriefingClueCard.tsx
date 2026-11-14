import styles from "./caseBriefing.module.css";

type Props = { label: string; text: string; order: number };

// Ficha de una pista del informe, clavada con chinche roja en la pizarra (como las del tablero de investigación)
export default function BriefingClueCard({ label, text, order }: Props) {
  return (
    <li
      className={`relative rounded-lg border border-[#d4c3a3] bg-[#f5eee0] p-3 pt-4 text-zinc-900 shadow-[0_8px_18px_rgba(0,0,0,0.5)] ${styles.pinIn} ${
        order % 2 === 0 ? "rotate-[-1.2deg]" : "rotate-[1deg]"
      }`}
      style={{ animationDelay: `${order * 260}ms` }}
    >
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 size-4 rounded-full border border-red-300 bg-red-600 shadow-[0_2px_5px_rgba(0,0,0,0.5)]" aria-hidden />
      <p className="mb-1 font-mono text-[10px] lg:text-xs font-bold uppercase tracking-wider text-zinc-600">{label}</p>
      <p className={`text-sm lg:text-base leading-snug text-zinc-800 ${styles.typewriter}`}>&ldquo;{text}&rdquo;</p>
    </li>
  );
}
