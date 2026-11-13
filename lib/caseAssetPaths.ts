// Tipo de imagen de un caso: define la carpeta donde la guarda el backend al subirla (POST /api/CaseAssets)
export type CaseAssetKind = "preview" | "map" | "dialog" | "portrait" | "location";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-") || "caso";
}

export function resolveAssetLevel(level: number): number {
  const normalizedLevel = Number.isFinite(level) && level > 0 ? level : 1;

  // Levels 6-15 are variations of the original case families and intentionally reuse
  // the visual assets of the corresponding base level group (6/7 -> 1, 8/9 -> 2, ...).
  const sharedAssetRoots: Record<number, number> = {
    6: 1,
    7: 1,
    8: 2,
    9: 2,
    10: 3,
    11: 3,
    12: 4,
    13: 4,
    14: 5,
    15: 5,
  };

  return sharedAssetRoots[normalizedLevel] ?? normalizedLevel;
}
