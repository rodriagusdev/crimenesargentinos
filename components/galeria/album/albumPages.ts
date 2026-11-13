import type { GallerySuspect, SuspectRelease } from "@/lib/suspectReleases";

/** Figuritas por página del álbum */
export const PER_PAGE = 8;

/** Una hoja del álbum: un tramo de hasta 8 figuritas de un release */
export type AlbumLeaf = {
  release: SuspectRelease;
  suspects: GallerySuspect[];
  /** Número de la primera figurita de la hoja */
  start: number;
  /** Hoja dentro del release (1..parts) */
  part: number;
  parts: number;
};

/** Hojas en orden de álbum (release 1 primero), corridas entre releases */
export function buildLeaves(releases: SuspectRelease[], firstNumber: (r: SuspectRelease) => number): AlbumLeaf[] {
  return [...releases]
    .sort((a, b) => a.id - b.id)
    .flatMap((release) => {
      const parts = Math.max(1, Math.ceil(release.suspects.length / PER_PAGE));
      return Array.from({ length: parts }, (_, i) => ({
        release,
        suspects: release.suspects.slice(i * PER_PAGE, (i + 1) * PER_PAGE),
        start: firstNumber(release) + i * PER_PAGE,
        part: i + 1,
        parts,
      }));
    });
}
