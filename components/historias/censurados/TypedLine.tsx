import styles from "./censurados.module.css";

type Props = { label: string; text: string; shown: number; typing: boolean; big?: boolean };

// Renglón del parte a máquina: lo ya escrito, el cursor y el resto invisible para que el texto no salte.
export default function TypedLine({ label, text, shown, typing, big }: Props) {
  const visible = text.slice(0, shown);
  const rest = text.slice(shown);
  return (
    <p className={`font-mono leading-relaxed ${big ? "text-base font-bold uppercase sm:text-xl" : "text-[13px] sm:text-[15px]"}`}>
      <span className="mr-2 text-[11px] font-bold tracking-widest text-[#7a6a50] sm:text-xs">{label}</span>
      {visible}
      {typing && <span className={`inline-block h-[1em] w-[0.55em] translate-y-[2px] bg-[#2b2117] ${styles.cursor}`} aria-hidden />}
      <span className="invisible">{rest}</span>
    </p>
  );
}
