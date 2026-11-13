import { NextResponse, type NextRequest } from "next/server";
import { detectLocale, isLocale, LOCALE_COOKIE } from "@/lib/i18n/locale";

const ONE_YEAR = 60 * 60 * 24 * 365;

// La primera visita define el idioma según el país (Vercel) o el navegador; después manda la cookie,
// que también cambia el selector ES / EN
export function proxy(request: NextRequest) {
  if (isLocale(request.cookies.get(LOCALE_COOKIE)?.value)) return NextResponse.next();

  const locale = detectLocale(request.headers.get("x-vercel-ip-country"), request.headers.get("accept-language"));

  // Se agrega también al pedido para que el layout ya renderice en ese idioma
  request.cookies.set(LOCALE_COOKIE, locale);
  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
  return response;
}

export const config = {
  // Solo páginas: nada de assets, imágenes ni archivos con extensión
  matcher: ["/((?!_next/static|_next/image|images|videos|sounds|favicon.ico|.*\\..*).*)"],
};
