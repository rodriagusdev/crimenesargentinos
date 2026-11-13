import type { GallerySuspect, SuspectRelease } from "@/lib/suspectReleases";

/** Pestañas del índice de uñero, de a dos letras como en las guías de antes */
export const THUMB_GROUPS = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "ÑO", "PQ", "RS", "TU", "VW", "XYZ"];

/** Inicial sin tilde (la Ñ se respeta) */
export function initialOf(name: string): string {
  const first = name.charAt(0).toUpperCase();
  return first === "Ñ" ? first : first.normalize("NFD").charAt(0);
}

export const groupOf = (letter: string) => THUMB_GROUPS.find((g) => g.includes(letter)) ?? "XYZ";

export const letterAnchor = (releaseId: number, letter: string) => `guia-r${releaseId}-${letter}`;

export type GuideItem =
  | { kind: "letter"; letter: string; anchor: string }
  | { kind: "entry"; suspect: GallerySuspect; number: number; order: number };

/** Renglones de una edición en orden alfabético, con un encabezado cada vez que cambia la inicial */
export function guideItems(release: SuspectRelease, start: number): GuideItem[] {
  const sorted = release.suspects.map((s, i) => ({ s, i })).sort((a, b) => a.s.name.localeCompare(b.s.name, "es"));
  const items: GuideItem[] = [];
  let prev = "";
  sorted.forEach(({ s, i }, order) => {
    const letter = initialOf(s.name);
    if (letter !== prev) items.push({ kind: "letter", letter, anchor: letterAnchor(release.id, letter) });
    prev = letter;
    items.push({ kind: "entry", suspect: s, number: start + i, order });
  });
  return items;
}

/** Para cada pestaña del uñero, el primer encabezado de letra al que salta (de la edición más nueva a la más vieja) */
export function thumbTargets(releases: SuspectRelease[]): Record<string, string> {
  const targets: Record<string, string> = {};
  for (const r of releases) {
    const letters = [...new Set(r.suspects.map((s) => initialOf(s.name)))].sort((a, b) => a.localeCompare(b, "es"));
    for (const l of letters) {
      const g = groupOf(l);
      if (!targets[g]) targets[g] = letterAnchor(r.id, l);
    }
  }
  return targets;
}
