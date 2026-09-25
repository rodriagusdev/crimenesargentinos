import type { AdminRow } from "@/services/adminService";

// Configuración del panel de administración: una entrada por tabla de jugabilidad.
// Las pantallas son genéricas (components/admin); acá solo se describe cada tabla.

export type AdminFieldType = "text" | "textarea" | "number" | "decimal" | "boolean" | "select" | "reference";

export interface AdminField {
  name: string; // propiedad del DTO en camelCase
  label: string;
  type: AdminFieldType;
  required?: boolean;
  options?: string[]; // para "select"
  reference?: string; // para "reference": key de la tabla a la que apunta
  keyPart?: boolean; // parte de una clave compuesta: no se edita después de crear
  hint?: string;
}

// guid: el backend genera el Id | guid-client: el Id lo manda el panel | int: autoincremental | composite: sin Id
export type AdminKeyKind = "guid" | "guid-client" | "int" | "composite";

export interface AdminTable {
  key: string; // segmento de la URL: /admin/{key}
  title: string;
  description: string;
  group: string;
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

const str = (value: unknown) => (value === null || value === undefined ? "" : String(value));
const cut = (value: unknown, max = 60) => {
  const text = str(value);
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

export const adminTables: AdminTable[] = [
  // ── Casos ──────────────────────────────────────────────────────────────
  {
    key: "cases",
    title: "Casos",
    description: "Niveles del juego: textos, configuración inicial y costos.",
    group: "Casos",
    controller: "Cases",
    keyKind: "int",
    label: (r) => `#${str(r.id)} ${str(r.title)}`,
    columns: ["id", "title", "initialTime", "initialPI", "startLocationId"],
    orderBy: ["id"],
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea", required: true },
      { name: "imageUrl", label: "Imagen (URL)", type: "text" },
      { name: "videoUrl", label: "Video (URL)", type: "text" },
      { name: "briefing", label: "Briefing", type: "textarea" },
      { name: "initialTime", label: "Tiempo inicial (hs)", type: "number", required: true },
      { name: "initialPI", label: "PI iniciales", type: "number", required: true },
      { name: "startLocationId", label: "Locación inicial", type: "reference", reference: "locations" },
      { name: "criminalLocationId", label: "Escondite del criminal", type: "reference", reference: "locations", hint: "Al llegar ahí se resuelve la orden de arresto" },
      { name: "travelProvinceTime", label: "Viajar a provincia: tiempo", type: "number", required: true },
      { name: "travelProvincePi", label: "Viajar a provincia: PI", type: "number", required: true },
      { name: "travelLocationTime", label: "Ir a locación: tiempo", type: "number", required: true },
      { name: "travelLocationPi", label: "Ir a locación: PI", type: "number", required: true },
      { name: "askQuestionTime", label: "Preguntar: tiempo", type: "number", required: true },
      { name: "askQuestionPi", label: "Preguntar: PI", type: "number", required: true },
    ],
  },
  {
    key: "clues",
    title: "Pistas",
    description: "Pistas iniciales de cada caso y las que desbloquean las preguntas.",
    group: "Casos",
    controller: "Clue",
    keyKind: "guid",
    label: (r) => cut(r.description),
    columns: ["caseId", "description", "isInitial", "sortOrder"],
    orderBy: ["caseId", "sortOrder"],
    filterBy: "caseId",
    fields: [
      { name: "caseId", label: "Caso", type: "reference", reference: "cases", required: true },
      { name: "description", label: "Descripción", type: "textarea", required: true },
      { name: "isInitial", label: "Pista inicial", type: "boolean", hint: "Si no es inicial, la desbloquea una pregunta" },
      { name: "sortOrder", label: "Orden", type: "number", required: true },
    ],
  },
  {
    key: "flags",
    title: "Flags",
    description: "Marcas que desbloquean preguntas condicionales dentro de un caso.",
    group: "Casos",
    controller: "Flag",
    keyKind: "guid-client",
    label: (r) => str(r.code),
    columns: ["caseId", "code"],
    orderBy: ["caseId", "code"],
    filterBy: "caseId",
    fields: [
      { name: "caseId", label: "Caso", type: "reference", reference: "cases", required: true },
      { name: "code", label: "Código", type: "text", required: true, hint: "Ej. KNOWS_GREASY_SHIRT" },
    ],
  },

  // ── Mapa ───────────────────────────────────────────────────────────────
  {
    key: "provinces",
    title: "Provincias",
    description: "Provincias del mapa y su imagen de fondo.",
    group: "Mapa",
    controller: "Province",
    keyKind: "guid",
    label: (r) => str(r.name),
    columns: ["name", "backgroundUrl"],
    orderBy: ["name"],
    fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "backgroundUrl", label: "Fondo (URL)", type: "text" },
    ],
  },
  {
    key: "locations",
    title: "Locaciones",
    description: "Lugares de interés de cada provincia.",
    group: "Mapa",
    controller: "Location",
    keyKind: "guid",
    label: (r) => str(r.name),
    columns: ["provinceId", "name", "imageUrl"],
    orderBy: ["provinceId", "name"],
    filterBy: "provinceId",
    fields: [
      { name: "provinceId", label: "Provincia", type: "reference", reference: "provinces", required: true },
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "imageUrl", label: "Imagen (URL)", type: "text" },
    ],
  },
  {
    key: "level-locations",
    title: "Provincias por caso",
    description: "Pins de provincia en el mapa de cada caso (posición e ícono).",
    group: "Mapa",
    controller: "LevelLocation",
    keyKind: "guid",
    label: (r) => str(r.name),
    columns: ["caseId", "provinceId", "name", "top", "left"],
    orderBy: ["caseId", "name"],
    filterBy: "caseId",
    fields: [
      { name: "caseId", label: "Caso", type: "reference", reference: "cases", required: true },
      { name: "provinceId", label: "Provincia", type: "reference", reference: "provinces", required: true },
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "top", label: "Posición vertical", type: "text", hint: "Porcentaje, ej. 44%" },
      { name: "left", label: "Posición horizontal", type: "text", hint: "Porcentaje, ej. 58%" },
      { name: "icon", label: "Ícono (URL)", type: "text" },
    ],
  },

  // ── Diálogos ───────────────────────────────────────────────────────────
  {
    key: "dialogs",
    title: "Diálogos",
    description: "NPC de cada locación en cada caso, con sus imágenes y texto del lugar.",
    group: "Diálogos",
    controller: "Dialog",
    keyKind: "guid",
    label: (r) => `${str(r.npcName)} (caso ${str(r.caseId)})`,
    columns: ["caseId", "locationId", "npcName"],
    orderBy: ["caseId", "npcName"],
    filterBy: "caseId",
    fields: [
      { name: "caseId", label: "Caso", type: "reference", reference: "cases", required: true },
      { name: "locationId", label: "Locación", type: "reference", reference: "locations", required: true },
      { name: "npcName", label: "NPC", type: "text", required: true },
      { name: "portraitUrl", label: "Retrato (URL)", type: "text" },
      { name: "overlayBackgroundUrl", label: "Fondo de la intro (URL)", type: "text" },
      { name: "npcCompleteUrl", label: "Escena del interrogatorio (URL)", type: "text" },
      { name: "infoBackground", label: "Texto del lugar", type: "textarea" },
    ],
  },
  {
    key: "dialog-messages",
    title: "Mensajes de intro",
    description: "Mensajes con los que arranca cada diálogo.",
    group: "Diálogos",
    controller: "DialogMessage",
    keyKind: "guid-client",
    label: (r) => cut(r.text),
    columns: ["dialogId", "sortOrder", "speaker", "text"],
    orderBy: ["dialogId", "sortOrder"],
    filterBy: "dialogId",
    fields: [
      { name: "dialogId", label: "Diálogo", type: "reference", reference: "dialogs", required: true },
      { name: "sortOrder", label: "Orden", type: "number", required: true },
      { name: "speaker", label: "Habla", type: "select", options: ["npc", "player", "narrator"], required: true },
      { name: "text", label: "Texto", type: "textarea", required: true },
    ],
  },
  {
    key: "dialog-questions",
    title: "Preguntas",
    description: "Preguntas de cada diálogo, su respuesta y la pista que desbloquean.",
    group: "Diálogos",
    controller: "DialogQuestion",
    keyKind: "guid",
    label: (r) => str(r.code),
    columns: ["dialogId", "sortOrder", "code", "text", "unlocksClueId"],
    orderBy: ["dialogId", "sortOrder"],
    filterBy: "dialogId",
    fields: [
      { name: "dialogId", label: "Diálogo", type: "reference", reference: "dialogs", required: true },
      { name: "code", label: "Código", type: "text", required: true, hint: "Único, ej. ba_kiosco_q1" },
      { name: "sortOrder", label: "Orden", type: "number", required: true },
      { name: "text", label: "Pregunta", type: "textarea", required: true },
      { name: "answer", label: "Respuesta", type: "textarea", required: true },
      { name: "unlocksClueId", label: "Pista que desbloquea", type: "reference", reference: "clues" },
    ],
  },
  {
    key: "question-flags",
    title: "Flags de preguntas",
    description: "Qué flags requiere cada pregunta para mostrarse y cuáles desbloquea.",
    group: "Diálogos",
    controller: "QuestionFlag",
    keyKind: "composite",
    keyFields: ["questionId", "flagId", "type"],
    editable: false,
    label: (r) => `${str(r.type)} ${str(r.flagId)}`,
    columns: ["questionId", "type", "flagId"],
    orderBy: ["questionId", "type"],
    filterBy: "questionId",
    fields: [
      { name: "questionId", label: "Pregunta", type: "reference", reference: "dialog-questions", required: true, keyPart: true },
      { name: "type", label: "Tipo", type: "select", options: ["Requires", "Unlocks"], required: true, keyPart: true, hint: "Requires: hace falta para verla. Unlocks: la otorga" },
      { name: "flagId", label: "Flag", type: "reference", reference: "flags", required: true, keyPart: true },
    ],
  },

  // ── Sospechosos ────────────────────────────────────────────────────────
  {
    key: "suspects",
    title: "Sospechosos",
    description: "Sospechosos que pueden aparecer en los casos.",
    group: "Sospechosos",
    controller: "Suspects",
    keyKind: "guid",
    label: (r) => str(r.name),
    columns: ["name", "alias", "age", "dangerLevel"],
    orderBy: ["name"],
    fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "alias", label: "Alias", type: "text" },
      { name: "age", label: "Edad", type: "number" },
      { name: "height", label: "Altura (m)", type: "decimal" },
      { name: "eyeColor", label: "Color de ojos", type: "text" },
      { name: "hairColor", label: "Color de pelo", type: "text" },
      { name: "dangerLevel", label: "Peligrosidad", type: "number" },
      { name: "imageUrl", label: "Imagen (URL)", type: "text" },
    ],
  },
  {
    key: "suspect-traits",
    title: "Rasgos de sospechosos",
    description: "Descripción de cada sospechoso, rasgo por rasgo.",
    group: "Sospechosos",
    controller: "SuspectTrait",
    keyKind: "guid-client",
    label: (r) => str(r.text),
    columns: ["suspectId", "sortOrder", "text"],
    orderBy: ["suspectId", "sortOrder"],
    filterBy: "suspectId",
    fields: [
      { name: "suspectId", label: "Sospechoso", type: "reference", reference: "suspects", required: true },
      { name: "sortOrder", label: "Orden", type: "number", required: true },
      { name: "text", label: "Rasgo", type: "text", required: true },
    ],
  },
  {
    key: "case-suspects",
    title: "Sospechosos por caso",
    description: "Qué sospechosos aparecen en cada caso y quién es el culpable.",
    group: "Sospechosos",
    controller: "CaseSuspects",
    keyKind: "composite",
    keyFields: ["caseId", "suspectId"],
    label: (r) => `${str(r.caseId)} ${str(r.suspectId)}`,
    columns: ["caseId", "suspectId", "isGuilty", "sortOrder"],
    orderBy: ["caseId", "sortOrder"],
    filterBy: "caseId",
    fields: [
      { name: "caseId", label: "Caso", type: "reference", reference: "cases", required: true, keyPart: true },
      { name: "suspectId", label: "Sospechoso", type: "reference", reference: "suspects", required: true, keyPart: true },
      { name: "isGuilty", label: "Es el culpable", type: "boolean" },
      { name: "sortOrder", label: "Orden", type: "number", required: true },
    ],
  },
];

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
