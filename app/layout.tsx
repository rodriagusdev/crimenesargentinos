import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Press_Start_2P } from "next/font/google";
import SessionExpiryWatcher from "@/components/SessionExpiryWatcher";
import SoundtrackPlayer from "@/components/audio/SoundtrackPlayer";
import GlobalAudioControl from "@/components/audio/GlobalAudioControl";
import { LocaleProvider } from "@/stores/useLocaleStore";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/locale";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

// La cookie la fija proxy.ts en la primera visita (país / navegador) y la cambia el selector ES / EN
async function requestLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

const DESCRIPTIONS: Record<Locale, string> = {
  es: "Juego de detectives: seguí la pista de los prófugos por todas las provincias de Argentina.",
  en: "Detective game: track down fugitives across every province of Argentina.",
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Crímenes Argentinos", description: DESCRIPTIONS[await requestLocale()] };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await requestLocale();

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
