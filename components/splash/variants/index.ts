import { expedienteSplash } from "./ExpedienteSplash";
import { fingerprintSplash } from "./FingerprintSplash";
import { laBocaSplash } from "./LaBocaSplash";
import { lineupSplash } from "./LineupSplash";
import { mapSplash } from "./MapSplash";
import { newspaperSplash } from "./NewspaperSplash";
import { radioSplash } from "./RadioSplash";
import { subwaySplash } from "./SubwaySplash";
import type { SplashVariant } from "./types";

// Splash disponibles después del login: se elige uno al azar entre los que todavía no se vieron
export const SPLASH_VARIANTS: Record<string, SplashVariant> = Object.fromEntries(
  [
    expedienteSplash,
    newspaperSplash,
    radioSplash,
    mapSplash,
    lineupSplash,
    subwaySplash,
    fingerprintSplash,
    laBocaSplash,
  ].map((v) => [v.id, v]),
);

export const SPLASH_VARIANT_IDS = Object.keys(SPLASH_VARIANTS);
