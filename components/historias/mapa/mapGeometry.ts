import { CASE_STORIES, type CaseStory } from "@/lib/caseStories";
import { getCalibratedProvinceCoordinates, projectLatLonToMap, TACTICAL_MONITOR_BOUNDS } from "@/lib/mapCalibration";

// Recorte del monitor táctico que se muestra: solo la franja donde está dibujado el país (todo el alto)
const VIEW = { leftPct: 26, widthPct: 48 };

const IMG_W = 1155;
const IMG_H = 644;
const b = TACTICAL_MONITOR_BOUNDS;

/** Proporción del recorte (ancho / alto) en píxeles de la imagen original */
export const VIEW_ASPECT = ((VIEW.widthPct / 100) * (b.widthPct / 100) * IMG_W) / ((b.heightPct / 100) * IMG_H);

// Dónde va la imagen completa de la sala, en % del recorte, para que el recorte quede encuadrado
const frameWidthInImage = (VIEW.widthPct / 100) * (b.widthPct / 100);
const frameLeftInImage = b.leftPct / 100 + (VIEW.leftPct / 100) * (b.widthPct / 100);
export const ROOM_IMAGE_BOX = {
  width: `${100 / frameWidthInImage}%`,
  left: `${(-frameLeftInImage / frameWidthInImage) * 100}%`,
  height: `${10000 / b.heightPct}%`,
  top: `${(-b.topPct / b.heightPct) * 100}%`,
};

// La tabla de calibración no tiene la Ciudad: se proyecta su lat/lon con la misma fórmula del mapa
const EXTRA_COORDINATES: Record<string, { top: string; left: string }> = {
  "Ciudad de Buenos Aires": projectLatLonToMap(-34.6, -58.4),
};

export type ProvincePin = {
  province: string;
  /** % relativos al recorte */
  top: number;
  left: number;
  cases: CaseStory[];
};

// Un pin por provincia de inicio (si dos casos arrancan en la misma, el pin queda doble)
export const PROVINCE_PINS: ProvincePin[] = Object.values(
  CASE_STORIES.reduce<Record<string, ProvincePin>>((acc, story) => {
    const pin = acc[story.province];
    if (pin) {
      pin.cases.push(story);
      return acc;
    }
    const coords = EXTRA_COORDINATES[story.province] ?? getCalibratedProvinceCoordinates({ name: story.province });
    acc[story.province] = {
      province: story.province,
      top: parseFloat(coords.top),
      left: ((parseFloat(coords.left) - VIEW.leftPct) / VIEW.widthPct) * 100,
      cases: [story],
    };
    return acc;
  }, {}),
);
