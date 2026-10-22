"use client";

export default function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border border-[#1c2c3e] bg-[#0c1421] hover:border-amber-400/40 transition-all duration-200 shadow-sm select-none">
      <span className="font-mono text-[9px] sm:text-[10px] tracking-wider uppercase font-bold text-slate-400 text-center mb-0.5 truncate max-w-full">
        {label}
      </span>
      <span className="font-mono font-black text-xs sm:text-sm tracking-wider text-amber-300 text-center break-words drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]">
        {value}
      </span>
    </div>
  );
}