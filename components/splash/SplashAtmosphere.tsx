"use client";

import EvidencePolaroid, { EvidencePhoto } from "./EvidencePolaroid";
import SplashBackdrop from "./SplashBackdrop";
import SplashDeskProps from "./SplashDeskProps";

const EVIDENCE: EvidencePhoto[] = [
  {
    silhouette: "fedora",
    caption: "N.N. #1",
    position: "top-[7%] left-[4%]",
    rotate: -9,
    fromX: "-60vw",
    fromY: "-20vh",
    delayMs: 150,
  },
  {
    silhouette: "cap",
    caption: "VISTO 02:40 HS",
    position: "top-[9%] right-[4%]",
    rotate: 8,
    fromX: "60vw",
    fromY: "-30vh",
    delayMs: 320,
  },
  {
    silhouette: "longhair",
    caption: "SIN COARTADA",
    position: "bottom-[9%] left-[6%] hidden md:block",
    rotate: 6,
    fromX: "-50vw",
    fromY: "40vh",
    delayMs: 480,
  },
  {
    silhouette: "beret",
    caption: "PRÓFUGO",
    position: "bottom-[7%] right-[6%] hidden md:block",
    rotate: -7,
    fromX: "50vw",
    fromY: "40vh",
    delayMs: 620,
  },
];

// Ambiente del splash: lluvia, relámpago, patrullero, lámpara con polvo, escritorio con evidencia y look de cámara de vigilancia
export default function SplashAtmosphere({ lampOn }: { lampOn: boolean }) {

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <SplashBackdrop lampOn={lampOn} />
      <div className="splash-rain absolute inset-0" />
      <div className="splash-lightning absolute inset-0" />
      <div className="splash-siren absolute inset-0" />

      {/* Luces del patrullero estacionado afuera, rebotando en los bordes */}
      {lampOn && (
        <>
          <div className="splash-edge-red absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-red-600/25 to-transparent" />
          <div className="splash-edge-blue absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-blue-600/25 to-transparent" />
        </>
      )}

      {/* Escritorio */}
      <div className="absolute bottom-0 inset-x-0 h-[38%] bg-gradient-to-b from-[#2a1a0f] to-[#120a05] shadow-[inset_0_12px_30px_rgba(0,0,0,0.6)]" />

      {/* Cono de luz de la lámpara + polvo flotando */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${lampOn ? "splash-lamp opacity-100" : "opacity-0"}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_50%_38%,rgba(255,196,110,0.34)_0%,rgba(255,170,80,0.10)_45%,transparent_75%)]" />
        <div className="splash-dust absolute inset-0" />
      </div>

      <SplashDeskProps lampOn={lampOn} />

      {EVIDENCE.map((photo) => (
        <EvidencePolaroid key={photo.silhouette} photo={photo} visible={lampOn} />
      ))}

      {/* HUD de cámara de vigilancia */}
      <div
        className={`absolute top-4 left-4 right-4 flex justify-between text-[8px] sm:text-[11px] tracking-widest text-[#FFF3C7]/70 transition-opacity duration-500 ${
          lampOn ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="splash-teletype">BUENOS AIRES · 03:14 HS</span>
        <span>
          <span className="splash-rec text-red-500">●</span> CAM 04 REC
        </span>
      </div>
    </div>
  );
}
