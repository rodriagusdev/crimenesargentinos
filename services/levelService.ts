import ILevelDataProvinces from "@/models/ILevelDataProvinces";
import ILevelLocations from "@/models/ILevelLocations";
import IDialog from "@/models/IDialog";
import { IGameData } from "@/models/IGameData";
import { API_URL, authHeaders, handleUnauthorized } from "@/lib/api";
import { resolveSuspectImage } from "@/lib/suspectImages";

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
    `Game data for level ${levelId} not found`,
    "Failed to fetch game data",
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
    `Data for level ${levelId} not found`,
    "Failed to fetch level provinces",
  )
    .then((data) => {
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
    `Data for province ${provinceId} not found`,
    "Failed to fetch province locations",
  )
    .then((data) => {
      if (data?.locations && Array.isArray(data.locations)) {
        data.locations = data.locations.map((loc) => ({
          ...loc,
          imageUrl: loc.imageUrl?.includes("/dialogbackground/")
            ? loc.imageUrl.replace(/\.jpe?g$/i, ".webp")
            : loc.imageUrl,
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

export async function getDialog(
  levelId: number,
  locationId: string,
): Promise<IDialog> {
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
    `Dialog for location ${locationId} not found`,
    "Failed to fetch dialog",
  )
    .then((data) => {
      if (data?.overlayBackgroundUrl?.includes("/dialogbackground/")) {
        data.overlayBackgroundUrl = data.overlayBackgroundUrl.replace(/\.jpe?g$/i, ".webp");
      }
      if (data?.npcCompleteUrl?.includes("/dialogbackground/")) {
        data.npcCompleteUrl = data.npcCompleteUrl.replace(/\.jpe?g$/i, ".webp");
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
