"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { msUntilTokenExpires, PUBLIC_PATHS, redirectToLogin } from "@/lib/auth";

// Límite de setTimeout (~24 días): más allá, el navegador lo dispara de inmediato
const MAX_TIMEOUT = 2 ** 31 - 1;

// En las pantallas que requieren sesión, manda al login cuando vence el token (aunque no se haga nada)
export default function SessionExpiryWatcher() {
  const pathname = usePathname();

  useEffect(() => {
    if (PUBLIC_PATHS.includes(pathname)) return;

    const check = () => {
      const hasToken = Boolean(localStorage.getItem("auth_token"));
      const remaining = msUntilTokenExpires();
      if (!hasToken || (remaining !== null && remaining <= 0)) {
        redirectToLogin();
        return null;
      }
      return remaining;
    };

    const remaining = check();
    const timeout = remaining === null ? undefined : setTimeout(check, Math.min(remaining + 500, MAX_TIMEOUT));

    // Los temporizadores de pestañas en segundo plano se demoran: se revisa al volver
    const onVisible = () => document.visibilityState === "visible" && check();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
    };
  }, [pathname]);

  return null;
}
