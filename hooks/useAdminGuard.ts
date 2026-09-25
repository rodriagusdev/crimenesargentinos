import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTokenClaims, isAdmin, isTokenExpired } from "@/lib/auth";

// El panel solo se muestra a administradores: sin sesión (o vencida) va al login, un jugador vuelve al menú
export function useAdminGuard() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const claims = getTokenClaims();

    if (!claims || isTokenExpired(claims)) {
      router.replace("/login");
    } else if (!isAdmin(claims)) {
      router.replace("/principal");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- el token solo existe en el navegador
      setAllowed(true);
    }
  }, [router]);

  return allowed;
}
