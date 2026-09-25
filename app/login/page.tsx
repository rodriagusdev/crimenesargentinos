"use client";

import PrincipalMenu from "@/components/login/PrincipalMenu";
import RegisterAndLogin from "@/components/login/RegisterAndLogin";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	return (
		<div className="relative min-h-screen w-screen overflow-hidden flex items-center justify-center font-sans bg-black">
			{/* Background */}
			<Image
				src="/images/backgroundlogin.jpeg"
				alt="Background"
				fill
				priority
				className="object-cover"
			/>

			{/* Overlay (Oscurece un poco el bg) */}
			<div className="absolute inset-0 bg-black/10" />

			{/* Reglas del juego (se ven sin sesión) */}
			<Link
				href="/reglas"
				className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-xs tracking-widest text-[#FFF3C7]/80 hover:text-[#E1C380] [text-shadow:_0_2px_0_#1E2A36]"
			>
				¿CÓMO SE JUEGA?
			</Link>

			{/* Elegir que menu mostrar */}
			<div className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center px-16 py-32">
				{isMenuOpen ? (
					<PrincipalMenu />
				) : (
					<RegisterAndLogin setIsMenuOpen={setIsMenuOpen} />
				)}
			</div>
		</div>
	);
}
