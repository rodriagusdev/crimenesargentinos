import Image from "next/image";
import SuspectSilhouette, { type SilhouetteVariant } from "@/components/splash/SuspectSilhouette";
import type { GallerySuspect } from "@/lib/suspectReleases";

const VARIANTS: SilhouetteVariant[] = ["fedora", "cap", "longhair", "beret"];

// Foto del sospechoso para las galerías (llena su contenedor, que debe ser relative); sin foto, una silueta
export default function SuspectPhoto({ suspect, index, className = "" }: { suspect: GallerySuspect; index: number; className?: string }) {
  if (!suspect.image) return <SuspectSilhouette variant={VARIANTS[index % VARIANTS.length]} />;
  return (
    <Image
      src={suspect.image}
      alt={suspect.name}
      fill
      sizes="(max-width: 640px) 45vw, 200px"
      className={`object-cover object-top ${className}`}
    />
  );
}
