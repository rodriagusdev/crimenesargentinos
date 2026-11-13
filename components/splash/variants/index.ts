import { expedienteSplash } from "./ExpedienteSplash";
import { lineupSplash } from "./LineupSplash";
import { mapSplash } from "./MapSplash";
import { newspaperSplash } from "./NewspaperSplash";
import { radioSplash } from "./RadioSplash";
import { subwaySplash } from "./SubwaySplash";
import type { SplashVariant } from "./types";

// Splash disponibles después del login: se elige uno al azar sin repetir el anterior
export const SPLASH_VARIANTS: Record<string, SplashVariant> = Object.fromEntries(
  [expedienteSplash, newspaperSplash, radioSplash, mapSplash, lineupSplash, subwaySplash].map((v) => [v.id, v]),
);

export const SPLASH_VARIANT_IDS = Object.keys(SPLASH_VARIANTS);
