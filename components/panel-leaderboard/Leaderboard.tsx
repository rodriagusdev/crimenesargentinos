export default function Leaderboard() {

  return (
    <div
      className="
        w-full mx-auto
        rounded-2xl
        overflow-hidden
        bg-[rgba(42,58,74,0.35)]
        backdrop-blur-[10px]
        border border-[#fff3c7]/15
        shadow-[0_10px_40px_rgba(0,0,0,0.4)]
      "
    >
      <div className="border-b border-[#fff3c7]/15 p-5 text-center">
        <h2
          className="
            font-['Press_Start_2P']
            text-[#E1C380]
            text-xs sm:text-sm
            tracking-widest
          "
        >
          TOP PLAYERS
        </h2>
      </div>

      <div className="divide-y divide-[#fff3c7]/10">
        {users.map((user, index) => (
          <div
            key={user.username}
            className="
              flex items-center justify-between
              px-4 sm:px-6 py-4
              hover:bg-[#FFF3C7]/5
              transition-colors
            "
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="
                  w-8 h-8
                  flex items-center justify-center
                  rounded-lg
                  bg-[#FFF3C7]/10
                  border border-[#FFF3C7]/15
                  text-[#E1C380]
                  font-['Press_Start_2P']
                  text-[10px]
                  shrink-0
                "
              >
                {index + 1}
              </div>

              <span
                className="
                  truncate
                  text-[#FFF3C7]
                  font-['Press_Start_2P']
                  text-[10px] sm:text-xs
                  tracking-widest
                "
              >
                {user.username}
              </span>
            </div>

            <span
              className="
                text-[#E1C380]
                font-['Press_Start_2P']
                text-[10px] sm:text-xs
                tracking-widest
              "
            >
              {user.points.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
// MOCK USERS - EN UN FUTURO ESTO SE OBTENDRÁ DE UNA API O BASE DE DATOS
const users = [
    { username: "ShadowWolf", points: 15420 },
    { username: "PixelKnight", points: 14980 },
    { username: "DragonByte", points: 13750 },
    { username: "RetroMage", points: 13100 },
    { username: "IronGoblin", points: 12640 },
    { username: "NeonRogue", points: 11890 },
    { username: "CrystalFox", points: 11230 },
    { username: "StormRider", points: 10750 },
    { username: "VoidHunter", points: 10120 },
    { username: "GoldenSlime", points: 9630 },
  ];