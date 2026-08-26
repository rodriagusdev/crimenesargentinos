import LevelProvinces from "@/components/Level/LevelProvinces";
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
    <main className="relative min-h-screen overflow-hidden">
      <h1 className="relative z-10 p-6 text-[#FFF3C7] tracking-widest">
        Level {id}
      </h1>

      <LevelProvinces levelId={id} />
    </main>
  );
}
