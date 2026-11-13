import { API_URL, authHeaders, handleUnauthorized } from "@/lib/api";
import type { CaseDraft, CaseDraftCheck } from "@/models/ICaseDraft";

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

async function post<T>(path: string, draft: CaseDraft): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(toRequest(draft)),
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
  return post<CaseDraftCheck>("/api/CaseAuthoring/check", draft);
}

// Crea el caso completo en una sola transacción
export function createCaseFromDraft(draft: CaseDraft): Promise<{ id: number; initialTime: number }> {
  return post("/api/CaseAuthoring", draft);
}
