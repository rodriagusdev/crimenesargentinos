import type { Metadata } from "next";
import { cookies } from "next/headers";
import RulesBook from "@/components/rules/RulesBook";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/locale";

const METADATA: Record<Locale, Metadata> = {
  es: {
    title: "Cómo se juega · Crímenes Argentinos",
    description:
      "Manual de procedimientos y reglas de juego: niveles, recursos, interrogatorios, pistas y orden de arresto.",
  },
  en: {
    title: "How to play · Crímenes Argentinos",
    description: "Procedure manual and game rules: levels, resources, interrogations, clues and the arrest warrant.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return METADATA[isLocale(value) ? value : DEFAULT_LOCALE];
}

// ?desde=principal: se abrió desde la pantalla de casos, así que al cerrar vuelve ahí (si no, al login)
export default async function RulesPage({ searchParams }: PageProps<"/reglas">) {
  const { desde } = await searchParams;
  return <RulesBook returnTo={desde === "principal" ? "/principal" : "/login"} />;
}
