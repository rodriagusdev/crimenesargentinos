// Siluetas de sospechosos sin identificar (estilo rueda de reconocimiento)

export type SilhouetteVariant = "fedora" | "cap" | "longhair" | "beret";

const HEADS: Record<SilhouetteVariant, string> = {
  // Sombrero de ala ancha
  fedora: "M28 34h44l-4-4h-4l-3-12q-11-6-22 0l-3 12h-4z",
  // Gorra con visera
  cap: "M34 30q0-14 16-14t16 14h12v4H34z",
  // Pelo largo
  longhair: "M33 46q-3-28 17-28t17 28l-4 8H37z",
  // Boina
  beret: "M33 30q2-12 19-12 14 0 15 9 0 4-6 5H36q-4 0-3-2z",
};

type SuspectSilhouetteProps = {
  variant: SilhouetteVariant;
  /** false: solo la figura, sin el fondo de rueda de reconocimiento */
  backdrop?: boolean;
};

export default function SuspectSilhouette({ variant, backdrop = true }: SuspectSilhouetteProps) {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
      {backdrop && (
        <>
          {/* Fondo de rueda de reconocimiento con marcas de altura */}
          <rect width="100" height="100" fill="#3a4250" />
          {[20, 35, 50, 65, 80].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#cfd6e0" strokeOpacity="0.35" strokeWidth="0.8" />
          ))}
          <rect width="100" height="100" fill="url(#splash-spot)" />
          <defs>
            <radialGradient id="splash-spot" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fff2cf" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
            </radialGradient>
          </defs>
        </>
      )}

      {/* Cuerpo y cabeza */}
      <g fill="#0b0d12">
        <path d="M14 100q2-30 24-34l12 6 12-6q22 4 24 34z" />
        <rect x="44" y="56" width="12" height="12" />
        <ellipse cx="50" cy="44" rx="13" ry="15" />
        <path d={HEADS[variant]} />
      </g>

      {/* Identidad desconocida */}
      {backdrop && (
        <text x="50" y="52" textAnchor="middle" fontSize="16" fill="#e1c380" fillOpacity="0.85" fontFamily="inherit">
          ?
        </text>
      )}
    </svg>
  );
}
