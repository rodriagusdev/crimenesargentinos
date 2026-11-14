import LevelProvinceLocations from "@/components/Level/LevelProvinceLocations";

export default async function Province({ params }: PageProps<"/[locale]/level/[levelId]/[provinceId]">) {
  const { levelId, provinceId } = await params;

  return <LevelProvinceLocations levelId={Number(levelId)} provinceId={provinceId} />;
}