import LevelProvinceLocations from "@/components/Level/LevelProvinceLocations";
import LevelMenu from "@/components/Level/LevelMenu";
import LevelTimer from "@/components/Level/LevelTimer";

interface Props {
  params: Promise<{
    levelId: string;
    provinceId: string;
  }>;
}

export default async function Province({ params }: Props) {
  const { levelId, provinceId } = await params;
  const levelIdNum = Number(levelId);
  const provinceIdNum = Number(provinceId);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <LevelTimer levelId={levelIdNum} />
      <LevelProvinceLocations levelId={levelIdNum} provinceId={provinceIdNum} />
      <LevelMenu levelId={levelIdNum} />
    </main>
  );
}