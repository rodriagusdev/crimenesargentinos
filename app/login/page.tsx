"use client";

import PrincipalMenu from "@/components/login/PrincipalMenu";
import RegisterAndLogin from "@/components/login/RegisterAndLogin";
import Image from "next/image";
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
