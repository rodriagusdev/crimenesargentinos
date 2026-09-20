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
    if (!preview.canPlay) return; // No permitir click si no puede jugar
    
    if (preview.videoURL) {
      handleShowVideo();
    } else {
      goToLevel();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        overflow-hidden rounded-2xl
        backdrop-blur-xs
        border border-[rgba(255,243,199,0.18)]
        shadow-[0_20px_50px_rgba(0,0,0,0.6)]
        transition-all duration-300
        ${preview.canPlay 
          ? "hover:-translate-y-1 hover:border-[#E1C380]/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.75),0_0_20px_rgba(225,195,128,0.15)] cursor-pointer" 
          : "opacity-50 cursor-not-allowed"
        }
      `}
    >
      <div
        className="
          relative
          h-40
          border-b border-[rgba(255,243,199,0.12)]
          bg-gradient-to-b
          from-[rgba(28,42,58,0.8)]
          to-[rgba(16,24,36,0.8)]
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
        {!preview.canPlay && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-4xl">🔒</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3
          className={`
            mb-3
            text-xs
            tracking-widest
            ${preview.canPlay ? "text-[#E1C380]" : "text-[#999999]"}
          `}
        >
          {preview.title}
          {!preview.canPlay && " [BLOQUEADO]"}
        </h3>

        <p className={`text-xs line-clamp-3 ${preview.canPlay ? "text-[#FFF3C7]" : "text-[#888888]"}`}>
          {preview.description}
        </p>
      </div>

      {showVideo && (
        <OverlayVideo videoURL={preview.videoURL} onSkip={goToLevel} />
      )}
    </div>
  );
}
