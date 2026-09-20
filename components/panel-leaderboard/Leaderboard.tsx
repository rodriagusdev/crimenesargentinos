export default function Leaderboard() {

  return (
    <div
      className="
        w-full mx-auto
        rounded-2xl
        overflow-hidden
        backdrop-blur-xs
        border border-[rgba(255,243,199,0.18)]
        shadow-[0_20px_50px_rgba(0,0,0,0.6)]
        text-[#FFF3C7]
      "
    >
      <div className="border-b border-[rgba(255,243,199,0.12)] p-5 text-center">
        <h2
          className="
            text-[#E1C380]
            text-xs sm:text-sm
            font-semibold
            tracking-widest
          "
        >
          TOP 10
        </h2>
      </div>

      <div className="divide-y divide-[rgba(255,243,199,0.08)]">
        {users.map((user, index) => (
          <div
            key={user.username}
            className="
              flex items-center justify-between
              px-4 sm:px-6 py-4
              hover:bg-[rgba(255,243,199,0.06)]
              transition-colors
            "
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="
                  w-8 h-8
                  flex items-center justify-center
                  rounded-xl
                  bg-[rgba(20,30,42,0.6)]
                  border border-[rgba(255,243,199,0.18)]
                  shadow-[0_4px_12px_rgba(0,0,0,0.4)]
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