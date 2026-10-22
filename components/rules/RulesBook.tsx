"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  <strong className="font-semibold text-[#FFF3C7]">{children}</strong>
);
const Win = ({ children }: { children: ReactNode }) => (
  <span className="font-semibold text-emerald-400">{children}</span>
);
const Lose = ({ children }: { children: ReactNode }) => (
  <span className="font-semibold text-rose-400">{children}</span>
);

function BulletItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-xs leading-relaxed text-[#FFF3C7]/90">
      <span className="shrink-0 text-[10px] mt-1 text-[#E1C380]" aria-hidden="true">
        ▪
      </span>
      <div>{children}</div>
    </li>
  );
}

function MiniTable({
  head,
  rows,
}: {
  head: [string, string];
  rows: [ReactNode, ReactNode][];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E1C380]/20 bg-[rgba(10,16,24,0.45)]">
      <table className="w-full text-left text-xs">
        <thead className="bg-[#1e2a36]/80 text-[#E1C380] border-b border-[#E1C380]/20">
          <tr>
            <th className="px-3 py-1.5 font-semibold tracking-wider uppercase text-[10px]">
              {head[0]}
            </th>
            <th className="px-3 py-1.5 font-semibold tracking-wider uppercase text-[10px]">
              {head[1]}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E1C380]/10">
          {rows.map(([a, b], idx) => (
            <tr
              key={idx}
              className="hover:bg-white/[0.02] transition-colors"
            >
              <td className="px-3 py-1.5 align-middle text-[#FFF3C7]">
                {a}
              </td>
              <td className="px-3 py-1.5 align-middle text-[#FFF3C7]/85">
                {b}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({
  label = "AVISO OPERATIVO",
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-[#E1C380]/25 bg-[#E1C380]/10 px-3 py-1.5 text-xs text-[#FFF3C7] shadow-inner">
      <span className="text-[9px] font-bold tracking-widest text-[#E1C380] uppercase">
        {label}
      </span>
      <div className="leading-snug text-[#FFF3C7]/90 text-xs">{children}</div>
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
      <div className="flex flex-col gap-3">
        <p className="text-xs leading-relaxed text-[#FFF3C7]/90">
          Un sospechoso de alta peligrosidad se ha dado a la fuga por territorio argentino.
          Tu labor como detective es reconstruir su itinerario de escape antes de que el caso prescriba.
        </p>

        <ul className="flex flex-col gap-2 text-xs">
          <BulletItem>
            Cada caso se inicia con un <Strong>informe de guardia</Strong> que contiene los primeros indicios sobre la última locación registrada y la contextura del prófugo.
          </BulletItem>
          <BulletItem>
            Deberás <Strong>viajar entre provincias</Strong>, interrogar testigos clave y acumular pruebas materiales y testimoniales.
          </BulletItem>
          <BulletItem>
            El operativo concluye con éxito al dar con el <Strong>escondite del criminal</Strong> habiendo emitido la <Strong>orden de arresto correspondiente</Strong>.
          </BulletItem>
        </ul>

        <Callout label="ADVERTENCIA DE PROCEDIMIENTO">
          Presentarse en el escondite sin orden judicial o con una orden emitida contra un inocente provocará la fuga inmediata del criminal y el fracaso definitivo del caso.
        </Callout>
      </div>
    ),
  },
  {
    id: "niveles",
    number: "02",
    tabLabel: "Niveles y Casos",
    title: "SISTEMA DE NIVELES Y ROTACIÓN",
    render: () => (
      <div className="flex flex-col gap-3">
        <ul className="flex flex-col gap-2 text-xs">
          <BulletItem>
            <Strong>Dificultad escalonada</Strong>: Comenzás en el Nivel 1. Cada nivel resuelto de forma exitosa desbloquea el acceso al siguiente escalafón de casos.
          </BulletItem>
          <BulletItem>
            <Strong>Sorteo aleatorio</Strong>: Al iniciar una partida, el sistema sortea al azar un caso que aún no hayas ganado en ese nivel de dificultad.
          </BulletItem>
          <BulletItem>
            <Strong>Reintentos variados</Strong>: Si sufrís una derrota, el próximo intento te asignará un caso diferente del mismo nivel para mantener la investigación inédita. Los casos resueltos no vuelven a aparecer en la misma vuelta.
          </BulletItem>
          <BulletItem>
            <Strong>Vuelta completa</Strong>: Al conquistar la totalidad de los niveles, se abre una vuelta maestra con todos los casos nuevamente en sorteo.
          </BulletItem>
        </ul>

        <Callout label="DOCUMENTACIÓN DE CASOS">
          Cada expediente cuenta con testigos, rutas geográficas, diálogos y pistas exclusivas ambientadas en distintos puntos de la República Argentina.
        </Callout>
      </div>
    ),
  },
  {
    id: "recursos",
    number: "03",
    tabLabel: "Tiempo y Recursos",
    title: "TIEMPO Y PUNTOS DE INVESTIGACIÓN",
    render: () => (
      <div className="flex flex-col gap-2.5">
        <p className="text-xs text-[#FFF3C7]/90">
          Disponés de un cupo de <Strong>Horas de Tiempo</Strong> y <Strong>Puntos de Investigación (PI)</Strong>. Cada desplazamiento e interrogatorio descuenta recursos:
        </p>

        <MiniTable
          head={["Acción en el Terreno", "Consumo de Recursos"]}
          rows={[
            ["Viajar a otra provincia", "Consumo alto de Tiempo y PI"],
            ["Desplazarse a locación interna", "Consumo moderado de Tiempo y PI"],
            ["Interrogar a un testigo por 1ra vez", "1 hora de tiempo y costo en PI"],
            [
              <>Pregunta que arroja una <Strong>pista nueva</Strong></>,
              <>Consume tiempo, pero <Win>¡recompensa con +5 PI!</Win></>,
            ],
            ["Repetir pregunta ya consultada", <span className="text-emerald-300 font-semibold">Sin costo (0 h / 0 PI)</span>],
            ["Permanecer en provincia o punto actual", <span className="text-emerald-300 font-semibold">Sin costo (0 h / 0 PI)</span>],
          ]}
        />

        <Callout label="CONDICIÓN DE FRACASO">
          Si el marcador de tiempo llega a <Lose>0 horas</Lose> o tu partida agota los <Lose>0 PI</Lose>, el operativo se suspende automáticamente por falta de recursos y se declara la derrota.
        </Callout>
      </div>
    ),
  },
  {
    id: "pistas",
    number: "04",
    tabLabel: "Testigos y Pistas",
    title: "TESTIGOS, INTERROGATORIOS Y PISTAS",
    render: () => (
      <div className="flex flex-col gap-3">
        <ul className="flex flex-col gap-2 text-xs">
          <BulletItem>
            <Strong>Testigos en cada locación</Strong>: En cada punto de interés provincial hallarás lugareños que aportarán información testimonial sobre el fugitivo.
          </BulletItem>
          <BulletItem>
            <Strong>Cuaderno de Pistas</Strong>: Toda evidencia aportada por testigos o recibida en el informe inicial se archiva de manera automática en el panel de Pistas.
          </BulletItem>
          <BulletItem>
            <Strong>Preguntas desbloqueables</Strong>: Ciertas pistas obtenidas en una región permiten formular preguntas específicas e inéditas ante testigos de otras provincias.
          </BulletItem>
          <BulletItem>
            <Strong>Historial de declaraciones</Strong>: Cada diálogo concluido queda asentado en actas y puede volver a leerse cuantas veces sea necesario sin costo operativo.
          </BulletItem>
        </ul>

        <Callout label="RECOMENDACIÓN TÁCTICA">
          Prestá atención a los detalles físicos: contextura corporal, estatura, rasgos faciales, vestimenta y particularidades de conducta del sospechoso.
        </Callout>
      </div>
    ),
  },
  {
    id: "arresto",
    number: "05",
    tabLabel: "Orden de Arresto",
    title: "LA ORDEN DE ARRESTO",
    render: () => (
      <div className="flex flex-col gap-3">
        <p className="text-xs text-[#FFF3C7]/90 leading-relaxed">
          Para proceder a la detención legal se exige sustento probatorio fehaciente ante la fiscalía:
        </p>

        <ul className="flex flex-col gap-2 text-xs">
          <BulletItem>
            <Strong>Requisito indispensable</Strong>: Se requiere un mínimo de <Strong>3 pistas obtenidas mediante interrogatorios</Strong> a testigos (las pistas del informe de guardia no computan para el aval judicial).
          </BulletItem>
          <BulletItem>
            <Strong>Determinación del sospechoso</Strong>: Seleccioná al individuo de la nómina que coincida con la totalidad de los indicios reunidos.
          </BulletItem>
          <BulletItem>
            <Strong>Carácter irrevocable</Strong>: Una vez librada la orden judicial, <Strong>no puede ser anulada ni reemplazada</Strong> por otra durante el transcurso del caso.
          </BulletItem>
        </ul>

        <Callout label="PRECAUCIÓN JUDICIAL">
          Cotejá detenidamente la ficha técnica de cada sospechoso antes de estampar la firma. Una orden mal dirigida conducirá a la fuga del verdadero culpable.
        </Callout>
      </div>
    ),
  },
  {
    id: "escondite",
    number: "06",
    tabLabel: "El Escondite",
    title: "EL ESCONDITE Y DESENLACE",
    render: () => (
      <div className="flex flex-col gap-2.5">
        <p className="text-xs text-[#FFF3C7]/90">
          El delincuente se encuentra agazapado en el punto final de su ruta. Al arribar a dicha locación, el caso se resolverá de acuerdo a tu estado procesal:
        </p>

        <MiniTable
          head={["Situación Procesal al Arribar", "Resolución Oficial"]}
          rows={[
            ["Con orden emitida contra el culpable", <Win>Victoria: Se concreta la captura formal</Win>],
            ["Con orden librada contra otro sospechoso", <Lose>Derrota: Se detiene a un inocente y el prófugo huye</Lose>],
            ["Sin orden emitida y con menos de 3 pistas", <Lose>Derrota: Falta de mérito probatorio, el prófugo escapa</Lose>],
            [
              "Sin orden emitida pero con 3 o más pistas",
              <span className="text-amber-300 font-semibold">Última oportunidad: Deberás librar la orden en el acto</span>,
            ],
          ]}
        />

        <Callout label="COSTO DE TRASLADO FINAL">
          El desplazamiento hasta el escondite descuenta tiempo y PI. Arribar con el reloj en cero frustrará la detención antes de poder actuar.
        </Callout>
      </div>
    ),
  },
  {
    id: "progreso",
    number: "07",
    tabLabel: "Tu Progreso",
    title: "REGISTRO, GUARDADO Y RANKING",
    render: () => (
      <div className="flex flex-col gap-3">
        <ul className="flex flex-col gap-2 text-xs">
          <BulletItem>
            <Strong>Sincronización en tiempo real</Strong>: Cada desplazamiento, pista y declaración se guarda automáticamente. Podés interrumpir la sesión y reanudarla con tu expediente intacto.
          </BulletItem>
          <BulletItem>
            <Strong>Reintentos sin penalización</Strong>: En caso de no superar un caso, podés reiniciar de inmediato con un nuevo caso asignado a tu nivel de dificultad.
          </BulletItem>
          <BulletItem>
            <Strong>Escalafón general de detectives</Strong>: Competí por el puntaje acumulado en el ranking. A igualdad de puntos, se premia al agente que resolvió los casos en menor número de partidas.
          </BulletItem>
        </ul>

        <div className="mt-1 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-[#E1C380]/25 bg-gradient-to-r from-[#1c2a38] to-[#14202c] p-3 shadow-lg">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#E1C380] font-semibold">
              EXPEDIENTE LISTO PARA COMENZAR
            </div>
            <div className="text-xs text-[#FFF3C7]/80">
              Iniciá sesión o registrá tu credencial de detective para asumir tu primer caso.
            </div>
          </div>
          <Link
            href="/login"
            className="shrink-0 whitespace-nowrap rounded-lg border border-[#E1C380] bg-gradient-to-b from-[#2a3c50] to-[#182634] px-4 py-2 text-xs font-semibold tracking-wider text-[#FFF3C7] shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:border-[#FFF3C7] hover:scale-105 transition-all"
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
      handleSelectPage(currentPage + 1);
    } else {
      router.push("/login");
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
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
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black select-none font-sans">
      {/* Background Seamless Looping Video */}
      <SeamlessBackgroundVideo
        src="/videos/introvid.mp4"
        poster="/images/backgroundlogin.jpeg"
        fadeDuration={0.8}
      />

      {/* Atmospheric Noir Vignette */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] pointer-events-none" />

      {/* Main Dossier Book Container - minimum 1200px width on desktop */}
      <main className="relative z-10 w-full max-w-[1260px] xl:w-[1240px] 2xl:w-[1260px] h-[94vh] max-h-[740px] min-h-[500px] rounded-2xl border border-[#E1C380]/30 shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-[rgba(16,24,34,0.95)] backdrop-blur-xl flex flex-col overflow-hidden">
        {/* Top Binder Header */}
        <header className="h-12 shrink-0 px-5 sm:px-8 border-b border-[#E1C380]/20 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#E1C380] border border-[#E1C380]/40 rounded px-1.5 py-0.5">
              PFA
            </span>

            <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#E1C380] [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">
              MANUAL DE PROCEDIMIENTO POLICIAL
            </span>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-lg border border-[#E1C380]/20 bg-[#2a3a4a]/40 px-3 py-1 text-xs tracking-wider text-[#FFF3C7]/90 hover:text-[#E1C380] hover:border-[#E1C380]/50 hover:bg-[#2a3a4a]/70 transition-all"
            title="Volver a la pantalla de acceso (Esc)"
          >
            <span>✕</span>
            <span className="hidden sm:inline">CERRAR</span>
          </Link>
        </header>

        {/* Mobile Horizontal Tabs (visible on small screens) */}
        <div className="flex md:hidden shrink-0 overflow-x-auto border-b border-[#E1C380]/15 bg-black/30 px-3 py-2 gap-2 scrollbar-none">
          {SECTIONS.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => handleSelectPage(idx)}
              className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 px-3 py-1 rounded-md text-xs tracking-wider transition-all ${
                currentPage === idx
                  ? "bg-[#E1C380]/25 text-[#E1C380] border border-[#E1C380]/40 font-semibold"
                  : "text-[#FFF3C7]/60 hover:text-[#FFF3C7]"
              }`}
            >
              <span className="font-mono text-[10px] text-[#E1C380]">{sec.number}</span>
              <span>{sec.tabLabel}</span>
            </button>
          ))}
        </div>

        {/* Body Layout: Left Sidebar + Right Page Content */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Desktop Left Sidebar: w-72 with non-wrapping full text */}
          <aside className="hidden md:flex w-72 shrink-0 border-r border-[#E1C380]/15 bg-black/25 flex-col justify-between p-4">
            <div className="flex flex-col gap-1.5">
              <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-[#E1C380]/70 font-bold whitespace-nowrap">
                ÍNDICE DE SECCIONES
              </div>
              {SECTIONS.map((sec, idx) => {
                const isActive = currentPage === idx;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectPage(idx)}
                    className={`whitespace-nowrap flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs tracking-wider transition-all relative ${
                      isActive
                        ? "bg-gradient-to-r from-[#E1C380]/25 to-transparent text-[#E1C380] font-semibold border-l-4 border-[#E1C380] shadow-sm"
                        : "text-[#FFF3C7]/70 hover:text-[#FFF3C7] hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="font-mono text-[11px] font-bold text-[#E1C380] opacity-80 shrink-0">
                      {sec.number}
                    </span>
                    <span className="whitespace-nowrap">{sec.tabLabel}</span>
                    {isActive && (
                      <span className="ml-auto text-[10px] text-[#E1C380] shrink-0">
                        ▶
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sidebar Bottom Progress */}
            <div className="rounded-xl border border-[#E1C380]/15 bg-black/30 p-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#FFF3C7]/70 whitespace-nowrap">
                <span className="uppercase tracking-wider text-[10px] text-[#E1C380]/70">PÁGINAS</span>
                <span className="text-[#E1C380] font-semibold font-mono">
                  {currentPage + 1} / {SECTIONS.length}
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#1a2634] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C29B38] to-[#E1C380] transition-all duration-300"
                  style={{
                    width: `${((currentPage + 1) / SECTIONS.length) * 100}%`,
                  }}
                />
              </div>
              <div className="text-[10px] text-[#FFF3C7]/50 text-center">
                Flechas ← →
              </div>
            </div>
          </aside>

          {/* Right Content Page Viewport */}
          <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-6 md:p-7 overflow-hidden bg-gradient-to-b from-transparent to-black/20">
            {/* Page Header */}
            <header className="shrink-0 mb-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-[#FFF3C7]/60 font-mono">
                  DOC. {section.number}-PFA
                </div>
              </div>

              <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-wider text-[#E1C380] [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)] mt-0.5">
                {section.title}
              </h1>
            </header>

            {/* Page Body: justify-start ensures top header/table never gets clipped */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-[#E1C380]/30 scrollbar-track-transparent flex flex-col justify-start">
              {section.render()}
            </div>

            {/* Page Bottom Navigation */}
            <footer className="shrink-0 pt-3 mt-2 border-t border-[#E1C380]/15 flex items-center justify-between gap-3">
              <button
                onClick={handlePrev}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs tracking-wider transition-all border border-[#E1C380]/20 bg-[#202e3e]/60 text-[#FFF3C7] disabled:opacity-30 disabled:pointer-events-none hover:border-[#E1C380]/50 hover:bg-[#202e3e]"
              >
                <span>←</span>
                <span className="hidden sm:inline">ANTERIOR</span>
              </button>

              {/* Dots indicator */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {SECTIONS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectPage(i)}
                    className={`transition-all rounded-full ${
                      currentPage === i
                        ? "size-2.5 sm:size-3 bg-[#E1C380] shadow-[0_0_8px_#E1C380]"
                        : "size-1.5 sm:size-2 bg-[#FFF3C7]/20 hover:bg-[#FFF3C7]/50"
                    }`}
                    aria-label={`Ir a sección ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-3 sm:px-5 py-1.5 rounded-lg text-xs tracking-wider font-semibold transition-all border border-[#E1C380] bg-gradient-to-b from-[#2a3c50] to-[#182634] text-[#FFF3C7] hover:border-[#FFF3C7] hover:scale-105 shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
              >
                <span>
                  {currentPage === SECTIONS.length - 1
                    ? "COMENZAR INVESTIGACIÓN"
                    : "SIGUIENTE"}
                </span>
                <span>→</span>
              </button>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
