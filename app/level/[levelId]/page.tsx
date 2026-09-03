import LevelProvinces from "@/components/Level/LevelProvinces";
import LevelMenu from "@/components/Level/LevelMenu";
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
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Mapa de fondo - ocupa toda la pantalla */}
      <Image
        src="/images/test_map.jpg"
        alt="Mapa de Argentina"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Botones encima del mapa */}
      <LevelProvinces levelId={id} />

      {/* Menú lateral de investigación */}
      <LevelMenu levelId={id} />
    </main>
  );
}
