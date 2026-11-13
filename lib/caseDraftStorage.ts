import type { CaseDraft } from "@/models/ICaseDraft";

// Borrador del asistente de casos en este navegador, para no perder lo cargado si se cierra la pestaña
const STORAGE_KEY = "admin_case_draft_v1";

export interface StoredCaseDraft {
  draft: CaseDraft;
  step: number;
}

export function loadCaseDraft(): StoredCaseDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCaseDraft;
    return parsed?.draft ? parsed : null;
  } catch {
    return null;
  }
}

export function saveCaseDraft(value: StoredCaseDraft): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // sin acceso a storage: el borrador solo vive en memoria
  }
}

export function clearCaseDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // sin acceso a storage
  }
}
