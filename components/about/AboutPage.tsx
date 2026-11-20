"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/hooks/useT";
import { useAudioStore } from "@/stores/useAudioStore";
import { defineMessages } from "@/lib/i18n/messages";
import SeamlessBackgroundVideo from "@/components/login/SeamlessBackgroundVideo";
import AboutMemberCard from "./AboutMemberCard";

const messages = defineMessages({
  es: {
    home: "← INICIO",
    title: "ACERCA DE",
    introStart: "Crímenes Argentinos comenzó como un proyecto académico inspirado en ",
    introEnd:
      ", concebido como una reinterpretación ambientada en la Argentina y ampliada con nuevas mecánicas y la impronta propia del equipo. Su desarrollo fue íntegramente colaborativo: todos participamos en las distintas etapas del proyecto —desde la arquitectura, los datos y la creación de casos hasta la interfaz, el diseño y las pruebas—, consolidando una propuesta con identidad local.",
    logoAlt: "Crímenes Argentinos",
  },
  en: {
    home: "← HOME",
    title: "ABOUT US",
    introStart: "Crímenes Argentinos began as an academic project inspired by ",
    introEnd:
      ", conceived as a reimagining set in Argentina and expanded with new mechanics and our team's own imprint. Development was thoroughly collaborative: everyone contributed across all stages of the project—from architecture, data, and case design to interface, visual craft, and testing—resulting in an experience with a distinct local identity.",
    logoAlt: "Crímenes Argentinos",
  },
});

const MEMBERS = [
  { name: "Santiago Fernández Espinosa", image: "/images/about/santiago-fernandez-espinosa.webp", width: 1360, height: 1157 },
  { name: "Rodrigo Cisterna", image: "/images/about/rodrigo-cisterna.webp", width: 1856, height: 2272 },
  { name: "Natalia Távora", image: "/images/about/natalia-tavora.webp", width: 1200, height: 896 },
  { name: "Agustina Barbaresi", image: "/images/about/agustina-barbaresi.webp", width: 788, height: 895 },
  { name: "Abigail Álvarez", image: "/images/about/abigail-alvarez.webp", width: 944, height: 1135 },
];

export default function AboutPage({ returnTo = "/login" }: { returnTo?: string }) {
  const t = useT(messages);
  const playSfx = useAudioStore((state) => state.playSfx);

  return (
    <div className="relative min-h-svh w-full overflow-x-hidden bg-black font-sans text-[#FFF3C7]">
      <SeamlessBackgroundVideo
        src="/videos/introvid.mp4"
        poster="/images/principal_background.webp"
        fadeDuration={0.8}
      />
      <div className="pointer-events-none absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

      <Link
        href={returnTo}
        onClick={() => playSfx("click")}
        className="fixed left-4 top-4 z-20 rounded-xl border border-[#FFF3C7]/25 bg-[#070c16]/70 px-4 py-3 text-[10px] tracking-widest text-[#FFF3C7]/85 hover:border-[#E1C380] hover:text-[#E1C380] sm:left-6 sm:top-6"
      >
        {t("home")}
      </Link>

      <main className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-8 sm:py-28">
        <section className="rounded-2xl border border-[#E1C380]/40 bg-[#0c1421]/85 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.75)] backdrop-blur-md sm:p-8 md:p-10">
          <header className="mb-6 flex items-center justify-center gap-4 border-b border-[#E1C380]/25 pb-5">
            <Image
              src="/images/logofinal.png"
              alt={t("logoAlt")}
              width={160}
              height={160}
              className="size-28 object-contain sm:size-32"
            />
            <h1 className="text-center text-base leading-relaxed tracking-widest text-[#E1C380] [text-shadow:0_2px_0_#1E2A36,0_0_10px_rgba(0,0,0,.8)] sm:text-xl">
              {t("title")}
            </h1>
          </header>

          <p className="text-[10px] leading-7 text-[#FFF3C7]/90 sm:text-xs sm:leading-8">
            {t("introStart")}
            <em>Carmen Sandiego</em>
            {t("introEnd")}
          </p>

          <div className="mt-8 flex flex-col gap-6">
            {MEMBERS.map((member) => (
              <AboutMemberCard
                key={member.image}
                image={member.image}
                name={member.name}
                width={member.width}
                height={member.height}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
