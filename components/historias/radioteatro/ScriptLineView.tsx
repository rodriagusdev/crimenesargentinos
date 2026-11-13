import styles from "./radioteatro.module.css";
import type { ScriptLine } from "./script";

type Props = {
  line: ScriptLine;
  /** Texto que ya salió al aire */
  text: string;
  typing: boolean;
};

const SPEAKER: Record<ScriptLine["kind"], string> = {
  locutor: "LOCUTOR",
  narrador: "NARRADOR",
  efecto: "",
};

// Una línea del guion: papel de máquina de escribir, con el personaje en mayúsculas o el efecto entre corchetes
export default function ScriptLineView({ line, text, typing }: Props) {
  if (line.kind === "efecto") {
    return (
      <p className={`${styles.lineIn} py-1 text-center text-[11px] sm:text-xs font-bold tracking-widest text-[#8a1c0c]`}>
        [EFECTO: {text}]
      </p>
    );
  }

  return (
    <div className={`${styles.lineIn} grid grid-cols-[5.5rem_1fr] sm:grid-cols-[7rem_1fr] gap-2`}>
      <span className={`pt-0.5 text-[10px] sm:text-xs font-bold tracking-wider ${line.kind === "locutor" ? "text-[#1d3a6b]" : "text-[#3b2a14]"}`}>
        {SPEAKER[line.kind]}:
      </span>
      <p className={`text-sm leading-relaxed ${line.kind === "locutor" ? "italic" : ""}`}>
        {text}
        {typing && <span className={`${styles.caret} ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-[#2a2016]`} aria-hidden />}
      </p>
    </div>
  );
}
