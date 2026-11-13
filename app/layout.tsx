import type { Metadata } from "next";
import "./globals.css";
import { Press_Start_2P } from "next/font/google";
import SessionExpiryWatcher from "@/components/SessionExpiryWatcher";
import SoundtrackPlayer from "@/components/audio/SoundtrackPlayer";
import GlobalAudioControl from "@/components/audio/GlobalAudioControl";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crímenes Argentinos",
  description: "Juego de detectives: seguí la pista de los prófugos por todas las provincias de Argentina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`h-full antialiased`}>
      <body className={pressStart.className}>
        <SessionExpiryWatcher />
        <SoundtrackPlayer />
        <GlobalAudioControl />
        {children}
      </body>
    </html>
  );
}
