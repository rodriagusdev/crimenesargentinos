import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Cómo se juega · Crímenes Argentinos",
  description: "Reglas del juego: niveles, tiempo, puntos de investigación, pistas y orden de arresto.",
};

// Página pública (no requiere sesión) con las reglas del juego

function Section({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-[#2a3a4a]/40 backdrop-blur-[10px] border border-[#fff3c7]/15 shadow-[0_10px_40px_rgba(0,0,0,0.45)] p-6 sm:p-8">
      <h2 className="flex items-center gap-3 mb-5 text-sm sm:text-base tracking-widest text-[#E1C380] [text-shadow:_0_2px_0_#1E2A36]">
        <span className="text-xl" aria-hidden="true">
          {icon}
        </span>
        {title}
      </h2>
      <div className="font-sans text-[15px] leading-relaxed text-[#FFF3C7]/90 flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Rule({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#E1C380]" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

function Table({ head, rows }: { head: [string, string]; rows: [ReactNode, ReactNode][] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#fff3c7]/15">
      <table className="w-full text-left text-sm">
        <thead className="bg-[rgba(20,30,42,0.6)] text-[#E1C380]">
          <tr>
            <th className="px-4 py-2.5 font-semibold">{head[0]}</th>
            <th className="px-4 py-2.5 font-semibold">{head[1]}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#fff3c7]/10">
          {rows.map(([a, b], i) => (
            <tr key={i} className="bg-[rgba(20,30,42,0.25)]">
              <td className="px-4 py-2.5 align-top">{a}</td>
              <td className="px-4 py-2.5 align-top text-[#FFF3C7]/80">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Strong = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-[#FFF3C7]">{children}</strong>;
const Win = ({ children }: { children: ReactNode }) => <span className="font-semibold text-emerald-300">{children}</span>;
const Lose = ({ children }: { children: ReactNode }) => <span className="font-semibold text-red-300">{children}</span>;

export default function Rules() {
  return (
    <div className="relative min-h-screen w-full bg-black">
      <Image src="/images/backgroundlogin.jpeg" alt="" fill priority className="object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      <main className="relative z-10 mx-auto max-w-4xl px-5 py-12 sm:py-16 flex flex-col gap-8">
        <header className="flex flex-col items-center gap-5 text-center">
          <Image src="/images/logofinal.png" alt="Crímenes Argentinos" width={220} height={110} className="h-auto w-44 sm:w-56" priority />
          <h1 className="text-2xl sm:text-4xl tracking-widest text-[#E1C380] [text-shadow:_0_2px_0_#1E2A36,_0_0_10px_rgba(0,0,0,0.8)]">
            CÓMO SE JUEGA
          </h1>
          <p className="max-w-2xl font-sans text-base leading-relaxed text-[#FFF3C7]/85">
            Sos detective y cada caso es un criminal a la fuga por Argentina. Recorré provincias, interrogá testigos,
            juntá pistas y emití la orden de arresto antes de que se te acabe el tiempo.
          </p>
        </header>

        <Section icon="🎯" title="EL OBJETIVO">
          <p>
            Cada caso empieza con un <Strong>informe inicial</Strong> y algunas pistas. A partir de ahí tenés que seguir
            el rastro del criminal hasta su escondite, que está en una de las locaciones del mapa, y llegar con la
            <Strong> orden de arresto correcta</Strong>.
          </p>
        </Section>

        <Section icon="🗂️" title="NIVELES Y CASOS">
          <ul className="flex flex-col gap-2">
            <Rule>
              Los niveles se juegan en orden: tenés <Strong>un nivel habilitado</Strong> y para desbloquear el siguiente
              tenés que <Strong>ganar</Strong>.
            </Rule>
            <Rule>
              Cada vez que empezás una partida, <Strong>el caso se sortea al azar</Strong>: primero entre los casos que
              nunca jugaste y, cuando ya los jugaste todos, entre los que todavía no ganaste.
            </Rule>
            <Rule>Si perdés, la próxima partida te toca otro caso. Un caso que ya ganaste no vuelve a salir.</Rule>
            <Rule>
              Cuando ganás todos los casos, empieza una <Strong>vuelta nueva</Strong>: los niveles vuelven a empezar
              desde el 1 y todos los casos vuelven al sorteo.
            </Rule>
          </ul>
        </Section>

        <Section icon="⏳" title="TIEMPO Y PUNTOS DE INVESTIGACIÓN">
          <p>
            Cada caso te da un tiempo (en horas de juego) y una cantidad de <Strong>puntos de investigación (PI)</Strong>.
            Casi todo lo que hacés los consume. Cada caso tiene sus propios valores, así que los más difíciles dan menos
            margen.
          </p>
          <Table
            head={["Acción", "Qué cuesta"]}
            rows={[
              ["Viajar a otra provincia", "Tiempo y PI"],
              ["Ir a una locación de la provincia", "Tiempo y PI"],
              ["Hacer una pregunta por primera vez", "Tiempo y PI"],
              [<>Una pregunta que te deja una <Strong>pista nueva</Strong></>, <>Solo tiempo, y <Win>suma 5 PI</Win></>],
              ["Repetir una pregunta que ya hiciste", "Nada"],
              ["Volver a la provincia o locación en la que ya estás", "Nada"],
            ]}
          />
          <p>
            Si el tiempo llega a cero, <Lose>perdés</Lose>. Si te quedás sin puntos de investigación, también{" "}
            <Lose>perdés</Lose>. Antes de cada viaje se muestra cuánto cuesta para que puedas decidir.
          </p>
        </Section>

        <Section icon="🗣️" title="TESTIGOS, PREGUNTAS Y PISTAS">
          <ul className="flex flex-col gap-2">
            <Rule>En cada locación hay un testigo. Elegí qué preguntarle: cada respuesta puede darte información útil.</Rule>
            <Rule>
              Algunas respuestas te dejan una <Strong>pista</Strong>. Todas tus pistas (las del informe inicial y las de los
              testigos) quedan anotadas en el menú de <Strong>Pistas</Strong>.
            </Rule>
            <Rule>
              Hay preguntas que solo aparecen cuando ya sabés algo: lo que te cuenta un testigo puede habilitar nuevas
              preguntas con otro.
            </Rule>
            <Rule>Las preguntas que ya hiciste quedan marcadas, y la conversación con cada testigo se guarda.</Rule>
          </ul>
        </Section>

        <Section icon="📜" title="LA ORDEN DE ARRESTO">
          <ul className="flex flex-col gap-2">
            <Rule>
              Para emitirla necesitás <Strong>al menos 3 pistas conseguidas con los testigos</Strong> (las del informe
              inicial no cuentan).
            </Rule>
            <Rule>Elegís a uno de los sospechosos del caso.</Rule>
            <Rule>
              La orden es <Strong>definitiva</Strong>: una vez emitida no se puede cambiar, así que pensalo bien.
            </Rule>
          </ul>
        </Section>

        <Section icon="🕵️" title="EL ESCONDITE DEL CRIMINAL">
          <p>
            El criminal está escondido en una de las locaciones. Cuando llegás a ese lugar, se decide el caso:
          </p>
          <Table
            head={["Cuando llegás al escondite...", "Resultado"]}
            rows={[
              ["Con la orden de arresto del culpable", <Win key="w">Ganás el caso</Win>],
              ["Con la orden de arresto de otro sospechoso", <Lose key="l1">Perdés: se te escapa</Lose>],
              ["Sin orden y sin las 3 pistas para emitirla", <Lose key="l2">Perdés: no tenés cómo detenerlo</Lose>],
              [
                "Sin orden pero con las 3 pistas",
                <>Estás frente al criminal: tenés que <Strong>emitir la orden en ese momento</Strong>. Si acertás ganás, si no, perdés.</>,
              ],
            ]}
          />
          <p>Llegar al escondite también cuesta tiempo: si con ese viaje te quedás sin tiempo, perdés.</p>
        </Section>

        <Section icon="💾" title="TU PROGRESO">
          <ul className="flex flex-col gap-2">
            <Rule>
              La partida <Strong>se guarda sola</Strong>: podés salir y seguir otro día desde donde la dejaste, con tus
              pistas y conversaciones.
            </Rule>
            <Rule>Si perdés, podés reintentar: se sortea un caso nuevo para tu nivel.</Rule>
            <Rule>
              El <Strong>ranking</Strong> ordena a los jugadores por puntaje; si hay empate, queda más arriba quien jugó
              menos partidas.
            </Rule>
          </ul>
        </Section>

        <footer className="flex flex-col items-center gap-4 pt-2 pb-6">
          <Link
            href="/login"
            className="rounded-2xl border border-[rgba(255,243,199,0.35)] bg-gradient-to-b from-[rgba(38,58,82,0.88)] to-[rgba(20,32,48,0.88)] px-8 py-4 text-xs tracking-wider text-[#FFF3C7] shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-all hover:border-[#E1C380] hover:shadow-[0_20px_50px_rgba(0,0,0,0.75),0_0_20px_rgba(225,195,128,0.3)]"
          >
            🕵️ EMPEZAR A INVESTIGAR
          </Link>
        </footer>
      </main>
    </div>
  );
}
