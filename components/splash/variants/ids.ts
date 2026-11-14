// Ids de los splash post-login. Módulo liviano (sin componentes) para poder elegir uno sin descargarlos todos
export const SPLASH_VARIANT_IDS = [
  "expediente",
  "newspaper",
  "radio",
  "map",
  "lineup",
  "subway",
  "fingerprint",
  "laboca",
] as const;

export type SplashVariantId = (typeof SPLASH_VARIANT_IDS)[number];

export function isSplashVariantId(id: string): id is SplashVariantId {
  return (SPLASH_VARIANT_IDS as readonly string[]).includes(id);
}
