import LevelCard from "./LevelCard";

export default function Levels() {
  const levels = [
    {
      title: "Nivel 1",
      description:
        "Las praderas del reino. Un lugar tranquilo para comenzar la aventura.",
    },
    {
      title: "Nivel 2",
      description: "Bosques antiguos llenos de senderos ocultos y secretos.",
    },
    {
      title: "Nivel 3",
      description: "Ruinas olvidadas donde permanecen reliquias del pasado.",
    },
    {
      title: "Nivel 4",
      description:
        "Montañas heladas que desafían incluso a los héroes más fuertes.",
    },
    {
      title: "Nivel 5",
      description: "La fortaleza final donde aguarda el desafío definitivo.",
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
