import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";
import { localeFromParam, type Locale } from "@/lib/i18n/locale";

const METADATA: Record<Locale, Metadata> = {
  es: {
    title: "Acerca de · Crímenes Argentinos",
    description: "Conocé el proyecto colaborativo detrás de Crímenes Argentinos.",
  },
  en: {
    title: "About Us · Crímenes Argentinos",
    description: "Learn about the collaborative project behind Crímenes Argentinos.",
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/acerda-de">): Promise<Metadata> {
  return METADATA[localeFromParam((await params).locale)];
}

export default async function AcercaDePage({ searchParams }: PageProps<"/[locale]/acerda-de">) {
  const { desde } = await searchParams;
  return <AboutPage returnTo={desde === "principal" ? "/principal" : "/login"} />;
}
