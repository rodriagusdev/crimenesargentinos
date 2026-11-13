import { API_URL, authHeaders, handleUnauthorized } from "@/lib/api";
import { defineMessages, translate } from "@/lib/i18n/messages";

const messages = defineMessages({
  es: {
    sessionExpired: "La sesión venció. Volvé a iniciar sesión.",
    notAdmin: "No tenés permisos de administrador.",
    noSession: "No hay una sesión iniciada.",
  },
  en: {
    sessionExpired: "Your session expired. Log in again.",
    notAdmin: "You don't have admin permissions.",
    noSession: "You're not logged in.",
  },
});

export type AdminRow = Record<string, unknown>;

// Error de la API con el código HTTP y un mensaje para mostrar en el panel
export class AdminApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body?.error === "string") return body.error;
    if (typeof body?.message === "string") return body.message;

    // Validación de ASP.NET: { title, errors: { Campo: ["mensaje"] } }
    if (body?.errors && typeof body.errors === "object") {
      return Object.values(body.errors as Record<string, string[]>).flat().join(" ");
    }
    if (typeof body?.title === "string") return body.title;
  } catch {
    // respuesta sin cuerpo JSON
  }

  if (response.status === 401) return translate(messages, "sessionExpired");
  if (response.status === 403) return translate(messages, "notAdmin");
  return response.statusText || `Error ${response.status}`;
}

async function request<T>(method: "GET" | "POST" | "PUT" | "DELETE", path: string, body?: unknown): Promise<T> {
  let headers: HeadersInit;
  try {
    headers = authHeaders();
  } catch {
    throw new AdminApiError(401, translate(messages, "noSession"));
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  handleUnauthorized(response);
  if (!response.ok) {
    throw new AdminApiError(response.status, await readErrorMessage(response));
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// CRUD genérico del backend (solo administradores): /{controller}/GetAll, /Agregar, /Actualizar, /Eliminar
export function listRows(controller: string): Promise<AdminRow[]> {
  return request("GET", `/${controller}/GetAll`);
}

export function createRow(controller: string, row: AdminRow): Promise<unknown> {
  return request("POST", `/${controller}/Agregar`, row);
}

export function updateRow(controller: string, row: AdminRow): Promise<unknown> {
  return request("PUT", `/${controller}/Actualizar`, row);
}

// La ruta de borrado depende del tipo de clave de la tabla (ver lib/adminTables.ts)
export function deleteRow(path: string): Promise<unknown> {
  return request("DELETE", path);
}
