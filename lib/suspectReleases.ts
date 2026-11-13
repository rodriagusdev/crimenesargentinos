// Sospechosos agrupados por release del juego. Solo foto y nombre: nada que diga en qué caso aparecen ni si son culpables.
// Cuando salga un release nuevo se agrega un grupo al final (el más nuevo se muestra primero y lleva la marca "NUEVO").

export type GallerySuspect = {
  name: string;
  /** null: todavía sin foto (se muestra una silueta) */
  image: string | null;
};

export type SuspectRelease = {
  id: number;
  name: string;
  suspects: GallerySuspect[];
};

const s = (name: string, file: string): GallerySuspect => ({ name, image: `/images/suspects/${file}` });

export const SUSPECT_RELEASES: SuspectRelease[] = [
  {
    id: 1,
    name: "Release 1",
    suspects: [
      s("Peque Mafia", "level1/Cara_Sospechoso_Peque_Mafia.webp"),
      s("Gordo Tragasi", "level1/Cara_Gordo_Tragassi_Sospechoso.webp"),
      s("Porcelana Jr", "level1/Cara_Porcelana_Jr_Sospechoso.webp"),
      s("Enano Orejón", "level2/Cara_Enano_Orejon_Sospechoso.webp"),
      s("La Pulga Mesías", "level2/Cara_Imitador_Messi_Sospechoso.webp"),
      s("Pedro Lanza", "level2/Cara_Pedro_Lanza_Sospechoso.webp"),
      s("Favatorro", "level3/suspect_level_3_favatorro.webp"),
      s("Mirtha la Chiquita", "level3/suspect_level_3_mirtha.webp"),
      s("Roberto Rosca Floja", "level3/suspect_level_3_robertito.webp"),
      s("Desodorante Loca", "level4/suspect_level_4_desodorante.webp"),
      s("El Bolitas", "level4/suspect_level_4_bolitas.webp"),
      s("Señor Kakas", "level4/suspect_level_4_kks.webp"),
      s("Mora Monumental", "level5/suspect_level_5_mora.webp"),
      s("Susanita Albina", "level5/suspect_level_5_susana.webp"),
      s("Lizy Travaglani", "level5/suspect_level_5_lizy.webp"),
      s("El Chamamecero", "level1/suspect_level_1_chamamecero.webp"),
      s("Gardelito", "level1/suspect_level_1_gardelito.webp"),
      s("Lucho Turrón", "level1/suspect_level_1_lucho_turron.webp"),
      s("Pancho Golosina", "level1/suspect_level_1_pancho_golosina.webp"),
      s("Petiso Gómez", "level1/suspect_level_1_petiso_gomez.webp"),
      s("El Pibe Zurdito", "level1/suspect_level_1_pibe_zurdito.webp"),
      s("Rulo Sosa", "level1/suspect_level_1_rulo_sosa.webp"),
      s("Tanguito Pérez", "level1/suspect_level_1_tanguito_perez.webp"),
      s("Tito Dulzura", "level1/suspect_level_1_tito_dulzura.webp"),
    ],
  },
];

/** Release de muestra para los bocetos: así se ve cómo se destacan los nuevos (siluetas, sin personajes reales) */
const PREVIEW_RELEASE: SuspectRelease = {
  id: 2,
  name: "Release 2",
  suspects: [1, 2, 3, 4].map((n) => ({ name: `Nuevo sospechoso ${n}`, image: null })),
};

/** Releases del más nuevo al más viejo; con `preview`, se suma el release de muestra */
export function galleryReleases(preview: boolean): SuspectRelease[] {
  const list = preview ? [...SUSPECT_RELEASES, PREVIEW_RELEASE] : SUSPECT_RELEASES;
  return [...list].reverse();
}

/** El release más nuevo es el que lleva la marca "NUEVO" (si hay más de uno) */
export function isNewRelease(release: SuspectRelease, releases: SuspectRelease[]): boolean {
  return releases.length > 1 && release.id === Math.max(...releases.map((r) => r.id));
}
