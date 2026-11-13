"use client";

import { useRouter } from "next/navigation";
import GameButton from "../buttons/GameButton";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";

const messages = defineMessages({
	es: { title: "MENU PRINCIPAL", continue: "CONTINUAR", newGame: "NUEVA PARTIDA", options: "OPCIONES" },
	en: { title: "MAIN MENU", continue: "CONTINUE", newGame: "NEW GAME", options: "OPTIONS" },
});

export default function PrincipalMenu() {
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	const t = useT(messages);


	const handleContinuar = () => {
		if (isAuthenticated) {
			router.push("/");
		} else {
			router.push("/login");
		}
	};

	return (
		<div className="w-full max-w-[480px] p-6 sm:p-8 rounded-xl bg-[#2a3a4a]/35 backdrop-blur-[10px] border border-[#fff3c7]/15 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
			<h2 className="mb-6 sm:mb-8 text-center text-2xl sm:text-4xl tracking-widest text-[#E1C380] [text-shadow:_0_2px_0_#1E2A36,_0_0_10px_rgba(0,0,0,0.8)]">
				{t("title")}
			</h2>

			<div className="flex flex-col gap-4">
				<GameButton
					icon="🗺️"
					label={t("continue")}
					onClick={handleContinuar}
				/>
				<GameButton icon="📁" label={t("newGame")} />
				<GameButton icon="⚙️" label={t("options")} />
			</div>
		</div>
	);
}
