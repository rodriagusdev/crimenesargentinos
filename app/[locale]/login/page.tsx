"use client";

import RegisterAndLogin from "@/components/login/RegisterAndLogin";
import SeamlessBackgroundVideo from "@/components/login/SeamlessBackgroundVideo";
import Link from "next/link";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { audioManager } from "@/lib/audioManager";
import { Suspense } from "react";
import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";

const messages = defineMessages({
	es: { home: "← INICIO", howToPlay: "¿CÓMO SE JUEGA?", about: "ACERCA DE" },
	en: { home: "← HOME", howToPlay: "HOW TO PLAY?", about: "ABOUT US" },
});

export default function Login() {
	const t = useT(messages);

	// no-desktop-zoom: el login se ve a tamaño completo (con el achique global de escritorio, el fondo se cortaba)
	return (
		<div className="no-desktop-zoom relative min-h-svh w-screen overflow-hidden flex items-center justify-center font-sans bg-black">
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

			{/* Información pública, visible sin sesión */}
			<nav className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 sm:gap-8 whitespace-nowrap text-xs tracking-widest [text-shadow:_0_2px_0_#1E2A36]">
				<Link
					href="/reglas"
					className="py-2 text-[#FFF3C7]/80 hover:text-[#E1C380]"
				>
					{t("howToPlay")}
				</Link>
				<Link
					href="/acerda-de?desde=principal"
					className="py-2 text-[#FFF3C7]/80 hover:text-[#E1C380]"
				>
					{t("about")}
				</Link>
			</nav>

			{/* Login / registro */}
			<div className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center px-4 pt-20 pb-16 sm:px-8 sm:py-16 md:px-12 md:py-20 xl:px-16 xl:py-32">
				{/* Suspense: RegisterAndLogin lee ?registro con useSearchParams */}
				<Suspense fallback={null}>
					<RegisterAndLogin />
				</Suspense>
			</div>
		</div>
	);
}
