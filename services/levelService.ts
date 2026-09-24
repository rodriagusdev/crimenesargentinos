import ILevelDataProvinces from "@/models/ILevelDataProvinces";
import ILevelLocations from "@/models/ILevelLocations";
import IDialog from "@/models/IDialog";
import { IGameData } from "@/models/IGameData";
import { API_URL, authHeaders } from "@/lib/api";

async function fetchFromApi<T>(path: string, notFoundMessage: string, failMessage: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (response.status === 404) {
    throw new Error(notFoundMessage);
  }

  if (!response.ok) {
    throw new Error(`${failMessage}: ${response.statusText}`);
  }

  return response.json();
}

export async function getGameData(levelId: number): Promise<IGameData> {
  return fetchFromApi<IGameData>(
    `/api/Levels/${levelId}/game-data`,
    `Game data for level ${levelId} not found`,
    "Failed to fetch game data",
  );
}

export async function getLevelProvinces(
  levelId: number,
): Promise<ILevelDataProvinces> {
  return fetchFromApi<ILevelDataProvinces>(
    `/LevelLocation/GetByCaseId/${levelId}`,
    `Data for level ${levelId} not found`,
    "Failed to fetch level provinces",
  );
}

export async function getLevelLocations(
  provinceId: string,
): Promise<ILevelLocations> {
  return fetchFromApi<ILevelLocations>(
    `/Province/GetWithLocations/${provinceId}`,
    `Data for province ${provinceId} not found`,
    "Failed to fetch province locations",
  );
}

export async function getDialog(
  levelId: number,
  locationId: string,
): Promise<IDialog> {
  return fetchFromApi<IDialog>(
    `/Dialog/GetByLocation/${levelId}/${locationId}`,
    `Dialog for location ${locationId} not found`,
    "Failed to fetch dialog",
  );
}
