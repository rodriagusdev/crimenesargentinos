import { NextResponse, type NextRequest } from "next/server";
import { detectLocale, isLocale, LOCALE_COOKIE, stripLocalePrefix, type Locale } from "@/lib/i18n/locale";

const ONE_YEAR = 60 * 60 * 24 * 365;

function setLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
  return response;
}

// Las páginas viven en app/[locale]/. La URL visible no lleva idioma: se reescribe /x → /{idioma}/x
// según la cookie, que la primera visita define por país (Vercel) o navegador y cambia el selector ES / EN.
// Así el layout no lee cookies() y el HTML de cada idioma se puede prerenderizar y cachear.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Un enlace con el prefijo interno (/en/reglas) se lleva a la URL limpia, fijando ese idioma
  const stripped = stripLocalePrefix(pathname);
  if (stripped !== pathname) {
    const prefix = pathname.split("/")[1] as Locale;
    return setLocaleCookie(NextResponse.redirect(new URL(`${stripped}${search}`, request.url)), prefix);
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : detectLocale(request.headers.get("x-vercel-ip-country"), request.headers.get("accept-language"));

  const target = new URL(`/${locale}${pathname === "/" ? "" : pathname}${search}`, request.url);
  const response = NextResponse.rewrite(target);
  return isLocale(cookieLocale) ? response : setLocaleCookie(response, locale);
}

export const config = {
  // Solo páginas: nada de assets, imágenes ni archivos con extensión
  // (ni rutas internas de Next: _next/* y __nextjs* del modo desarrollo)
  matcher: ["/((?!_next|__nextjs|images|videos|sounds|favicon.ico|.*\\..*).*)"],
};
