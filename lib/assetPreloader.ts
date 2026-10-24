// Centralized Hierarchical Asset Preloader for Crímenes Argentinos
// Implements Case-level and City/Province-level asset staging (Hierarchical Preloading Pattern)

import { getGameData, getLevelLocations, getLevelProvinces, getDialog } from "@/services/levelService";
import { resolveSuspectImage } from "./suspectImages";
import { ISuspect } from "@/models/ISuspect";

const preloadedUrls = new Set<string>();

/**
 * Preload a single image into the browser's disk / HTTP memory cache.
 * Resolves safely on load or error without blocking execution.
 */
export function preloadImage(url: string | null | undefined): Promise<void> {
  if (!url || typeof window === "undefined") {
    return Promise.resolve();
  }

  const cleanUrl = url.trim();
  if (!cleanUrl || preloadedUrls.has(cleanUrl)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      preloadedUrls.add(cleanUrl);
      if ("decode" in img && typeof img.decode === "function") {
        img.decode().then(resolve).catch(resolve);
      } else {
        resolve();
      }
    };
    img.onerror = () => {
      // Don't fail the preloader if an image is missing
      preloadedUrls.add(cleanUrl);
      resolve();
    };
    img.src = cleanUrl;
  });
}

/**
 * Preload an array of image URLs concurrently.
 */
export function preloadImages(urls: (string | null | undefined)[]): Promise<void[]> {
  const filtered = urls.filter(Boolean) as string[];
  return Promise.all(filtered.map(preloadImage));
}

/**
 * 1. CASE LEVEL PRELOAD
 * When a player starts or resumes a case:
 * - Preload suspect portraits
 * - Preload national base map
 * - Preload case briefing & game data
 * - Preload level provinces list
 */
export async function preloadCasePackage(levelId: number, suspects?: ISuspect[]): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const promises: Promise<unknown>[] = [
      // 1. National map base
      preloadImage("/images/test_map.jpg"),
      // 2. Core UI icons
      preloadImages([
        "/images/icons/icon_clues.jpg",
        "/images/icons/icon_suspects.jpg",
        "/images/icons/icon_arrestorder.jpg",
      ]),
      // 3. Game data & provinces
      getGameData(levelId).catch(() => null),
      getLevelProvinces(levelId).catch(() => null),
    ];

    // 4. Suspect portraits
    if (suspects && suspects.length > 0) {
      const suspectImages = suspects
        .map((s) => resolveSuspectImage(s.name, s.image))
        .filter(Boolean) as string[];
      promises.push(preloadImages(suspectImages));
    }

    await Promise.all(promises);
  } catch (err) {
    console.warn("[AssetPreloader] Error in preloadCasePackage:", err);
  }
}

/**
 * 2. PROVINCE / CITY LEVEL PRELOAD ("El Truco del Avión")
 * Executed during the 1.6s flight cutscene or on province hover:
 * - Preload destination province map background (data.backgroundUrl)
 * - Fetch province locations data (stored in levelService in-memory cache)
 * - Preload all location icons of that province
 */
export async function preloadProvincePackage(
  provinceId: string,
  extraMapUrl?: string,
): Promise<void> {
  if (typeof window === "undefined" || !provinceId) return;

  try {
    const promises: Promise<unknown>[] = [];

    if (extraMapUrl) {
      promises.push(preloadImage(extraMapUrl));
    }

    // Fetch locations for destination province (caches in memory)
    const locationsPromise = getLevelLocations(provinceId)
      .then(async (data) => {
        const nested: Promise<unknown>[] = [];
        if (data?.backgroundUrl) {
          nested.push(preloadImage(data.backgroundUrl));
        }
        if (data?.locations && Array.isArray(data.locations)) {
          const locationImages = data.locations
            .map((loc) => loc.imageUrl)
            .filter(Boolean);
          nested.push(preloadImages(locationImages));
        }
        await Promise.all(nested);
      })
      .catch(() => null);

    promises.push(locationsPromise);
    await Promise.all(promises);
  } catch (err) {
    console.warn(`[AssetPreloader] Error in preloadProvincePackage (${provinceId}):`, err);
  }
}

/**
 * 3. LOCATION / SCENE LEVEL PRELOAD ("El Truco del Patrullero")
 * Executed during the 1.4s car cutscene or on location button hover:
 * - Fetch dialog for that specific location (cached in memory)
 * - Preload the witness / crime scene background image (dialog.overlayBackgroundUrl)
 */
export async function preloadLocationPackage(
  levelId: number,
  provinceId: string,
  locationId: string,
): Promise<void> {
  if (typeof window === "undefined" || !locationId) return;

  try {
    // Fetch dialog data ahead of arrival
    await getDialog(levelId, locationId)
      .then((dialog) => {
        if (dialog?.overlayBackgroundUrl) {
          return preloadImage(dialog.overlayBackgroundUrl);
        }
      })
      .catch(() => null);
  } catch (err) {
    console.warn(`[AssetPreloader] Error in preloadLocationPackage (${locationId}):`, err);
  }
}
