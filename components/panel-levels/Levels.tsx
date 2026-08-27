import { ICardLevelPreview } from "@/models/ICardLevelPreview";
import LevelCard from "./LevelCard";

export default function Levels() {
const levels: ICardLevelPreview[] = [
    {
      id:1,
      title: "Robo a las Estrellas",
      description: "El trofeo mundial desapareció tras los festejos. Busca pistas en el Obelisco.",
      imageURL: "/images/levelcardspreview/level_1_preview.jpg",
      videoURL: "/videos/intro_level_1.mp4"
    },
    {
      id:2,
      title: "Los Desaparecidos del Interior",
      description: "Trenes fantasmas y estaciones abandonadas. ¿A dónde fueron los pasajeros?",
      imageURL: "/images/levelcardspreview/level_2_preview.jpg"
    },
    {
      id:3,
      title: "Caso Patagonia",
      description: "Una estación científica incomunicada oculta un secreto en el fin del mundo.",
      imageURL: "/images/levelcardspreview/level_3_preview.jpg"
    },
    {
      id:4,
      title: "¿Qué pasó en la Ruta Nacional 40?",
      description: "Tráfico de datos corruptos en una red que se extiende por todo el país.",
      imageURL: "/images/levelcardspreview/level_4_preview.jpg"
    },
    {
      id:5,
      title: "El Asesino de las Provincias",
      description: "Un rastro de crímenes que conecta las costumbres y regiones argentinas.",
      imageURL: "/images/levelcardspreview/level_5_preview.jpg"
    },
  ];

  return (
    <section className="w-full">
      <h2
        className="
          mb-8 text-center
          font-['Press_Start_2P']
          text-[#E1C380]
          text-sm sm:text-base
          tracking-widest
        "
      >
        NIVELES
      </h2>

      <div
        className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            2xl:grid-cols-3
        "
      >
        {levels.map((level) => (
          <LevelCard
            key={level.title}
            preview={level}
  
          />
        ))}
      </div>
    </section>
  );
}
