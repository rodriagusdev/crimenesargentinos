"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import SeamlessBackgroundVideo from "@/components/login/SeamlessBackgroundVideo";
import { useAudioStore } from "@/stores/useAudioStore";

interface SectionData {
  id: string;
  number: string;
  tabLabel: string;
  title: string;
  render: () => ReactNode;
}

const Strong = ({ children }: { children: ReactNode }) => (
  <strong className="font-bold text-[#1f1710]">{children}</strong>
);
const Win = ({ children }: { children: ReactNode }) => (
  <span className="font-bold text-[#1b6b3e]">{children}</span>
);
const Lose = ({ children }: { children: ReactNode }) => (
  <span className="font-bold text-[#9e1c1c]">{children}</span>
);

function PolaroidCard({
  imageSrc,
  caption,
  subCaption,
  rotation = "rotate-[-1deg]",
  stamp,
  pinColor = "red",
  className = "",
}: {
  imageSrc: string;
  caption: string;
  subCaption?: string;
  rotation?: string;
  stamp?: string;
  pinColor?: "red" | "gold";
  className?: string;
}) {
  const playSfx = useAudioStore((state) => state.playSfx);

  return (
    <div
      onMouseEnter={() => {
        try {
          playSfx("opencasefile");
        } catch {}
      }}
      className={`relative p-2.5 pb-4 bg-[#faf8f5] text-zinc-900 border border-[#d6c7b2] shadow-[0_10px_24px_rgba(40,30,20,0.18)] rounded-xs select-none transition-all duration-200 hover:scale-105 hover:rotate-0 hover:z-20 hover:shadow-[0_16px_32px_rgba(40,30,20,0.28)] flex flex-col justify-between shrink-0 ${rotation} ${className}`}
    >
      {/* Top Push-pin */}
      <div
        className={`absolute -top-2 left-1/2 -translate-x-1/2 size-4 rounded-full border shadow-sm flex items-center justify-center z-20 ${
          pinColor === "gold"
            ? "bg-amber-400 border-amber-100 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
            : "bg-red-600 border-red-200 shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
        }`}
      >
        <span className="size-1 rounded-full bg-white/80" />
      </div>

      {/* Photo Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-950 border border-zinc-300 rounded-xs">
        <Image
          src={imageSrc}
          alt={caption}
          fill
          sizes="(max-width: 768px) 140px, 200px"
          className="object-cover contrast-[1.05]"
        />

        {stamp && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1">
            <span className="px-2 py-0.5 border-2 border-red-600 text-red-600 bg-red-950/20 font-serif font-black text-[10px] sm:text-xs tracking-widest uppercase rotate-[-12deg] shadow-sm [text-shadow:_0_1px_2px_rgba(255,255,255,0.85)]">
              {stamp}
            </span>
          </div>
        )}
      </div>

      {/* Caption underneath like handwritten Polaroid note */}
      <div className="pt-2 text-center">
        <div className="font-mono text-[11px] sm:text-xs font-bold text-[#2d2116] tracking-tight leading-tight uppercase">
          {caption}
        </div>
        {subCaption && (
          <div className="font-serif text-[10px] text-[#705c47] italic mt-0.5 leading-none">
            {subCaption}
          </div>
        )}
      </div>
    </div>
  );
}

function BookletCard({
  num,
  title,
  children,
}: {
  num?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative rounded border border-[#c4b395] bg-[#fdfbf5] p-3.5 sm:p-4 shadow-[0_2px_5px_rgba(40,30,20,0.06)] flex flex-col gap-1.5 transition-colors hover:border-[#9e835c]">
      <div className="flex items-center gap-2 border-b border-[#ded3be] pb-2">
        {num && (
          <span className="font-mono text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#e8deca] text-[#4a3a28] border border-[#c5b597]">
            {num}
          </span>
        )}
        <h4 className="font-serif font-bold text-xs sm:text-[14px] tracking-wide text-[#2b2117] uppercase">
          {title}
        </h4>
      </div>
      <div className="text-xs sm:text-[13px] leading-relaxed text-[#3d3124]">
        {children}
      </div>
    </div>
  );
}

function VintageTable({
  head,
  rows,
}: {
  head: [string, string];
  rows: [ReactNode, ReactNode][];
}) {
  return (
    <div className="overflow-hidden rounded border-2 border-[#b5a180] bg-[#fbf8f0] shadow-sm">
      <table className="w-full text-left text-xs sm:text-[13px]">
        <thead className="bg-[#ede2cb] text-[#3a2d1d] border-b-2 border-[#b5a180]">
          <tr>
            <th className="px-4 sm:px-5 py-2.5 font-serif font-bold tracking-wider uppercase text-[11px] sm:text-xs">
              {head[0]}
            </th>
            <th className="px-4 sm:px-5 py-2.5 font-serif font-bold tracking-wider uppercase text-[11px] sm:text-xs">
              {head[1]}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#dfd3bc]">
          {rows.map(([a, b], idx) => (
            <tr
              key={idx}
              className="hover:bg-[#f3ead6]/80 transition-colors odd:bg-transparent even:bg-[#f6efe0]/60"
            >
              <td className="px-4 sm:px-5 py-3 align-middle text-[#2d2319] font-medium">
                {a}
              </td>
              <td className="px-4 sm:px-5 py-3 align-middle text-[#3a2e22]">
                {b}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VintageCallout({
  label = "AVISO OPERATIVO",
  children,
  isDanger = false,
}: {
  label?: string;
  children: ReactNode;
  isDanger?: boolean;
}) {
  return (
    <div
      className={`relative rounded border-2 p-3.5 sm:p-4 shadow-sm ${
        isDanger
          ? "border-[#a83232] bg-[#fcf2f2] text-[#3a1515]"
          : "border-[#b59e75] bg-[#f7f1e1] text-[#3d3122]"
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-sm">{isDanger ? "⚠️" : "📌"}</span>
        <span
          className={`font-serif text-[11px] sm:text-xs font-bold tracking-widest uppercase ${
            isDanger ? "text-[#992222]" : "text-[#5e492f]"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="text-xs sm:text-[13px] leading-relaxed font-serif">
        {children}
      </div>
    </div>
  );
}

const SECTIONS: SectionData[] = [
  {
    id: "objetivo",
    number: "01",
    tabLabel: "El Objetivo",
    title: "EL OBJETIVO DE LA MISIÓN",
    render: () => (
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left main content */}
        <div className="flex-1 flex flex-col gap-3.5">
          <p className="text-xs sm:text-sm leading-relaxed text-[#2e2419] italic font-serif">
            Un sospechoso de alta peligrosidad se ha dado a la fuga por territorio argentino.
            Tu labor como detective es reconstruir su itinerario de escape antes de que el caso prescriba.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <BookletCard num="01" title="Informe de Guardia">
              Cada caso se inicia con un <Strong>informe de guardia</Strong> que contiene los primeros indicios sobre la última locación registrada y la contextura del prófugo.
            </BookletCard>

            <BookletCard num="02" title="Viajes e Interrogatorios">
              Deberás <Strong>viajar entre provincias</Strong>, interrogar testigos clave y acumular pruebas materiales y testimoniales.
            </BookletCard>

            <BookletCard num="03" title="Detención Final">
              El operativo concluye con éxito al dar con el <Strong>escondite del criminal</Strong> habiendo emitido la <Strong>orden de arresto correspondiente</Strong>.
            </BookletCard>
          </div>

          <VintageCallout label="ADVERTENCIA DE PROCEDIMIENTO" isDanger>
            Presentarse en el escondite sin orden judicial o con una orden emitida contra un inocente provocará la fuga inmediata del criminal y el fracaso definitivo del caso.
          </VintageCallout>
        </div>

        {/* Right side Polaroids */}
        <div className="hidden md:flex flex-row lg:flex-col gap-4 items-center justify-center shrink-0 w-full lg:w-48 pt-1">
          <PolaroidCard
            imageSrc="/images/suspects/level1/Cara_Gordo_Tragassi_Sospechoso.webp"
            caption="SUJETO PRÓFUGO"
            subCaption="Última foto registrada"
            rotation="rotate-[2deg]"
            stamp="BUSCADO"
            pinColor="red"
            className="w-40 sm:w-44"
          />
          <PolaroidCard
            imageSrc="/images/test_composite.webp"
            caption="RUTA INTERPROVINCIAL"
            subCaption="Itinerario de fuga"
            rotation="rotate-[-2deg]"
            pinColor="gold"
            className="w-40 sm:w-44"
          />
        </div>
      </div>
    ),
  },
  {
    id: "niveles",
    number: "02",
    tabLabel: "Niveles y Casos",
    title: "SISTEMA DE NIVELES Y ROTACIÓN",
    render: () => (
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="flex-1 flex flex-col gap-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BookletCard num="REGLA 1" title="Dificultad Escalonada">
              Comenzás en el <Strong>Nivel 1</Strong>. Cada nivel resuelto de forma exitosa desbloquea el acceso al siguiente escalafón de casos.
            </BookletCard>

            <BookletCard num="REGLA 2" title="Sorteo Aleatorio">
              Al iniciar una partida, el sistema sortea al azar un caso que aún no hayas ganado en ese nivel de dificultad.
            </BookletCard>

            <BookletCard num="REGLA 3" title="Reintentos Variados">
              Si sufrís una derrota, el próximo intento te asignará un caso diferente del mismo nivel para mantener la investigación inédita. Los casos resueltos no vuelven a aparecer en la misma vuelta.
            </BookletCard>

            <BookletCard num="REGLA 4" title="Vuelta Completa">
              Al conquistar la totalidad de los niveles, se abre una vuelta maestra con todos los casos nuevamente en sorteo.
            </BookletCard>
          </div>

          <VintageCallout label="DOCUMENTACIÓN DE CASOS">
            Cada expediente cuenta con testigos, rutas geográficas, diálogos y pistas exclusivas ambientadas en distintos puntos de la República Argentina.
          </VintageCallout>
        </div>

        <div className="hidden md:flex flex-col gap-4 items-center justify-center shrink-0 w-full lg:w-48 pt-1">
          <PolaroidCard
            imageSrc="/images/suspects/level1/Cara_Porcelana_Jr_Sospechoso.webp"
            caption="CASO ASIGNADO"
            subCaption="Rotación de expediente"
            rotation="rotate-[-1.5deg]"
            stamp="EXPEDIENTE"
            pinColor="gold"
            className="w-40 sm:w-44"
          />
        </div>
      </div>
    ),
  },
  {
    id: "recursos",
    number: "03",
    tabLabel: "Tiempo y Recursos",
    title: "TIEMPO Y PUNTOS DE INVESTIGACIÓN",
    render: () => (
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 rounded border border-[#bfae91] bg-[#f5ecda] p-3 flex items-center gap-3 shadow-xs">
            <span className="text-2xl p-2 rounded bg-[#ede0c6] border border-[#cfbe9e]">⏳</span>
            <div>
              <div className="text-[10px] font-mono text-[#665038] uppercase tracking-wider font-bold">
                RECURSO OPERATIVO
              </div>
              <div className="text-sm font-serif font-bold text-[#2d2116]">
                Horas de Tiempo
              </div>
              <div className="text-xs text-[#52412e] font-serif">
                Cada desplazamiento e interrogatorio descuenta horas del reloj.
              </div>
            </div>
          </div>

          <div className="flex-1 rounded border border-[#bfae91] bg-[#f5ecda] p-3 flex items-center gap-3 shadow-xs">
            <span className="text-2xl p-2 rounded bg-[#ede0c6] border border-[#cfbe9e]">⭐</span>
            <div>
              <div className="text-[10px] font-mono text-[#665038] uppercase tracking-wider font-bold">
                PUNTAJE DE ACCIÓN
              </div>
              <div className="text-sm font-serif font-bold text-[#2d2116]">
                Puntos de Investigación (PI)
              </div>
              <div className="text-xs text-[#52412e] font-serif">
                Recursos para viajar e indagar. ¡Preguntas con pista nueva dan +5 PI!
              </div>
            </div>
          </div>
        </div>

        <VintageTable
          head={["Acción en el Terreno", "Consumo de Recursos"]}
          rows={[
            ["Viajar a otra provincia", "Consumo alto de Tiempo y PI"],
            ["Desplazarse a locación interna", "Consumo moderado de Tiempo y PI"],
            ["Interrogar a un testigo por 1ra vez", "1 hora de tiempo y costo en PI"],
            [
              <>Pregunta que arroja una <Strong>pista nueva</Strong></>,
              <>Consume tiempo, pero <Win>¡recompensa con +5 PI!</Win></>,
            ],
            ["Repetir pregunta ya consultada", <span className="text-[#1b6b3e] font-semibold">Sin costo (0 h / 0 PI)</span>],
            ["Permanecer en provincia o punto actual", <span className="text-[#1b6b3e] font-semibold">Sin costo (0 h / 0 PI)</span>],
          ]}
        />

        <VintageCallout label="CONDICIÓN DE FRACASO" isDanger>
          Si el marcador de tiempo llega a <Lose>0 horas</Lose> o tu partida agota los <Lose>0 PI</Lose>, el operativo se suspende automáticamente por falta de recursos y se declara la derrota.
        </VintageCallout>
      </div>
    ),
  },
  {
    id: "pistas",
    number: "04",
    tabLabel: "Testigos y Pistas",
    title: "TESTIGOS, INTERROGATORIOS Y PISTAS",
    render: () => (
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="flex-1 flex flex-col gap-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BookletCard num="01" title="Testigos en cada locación">
              En cada punto de interés provincial hallarás lugareños que aportarán información testimonial sobre el fugitivo.
            </BookletCard>

            <BookletCard num="02" title="Cuaderno de Pistas">
              Toda evidencia aportada por testigos o recibida en el informe inicial se archiva de manera automática en el panel de Pistas.
            </BookletCard>

            <BookletCard num="03" title="Preguntas Desbloqueables">
              Ciertas pistas obtenidas en una región permiten formular preguntas específicas e inéditas ante testigos de otras provincias.
            </BookletCard>

            <BookletCard num="04" title="Historial de Declaraciones">
              Cada diálogo concluido queda asentado en actas y puede volver a leerse cuantas veces sea necesario sin costo operativo.
            </BookletCard>
          </div>

          <VintageCallout label="RECOMENDACIÓN TÁCTICA">
            Prestá atención a los detalles físicos: contextura corporal, estatura, rasgos faciales, vestimenta y particularidades de conducta del sospechoso.
          </VintageCallout>
        </div>

        <div className="hidden md:flex flex-col gap-4 items-center justify-center shrink-0 w-full lg:w-48 pt-1">
          <PolaroidCard
            imageSrc="/images/dialogbackground/level2/Dialogo_gaucho.webp"
            caption="TESTIGO PROVINCIAL"
            subCaption="Declaración testimonial"
            rotation="rotate-[1.5deg]"
            pinColor="red"
            className="w-40 sm:w-44"
          />
        </div>
      </div>
    ),
  },
  {
    id: "arresto",
    number: "05",
    tabLabel: "Orden de Arresto",
    title: "LA ORDEN DE ARRESTO",
    render: () => (
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="flex-1 flex flex-col gap-3.5">
          <p className="text-xs sm:text-sm text-[#2e2419] leading-relaxed font-serif">
            Para proceder a la detención legal se exige sustento probatorio fehaciente ante la fiscalía:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <BookletCard num="ART. 1" title="Requisito Indispensable">
              Se requiere un mínimo de <Strong>3 pistas obtenidas mediante interrogatorios</Strong> a testigos (las pistas del informe de guardia no computan para el aval judicial).
            </BookletCard>

            <BookletCard num="ART. 2" title="Determinación">
              Seleccioná al individuo de la nómina que coincida con la <Strong>totalidad de los indicios reunidos</Strong>.
            </BookletCard>

            <BookletCard num="ART. 3" title="Carácter Irrevocable">
              Una vez librada la orden judicial, <Strong>no puede ser anulada ni reemplazada</Strong> por otra durante el transcurso del caso.
            </BookletCard>
          </div>

          <VintageCallout label="PRECAUCIÓN JUDICIAL" isDanger>
            Cotejá detenidamente la ficha técnica de cada sospechoso antes de estampar la firma. Una orden mal dirigida conducirá a la fuga del verdadero culpable.
          </VintageCallout>
        </div>

        <div className="hidden md:flex flex-col gap-4 items-center justify-center shrink-0 w-full lg:w-48 pt-1">
          <PolaroidCard
            imageSrc="/images/suspects/level1/Cara_Sospechoso_Peque_Mafia.webp"
            caption="ORDEN JUDICIAL"
            subCaption="Firma fehaciente"
            rotation="rotate-[-2deg]"
            stamp="ORDEN DE ARRESTO"
            pinColor="gold"
            className="w-40 sm:w-44"
          />
        </div>
      </div>
    ),
  },
  {
    id: "escondite",
    number: "06",
    tabLabel: "El Escondite",
    title: "EL ESCONDITE Y DESENLACE",
    render: () => (
      <div className="flex flex-col gap-3.5">
        <p className="text-xs sm:text-sm text-[#2e2419] leading-relaxed font-serif">
          El delincuente se encuentra agazapado en el punto final de su ruta. Al arribar a dicha locación, el caso se resolverá de acuerdo a tu estado procesal:
        </p>

        <VintageTable
          head={["Situación Procesal al Arribar", "Resolución Oficial"]}
          rows={[
            ["Con orden emitida contra el culpable", <Win>Victoria: Se concreta la captura formal</Win>],
            ["Con orden librada contra otro sospechoso", <Lose>Derrota: Se detiene a un inocente y el prófugo huye</Lose>],
            ["Sin orden emitida y con menos de 3 pistas", <Lose>Derrota: Falta de mérito probatorio, el prófugo escapa</Lose>],
            [
              "Sin orden emitida pero con 3 o más pistas",
              <span className="text-[#a85e13] font-bold">Última oportunidad: Deberás librar la orden en el acto</span>,
            ],
          ]}
        />

        <VintageCallout label="COSTO DE TRASLADO FINAL">
          El desplazamiento hasta el escondite descuenta tiempo y PI. Arribar con el reloj en cero frustrará la detención antes de poder actuar.
        </VintageCallout>
      </div>
    ),
  },
  {
    id: "progreso",
    number: "07",
    tabLabel: "Tu Progreso",
    title: "REGISTRO, GUARDADO Y RANKING",
    render: () => (
      <div className="flex flex-col gap-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <BookletCard num="REGISTRO" title="Sincronización">
            Cada desplazamiento, pista y declaración se guarda automáticamente. Podés interrumpir la sesión y reanudarla con tu expediente intacto.
          </BookletCard>

          <BookletCard num="INTENTOS" title="Sin Penalización">
            En caso de no superar un caso, podés reiniciar de inmediato con un nuevo caso asignado a tu nivel de dificultad.
          </BookletCard>

          <BookletCard num="ESCALAFÓN" title="Ranking Oficial">
            Competí por el puntaje acumulado en el ranking. A igualdad de puntos, se premia al agente que resolvió los casos en menor número de partidas.
          </BookletCard>
        </div>

        {/* Vintage Access Dispatch Box */}
        <div className="mt-2 rounded border-2 border-[#9e835c] bg-gradient-to-r from-[#f0e6cf] via-[#f7f1e1] to-[#ede2ca] p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-[#3d2e1c]">
              EXPEDIENTE LISTO PARA COMENZAR
            </div>
            <div className="text-xs sm:text-[13px] text-[#52412e] font-serif mt-1">
              Iniciá sesión o registrá tu credencial de detective para asumir tu primer caso.
            </div>
          </div>
          <Link
            href="/login"
            className="shrink-0 whitespace-nowrap rounded border-2 border-[#52412d] bg-[#3a2d1e] px-6 py-2.5 text-xs sm:text-sm font-serif font-bold tracking-wider text-[#f5ebd7] shadow-md hover:bg-[#271d12] hover:scale-105 active:scale-95 transition-all"
          >
            INGRESAR AL ACCESO →
          </Link>
        </div>
      </div>
    ),
  },
];

export default function RulesBook() {
  const router = useRouter();
  const playSfx = useAudioStore((state) => state.playSfx);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const section = SECTIONS[currentPage];

  const handleSelectPage = (idx: number) => {
    if (idx === currentPage) return;
    try {
      playSfx("opencasefile");
    } catch {}
    setCurrentPage(idx);
  };

  const handleNext = () => {
    if (currentPage < SECTIONS.length - 1) {
      try {
        playSfx("click");
      } catch {}
      handleSelectPage(currentPage + 1);
    } else {
      try {
        playSfx("click");
      } catch {}
      router.push("/login");
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      try {
        playSfx("click");
      } catch {}
      handleSelectPage(currentPage - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        if (currentPage < SECTIONS.length - 1) {
          handleSelectPage(currentPage + 1);
        }
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        if (currentPage > 0) {
          handleSelectPage(currentPage - 1);
        }
      } else if (e.key === "Escape") {
        router.push("/login");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage]);

  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center p-2 sm:p-4 bg-[#0a0705] select-none font-sans">
      {/* Background Seamless Looping Video */}
      <SeamlessBackgroundVideo
        src="/videos/introvid.mp4"
        poster="/images/backgroundlogin.jpeg"
        fadeDuration={0.8}
      />

      {/* Atmospheric Dark Tabletop Overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[3px] pointer-events-none" />

      {/* Main Physical Booklet Container - widened to 92-94% width up to 1380px for generous spacing */}
      <main className="relative z-10 w-[96%] md:w-[94%] xl:w-[92%] 2xl:w-[90%] max-w-[1380px] h-[94vh] max-h-[860px] min-h-[560px] rounded-sm border-2 border-[#4a3928] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(30,20,10,0.6)] bg-[#f6efe1] flex overflow-hidden">
        
        {/* Left Book Spine (Stapled Booklet Fold Margin) */}
        <div className="w-8 sm:w-11 shrink-0 bg-[#e8deca] border-r-2 border-[#bfae92] flex flex-col justify-between items-center py-6 select-none relative shadow-[inset_-4px_0_10px_rgba(0,0,0,0.12)]">
          {/* Metallic Staples */}
          <div className="w-1.5 h-6 rounded-sm bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-600 shadow-sm border border-zinc-700/80 my-4" />
          
          <div className="[writing-mode:vertical-rl] text-[9px] font-mono tracking-widest text-[#78664f] uppercase rotate-180 opacity-60">
            PFA • MANUAL
          </div>
          
          <div className="w-1.5 h-6 rounded-sm bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-600 shadow-sm border border-zinc-700/80 my-4" />
        </div>

        {/* Right Booklet Page Area */}
        <div className="flex-1 min-h-0 flex flex-col p-3 sm:p-5 md:p-6 overflow-hidden bg-[#f7f0e2] relative">
          
          {/* Outer Vintage Double Frame */}
          <div className="flex-1 min-h-0 border-2 border-[#9e835c] p-3 sm:p-5 md:p-6 rounded-sm flex flex-col justify-between relative bg-[#faf5ea] shadow-inner">
            
            {/* Top Booklet Title Bar */}
            <header className="shrink-0 pb-3 border-b border-[#cbbca3]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="font-serif font-black text-xl sm:text-2xl md:text-3xl tracking-wide text-[#342617] uppercase leading-tight [text-shadow:_0_1px_1px_rgba(255,255,255,0.8)]">
                    CRÍMENES ARGENTINOS
                  </h1>
                  <div className="h-0.5 w-36 bg-[#9e835c] my-0.5" />
                  <div className="text-[10px] sm:text-[11px] font-serif font-bold tracking-widest text-[#665038] uppercase">
                    MANUAL DE PROCEDIMIENTO POLICIAL
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    onClick={() => {
                      try {
                        playSfx("click");
                      } catch {}
                    }}
                    className="flex items-center gap-1.5 rounded border border-[#8f744e] bg-[#ede2cb] hover:bg-[#dfd1b5] text-[#3d2e1c] px-3 py-1.5 text-xs font-serif font-bold tracking-wider transition-all shadow-xs"
                    title="Cerrar Manual (Esc)"
                  >
                    <span>✕</span>
                    <span className="hidden sm:inline">CERRAR</span>
                  </Link>
                </div>
              </div>

              {/* Publisher / Designer Metadata row */}
              <div className="mt-2.5 pt-1.5 border-t border-[#dfd4c1] flex items-center justify-between text-[11px] sm:text-xs font-serif text-[#544330]">
                <div>
                  <span className="font-semibold text-[#7d6850]">Autoridad: </span>
                  <span className="font-bold text-[#2d2217]">Policía Federal Argentina</span>
                </div>
                <div className="hidden sm:block">
                  <span className="font-semibold text-[#7d6850]">Sección: </span>
                  <span className="font-bold text-[#2d2217]">{section.title}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#7d6850]">Jurisdicción: </span>
                  <span className="font-bold text-[#2d2217]">Territorio Nacional</span>
                </div>
              </div>

              {/* Quick Section Tabs Ribbon */}
              <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {SECTIONS.map((sec, idx) => (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectPage(idx)}
                    className={`shrink-0 whitespace-nowrap px-2.5 sm:px-3 py-1 rounded text-[10px] sm:text-xs font-serif tracking-wider transition-all border ${
                      currentPage === idx
                        ? "bg-[#382b1d] text-[#f8f2e4] border-[#382b1d] font-bold shadow-xs"
                        : "bg-[#eee4cf] text-[#5a4835] border-[#cbbba2] hover:bg-[#dfd3bc]"
                    }`}
                  >
                    <span className="font-mono text-[9px] mr-1.5 opacity-80">{sec.number}</span>
                    <span>{sec.tabLabel}</span>
                  </button>
                ))}
              </div>
            </header>

            {/* Scrollable Page Body with generous spacing */}
            <div className="flex-1 min-h-0 overflow-y-auto py-3.5 pr-1 sm:pr-3 scrollbar-thin scrollbar-thumb-[#c2b093] scrollbar-track-transparent">
              {section.render()}
            </div>

            {/* Bottom Rulebook Footer */}
            <footer className="shrink-0 pt-3 border-t border-[#cbbca3] flex items-center justify-between gap-3 relative">
              {/* Left: Page Number Box */}
              <div className="flex items-center gap-2.5">
                <div className="size-8 sm:size-9 rounded border-2 border-[#8f744e] bg-[#ede0c7] flex items-center justify-center font-serif font-black text-xs sm:text-sm text-[#382b1d] shadow-inner select-none">
                  {currentPage + 1}
                </div>
                <div className="text-[11px] sm:text-xs font-serif text-[#66523c] hidden sm:block">
                  Folio {currentPage + 1} de {SECTIONS.length}
                </div>
              </div>

              {/* Center: Flip Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  className="px-3.5 py-1.5 rounded border border-[#8f744e] bg-[#eee4cf] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#e0d2b7] text-[#342617] text-xs font-serif font-bold transition-all shadow-xs"
                >
                  ← ANTERIOR
                </button>
                <button
                  onClick={handleNext}
                  className="px-4 sm:px-5 py-1.5 rounded border border-[#443323] bg-[#3a2d1f] hover:bg-[#291f14] text-[#f9f3e6] text-xs font-serif font-bold transition-all shadow-xs"
                >
                  {currentPage === SECTIONS.length - 1 ? "COMENZAR INVESTIGACIÓN" : "SIGUIENTE →"}
                </button>
              </div>

              {/* Right: Vintage Circular Rubber Stamp / Seal */}
              <div className="shrink-0 size-12 sm:size-14 rounded-full border-2 border-[#695138] bg-[#e7d8be] p-0.5 shadow-sm flex flex-col items-center justify-center text-center select-none rotate-[-4deg]">
                <div className="size-full rounded-full border border-dashed border-[#695138] flex flex-col items-center justify-center p-0.5">
                  <span className="text-[6px] sm:text-[7px] font-serif font-bold tracking-widest text-[#5c442c] uppercase">
                    POLICÍA FEDERAL
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-black tracking-wider text-[#342414] leading-tight">
                    PFA
                  </span>
                  <span className="text-[6px] sm:text-[7px] font-serif font-semibold text-[#5c442c] uppercase">
                    OFICIAL
                  </span>
                </div>
              </div>
            </footer>

          </div>
        </div>
      </main>
    </div>
  );
}
