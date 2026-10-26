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

// Coordenadas calibradas por clave normalizada (sin tildes, minúsculas)
const PROVINCE_COORDINATES_BY_NAME: Record<string, IProvinceCoordinates> = {
  // Caso 1
  "misiones":          { top: "18%", left: "62%" },
  "cordoba":           { top: "29%", left: "45%" },
  "buenos aires":      { top: "42%", left: "54%" },

  // Caso 2
  "chaco":             { top: "14%", left: "47%" },
  "corrientes":        { top: "24%", left: "57%" },
  "tierra del fuego":  { top: "86%", left: "43%" },

  // Caso 3
  "salta":             { top: "13%", left: "43%" },
  "mendoza":           { top: "34%", left: "37%" },
  "rio negro":         { top: "52%", left: "44%" },

  // Caso 4
  "jujuy":             { top: "10%", left: "44%" },
  "neuquen":           { top: "45%", left: "37%" },
  "santa cruz":        { top: "73%", left: "39%" },

  // Caso 5
  "tucuman":           { top: "17%", left: "42%" },
  "santa fe":          { top: "27%", left: "49%" },
  "entre rios":        { top: "35%", left: "58%" },
};

// Coordenadas calibradas por ID (GUID) de la base de datos
const PROVINCE_COORDINATES_BY_ID: Record<string, IProvinceCoordinates> = {
  // Caso 1
  "01653342-9355-4d4b-b391-4de7fd955de2": { top: "42%", left: "54%" }, // Buenos Aires
  "235804f3-f074-4c22-b9d6-3fd616f85500": { top: "29%", left: "45%" }, // Córdoba
  "6e2e014c-d8f2-49aa-bf12-2474c05210bb": { top: "18%", left: "62%" }, // Misiones

  // Caso 2
  "f4c6f97c-6985-45eb-8711-ae6aeec6577d": { top: "14%", left: "47%" }, // Chaco
  "db555128-3ee4-4e5d-bcf2-1a86aec26e31": { top: "24%", left: "57%" }, // Corrientes
  "eceab6a9-3478-4c0e-b41a-81ed46ff4fa1": { top: "86%", left: "43%" }, // Tierra del Fuego

  // Caso 3
  "c9daed5d-7052-47f8-bc72-dea33bcbb152": { top: "52%", left: "44%" }, // Río Negro
  "a36af09c-7bc6-4ad9-9d14-ce0a2c7094f7": { top: "34%", left: "37%" }, // Mendoza
  "b2438304-f80c-47df-b4c4-dd4c39b6785a": { top: "13%", left: "43%" }, // Salta

  // Caso 4
  "4ae47acc-9131-4d02-92ec-bc9393fbbe4b": { top: "10%", left: "44%" }, // Jujuy
  "68526d1a-fc56-4067-8313-0f8fd472ebdd": { top: "73%", left: "39%" }, // Santa Cruz
  "3cabc223-3475-495d-aa2f-434e6a8b82c4": { top: "45%", left: "37%" }, // Neuquén

  // Caso 5
  "d6ddfb6d-77cf-4792-a778-c790eed1ec7f": { top: "35%", left: "58%" }, // Entre Ríos
  "7e8e02c0-d28b-4442-a7a2-5a4f2dfffccd": { top: "17%", left: "42%" }, // Tucumán
  "279af790-afcb-4db0-96ca-442ac67f786f": { top: "27%", left: "49%" }, // Santa Fe
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
  if (province.id && PROVINCE_COORDINATES_BY_ID[province.id.toLowerCase()]) {
    return PROVINCE_COORDINATES_BY_ID[province.id.toLowerCase()];
  }

  if (province.name) {
    const key = normalizeProvinceName(province.name);
    if (PROVINCE_COORDINATES_BY_NAME[key]) {
      return PROVINCE_COORDINATES_BY_NAME[key];
    }
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
