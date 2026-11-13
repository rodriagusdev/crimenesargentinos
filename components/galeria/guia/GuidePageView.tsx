import DirectoryEntry from "./DirectoryEntry";
import type { GuidePage } from "./guiaPages";
import styles from "./guia.module.css";

type Props = {
  page: GuidePage;
  side: "left" | "right";
  /** Coincidencias del buscador (nombres) */
  found: Set<string>;
};

// Una página de la guía: encabezado con el primer y el último nombre (como las guías de verdad), los avisos y el folio.
// El suplemento de altas es una hoja más amarilla, abrochada, con su faja.
export default function GuidePageView({ page, side, found }: Props) {
  const supplement = page.kind === "suplemento";
  const firstName = page.entries[0]?.suspect.name ?? "";
  const lastName = page.entries[page.entries.length - 1]?.suspect.name ?? "";

  return (
    <section
      className={`relative flex flex-col min-h-[30rem] px-4 sm:px-6 pt-4 pb-3 text-[#1b1813] ${
        supplement ? "bg-[#ffe45c]" : "bg-[#f6e7a1]"
      } ${side === "left" ? styles.pageLeft : styles.pageRight}`}
    >
      {/* Encabezado de página */}
      <header className="flex items-baseline justify-between gap-2 border-b-[3px] border-[#1b1813] pb-1.5 font-serif font-black uppercase">
        {supplement ? (
          <span className="text-sm sm:text-base">Suplemento · Altas de esta edición</span>
        ) : (
          <>
            <span className="truncate text-sm sm:text-base">{firstName}</span>
            <span className="shrink-0 text-xs">—</span>
            <span className="truncate text-sm sm:text-base text-right">{lastName}</span>
          </>
        )}
      </header>

      <ol className="flex-1 mt-2">
        {page.entries.map((e, i) => (
          <DirectoryEntry key={e.suspect.name} entry={e} fresh={supplement} order={i} found={found.has(e.suspect.name)} />
        ))}
      </ol>

      <footer className={`mt-2 font-mono text-xs font-bold ${side === "left" ? "text-left" : "text-right"}`}>{page.folio}</footer>

      {/* Ganchos de la abrochadora del suplemento */}
      {supplement && (
        <>
          <span className={`absolute top-3 left-6 ${styles.staple}`} aria-hidden />
          <span className={`absolute bottom-6 left-6 ${styles.staple}`} aria-hidden />
        </>
      )}
    </section>
  );
}
