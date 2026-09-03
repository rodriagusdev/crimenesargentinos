import LevelLocation from "@/components/Level/LevelLocation";

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
  const provinceIdNum = Number(provinceId);
  const locationIdNum = Number(locationId);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <h1 className="relative z-10 p-6 text-[#FFF3C7] tracking-widest">
        Location {locationIdNum}
      </h1>

      <LevelLocation levelId={levelIdNum} locationId={locationIdNum} provinceId={provinceIdNum} />
    </main>
  );
}

/*
  const [insideLocation, setInsideLocation] = useState(false);
  const [idLocation, setIdLocation] = useState(0);

  const onEnterLocation = (idLocation: number) => {
    setInsideLocation(true);
    setIdLocation(idLocation - 1);
  };

  const onExitLocation = () => {
    setInsideLocation(false);
    setIdLocation(0);
  };*/
