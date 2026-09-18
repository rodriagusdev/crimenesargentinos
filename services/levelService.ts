import ILevelDataProvinces from "@/models/ILevelDataProvinces";
import ILevelLocations from "@/models/ILevelLocations";
import IDialog from "@/models/IDialog";
import IInfoPerLevel from "@/models/IInfoPerLevel";
import { levelDataConfig } from "@/data/levelDataConfig";
import { levels } from "@/data/levelLocations";
import { dialogs } from "@/data/dialogs";
import { infoPerLevel } from "@/data/infoPerLevel";

export async function getInfoPerLevel(levelId: number): Promise<IInfoPerLevel> {
  const data = infoPerLevel.find((item) => item.id === levelId) ?? infoPerLevel[levelId - 1];

  if (!data) {
    throw new Error(`Data for level ${levelId} not found`);
  }

  return data;
}

export async function getLevelProvinces(
  levelId: number,
): Promise<ILevelDataProvinces> {
  const data = levelDataConfig.find((item) => item.id === levelId) ?? levelDataConfig[levelId - 1];

  if (!data) {
    throw new Error(`Data for level ${levelId} not found`);
  }

  return data;
}

export async function getLevelLocations(
  provinceId: number,
): Promise<ILevelLocations> {
  const data = levels.find((item) => item.id === provinceId) ?? levels[provinceId - 1];

  if (!data) {
    throw new Error(`Data for province ${provinceId} not found`);
  }

  return data;
}

export async function getDialogs(): Promise<IDialog[]> {
  const data = dialogs;

  if (!data) {
    throw new Error(`Dialogs not found`);
  }

  return data;
}
