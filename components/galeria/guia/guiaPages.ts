import type { GallerySuspect, SuspectRelease } from "@/lib/suspectReleases";

/** Avisos por página del libro */
export const PER_PAGE = 6;

export type GuideEntry = { suspect: GallerySuspect; number: number };

export type GuidePage = {
  /** "suplemento": altas del release nuevo, abrochadas al principio; "guia": el resto en orden alfabético */
  kind: "suplemento" | "guia";
  entries: GuideEntry[];
  /** Número impreso al pie */
  folio: number;
};

const byName = (a: GuideEntry, b: GuideEntry) => a.suspect.name.localeCompare(b.suspect.name, "es");

const chunk = (entries: GuideEntry[], kind: GuidePage["kind"]) =>
  Array.from({ length: Math.ceil(entries.length / PER_PAGE) }, (_, i) => ({
    kind,
    entries: entries.slice(i * PER_PAGE, (i + 1) * PER_PAGE),
  }));

/** Inicial sin tilde (la Ñ se respeta) */
export function initialOf(name: string): string {
  const first = name.charAt(0).toUpperCase();
  return first === "Ñ" ? first : first.normalize("NFD").charAt(0);
}

/** Texto comparable para el buscador: sin tildes ni mayúsculas */
export const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/**
 * Páginas del libro: primero el suplemento con las altas del release nuevo (si hay) y después la guía con
 * todos los demás en orden alfabético.
 */
export function buildPages(releases: SuspectRelease[], isNew: (r: SuspectRelease) => boolean, firstNumber: (r: SuspectRelease) => number): GuidePage[] {
  const entriesOf = (r: SuspectRelease) => r.suspects.map((suspect, i) => ({ suspect, number: firstNumber(r) + i }));
  const fresh = releases.filter(isNew).flatMap(entriesOf).sort(byName);
  const rest = releases.filter((r) => !isNew(r)).flatMap(entriesOf).sort(byName);
  return [...chunk(fresh, "suplemento"), ...chunk(rest, "guia")].map((p, i) => ({ ...p, folio: i + 1 }));
}

/** Para cada inicial, la primera página de la guía donde aparece (el índice de uñero salta ahí) */
export function letterPages(pages: GuidePage[]): Map<string, number> {
  const map = new Map<string, number>();
  pages.forEach((p, i) => {
    if (p.kind !== "guia") return;
    for (const e of p.entries) {
      const l = initialOf(e.suspect.name);
      if (!map.has(l)) map.set(l, i);
    }
  });
  return map;
}
