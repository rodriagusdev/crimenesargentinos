import LevelCard from "./LevelCard";

export default function Levels() {
const levels = [
    {
      title: "Robo a las Estrellas",
      description: "El trofeo mundial desapareció tras los festejos. Busca pistas en el Obelisco.",
    },
    {
      title: "Los Desaparecidos del Interior",
      description: "Trenes fantasmas y estaciones abandonadas. ¿A dónde fueron los pasajeros?",
    },
    {
      title: "Caso Patagonia",
      description: "Una estación científica incomunicada oculta un secreto en el fin del mundo.",
    },
    {
      title: "¿Qué pasó en la Ruta Nacional 40?",
      description: "Tráfico de datos corruptos en una red que se extiende por todo el país.",
    },
    {
      title: "El Asesino de las Provincias",
      description: "Un rastro de crímenes que conecta las costumbres y regiones argentinas.",
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
            title={level.title}
            description={level.description}
          />
        ))}
      </div>
    </section>
  );
}
