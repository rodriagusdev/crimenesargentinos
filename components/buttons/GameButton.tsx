import { useTypewriterSound } from "@/hooks/useTypewriterSound";

type GameButtonProps = {
	icon?: React.ReactNode;
	label: string;
	onClick?: () => void;
	variant?: "primary" | "secondary";
	disabled?: boolean;
	className?: string;
};

export default function GameButton({
	icon,
	label,
	onClick,
	variant = "primary",
	disabled = false,
	className = "",
}: GameButtonProps) {
	const isPrimary = variant === "primary";

	return (
		<button
			onClick={onClick}
			onMouseEnter={!disabled ? useTypewriterSound() : undefined}
			disabled={disabled}
			className={`
				relative group w-full p-4 text-xs modern-button flex items-center justify-center rounded-2xl
				backdrop-blur-xs shadow-[0_20px_50px_rgba(0,0,0,0.6)]
				tracking-wider font-semibold
				transition-all duration-200 select-none
				${disabled
					? "opacity-50 cursor-not-allowed pointer-events-none bg-[rgba(20,30,42,0.4)] border border-[rgba(255,243,199,0.1)] text-[#FFF3C7]/40"
					: isPrimary
						? "bg-gradient-to-b from-[rgba(38,58,82,0.88)] to-[rgba(20,32,48,0.88)] border border-[rgba(255,243,199,0.35)] text-[#FFF3C7] shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,243,199,0.25)] hover:from-[rgba(50,76,108,0.95)] hover:to-[rgba(28,45,68,0.95)] hover:border-[#E1C380] hover:shadow-[0_20px_50px_rgba(0,0,0,0.75),0_0_20px_rgba(225,195,128,0.3)] cursor-pointer"
						: "bg-[rgba(20,30,42,0.4)] border border-[rgba(255,243,199,0.14)] text-[#FFF3C7]/75 hover:bg-[rgba(255,243,199,0.08)] hover:text-[#FFF3C7] hover:border-[rgba(255,243,199,0.35)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)] cursor-pointer"
				}
				${className}
			`}
		>
			{icon && (
				<span className="absolute left-4 opacity-0 translate-x-[-4px] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 icon-float">
					{icon}
				</span>
			)}

			<span className="pointer-events-none">{label}</span>
		</button>
	);
}
