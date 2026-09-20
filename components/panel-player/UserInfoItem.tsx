"use client";

export default function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl py-2 bg-[rgba(20,30,42,0.5)] backdrop-blur-xs border border-[rgba(255,243,199,0.14)] shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
      <p
        className="text-[8px] font-['Press_Start_2P'] text-[#E1C380] tracking-widest text-center"
      >
        {label}
      </p>

      <p className="text-[8px] font-semibold text-[#FFF3C7] text-center break-words">{value}</p>
    </div>
  );
}