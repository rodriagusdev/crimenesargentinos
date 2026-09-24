import LevelLocation from "@/components/Level/LevelLocation";
import LevelMenu from "@/components/Level/LevelMenu";
import LevelTimer from "@/components/Level/LevelTimer";

interface Props {
  params: Promise<{
    levelId: string;
    provinceId: string;
    locationId: string;
  }>;
}

export default async function ProvinceLocation({ params }: Props) {
  const { levelId, provinceId, locationId } = await params;

  const levelIdNum = Number(levelId);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <LevelTimer levelId={levelIdNum} />
      <LevelLocation levelId={levelIdNum} locationId={locationId} provinceId={provinceId} />
      <LevelMenu levelId={levelIdNum} />
    </main>
  );
}