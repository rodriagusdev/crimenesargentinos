"use client";

import { useRouter } from "next/navigation";
import GameButton from "../buttons/GameButton";
export default function PrincipalMenu() {
	const router = useRouter();

	return (
		<div className="w-120 p-8 rounded-xl bg-[#2a3a4a]/35 backdrop-blur-[10px] border border-[#fff3c7]/15 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
			<h2 className="mb-8 text-center text-4xl tracking-widest text-[#E1C380] [text-shadow:_0_2px_0_#1E2A36,_0_0_10px_rgba(0,0,0,0.8)]">
				MENU PRINCIPAL
			</h2>

			<div className="flex flex-col gap-4">
				<GameButton
					icon="🗺️"
					label="CONTINUAR"
					onClick={() => router.push("/")}
				/>
				<GameButton icon="📁" label="NUEVA PARTIDA" />
				<GameButton icon="⚙️" label="OPCIONES" />
			</div>
		</div>
	);
}
