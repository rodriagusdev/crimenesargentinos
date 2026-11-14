import type { SplashVariantId } from "./ids";
import type { SplashVariant } from "./types";

export { SPLASH_VARIANT_IDS, isSplashVariantId, type SplashVariantId } from "./ids";

// Cada splash se descarga recién cuando toca mostrarlo (se ve uno solo, una vez después del login)
export const SPLASH_VARIANT_LOADERS: Record<SplashVariantId, () => Promise<SplashVariant>> = {
  expediente: () => import("./ExpedienteSplash").then((m) => m.expedienteSplash),
  newspaper: () => import("./NewspaperSplash").then((m) => m.newspaperSplash),
  radio: () => import("./RadioSplash").then((m) => m.radioSplash),
  map: () => import("./MapSplash").then((m) => m.mapSplash),
  lineup: () => import("./LineupSplash").then((m) => m.lineupSplash),
  subway: () => import("./SubwaySplash").then((m) => m.subwaySplash),
  fingerprint: () => import("./FingerprintSplash").then((m) => m.fingerprintSplash),
  laboca: () => import("./LaBocaSplash").then((m) => m.laBocaSplash),
};
