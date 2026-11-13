/**
 * Idiomas del juego y detección inicial. Se comparte entre el proxy (servidor) y el cliente:
 * no importar nada de React ni del navegador acá.
 */

export type Locale = "es" | "en";

export const LOCALES: readonly Locale[] = ["es", "en"];
export const DEFAULT_LOCALE: Locale = "es";
export const LOCALE_COOKIE = "lang";

// Países donde se habla castellano (ISO 3166-1 alfa-2). Fuera de estos el juego arranca en inglés
const SPANISH_SPEAKING_COUNTRIES = new Set([
  "AR", "BO", "CL", "CO", "CR", "CU", "DO", "EC", "SV", "GQ", "GT",
  "HN", "MX", "NI", "PA", "PY", "PE", "PR", "ES", "UY", "VE",
]);

export function isLocale(value: unknown): value is Locale {
  return value === "es" || value === "en";
}

/**
 * Idioma para un visitante nuevo: manda el país (x-vercel-ip-country); sin país (desarrollo local u otro
 * hosting) se usa el primer idioma del navegador.
 */
export function detectLocale(country: string | null, acceptLanguage: string | null): Locale {
  if (country) return SPANISH_SPEAKING_COUNTRIES.has(country.toUpperCase()) ? "es" : "en";
  const first = acceptLanguage?.split(",")[0]?.trim().toLowerCase() ?? "";
  if (!first) return DEFAULT_LOCALE;
  return first.startsWith("es") ? "es" : "en";
}
