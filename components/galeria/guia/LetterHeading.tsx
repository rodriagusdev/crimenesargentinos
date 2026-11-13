import styles from "./guia.module.css";

// Encabezado de letra dentro de las columnas (la "A" grande de las guías); destella cuando se llega desde el uñero
export default function LetterHeading({ letter, anchor, flash }: { letter: string; anchor: string; flash: boolean }) {
  return (
    <li
      id={anchor}
      className={`break-inside-avoid break-after-avoid scroll-mt-24 flex items-end gap-2 pt-2 pb-1 ${flash ? styles.flash : ""}`}
    >
      <span className="font-serif text-3xl font-black leading-none text-[#1d3f8a]">{letter}</span>
      <span className="flex-1 mb-1.5 border-b-2 border-[#1d3f8a]" aria-hidden />
    </li>
  );
}
