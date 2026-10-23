export const SUSPECT_IMAGES: Record<string, string> = {
  // Nivel 1 (Casos 1, 6, 7)
  "peque mafia": "/images/suspects/level1/Cara_Sospechoso_Peque_Mafia.webp",
  "gordo tragasi": "/images/suspects/level1/Cara_Gordo_Tragassi_Sospechoso.webp",
  "porcelana jr": "/images/suspects/level1/Cara_Porcelana_Jr_Sospechoso.webp",

  // Nivel 2 (Casos 2, 8, 9)
  "enano orejón": "/images/suspects/level2/Cara_Enano_Orejon_Sospechoso.webp",
  "enano orejon": "/images/suspects/level2/Cara_Enano_Orejon_Sospechoso.webp",
  "la pulga mesías": "/images/suspects/level2/Cara_Imitador_Messi_Sospechoso.webp",
  "la pulga mesias": "/images/suspects/level2/Cara_Imitador_Messi_Sospechoso.webp",
  "pedro lanza": "/images/suspects/level2/Cara_Pedro_Lanza_Sospechoso.webp",

  // Nivel 3 (Casos 3, 10, 11)
  "favatorro": "/images/suspects/level3/suspect_level_3_favatorro.webp",
  "mirtha la chiquita": "/images/suspects/level3/suspect_level_3_mirtha.webp",
  "roberto rosca floja": "/images/suspects/level3/suspect_level_3_robertito.webp",

  // Nivel 4 (Casos 4, 12, 13)
  "desodorante loca": "/images/suspects/level4/suspect_level_4_desodorante.webp",
  "el bolitas": "/images/suspects/level4/suspect_level_4_bolitas.webp",
  "señor kakas": "/images/suspects/level4/suspect_level_4_kks.webp",
  "senor kakas": "/images/suspects/level4/suspect_level_4_kks.webp",

  // Nivel 5 (Casos 5, 14, 15)
  "mora monumental": "/images/suspects/level5/suspect_level_5_mora.webp",
  "susanita albina": "/images/suspects/level5/suspect_level_5_susana.webp",
  "lizy travaglani": "/images/suspects/level5/suspect_level_5_lizy.webp",
};

export function resolveSuspectImage(name?: string, image?: string | null): string | null {
  if (image && image.trim().length > 0) return image;
  if (!name) return null;
  const normalized = name.trim().toLowerCase();
  return SUSPECT_IMAGES[normalized] ?? null;
}
