/**
 * Flag de sesión para el splash "Expediente Clasificado".
 * El login lo marca como pendiente y /principal lo consume una sola vez.
 */

const SPLASH_KEY = "post_login_splash_pending";

export function markSplashPending(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SPLASH_KEY, "true");
  } catch {
    // Ignorar errores en modo incógnito/restringido
  }
}

export function isSplashPending(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SPLASH_KEY) === "true";
  } catch {
    return false;
  }
}

export function clearSplashPending(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SPLASH_KEY);
  } catch {
    // Ignorar errores en SSR
  }
}

const SEEN_VARIANTS_KEY = "post_login_splash_seen";

/** Splash que este navegador ya vio en la ronda actual (en orden) */
function getSeenSplashVariants(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(SEEN_VARIANTS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Elige al azar un splash que todavía no se vio. Cuando ya se vieron todos, arranca una ronda nueva
 * evitando repetir el último. No escribe nada: el guardado lo hace markSplashVariantSeen.
 */
export function chooseSplashVariant<T extends string>(ids: readonly T[]): T {
  const seen = getSeenSplashVariants();
  const unseen = ids.filter((id) => !seen.includes(id));
  const last = seen[seen.length - 1];
  const pool = unseen.length > 0 ? unseen : ids.length > 1 ? ids.filter((id) => id !== last) : ids;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Registra que se mostró un splash; si con él ya se vieron todos, la próxima ronda empieza de cero */
export function markSplashVariantSeen(id: string, allIds: readonly string[]): void {
  const seen = getSeenSplashVariants().filter((s) => allIds.includes(s));
  const roundComplete = allIds.every((s) => seen.includes(s));
  const next = roundComplete ? [id] : seen.includes(id) ? seen : [...seen, id];
  try {
    localStorage.setItem(SEEN_VARIANTS_KEY, JSON.stringify(next));
  } catch {
    // sin acceso a storage
  }
}

/**
 * Splash pedido para esta carga de página: el id forzado por `?splash=<id>` (vista previa),
 * "random" si quedó pendiente del login, o null si no hay que mostrar nada.
 */
export function getSplashRequest(): string | null {
  if (typeof window === "undefined") return null;
  const forced = new URLSearchParams(window.location.search).get("splash");
  if (forced) return forced;
  return isSplashPending() ? "random" : null;
}
