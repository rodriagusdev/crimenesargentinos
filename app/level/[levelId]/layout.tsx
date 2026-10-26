import LevelMenu from "@/components/Level/LevelMenu";
import LevelTimer from "@/components/Level/LevelTimer";

// Marco compartido por mapa, provincia y locación: el menú de investigación y los
// modales de fin de partida quedan montados mientras se navega dentro del caso
export default async function LevelLayout({ children, params }: LayoutProps<"/level/[levelId]">) {
  const { levelId } = await params;
  const id = Number(levelId);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {children}

      {/* Menú de investigación desplegable (Arriba a la izquierda) */}
      <LevelMenu levelId={id} />

      {/* Modales de victoria / derrota / sesión */}
      <LevelTimer levelId={id} />
    </main>
  );
}
