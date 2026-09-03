import ILevelDataProvinces from "@/models/ILevelDataProvinces";
import ILevelLocations from "@/models/ILevelLocations";
import IDialog from "@/models/IDialog";
import { levelDataConfig } from "@/data/levelDataConfig";
import { levels } from "@/data/levelLocations";
import { dialogs } from "@/data/dialogs";

/*
import { API_URL } from "../lib/api";

export async function getLevel(levelId: number): Promise<ILevel> {
  const res = await fetch(`${API_URL}/level/${levelId}/dialog`);

  if (!res.ok) {
    throw new Error("Failed to fetch level data");
  }

  return res.json();
}
*/

export async function getLevelProvinces(
  levelId: number,
): Promise<ILevelDataProvinces> {
  // SE NECESITA REGULARIZAR EL LEVELID PARA QUE SEA UN INDICE DEL ARRAY
  // (EMPIEZA EN 0, PERO LOS NIVELES EMPIEZAN DESDE EL 1)
  const regularize = levelId - 1;

  console.log(regularize);

  const data = levelDataConfig[regularize];

  if (!data) {
    throw new Error(`Data for level ${levelId} not found`);
  }

  return data;
}

export async function getLevelLocations(
  levelId: number,
): Promise<ILevelLocations> {
  // SE NECESITA REGULARIZAR EL LEVELID PARA QUE SEA UN INDICE DEL ARRAY
  // (EMPIEZA EN 0, PERO LOS NIVELES EMPIEZAN DESDE EL 1)
  const regularize = levelId - 1;

  const data = levels[regularize];

  if (!data) {
    throw new Error(`Data for level ${levelId} not found`);
  }

  return data;
}

export async function getDialogs(): Promise<IDialog[]> {
  // SIMULO PETICION
  const data = dialogs;

  if (!data) {
    throw new Error(`Dialogs not found`);
  }

  return data;
}
