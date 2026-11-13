import ILevelDataProvinces from "@/models/ILevelDataProvinces";
import ILevelLocations from "@/models/ILevelLocations";
import IDialog from "@/models/IDialog";
import { IGameData } from "@/models/IGameData";
import { API_URL, authHeaders, handleUnauthorized } from "@/lib/api";
import { resolveSuspectImage } from "@/lib/suspectImages";
import { getCalibratedProvinceCoordinates } from "@/lib/mapCalibration";
import { introForScene } from "@/lib/locationIntros";
import { resolveImageUrl } from "@/lib/imageUrls";
import { defineMessages, translate } from "@/lib/i18n/messages";
import { readLocaleCookie } from "@/lib/i18n/localeStorage";

const messages = defineMessages({
  es: {
    gameDataNotFound: "No se encontraron los datos del nivel {id}",
    gameDataFailed: "No se pudieron cargar los datos del juego",
    levelNotFound: "No se encontraron datos del nivel {id}",
    provincesFailed: "No se pudieron cargar las provincias del nivel",
    provinceNotFound: "No se encontraron datos de la provincia {id}",
    locationsFailed: "No se pudieron cargar las locaciones de la provincia",
    dialogNotFound: "No se encontró el diálogo de la locación {id}",
    dialogFailed: "No se pudo cargar el diálogo",
  },
  en: {
    gameDataNotFound: "Game data for level {id} not found",
    gameDataFailed: "Failed to fetch game data",
    levelNotFound: "Data for level {id} not found",
    provincesFailed: "Failed to fetch level provinces",
    provinceNotFound: "Data for province {id} not found",
    locationsFailed: "Failed to fetch province locations",
    dialogNotFound: "Dialog for location {id} not found",
    dialogFailed: "Failed to fetch dialog",
  },
});

async function fetchFromApi<T>(path: string, notFoundMessage: string, failMessage: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: authHeaders(),
  });

  handleUnauthorized(response);
  if (response.status === 404) {
    throw new Error(notFoundMessage);
  }

  if (!response.ok) {
    throw new Error(`${failMessage}: ${response.statusText}`);
  }

  return response.json();
}

// In-memory caches to prevent redundant network calls across components
const gameDataCache = new Map<number, IGameData>();
const inFlightGameData = new Map<number, Promise<IGameData>>();

const provincesCache = new Map<number, ILevelDataProvinces>();
const inFlightProvinces = new Map<number, Promise<ILevelDataProvinces>>();

const locationsCache = new Map<string, ILevelLocations>();
const inFlightLocations = new Map<string, Promise<ILevelLocations>>();

const dialogCache = new Map<string, IDialog>();
const inFlightDialog = new Map<string, Promise<IDialog>>();

// La API devuelve los textos en el idioma del jugador: si lo cambia, lo cacheado ya no sirve
let cacheLocale = readLocaleCookie();
function ensureCacheLocale(): void {
  const locale = readLocaleCookie();
  if (locale === cacheLocale) return;
  cacheLocale = locale;
  clearLevelCache();
}

/**
 * Clears cached level data. If levelId is passed, clears only that level.
 */
export function clearLevelCache(levelId?: number): void {
  if (levelId !== undefined) {
    gameDataCache.delete(levelId);
    inFlightGameData.delete(levelId);
    provincesCache.delete(levelId);
    inFlightProvinces.delete(levelId);
    for (const key of dialogCache.keys()) {
      if (key.startsWith(`${levelId}_`)) {
        dialogCache.delete(key);
        inFlightDialog.delete(key);
      }
    }
  } else {
    gameDataCache.clear();
    inFlightGameData.clear();
    provincesCache.clear();
    inFlightProvinces.clear();
    locationsCache.clear();
    inFlightLocations.clear();
    dialogCache.clear();
    inFlightDialog.clear();
  }
}

export async function getGameData(levelId: number): Promise<IGameData> {
  ensureCacheLocale();
  const cached = gameDataCache.get(levelId);
  if (cached) {
    return cached;
  }

  const inFlight = inFlightGameData.get(levelId);
  if (inFlight) {
    return inFlight;
  }

  const promise = fetchFromApi<IGameData>(
    `/api/Levels/${levelId}/game-data`,
    translate(messages, "gameDataNotFound", { id: levelId }),
    translate(messages, "gameDataFailed"),
  )
    .then((data) => {
      if (data?.suspects && Array.isArray(data.suspects)) {
        data.suspects = data.suspects.map((s) => ({
          ...s,
          image: resolveSuspectImage(s.name, s.image),
        }));
      }
      gameDataCache.set(levelId, data);
      return data;
    })
    .finally(() => {
      inFlightGameData.delete(levelId);
    });

  inFlightGameData.set(levelId, promise);
  return promise;
}

export async function getLevelProvinces(
  levelId: number,
): Promise<ILevelDataProvinces> {
  ensureCacheLocale();
  const cached = provincesCache.get(levelId);
  if (cached) {
    return cached;
  }

  const inFlight = inFlightProvinces.get(levelId);
  if (inFlight) {
    return inFlight;
  }

  const promise = fetchFromApi<ILevelDataProvinces>(
    `/LevelLocation/GetByCaseId/${levelId}`,
    translate(messages, "levelNotFound", { id: levelId }),
    translate(messages, "provincesFailed"),
  )
    .then((data) => {
      if (data?.provinces && Array.isArray(data.provinces)) {
        data.provinces = data.provinces.map((p) => {
          const cal = getCalibratedProvinceCoordinates(p);
          return {
            ...p,
            top: cal.top,
            left: cal.left,
          };
        });
      }
      provincesCache.set(levelId, data);
      return data;
    })
    .finally(() => {
      inFlightProvinces.delete(levelId);
    });

  inFlightProvinces.set(levelId, promise);
  return promise;
}

export async function getLevelLocations(
  provinceId: string,
): Promise<ILevelLocations> {
  ensureCacheLocale();
  const cached = locationsCache.get(provinceId);
  if (cached) {
    return cached;
  }

  const inFlight = inFlightLocations.get(provinceId);
  if (inFlight) {
    return inFlight;
  }

  const promise = fetchFromApi<ILevelLocations>(
    `/Province/GetWithLocations/${provinceId}`,
    translate(messages, "provinceNotFound", { id: provinceId }),
    translate(messages, "locationsFailed"),
  )
    .then((data) => {
      if (data?.locations && Array.isArray(data.locations)) {
        data.locations = data.locations.map((loc) => ({
          ...loc,
          imageUrl: resolveImageUrl(loc.imageUrl),
        }));
      }
      locationsCache.set(provinceId, data);
      return data;
    })
    .finally(() => {
      inFlightLocations.delete(provinceId);
    });

  inFlightLocations.set(provinceId, promise);
  return promise;
}

// La foto de cada locación viene de la provincia y es compartida entre casos (ej. Buenos Aires
// en los casos 1 y 18), así que se usa la escena del testigo del caso cuando existe.
export async function getCaseLocations(
  levelId: number,
  provinceId: string,
): Promise<ILevelLocations> {
  const data = await getLevelLocations(provinceId);
  const scenes = await Promise.all(
    data.locations.map((loc) =>
      getDialog(levelId, loc.id)
        .then((dialog) => dialog?.npcCompleteUrl || null)
        .catch(() => null),
    ),
  );
  return {
    ...data,
    locations: data.locations.map((loc, i) => ({ ...loc, imageUrl: scenes[i] ?? loc.imageUrl })),
  };
}

export async function getDialog(
  levelId: number,
  locationId: string,
): Promise<IDialog> {
  ensureCacheLocale();
  const cacheKey = `${levelId}_${locationId}`;
  const cached = dialogCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const inFlight = inFlightDialog.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  const promise = fetchFromApi<IDialog>(
    `/Dialog/GetByLocation/${levelId}/${locationId}`,
    translate(messages, "dialogNotFound", { id: locationId }),
    translate(messages, "dialogFailed"),
  )
    .then((data) => {
      if (data) {
        data.overlayBackgroundUrl = resolveImageUrl(data.overlayBackgroundUrl);
        data.npcCompleteUrl = resolveImageUrl(data.npcCompleteUrl);
      }
      const intro = introForScene(data?.npcCompleteUrl);
      if (intro) {
        data.overlayBackgroundUrl = intro;
      }
      dialogCache.set(cacheKey, data);
      return data;
    })
    .finally(() => {
      inFlightDialog.delete(cacheKey);
    });

  inFlightDialog.set(cacheKey, promise);
  return promise;
}
