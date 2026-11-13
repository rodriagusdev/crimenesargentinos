import ThumbTab from "./ThumbTab";
import { THUMB_GROUPS } from "./guiaIndex";

type Props = { targets: Record<string, string>; onJump: (anchor: string) => void; vertical: boolean };

// Uñero A–Z: pestañas negras cortadas en el canto de las hojas. Las letras sin nadie quedan apagadas.
export default function ThumbIndex({ targets, onJump, vertical }: Props) {
  return (
    <nav
      aria-label="Índice alfabético"
      className={vertical ? "flex flex-col justify-around gap-1 py-6 h-full" : "flex flex-wrap justify-center gap-1"}
    >
      {THUMB_GROUPS.map((g) => (
        <ThumbTab key={g} label={g} target={targets[g]} onJump={onJump} vertical={vertical} />
      ))}
    </nav>
  );
}
