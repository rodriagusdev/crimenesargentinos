type LevelCardProps = {
  title: string;
  description: string;
};

export default function LevelCard({ title, description }: LevelCardProps) {
  return (
    <div
      className="
        overflow-hidden rounded-2xl
        bg-[rgba(42,58,74,0.35)]
        backdrop-blur-[10px]
        border border-[#fff3c7]/15
        shadow-[0_10px_40px_rgba(0,0,0,0.4)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-[#E1C380]/30
      "
    >
      {/* Imagen Placeholder */}
      <div
        className="
          h-40
          flex items-center justify-center
          border-b border-[#fff3c7]/15
          bg-gradient-to-b
          from-[#2A3A4A]
          to-[#1E2A36]
        "
      >
        <span
          className="
            font-['Press_Start_2P']
            text-[#E1C380]
            text-xs
            tracking-widest
          "
        >
          PREVIEW
        </span>
      </div>

      <div className="p-5">
        <h3
          className="
            mb-3
            font-['Press_Start_2P']
            text-[#E1C380]
            text-xs
            tracking-widest
          "
        >
          {title}
        </h3>

        <p className="text-xs text-[#FFF3C7] line-clamp-3">{description}</p>
      </div>
    </div>
  );
}
