import LevelLocation from "@/components/Level/LevelLocation";

export default async function ProvinceLocation({
  params,
}: PageProps<"/level/[levelId]/[provinceId]/[locationId]">) {
  const { levelId, provinceId, locationId } = await params;

  return <LevelLocation levelId={Number(levelId)} locationId={locationId} provinceId={provinceId} />;
}