import type { Metadata } from "next";
import { cookies } from "next/headers";
import HomeNav from "@/components/home/HomeNav";
import TrailerHistoriasScreen from "@/components/historias/trailer/TrailerHistoriasScreen";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/locale";

const METADATA: Record<Locale, Metadata> = {
  es: {
    title: "Casos · Crímenes Argentinos",
    description: "Los casos de Crímenes Argentinos: un tráiler por caso, sin pistas. El resto del expediente se abre al jugar.",
  },
  en: {
    title: "Cases · Crímenes Argentinos",
    description: "The cases of Crímenes Argentinos: one trailer per case, no clues. The rest of the file opens when you play.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return METADATA[isLocale(value) ? value : DEFAULT_LOCALE];
}

// Página pública de presentación de los casos: la videoteca con un tráiler por caso
export default function CasosPage() {
  return (
    <>
      <HomeNav className="bg-[#070c16]" />
      <TrailerHistoriasScreen />
    </>
  );
}
