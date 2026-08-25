import LevelCard from "./LevelCard";

interface LevelsProps {
  onSelectLevel: (videoPath: string | null) => void;
  onBackToMenu: () => void; // 👈 Prop para volver al menú
}

export default function Levels({ onSelectLevel, onBackToMenu }: LevelsProps) {
  const levels = [
    {
      title: "Robo a las Estrellas",
      description: "El trofeo mundial desapareció tras los festejos. Se pinchó la fiesta",
      video: "/videos/Video_Introduccion_N1.mp4",
      image: "/images/level_cards_images/Tarjeta_Preview_N1.jpg", // 👈 Imagen N1
    },
    {
      title: "Los Desaparecidos del Interior",
      description: "Trenes fantasmas y estaciones abandonadas. ¿A dónde fueron los pasajeros?",
      video: null,
      image: "/images//level_cards_images/Tarjeta_Preview_N2.jpg", // 👈 Imagen N2
    },
    {
      title: "Caso Patagonia",
      description: "Una estación científica incomunicada oculta un secreto en el fin del mundo.",
      video: null,
      image: "/images/level_cards_images/Tarjeta_Preview_N3.jpg", // 👈 Imagen N3
    },
    {
      title: "¿Qué pasó en la Ruta Nacional 40?",
      description: "Tráfico de datos corruptos en una red que se extiende por todo el país.",
      video: null,
      image: "/images/level_cards_images/Tarjeta_Preview_N4.jpg", // 👈 Imagen N4
    },
    {
      title: "Robo brillante",
      description: "Robo de las joyas, un acto de guante blanco",
      video: null,
      image: "/images/level_cards_images/Tarjeta_Preview_N5.jpg", // 👈 Imagen N5
    },
  ];

  return (
    <section className="w-full relative flex flex-col gap-6">
      {/* Botón para volver al menú principal */}
      <div className="flex justify-start">
        <button 
          onClick={onBackToMenu}
          className="px-4 py-2 bg-[#1a232a] border border-[#2a3a4a] text-[#e1c380] font-pixel text-xs rounded hover:border-[#e1c380] transition-colors cursor-pointer flex items-center gap-2"
        >
          ⬅ VOLVER AL MENÚ
        </button>
      </div>

      {/* Grilla de tarjetas */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3">
        {levels.map((lvl, index) => (
          <div 
            key={index} 
            onClick={() => onSelectLevel(lvl.video)} 
            className="cursor-pointer"
          >
            <LevelCard 
              title={lvl.title} 
              description={lvl.description} 
              image={lvl.image} 
            />
          </div>
        ))}
      </div>
    </section>
  );
}
