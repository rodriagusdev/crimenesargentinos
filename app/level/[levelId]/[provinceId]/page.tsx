import LevelProvinceLocations from "@/components/Level/LevelProvinceLocations";

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
      <LevelProvinceLocations levelId={levelIdNum} provinceId={provinceIdNum} />
    </main>
  );
}