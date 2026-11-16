import type { Metadata } from "next";
import RulesBook from "@/components/rules/RulesBook";
import { localeFromParam, type Locale } from "@/lib/i18n/locale";

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

export async function generateMetadata({ params }: PageProps<"/[locale]/reglas">): Promise<Metadata> {
  return METADATA[localeFromParam((await params).locale)];
}

// ?desde=principal: se abrió desde la pantalla de casos, así que al cerrar vuelve ahí (si no, al login)
export default async function RulesPage({ searchParams }: PageProps<"/[locale]/reglas">) {
  const { desde } = await searchParams;
  return <RulesBook returnTo={desde === "principal" ? "/principal" : "/login"} />;
}
