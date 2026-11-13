"use client";

import PrincipalMenu from "@/components/login/PrincipalMenu";
import RegisterAndLogin from "@/components/login/RegisterAndLogin";
import SeamlessBackgroundVideo from "@/components/login/SeamlessBackgroundVideo";
import Link from "next/link";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { audioManager } from "@/lib/audioManager";
import { Suspense, useState } from "react";
import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";

const messages = defineMessages({
	es: { home: "← INICIO", howToPlay: "¿CÓMO SE JUEGA?" },
	en: { home: "← HOME", howToPlay: "HOW TO PLAY?" },
});

export default function Login() {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const t = useT(messages);

	return (
		<div className="relative min-h-svh w-screen overflow-hidden flex items-center justify-center font-sans bg-black">
			{/* Seamless Looping Video Background */}
			<SeamlessBackgroundVideo
				src="/videos/introvid.mp4"
				poster="/images/principal_background.webp"
				fadeDuration={0.8}
			/>

			{/* Overlay (Oscurece un poco el bg) */}
			<div className="absolute inset-0 bg-black/30 pointer-events-none" />

			{/* Volver a la home */}
			<Link
				href="/"
				onClick={() => audioManager.play("click")}
				className="absolute top-5 left-5 z-20 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#070c16]/60 border border-[#FFF3C7]/25 text-[10px] tracking-widest text-[#FFF3C7]/85 hover:text-[#E1C380] hover:border-[#E1C380] backdrop-blur-sm [text-shadow:_0_2px_0_#1E2A36]"
			>
				{t("home")}
			</Link>

			{/* Idioma */}
			<LanguageSwitcher className="absolute top-5 right-5 z-20" />

			{/* Reglas del juego (se ven sin sesión) */}
			<Link
				href="/reglas"
				className="absolute bottom-4 right-4 py-2 sm:py-0 sm:bottom-6 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-20 text-xs tracking-widest text-[#FFF3C7]/80 hover:text-[#E1C380] [text-shadow:_0_2px_0_#1E2A36]"
			>
				{t("howToPlay")}
			</Link>

			{/* Elegir que menu mostrar */}
			<div className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center px-4 pt-20 pb-16 sm:px-8 sm:py-16 md:px-12 md:py-20 xl:px-16 xl:py-32">
				{isMenuOpen ? (
					<PrincipalMenu />
				) : (
					// Suspense: RegisterAndLogin lee ?registro con useSearchParams
					<Suspense fallback={null}>
						<RegisterAndLogin setIsMenuOpen={setIsMenuOpen} />
					</Suspense>
				)}
			</div>
		</div>
	);
}
