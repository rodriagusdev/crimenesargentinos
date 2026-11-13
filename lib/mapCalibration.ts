/**
 * Calibración geográfica de las coordenadas (top, left) de cada provincia
 * sobre el monitor táctico de la sala de detectives (test_composite.webp).
 *
 * El contenedor del monitor táctico en app/level/[levelId]/page.tsx tiene:
 * left: 19.186%, top: 6.510%, width: 61.773%, height: 74.219%
 *
 * Las coordenadas a continuación son porcentajes relativos al monitor táctico,
 * ajustadas milimétricamente al relieve y silueta de Argentina en dicha imagen.
 */

export interface IProvinceCoordinates {
  top: string;
  left: string;
}

// Bounding box del monitor táctico relativo a la pantalla completa
export const TACTICAL_MONITOR_BOUNDS = {
  leftPct: 19.186,
  topPct: 6.510,
  widthPct: 61.773,
  heightPct: 74.219,
};

// Coordenadas sacadas de un punto interior de cada provincia (lat/lon) proyectado sobre el dibujo del mapa:
// top = 4.5 + 2.59 × (−lat − 22), left = 45 + 1.8 × (lon + 65.6), ajustado con La Quiaca, la punta de
// Misiones y la costa de Buenos Aires. Se usa un punto interior (no la capital) para que el pin no caiga en el agua.
const PROVINCE_COORDINATES_BY_NAME: Record<string, IProvinceCoordinates> = {
  "jujuy":               { top: "7.9%",  left: "44.6%" },
  "salta":               { top: "11%",   left: "46.4%" },
  "formosa":             { top: "12.3%", left: "55.1%" },
  "chaco":               { top: "16.2%", left: "53.6%" },
  "misiones":            { top: "16.9%", left: "64.8%" },
  "tucuman":             { top: "17.4%", left: "45.5%" },
  "santiago del estero": { top: "19.5%", left: "49.1%" },
  "catamarca":           { top: "18.2%", left: "42.5%" },
  "corrientes":          { top: "21.9%", left: "59%" },
  "la rioja":            { top: "24.4%", left: "42.1%" },
  "santa fe":            { top: "27%",   left: "53.5%" },
  "san juan":            { top: "27%",   left: "41%" },
  "cordoba":             { top: "29.4%", left: "48.2%" },
  "entre rios":          { top: "30.4%", left: "56.5%" },
  "san luis":            { top: "35.1%", left: "44.3%" },
  "mendoza":             { top: "36.4%", left: "40.7%" },
  "buenos aires":        { top: "42.1%", left: "55.1%" },
  "la pampa":            { top: "43.3%", left: "45.2%" },
  "neuquen":             { top: "47.5%", left: "38.3%" },
  "rio negro":           { top: "51.1%", left: "43.4%" },
  "chubut":              { top: "61%",   left: "39.8%" },
  "santa cruz":          { top: "73.9%", left: "37.4%" },
  "tierra del fuego":    { top: "88.2%", left: "41.2%" },
};

// Ids de la base → nombre de la tabla de arriba (las coordenadas guardadas en LevelLocations son viejas)
const PROVINCE_NAME_BY_ID: Record<string, string> = {
  "01653342-9355-4d4b-b391-4de7fd955de2": "buenos aires",
  "235804f3-f074-4c22-b9d6-3fd616f85500": "cordoba",
  "6e2e014c-d8f2-49aa-bf12-2474c05210bb": "misiones",
  "f4c6f97c-6985-45eb-8711-ae6aeec6577d": "chaco",
  "db555128-3ee4-4e5d-bcf2-1a86aec26e31": "corrientes",
  "eceab6a9-3478-4c0e-b41a-81ed46ff4fa1": "tierra del fuego",
  "c9daed5d-7052-47f8-bc72-dea33bcbb152": "rio negro",
  "a36af09c-7bc6-4ad9-9d14-ce0a2c7094f7": "mendoza",
  "b2438304-f80c-47df-b4c4-dd4c39b6785a": "salta",
  "4ae47acc-9131-4d02-92ec-bc9393fbbe4b": "jujuy",
  "68526d1a-fc56-4067-8313-0f8fd472ebdd": "santa cruz",
  "3cabc223-3475-495d-aa2f-434e6a8b82c4": "neuquen",
  "d6ddfb6d-77cf-4792-a778-c790eed1ec7f": "entre rios",
  "7e8e02c0-d28b-4442-a7a2-5a4f2dfffccd": "tucuman",
  "279af790-afcb-4db0-96ca-442ac67f786f": "santa fe",
  "ac889e85-0343-561d-8ee0-9909f8bd2df7": "san juan",
  "6b4f1a9e-0d65-5a62-916b-2c57ad5adb8c": "san luis",
  "b99237a6-e55e-54fe-93bf-06e2d8fcde96": "la pampa",
  "87678a3d-095a-5d04-bcd7-f4688e1d1835": "santiago del estero",
  "73649cb7-1a35-5e22-bf18-ec3f0408940a": "catamarca",
  "d6ae2133-6458-5910-b0ea-ad0c26a35398": "la rioja",
  "b51b7efb-b5fc-5381-93b9-ecd94af9dfdd": "chubut",
  "0e42d54b-b0ef-5da5-9f07-b720a116a1d2": "formosa",
};

/**
 * Normaliza el nombre de una provincia para búsquedas sin diacríticos ni mayúsculas.
 */
export function normalizeProvinceName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Obtiene las coordenadas calibradas de una provincia según su id o nombre.
 * Si no está registrada en la tabla de calibración, utiliza las coordenadas provistas como fallback.
 */
export function getCalibratedProvinceCoordinates(province: {
  id?: string;
  name?: string;
  top?: string;
  left?: string;
}): IProvinceCoordinates {
  const key =
    (province.id && PROVINCE_NAME_BY_ID[province.id.toLowerCase()]) ||
    (province.name && normalizeProvinceName(province.name));
  if (key && PROVINCE_COORDINATES_BY_NAME[key]) {
    return PROVINCE_COORDINATES_BY_NAME[key];
  }

  return {
    top: province.top ?? "50%",
    left: province.left ?? "50%",
  };
}

/**
 * Convierte coordenadas relativas al monitor táctico en coordenadas relativas
 * a la ventana completa (viewport 100vw x 100vh) para animaciones globales
 * como el vuelo de aviones (TravelAnimationOverlay).
 */
export function monitorCoordToScreen(coord?: { top?: string; left?: string } | null): {
  top: string;
  left: string;
} | undefined {
  if (!coord?.left || !coord?.top) return undefined;
  const leftNum = parseFloat(coord.left);
  const topNum = parseFloat(coord.top);
  if (isNaN(leftNum) || isNaN(topNum)) return undefined;

  const screenLeft =
    TACTICAL_MONITOR_BOUNDS.leftPct +
    (leftNum / 100) * TACTICAL_MONITOR_BOUNDS.widthPct;
  const screenTop =
    TACTICAL_MONITOR_BOUNDS.topPct +
    (topNum / 100) * TACTICAL_MONITOR_BOUNDS.heightPct;

  return {
    left: `${screenLeft.toFixed(3)}%`,
    top: `${screenTop.toFixed(3)}%`,
  };
}
