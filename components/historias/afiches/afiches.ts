// Paleta de cada afiche (por nivel) y créditos genéricos: no nombran a nadie del caso, solo bromean con el jugador.

export type PosterTone = { accent: string; glow: string };

const TONES: PosterTone[] = [
  { accent: "#f5c84c", glow: "245,200,76" },
  { accent: "#7fd4ff", glow: "127,212,255" },
  { accent: "#e8f1ff", glow: "232,241,255" },
  { accent: "#ff9a5a", glow: "255,154,90" },
  { accent: "#ff6fb5", glow: "255,111,181" },
  { accent: "#e0a86b", glow: "224,168,107" },
  { accent: "#8fd0ff", glow: "143,208,255" },
  { accent: "#ffd76a", glow: "255,215,106" },
];

export function toneFor(level: number) {
  return TONES[(level - 1) % TONES.length];
}

export const CREDITS =
  "PROTAGONIZADA POR VOS · CON LA PARTICIPACIÓN DE LA CENTRAL DE POLICÍA · GUION: EL EXPEDIENTE · MÚSICA: LA SIRENA DEL PATRULLERO · DIRECCIÓN DE FOTOGRAFÍA: EL ARCHIVO";

export const REGISTER_HREF = "/login?registro";
