import Image from "next/image";

type AboutMemberCardProps = {
  image: string;
  name: string;
  width: number;
  height: number;
};

export default function AboutMemberCard({ image, name, width, height }: AboutMemberCardProps) {
  return (
    <figure className="mx-auto w-full max-w-xl overflow-hidden rounded-xl border border-[#E1C380]/35 bg-[#0c1421]/80 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
      <Image
        src={image}
        alt={name}
        width={width}
        height={height}
        sizes="(max-width: 640px) calc(100vw - 5rem), (max-width: 1024px) calc(100vw - 8rem), 576px"
        className="block h-auto w-full"
      />
    </figure>
  );
}
