import { ICardLevelPreview } from "@/models/ICardLevelPreview";
import Image from "next/image";
import { usePreviewVideoHandler } from "@/hooks/usePreviewVideoHandler";
import { OverlayVideo } from "../overlays/OverlayVideo";

type LevelCardProps = {
  preview: ICardLevelPreview;
};

export default function LevelCard({ preview }: LevelCardProps) {
  const { handleShowVideo, showVideo, goToLevel } = usePreviewVideoHandler(
    preview.id,
  );

  const handleCardClick = () => {
    if (preview.videoURL) {
      handleShowVideo();
    } else {
      goToLevel();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        overflow-hidden rounded-2xl
        bg-[rgba(42,58,74,0.35)]
        backdrop-blur-[10px]
        border border-[#fff3c7]/15
        shadow-[0_10px_40px_rgba(0,0,0,0.4)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[#E1C380]/30
        cursor-pointer
      "
    >
      <div
        className="
    relative
    h-40
    border-b border-[#fff3c7]/15
    bg-gradient-to-b
    from-[#2A3A4A]
    to-[#1E2A36]
    overflow-hidden
  "
      >
        <Image
          src={preview.imageURL}
          alt="Preview"
          fill
          className="object-contain p-2"
          sizes="100vw"
        />
      </div>
      <div className="p-5">
        <h3
          className="
            mb-3
            text-[#E1C380]
            text-xs
            tracking-widest
          "
        >
          {preview.title}
        </h3>

        <p className="text-xs text-[#FFF3C7] line-clamp-3">
          {preview.description}
        </p>
      </div>

      {showVideo && (
        <OverlayVideo videoURL={preview.videoURL} onSkip={goToLevel} />
      )}
    </div>
  );
}
