/**
 * Utilidades de almacenamiento para el estado de visualización del informe del caso (briefing).
 * Encapsula sessionStorage con protecciones seguras contra fallos en SSR o entornos restringidos.
 */

const BRIEFING_SUFFIX = "_briefing_seen";

export function markBriefingSeen(levelId: number): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`level_${levelId}${BRIEFING_SUFFIX}`, "true");
  } catch {
    // Ignorar errores en modo incógnito/restringido
  }
}

export function clearAllBriefingSeenFlags(): void {
  if (typeof window === "undefined") return;
  try {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.endsWith(BRIEFING_SUFFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch {
    // Ignorar errores en SSR
  }
}
