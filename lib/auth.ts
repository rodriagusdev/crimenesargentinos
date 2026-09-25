// Lectura del token JWT guardado al iniciar sesión (sin validar la firma: eso lo hace el backend)

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

type TokenClaims = Record<string, unknown> & { exp?: number; role?: string | string[] };

export function getTokenClaims(): TokenClaims | null {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;

    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function isTokenExpired(claims: TokenClaims): boolean {
  return typeof claims.exp === "number" && claims.exp * 1000 <= Date.now();
}

export function getUserRoles(claims: TokenClaims | null = getTokenClaims()): string[] {
  if (!claims) return [];
  const roles = claims[ROLE_CLAIM] ?? claims.role;
  if (Array.isArray(roles)) return roles.map(String);
  return typeof roles === "string" ? [roles] : [];
}

export function isAdmin(claims: TokenClaims | null = getTokenClaims()): boolean {
  return getUserRoles(claims).includes("Admin");
}
