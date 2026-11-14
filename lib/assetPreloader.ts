// Centralized Hierarchical Asset Preloader for Crímenes Argentinos
// Implements Case-level and City/Province-level asset staging (Hierarchical Preloading Pattern)

import { getImageProps } from "next/image";
import { getGameData, getCaseLocations, getLevelProvinces, getDialog } from "@/services/levelService";
import { resolveSuspectImage } from "./suspectImages";
import { ISuspect } from "@/models/ISuspect";

// `sizes` de los <Image fill> que muestran cada asset: el preload tiene que pedir exactamente
// la misma URL que next/image (/_next/image?url=…&w=… en producción, la URL cruda en desarrollo)
export const IMAGE_SIZES = {
  /** LocationIntro: escena a pantalla completa */
  fullscreen: "100vw",
  /** ProvinceMapFrame y DialogBox: cuadro enmarcado de la escena / mapa */
  sceneFrame: "(max-width: 1200px) 100vw, 60vw",
  /** LocationPolaroidCard */
  polaroid: "(max-width: 640px) 50vw, (max-width: 768px) 100vw, (max-width: 1200px) 50vw, 240px",
  /** InvestigationBoard: retratos de sospechosos */
  suspect: "(max-width: 640px) 45vw, 200px",
  /** LevelMenu: íconos de acciones */
  menuIcon: "48px",
  /** CaseDossierModal: ícono de orden de arresto */
  dossierIcon: "80px",
} as const;

// URL ya pedida (o en curso) → promesa de su descarga. Evita pedir dos veces lo mismo.
const preloads = new Map<string, Promise<void>>();

/**
 * Precarga una imagen tal como la va a pedir next/image con `fill` y el `sizes` dado.
 * Se usa un <img> desconectado con el mismo srcset/sizes: el navegador elige el mismo candidato
 * que el <Image> real, y no deja avisos de "preload sin usar" en consola.
 */
export function preloadImage(url: string | null | undefined, sizes: string): Promise<void> {
  if (!url || typeof window === "undefined") return Promise.resolve();
  const cleanUrl = url.trim();
  if (!cleanUrl) return Promise.resolve();

  const key = `${cleanUrl}|${sizes}`;
  const existing = preloads.get(key);
  if (existing) return existing;

  let src = cleanUrl;
  let srcSet: string | undefined;
  try {
    const { props } = getImageProps({ src: cleanUrl, alt: "", fill: true, sizes });
    src = props.src;
    srcSet = props.srcSet;
  } catch {
    // Host no permitido u otra URL que next/image no sabe optimizar: se usa la cruda
  }

  const promise = new Promise<void>((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    // Una imagen faltante no debe romper la precarga
    img.onerror = () => resolve();
    if (srcSet) {
      img.sizes = sizes;
      img.srcset = srcSet;
    }
    img.src = src;
  });
  preloads.set(key, promise);
  return promise;
}

function preloadImages(urls: (string | null | undefined)[], sizes: string): Promise<void[]> {
  return Promise.all(urls.filter(Boolean).map((url) => preloadImage(url, sizes)));
}

export interface PreloadOptions {
  /** false: solo se traen los datos (JSON), sin imágenes. Ej.: hover. */
  images?: boolean;
}

/**
 * 1. CASE LEVEL PRELOAD
 * When a player starts or resumes a case:
 * - Preload suspect portraits and the investigation menu icons
 * - Preload case briefing & game data
 * - Preload level provinces list
 */
export async function preloadCasePackage(levelId: number, suspects?: ISuspect[]): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const promises: Promise<unknown>[] = [
      preloadImage("/images/icons/icon_clues.jpg", IMAGE_SIZES.menuIcon),
      preloadImage("/images/icons/icon_arrestorder.jpg", IMAGE_SIZES.dossierIcon),
      getGameData(levelId).catch(() => null),
      getLevelProvinces(levelId).catch(() => null),
    ];

    if (suspects && suspects.length > 0) {
      const suspectImages = suspects.map((s) => resolveSuspectImage(s.name, s.image));
      promises.push(preloadImages(suspectImages, IMAGE_SIZES.suspect));
    }

    await Promise.all(promises);
  } catch (err) {
    console.warn("[AssetPreloader] Error in preloadCasePackage:", err);
  }
}

/**
 * 2. PROVINCE / CITY LEVEL PRELOAD ("El Truco del Avión")
 * Executed during the flight cutscene (images) or on province hover (data only):
 * - Fetch the province locations + the case scene of each one (same data the province screen uses, cached)
 * - Preload the province map frame and each location polaroid (the case scene image)
 */
export async function preloadProvincePackage(
  levelId: number,
  provinceId: string,
  { images = true }: PreloadOptions = {},
): Promise<void> {
  if (typeof window === "undefined" || !provinceId) return;

  try {
    const data = await getCaseLocations(levelId, provinceId);
    if (!images || !data) return;

    await Promise.all([
      preloadImage(data.backgroundUrl, IMAGE_SIZES.sceneFrame),
      preloadImages(data.locations?.map((loc) => loc.imageUrl) ?? [], IMAGE_SIZES.polaroid),
    ]);
  } catch (err) {
    console.warn(`[AssetPreloader] Error in preloadProvincePackage (${provinceId}):`, err);
  }
}

export interface LocationPreloadOptions extends PreloadOptions {
  /** Intro ya vista: se va directo al interrogatorio (DialogBox) en vez de LocationIntro */
  introSeen?: boolean;
}

/**
 * 3. LOCATION / SCENE LEVEL PRELOAD ("El Truco del Patrullero")
 * Executed during the car cutscene (images) or on location hover (data only):
 * - Fetch dialog for that specific location (cached in memory)
 * - Preload the first image the location screen shows: the intro scene (LocationIntro)
 *   or, if the intro was already seen, the framed scene of the interrogation (DialogBox)
 */
export async function preloadLocationPackage(
  levelId: number,
  provinceId: string,
  locationId: string,
  { images = true, introSeen = false }: LocationPreloadOptions = {},
): Promise<void> {
  if (typeof window === "undefined" || !locationId) return;

  try {
    const dialog = await getDialog(levelId, locationId);
    if (!images || !dialog) return;

    if (introSeen) {
      await preloadImage(dialog.npcCompleteUrl, IMAGE_SIZES.sceneFrame);
    } else {
      await preloadImage(dialog.overlayBackgroundUrl || dialog.npcCompleteUrl, IMAGE_SIZES.fullscreen);
    }
  } catch (err) {
    console.warn(`[AssetPreloader] Error in preloadLocationPackage (${provinceId}/${locationId}):`, err);
  }
}
