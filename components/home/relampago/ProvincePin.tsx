"use client";

import { getCalibratedProvinceCoordinates } from "@/lib/mapCalibration";

type ProvincePinProps = {
  province: string;
  ariaLabel: string;
  /** "idle" mientras se juega; al terminar, la correcta queda verde y la elegida mal en rojo */
  status: "idle" | "correct" | "wrong" | "dimmed";
  disabled: boolean;
  onPick: (province: string) => void;
};

const STATUS_STYLE: Record<ProvincePinProps["status"], string> = {
  idle: "bg-[#E1C380] border-[#FFF3C7] animate-pulse",
  correct: "bg-[#3ddc84] border-[#FFF3C7] scale-125",
  wrong: "bg-[#c81e1e] border-[#FFF3C7]",
  dimmed: "bg-[#5c636e] border-[#9aa3ae] opacity-60",
};

// Pin de una provincia candidata sobre el monitor táctico; también se puede tocar para elegirla
export default function ProvincePin({ province, ariaLabel, status, disabled, onPick }: ProvincePinProps) {
  const { top, left } = getCalibratedProvinceCoordinates({ name: province });

  return (
    <button
      type="button"
      onClick={() => onPick(province)}
      disabled={disabled}
      style={{ top, left }}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 p-2 cursor-pointer disabled:cursor-default"
      aria-label={ariaLabel}
    >
      <span className={`block size-3.5 rounded-full border-2 shadow-[0_0_10px_rgba(0,0,0,0.8)] transition-all ${STATUS_STYLE[status]}`} />
      <span className="text-[7px] sm:text-[9px] text-[#FFF3C7] uppercase whitespace-nowrap [text-shadow:0_1px_0_#000,0_0_6px_#000]">
        {province}
      </span>
    </button>
  );
}
