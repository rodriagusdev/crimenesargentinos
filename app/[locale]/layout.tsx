import type { Metadata } from "next";
import "../globals.css";
import { Press_Start_2P } from "next/font/google";
import SessionExpiryWatcher from "@/components/SessionExpiryWatcher";
import SoundtrackPlayer from "@/components/audio/SoundtrackPlayer";
import GlobalAudioControl from "@/components/audio/GlobalAudioControl";
import { LocaleProvider } from "@/stores/useLocaleStore";
import { LOCALES, localeFromParam, type Locale } from "@/lib/i18n/locale";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

// El idioma llega por la ruta: proxy.ts reescribe /x → /{cookie}/x (la cookie la fija en la primera visita
// según país / navegador, y la cambia el selector ES / EN). Sin cookies() acá, las páginas se pueden prerenderizar.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const DESCRIPTIONS: Record<Locale, string> = {
  es: "Juego de detectives: seguí la pista de los prófugos por todas las provincias de Argentina.",
  en: "Detective game: track down fugitives across every province of Argentina.",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const locale = localeFromParam((await params).locale);
  return { title: "Crímenes Argentinos", description: DESCRIPTIONS[locale] };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = localeFromParam((await params).locale);

  return (
    <html lang={locale} className={`h-full antialiased`}>
      <body className={pressStart.className}>
        <LocaleProvider initialLocale={locale}>
          <SessionExpiryWatcher />
          <SoundtrackPlayer />
          <GlobalAudioControl />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
