"use client";

import Image from "next/image";
import Leaderboard from "@/components/panel-leaderboard/Leaderboard";
import Levels from "@/components/panel-levels/Levels";
import PlayerPanel from "@/components/panel-player/PlayerPanel";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";

const messages = defineMessages({
  es: { backgroundAlt: "Central de Investigaciones Policiales", loading: "Accediendo a la Central de Investigaciones..." },
  en: { backgroundAlt: "Police Investigations Headquarters", loading: "Accessing Investigations HQ..." },
});

export default function Principal() {
  const { isAuthenticated, loading } = useAuth();
  const t = useT(messages);

  if (loading) {
    return (
      <div className="relative min-h-svh w-full flex items-center justify-center bg-[#070c16] font-mono select-none overflow-hidden">
        {/* Fondo táctico tenue de la sala de detectives */}
        <Image
          src="/images/principal_background.webp"
          alt={t("backgroundAlt")}
          fill
          priority
          className="object-cover object-center opacity-30 blur-xs pointer-events-none select-none"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#070c16]/85 pointer-events-none" />

        {/* Indicador de acceso al cuartel */}
        <div className="relative z-10 flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#0c1421]/95 border border-amber-400/40 text-[#FFF3C7] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
          <span className="size-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs sm:text-sm tracking-widest uppercase font-bold">
            {t("loading")}
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El hook useAuth redirige automáticamente a /login
  }

  return (
    <div className="relative min-h-svh w-full overflow-x-hidden select-none bg-[#070c16]">
      {/* ========================================================================= */}
      {/* FONDO AMBIENTAL: SALA CENTRAL DE INVESTIGACIÓN POLICIAL (z-0)              */}
      {/* Ilustración dedicada de la comisaría porteña con tratamiento táctico retro */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Ilustración de la oficina de investigaciones */}
        <Image
          src="/images/principal_background.webp"
          alt={t("backgroundAlt")}
          fill
          priority
          className="object-cover object-center pointer-events-none select-none"
          sizes="100vw"
        />



        {/* Viñeta radial profunda que centra la atención en los casos activos */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(8,14,24,0.4)_0%,_#03060c_90%)]" />

        {/* Resplandor ámbar superior proyectado sobre el encabezado de casos */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-52 bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent blur-3xl" />

        {/* Sombra de apoyo en la base */}
        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-[#03060c] via-[#03060c]/60 to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* CONTENIDO PRINCIPAL: DISTRIBUCIÓN DE PANELES DE INVESTIGACIÓN (z-10)       */}
      {/* ========================================================================= */}
      <div className="relative z-10 min-h-svh p-4 pb-20 md:p-6 md:pb-6 xl:p-8 xl:pb-8">
        <div className="mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
          {/* PANEL IZQUIERDO / COLUMNA 1 TABLET: FICHA POLICIAL Y CERRAR SESIÓN */}
          <aside className="order-1 md:order-1 xl:order-1 md:col-span-1 xl:col-span-1">
            <PlayerPanel />
          </aside>

          {/* PANEL DERECHO / COLUMNA 2 TABLET: RANKING DE AGENTES */}
          <aside className="order-3 md:order-2 xl:order-3 md:col-span-1 xl:col-span-1">
            <Leaderboard />
          </aside>

          {/* NIVELES / ANCHO COMPLETO EN TABLET: EXPEDIENTES DISPONIBLES */}
          <main className="order-2 md:order-3 xl:order-2 md:col-span-2 xl:col-span-1">
            <Levels />
          </main>
        </div>
      </div>
    </div>
  );
}

