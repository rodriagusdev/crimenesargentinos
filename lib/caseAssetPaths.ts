export type CaseAssetKind = "preview" | "map" | "dialog" | "portrait" | "location";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-") || "caso";
}

export function sanitizeFilename(originalName: string): string {
  const clean = originalName.split(".").slice(0, -1).join(".") || "archivo";
  return slugify(clean).slice(0, 80);
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

export function buildCaseAssetFolder(kind: CaseAssetKind, level: number, slug: string): string {
  const normalizedLevel = resolveAssetLevel(level);
  const normalizedSlug = slugify(slug || "caso");

  switch (kind) {
    case "preview":
      return `/images/levelcardspreview/${normalizedSlug}`;
    case "map":
      return `/images/maps/level${normalizedLevel}/${normalizedSlug}`;
    case "dialog":
      return `/images/dialogbackground/level${normalizedLevel}/${normalizedSlug}`;
    case "portrait":
      return `/images/portraits/level${normalizedLevel}/${normalizedSlug}`;
    case "location":
      return `/images/locations/level${normalizedLevel}/${normalizedSlug}`;
    default:
      return `/images/locations/level${normalizedLevel}/${normalizedSlug}`;
  }
}

export function buildCaseAssetPath(kind: CaseAssetKind, level: number, slug: string, originalName: string): {
  relativePath: string;
  absolutePath: string;
  filename: string;
} {
  const folder = buildCaseAssetFolder(kind, level, slug);
  const extension = originalName.includes(".") ? originalName.split(".").pop() || "webp" : "webp";
  const filename = `${sanitizeFilename(originalName)}.${extension}`;
  const relativePath = `${folder}/${filename}`;

  return {
    relativePath,
    absolutePath: `${process.cwd()}/public${relativePath}`,
    filename,
  };
}
