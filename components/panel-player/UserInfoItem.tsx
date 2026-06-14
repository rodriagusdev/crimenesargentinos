export default function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="
        rounded-xl
        p-4
        bg-[#FFF3C7]/5
        border border-[#FFF3C7]/10
      "
    >
      <p
        className="
          mb-2
          text-[10px]
          font-['Press_Start_2P']
          text-[#E1C380]
          tracking-widest
        "
      >
        {label}
      </p>

      <p
        className="
          text-sm
          text-[#FFF3C7]
          break-words
        "
      >
        {value}
      </p>
    </div>
  );
}