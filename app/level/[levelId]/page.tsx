import LevelProvinces from "@/components/Level/LevelProvinces";
import LevelMenu from "@/components/Level/LevelMenu";
import LevelTimer from "@/components/Level/LevelTimer";
import Image from "next/image";

interface Props {
  params: Promise<{
    levelId: string;
  }>;
}

export default async function Level({ params }: Props) {
  const { levelId } = await params;
  const id = Number(levelId);

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-[#05070a]">
      {/* ========================================================================= */}
      {/* SALA DE INVESTIGACIÓN POLICIAL (100% PANTALLA COMPLETA SIN BORDES OSCUROS) */}
      {/* ========================================================================= */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Ilustración de la central de detectives ocupando toda la pantalla */}
        <Image
          src="/images/test_composite.webp"
          alt="Centro de Mando de Investigación Policial"
          fill
          priority
          className="object-fill"
          sizes="100vw"
        />

        {/* ========================================================================= */}
        {/* MONITOR TÁCTICO: CAPA INTERACTIVA DE PROVINCIAS                           */}
        {/* Calibrado con el área de la pantalla del mapa en la escena:              */}
        {/* left: 19.186%, top: 6.510%, width: 61.773%, height: 74.219%               */}
        {/* ========================================================================= */}
        <div
          className="absolute z-10 pointer-events-auto"
          style={{
            left: "19.186%",
            top: "6.510%",
            width: "61.773%",
            height: "74.219%",
          }}
        >
          <LevelProvinces levelId={id} />
        </div>

        {/* Menú de investigación desplegable (Arriba a la izquierda) */}
        <LevelMenu levelId={id} />

        {/* Modales de victoria / derrota / sesión */}
        <LevelTimer levelId={id} />
      </div>
    </main>
  );
}
