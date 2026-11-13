import type { AdminRow } from "@/services/adminService";
import type { Locale } from "@/lib/i18n/locale";
import { defineMessages, translate } from "@/lib/i18n/messages";

// Configuración del panel de administración: una entrada por tabla de jugabilidad.
// Las pantallas son genéricas (components/admin); acá solo se describe cada tabla.
// Los textos visibles van en los dos idiomas ({ es, en }); los componentes eligen con el idioma actual

export type AdminFieldType = "text" | "textarea" | "number" | "decimal" | "boolean" | "select" | "reference";

export type AdminText = Record<Locale, string>;

const tx = (es: string, en: string): AdminText => ({ es, en });

export interface AdminField {
  name: string; // propiedad del DTO en camelCase
  label: AdminText;
  type: AdminFieldType;
  required?: boolean;
  options?: string[]; // para "select"
  reference?: string; // para "reference": key de la tabla a la que apunta
  keyPart?: boolean; // parte de una clave compuesta: no se edita después de crear
  hint?: AdminText;
  image?: boolean; // URL de una imagen: el panel ofrece ver el preview
}

// guid: el backend genera el Id | guid-client: el Id lo manda el panel | int: autoincremental | composite: sin Id
export type AdminKeyKind = "guid" | "guid-client" | "int" | "composite";

// Grupos de tablas (barra lateral e inicio del panel)
export type AdminGroup = "cases" | "map" | "dialogs" | "suspects";

export const adminGroupTitles: Record<AdminGroup, AdminText> = {
  cases: tx("Casos", "Cases"),
  map: tx("Mapa", "Map"),
  dialogs: tx("Diálogos", "Dialogs"),
  suspects: tx("Sospechosos", "Suspects"),
};

export interface AdminTable {
  key: string; // segmento de la URL: /admin/{key}
  title: AdminText;
  description: AdminText;
  group: AdminGroup;
  controller: string; // controller del backend
  keyKind: AdminKeyKind;
  keyFields?: string[]; // para "composite"
  editable?: boolean; // false: solo alta y baja (todas las columnas son clave)
  label: (row: AdminRow) => string; // cómo se muestra el registro en los selects de otras tablas
  columns: string[]; // columnas del listado
  orderBy?: string[];
  filterBy?: string; // referencia para filtrar el listado (ej. preguntas de un diálogo)
  fields: AdminField[];
}

const labelMessages = defineMessages({
  es: { dialogLabel: "{npc} (caso {caseId})" },
  en: { dialogLabel: "{npc} (case {caseId})" },
});

const str = (value: unknown) => (value === null || value === undefined ? "" : String(value));
const cut = (value: unknown, max = 60) => {
  const text = str(value);
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

// Traducción al inglés de un texto del contenido: opcional, si queda vacía el juego muestra el castellano
const EN_HINT = tx("Opcional: si queda vacío, el juego muestra el castellano.", "Optional: if left empty, the game shows the Spanish text.");

const CASE = tx("Caso", "Case");
const ORDER = tx("Orden", "Order");
const DIALOG = tx("Diálogo", "Dialog");
const DISTANCE_HINT = tx("Para calcular el tiempo de viaje según la distancia", "Used to calculate travel time from the distance");

export const adminTables: AdminTable[] = [
  // ── Casos ──────────────────────────────────────────────────────────────
  {
    key: "cases",
    title: tx("Casos", "Cases"),
    description: tx("Niveles del juego: textos, configuración inicial y costos.", "Game levels: texts, starting setup and costs."),
    group: "cases",
    controller: "Cases",
    keyKind: "int",
    label: (r) => `#${str(r.id)} ${str(r.title)}`,
    columns: ["id", "groupLevel", "title", "initialTime", "initialPI", "startLocationId"],
    orderBy: ["groupLevel", "id"],
    fields: [
      { name: "groupLevel", label: tx("Nivel", "Level"), type: "number", required: true, hint: tx("El nivel N sortea entre los casos con este valor (variaciones del mismo caso)", "Level N draws among the cases with this value (variants of the same case)") },
      { name: "title", label: tx("Título", "Title"), type: "text", required: true },
      { name: "titleEn", label: tx("Título (inglés)", "Title (English)"), type: "text", hint: EN_HINT },
      { name: "description", label: tx("Descripción", "Description"), type: "textarea", required: true },
      { name: "descriptionEn", label: tx("Descripción (inglés)", "Description (English)"), type: "textarea", hint: EN_HINT },
      { name: "imageUrl", label: tx("Imagen (URL)", "Image (URL)"), type: "text", image: true },
      { name: "videoUrl", label: tx("Video (URL)", "Video (URL)"), type: "text" },
      { name: "briefing", label: tx("Briefing", "Briefing"), type: "textarea" },
      { name: "briefingEn", label: tx("Briefing (inglés)", "Briefing (English)"), type: "textarea", hint: EN_HINT },
      { name: "initialTime", label: tx("Tiempo inicial (hs)", "Starting time (h)"), type: "number", required: true },
      { name: "initialPI", label: tx("PI iniciales", "Starting IP"), type: "number", required: true },
      { name: "startLocationId", label: tx("Locación inicial", "Starting location"), type: "reference", reference: "locations" },
      { name: "criminalLocationId", label: tx("Escondite del criminal", "Criminal's hideout"), type: "reference", reference: "locations", hint: tx("Al llegar ahí se resuelve la orden de arresto", "Arriving there resolves the arrest warrant") },
      { name: "travelProvinceTime", label: tx("Viajar a provincia: tiempo", "Travel to province: time"), type: "number", required: true },
      { name: "travelProvincePi", label: tx("Viajar a provincia: PI", "Travel to province: IP"), type: "number", required: true },
      { name: "travelLocationTime", label: tx("Ir a locación: tiempo", "Go to location: time"), type: "number", required: true },
      { name: "travelLocationPi", label: tx("Ir a locación: PI", "Go to location: IP"), type: "number", required: true },
      { name: "askQuestionTime", label: tx("Preguntar: tiempo", "Ask: time"), type: "number", required: true },
      { name: "askQuestionPi", label: tx("Preguntar: PI", "Ask: IP"), type: "number", required: true },
    ],
  },
  {
    key: "clues",
    title: tx("Pistas", "Clues"),
    description: tx("Pistas iniciales de cada caso y las que desbloquean las preguntas.", "Each case's initial clues and the ones unlocked by questions."),
    group: "cases",
    controller: "Clue",
    keyKind: "guid",
    label: (r) => cut(r.description),
    columns: ["caseId", "description", "isInitial", "sortOrder"],
    orderBy: ["caseId", "sortOrder"],
    filterBy: "caseId",
    fields: [
      { name: "caseId", label: CASE, type: "reference", reference: "cases", required: true },
      { name: "description", label: tx("Descripción", "Description"), type: "textarea", required: true },
      { name: "descriptionEn", label: tx("Descripción (inglés)", "Description (English)"), type: "textarea", hint: EN_HINT },
      { name: "isInitial", label: tx("Pista inicial", "Initial clue"), type: "boolean", hint: tx("Si no es inicial, la desbloquea una pregunta", "If it's not initial, a question unlocks it") },
      { name: "sortOrder", label: ORDER, type: "number", required: true },
    ],
  },
  {
    key: "flags",
    title: tx("Flags", "Flags"),
    description: tx("Marcas que desbloquean preguntas condicionales dentro de un caso.", "Markers that unlock conditional questions within a case."),
    group: "cases",
    controller: "Flag",
    keyKind: "guid-client",
    label: (r) => str(r.code),
    columns: ["caseId", "code"],
    orderBy: ["caseId", "code"],
    filterBy: "caseId",
    fields: [
      { name: "caseId", label: CASE, type: "reference", reference: "cases", required: true },
      { name: "code", label: tx("Código", "Code"), type: "text", required: true, hint: tx("Ej. KNOWS_GREASY_SHIRT", "E.g. KNOWS_GREASY_SHIRT") },
    ],
  },

  // ── Mapa ───────────────────────────────────────────────────────────────
  {
    key: "provinces",
    title: tx("Provincias", "Provinces"),
    description: tx("Provincias del mapa y su imagen de fondo.", "Map provinces and their background image."),
    group: "map",
    controller: "Province",
    keyKind: "guid",
    label: (r) => str(r.name),
    columns: ["name", "backgroundUrl"],
    orderBy: ["name"],
    fields: [
      { name: "name", label: tx("Nombre", "Name"), type: "text", required: true },
      { name: "backgroundUrl", label: tx("Fondo (URL)", "Background (URL)"), type: "text", image: true },
      { name: "latitude", label: tx("Latitud (punto de llegada)", "Latitude (arrival point)"), type: "decimal", hint: DISTANCE_HINT },
      { name: "longitude", label: tx("Longitud (punto de llegada)", "Longitude (arrival point)"), type: "decimal", hint: DISTANCE_HINT },
    ],
  },
  {
    key: "locations",
    title: tx("Locaciones", "Locations"),
    description: tx("Lugares de interés de cada provincia.", "Points of interest in each province."),
    group: "map",
    controller: "Location",
    keyKind: "guid",
    label: (r) => str(r.name),
    columns: ["provinceId", "name", "imageUrl"],
    orderBy: ["provinceId", "name"],
    filterBy: "provinceId",
    fields: [
      { name: "provinceId", label: tx("Provincia", "Province"), type: "reference", reference: "provinces", required: true },
      { name: "name", label: tx("Nombre", "Name"), type: "text", required: true },
      { name: "imageUrl", label: tx("Imagen (URL)", "Image (URL)"), type: "text", image: true },
      { name: "latitude", label: tx("Latitud", "Latitude"), type: "decimal", hint: DISTANCE_HINT },
      { name: "longitude", label: tx("Longitud", "Longitude"), type: "decimal", hint: DISTANCE_HINT },
    ],
  },
  {
    key: "level-locations",
    title: tx("Provincias por caso", "Provinces per case"),
    description: tx("Pins de provincia en el mapa de cada caso (posición e ícono).", "Province pins on each case's map (position and icon)."),
    group: "map",
    controller: "LevelLocation",
    keyKind: "guid",
    label: (r) => str(r.name),
    columns: ["caseId", "provinceId", "name", "top", "left"],
    orderBy: ["caseId", "name"],
    filterBy: "caseId",
    fields: [
      { name: "caseId", label: CASE, type: "reference", reference: "cases", required: true },
      { name: "provinceId", label: tx("Provincia", "Province"), type: "reference", reference: "provinces", required: true },
      { name: "name", label: tx("Nombre", "Name"), type: "text", required: true },
      { name: "top", label: tx("Posición vertical", "Vertical position"), type: "text", hint: tx("Porcentaje, ej. 44%", "Percentage, e.g. 44%") },
      { name: "left", label: tx("Posición horizontal", "Horizontal position"), type: "text", hint: tx("Porcentaje, ej. 58%", "Percentage, e.g. 58%") },
      { name: "icon", label: tx("Ícono (URL)", "Icon (URL)"), type: "text", image: true },
    ],
  },

  // ── Diálogos ───────────────────────────────────────────────────────────
  {
    key: "dialogs",
    title: tx("Diálogos", "Dialogs"),
    description: tx("NPC de cada locación en cada caso, con sus imágenes y texto del lugar.", "Each location's NPC in each case, with their images and place text."),
    group: "dialogs",
    controller: "Dialog",
    keyKind: "guid",
    label: (r) => translate(labelMessages, "dialogLabel", { npc: str(r.npcName), caseId: str(r.caseId) }),
    columns: ["caseId", "locationId", "npcName"],
    orderBy: ["caseId", "npcName"],
    filterBy: "caseId",
    fields: [
      { name: "caseId", label: CASE, type: "reference", reference: "cases", required: true },
      { name: "locationId", label: tx("Locación", "Location"), type: "reference", reference: "locations", required: true },
      { name: "npcName", label: tx("NPC", "NPC"), type: "text", required: true },
      { name: "npcNameEn", label: tx("NPC (inglés)", "NPC (English)"), type: "text", hint: EN_HINT },
      { name: "portraitUrl", label: tx("Retrato (URL)", "Portrait (URL)"), type: "text", image: true },
      { name: "overlayBackgroundUrl", label: tx("Fondo de la intro (URL)", "Intro background (URL)"), type: "text", image: true },
      { name: "npcCompleteUrl", label: tx("Escena del interrogatorio (URL)", "Interrogation scene (URL)"), type: "text", image: true },
      { name: "infoBackground", label: tx("Texto del lugar", "Place text"), type: "textarea" },
      { name: "infoBackgroundEn", label: tx("Texto del lugar (inglés)", "Place text (English)"), type: "textarea", hint: EN_HINT },
    ],
  },
  {
    key: "dialog-messages",
    title: tx("Mensajes de intro", "Intro messages"),
    description: tx("Mensajes con los que arranca cada diálogo.", "The messages each dialog opens with."),
    group: "dialogs",
    controller: "DialogMessage",
    keyKind: "guid-client",
    label: (r) => cut(r.text),
    columns: ["dialogId", "sortOrder", "speaker", "text"],
    orderBy: ["dialogId", "sortOrder"],
    filterBy: "dialogId",
    fields: [
      { name: "dialogId", label: DIALOG, type: "reference", reference: "dialogs", required: true },
      { name: "sortOrder", label: ORDER, type: "number", required: true },
      { name: "speaker", label: tx("Habla", "Speaker"), type: "select", options: ["npc", "player", "narrator"], required: true },
      { name: "text", label: tx("Texto", "Text"), type: "textarea", required: true },
      { name: "textEn", label: tx("Texto (inglés)", "Text (English)"), type: "textarea", hint: EN_HINT },
    ],
  },
  {
    key: "dialog-questions",
    title: tx("Preguntas", "Questions"),
    description: tx("Preguntas de cada diálogo, su respuesta y la pista que desbloquean.", "Each dialog's questions, their answer and the clue they unlock."),
    group: "dialogs",
    controller: "DialogQuestion",
    keyKind: "guid",
    label: (r) => str(r.code),
    columns: ["dialogId", "sortOrder", "code", "text", "unlocksClueId"],
    orderBy: ["dialogId", "sortOrder"],
    filterBy: "dialogId",
    fields: [
      { name: "dialogId", label: DIALOG, type: "reference", reference: "dialogs", required: true },
      { name: "code", label: tx("Código", "Code"), type: "text", required: true, hint: tx("Único, ej. ba_kiosco_q1", "Unique, e.g. ba_kiosco_q1") },
      { name: "sortOrder", label: ORDER, type: "number", required: true },
      { name: "text", label: tx("Pregunta", "Question"), type: "textarea", required: true },
      { name: "textEn", label: tx("Pregunta (inglés)", "Question (English)"), type: "textarea", hint: EN_HINT },
      { name: "answer", label: tx("Respuesta", "Answer"), type: "textarea", required: true },
      { name: "answerEn", label: tx("Respuesta (inglés)", "Answer (English)"), type: "textarea", hint: EN_HINT },
      { name: "unlocksClueId", label: tx("Pista que desbloquea", "Clue it unlocks"), type: "reference", reference: "clues" },
    ],
  },
  {
    key: "question-flags",
    title: tx("Flags de preguntas", "Question flags"),
    description: tx("Qué flags requiere cada pregunta para mostrarse y cuáles desbloquea.", "Which flags each question needs to show up and which it unlocks."),
    group: "dialogs",
    controller: "QuestionFlag",
    keyKind: "composite",
    keyFields: ["questionId", "flagId", "type"],
    editable: false,
    label: (r) => `${str(r.type)} ${str(r.flagId)}`,
    columns: ["questionId", "type", "flagId"],
    orderBy: ["questionId", "type"],
    filterBy: "questionId",
    fields: [
      { name: "questionId", label: tx("Pregunta", "Question"), type: "reference", reference: "dialog-questions", required: true, keyPart: true },
      { name: "type", label: tx("Tipo", "Type"), type: "select", options: ["Requires", "Unlocks"], required: true, keyPart: true, hint: tx("Requires: hace falta para verla. Unlocks: la otorga", "Requires: needed to see it. Unlocks: grants it") },
      { name: "flagId", label: tx("Flag", "Flag"), type: "reference", reference: "flags", required: true, keyPart: true },
    ],
  },

  // ── Sospechosos ────────────────────────────────────────────────────────
  {
    key: "suspects",
    title: tx("Sospechosos", "Suspects"),
    description: tx("Sospechosos que pueden aparecer en los casos.", "Suspects that can show up in cases."),
    group: "suspects",
    controller: "Suspects",
    keyKind: "guid",
    label: (r) => str(r.name),
    columns: ["name", "alias", "age", "dangerLevel"],
    orderBy: ["name"],
    fields: [
      { name: "name", label: tx("Nombre", "Name"), type: "text", required: true },
      { name: "alias", label: tx("Alias", "Alias"), type: "text" },
      { name: "age", label: tx("Edad", "Age"), type: "number" },
      { name: "height", label: tx("Altura (m)", "Height (m)"), type: "decimal" },
      { name: "eyeColor", label: tx("Color de ojos", "Eye color"), type: "text" },
      { name: "hairColor", label: tx("Color de pelo", "Hair color"), type: "text" },
      { name: "dangerLevel", label: tx("Peligrosidad", "Danger level"), type: "number" },
      { name: "imageUrl", label: tx("Imagen (URL)", "Image (URL)"), type: "text", image: true },
    ],
  },
  {
    key: "suspect-traits",
    title: tx("Rasgos de sospechosos", "Suspect traits"),
    description: tx("Descripción de cada sospechoso, rasgo por rasgo.", "Each suspect's description, trait by trait."),
    group: "suspects",
    controller: "SuspectTrait",
    keyKind: "guid-client",
    label: (r) => str(r.text),
    columns: ["suspectId", "sortOrder", "text"],
    orderBy: ["suspectId", "sortOrder"],
    filterBy: "suspectId",
    fields: [
      { name: "suspectId", label: tx("Sospechoso", "Suspect"), type: "reference", reference: "suspects", required: true },
      { name: "sortOrder", label: ORDER, type: "number", required: true },
      { name: "text", label: tx("Rasgo", "Trait"), type: "text", required: true },
      { name: "textEn", label: tx("Rasgo (inglés)", "Trait (English)"), type: "text", hint: EN_HINT },
    ],
  },
  {
    key: "case-suspects",
    title: tx("Sospechosos por caso", "Suspects per case"),
    description: tx("Qué sospechosos aparecen en cada caso y quién es el culpable.", "Which suspects appear in each case and who the culprit is."),
    group: "suspects",
    controller: "CaseSuspects",
    keyKind: "composite",
    keyFields: ["caseId", "suspectId"],
    label: (r) => `${str(r.caseId)} ${str(r.suspectId)}`,
    columns: ["caseId", "suspectId", "isGuilty", "sortOrder"],
    orderBy: ["caseId", "sortOrder"],
    filterBy: "caseId",
    fields: [
      { name: "caseId", label: CASE, type: "reference", reference: "cases", required: true, keyPart: true },
      { name: "suspectId", label: tx("Sospechoso", "Suspect"), type: "reference", reference: "suspects", required: true, keyPart: true },
      { name: "isGuilty", label: tx("Es el culpable", "Is the culprit"), type: "boolean" },
      { name: "sortOrder", label: ORDER, type: "number", required: true },
    ],
  },
];

export const adminGroups: AdminGroup[] = Array.from(new Set(adminTables.map((t) => t.group)));

export function findAdminTable(key: string): AdminTable | undefined {
  return adminTables.find((table) => table.key === key);
}

// Identificador único del registro dentro de su tabla
export function rowKey(table: AdminTable, row: AdminRow): string {
  if (table.keyKind === "composite") return (table.keyFields ?? []).map((f) => str(row[f])).join("|");
  return str(row.id);
}

// Ruta de borrado según el tipo de clave
export function deletePath(table: AdminTable, row: AdminRow): string {
  switch (table.keyKind) {
    case "int":
      return `/${table.controller}/Eliminar/id/${str(row.id)}`;
    case "composite":
      return `/${table.controller}/Eliminar/${(table.keyFields ?? []).map((f) => encodeURIComponent(str(row[f]))).join("/")}`;
    default:
      return `/${table.controller}/Eliminar/${str(row.id)}`;
  }
}
