import LevelMenu from "@/components/Level/LevelMenu";
import LevelTimer from "@/components/Level/LevelTimer";
import CaseBriefingModal from "@/components/Level/CaseBriefingModal";
import AgentPortraitHUD from "@/components/Level/AgentPortraitHUD";

// Marco compartido por mapa, provincia y locación: el menú de investigación,
// el informe del caso inicial y los modales de fin de partida quedan montados mientras se navega dentro del caso
export default async function LevelLayout({ children, params }: LayoutProps<"/level/[levelId]">) {
  const { levelId } = await params;
  const id = Number(levelId);

  return (
    <main className="relative min-h-dvh overflow-hidden">
      {children}

      {/* Menú de investigación desplegable (Arriba a la izquierda) */}
      <LevelMenu levelId={id} />

      {/* Modales de victoria / derrota / sesión */}
      <LevelTimer levelId={id} />

      {/* Informe inicial del caso (se muestra una única vez según session.briefingSeen) */}
      <CaseBriefingModal levelId={id} />

      {/* Placa / Credencial del agente (Abajo a la derecha) */}
      <AgentPortraitHUD />
    </main>
  );
}
