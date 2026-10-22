// Gestor de progreso de casos completados en el cliente (localStorage)
const STORAGE_KEY = "crimenes_completed_cases";

export function getCompletedCases(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(Number).filter((n) => !isNaN(n)) : [];
  } catch {
    return [];
  }
}

export function markCaseCompleted(caseId: number): void {
  if (typeof window === "undefined" || !caseId) return;
  try {
    const current = getCompletedCases();
    if (!current.includes(caseId)) {
      current.push(caseId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
  } catch (e) {
    console.error("Error al guardar caso completado:", e);
  }
}

export function isCaseCompleted(caseId: number): boolean {
  return getCompletedCases().includes(caseId);
}
