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

// Milisegundos que le quedan al token (null si no hay token o no tiene vencimiento)
export function msUntilTokenExpires(claims: TokenClaims | null = getTokenClaims()): number | null {
  if (!claims || typeof claims.exp !== "number") return null;
  return claims.exp * 1000 - Date.now();
}

// Pantallas que se ven sin sesión
export const PUBLIC_PATHS = ["/", "/login", "/reglas"];

// Sesión vencida o inválida: se borra el token y se vuelve al login (navegación completa para limpiar el estado)
export function redirectToLogin() {
  try {
    localStorage.removeItem("auth_token");
  } catch {
    // sin acceso a localStorage
  }

  if (typeof window !== "undefined" && !PUBLIC_PATHS.includes(window.location.pathname)) {
    window.location.replace("/login");
  }
}

export function getUserRoles(claims: TokenClaims | null = getTokenClaims()): string[] {
  if (!claims) return [];
  const roles = claims[ROLE_CLAIM] ?? claims.role;
  if (Array.isArray(roles)) return roles.map(String);
  return typeof roles === "string" ? [roles] : [];
}

// Nombre y email del usuario logueado (claims estándar de .NET o sus nombres cortos)
export function getUserIdentity(claims: TokenClaims | null = getTokenClaims()): { name: string; email: string } {
  const pick = (...keys: string[]) => {
    for (const key of keys) {
      const value = claims?.[key];
      if (typeof value === "string" && value) return value;
    }
    return "";
  };

  return {
    name: pick("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name", "unique_name", "sub"),
    email: pick("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress", "email"),
  };
}

export function isAdmin(claims: TokenClaims | null = getTokenClaims()): boolean {
  return getUserRoles(claims).includes("Admin");
}
