import { API_URL, authHeaders, handleUnauthorized } from "@/lib/api";
import type { CaseDraft, CaseDraftCheck, CaseDraftLoaded } from "@/models/ICaseDraft";

// El backend rechazó el caso: errores para corregir antes de crearlo
export class CaseDraftRejectedError extends Error {
  errors: string[];

  constructor(message: string, errors: string[]) {
    super(message);
    this.name = "CaseDraftRejectedError";
    this.errors = errors;
  }
}

// En el escondite solo la primera pregunta lleva respuestas de encontrarlo/perderlo; el resto, respuesta normal
export function toRequest(draft: CaseDraft): CaseDraft {
  return {
    ...draft,
    dialogs: draft.dialogs.map((dialog) => {
      const isHideout = dialog.locationId === draft.criminalLocationId;
      return {
        ...dialog,
        questions: dialog.questions.map((q, i) =>
          isHideout && i === 0
            ? { ...q, answer: "" }
            : { ...q, foundAnswer: null, lostAnswer: null }
        ),
      };
    }),
  };
}

async function send<T>(method: "GET" | "POST" | "PUT", path: string, draft?: CaseDraft): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: authHeaders(),
    body: draft ? JSON.stringify(toRequest(draft)) : undefined,
  });
  handleUnauthorized(response);

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const errors: string[] = Array.isArray(body?.errors) ? body.errors : [];
    throw new CaseDraftRejectedError(body?.error ?? `Error ${response.status}`, errors);
  }
  return body as T;
}

// Valida el borrador y calcula el tiempo inicial (recorrido óptimo + 2/3 de las preguntas), sin guardar
export function checkCaseDraft(draft: CaseDraft): Promise<CaseDraftCheck> {
  return send<CaseDraftCheck>("POST", "/api/CaseAuthoring/check", draft);
}

// Caso existente con todo lo suyo, para editarlo en el asistente
export function loadCaseForEdit(caseId: number): Promise<CaseDraftLoaded> {
  return send<CaseDraftLoaded>("GET", `/api/CaseAuthoring/${caseId}`);
}

// Crea el caso (si es nuevo) o guarda los cambios (si tiene id), todo en una transacción
export function submitCaseDraft(draft: CaseDraft): Promise<{ id: number; initialTime: number }> {
  return draft.id == null
    ? send("POST", "/api/CaseAuthoring", draft)
    : send("PUT", `/api/CaseAuthoring/${draft.id}`, draft);
}
