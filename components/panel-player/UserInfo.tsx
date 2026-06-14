// MOCK USER DATA

import InfoItem from "./UserInfoItem";

const user = {
  username: "RamiSansi",
  level: 12,
  points: 15420,
  gamesPlayed: 87,
  highScore: 3210,
};

export default function UserInfo() {
  return (
    <section
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
      <div className="p-5 border-b border-[#fff3c7]/15">
        <h2
          className="
            text-center
            text-[#E1C380]
            text-xs sm:text-sm
            tracking-widest
          "
        >
          PLAYER INFO
        </h2>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-6 text-center">
          <div
            className="
              mx-auto mb-4
              w-20 h-20
              rounded-xl
              flex items-center justify-center
              bg-[#FFF3C7]/10
              border border-[#FFF3C7]/15
            "
          >
            <span className="text-[#E1C380] text-lg">RS</span>
          </div>

          <h3 className="text-[#FFF3C7] text-xs tracking-widest">
            {user.username}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="LEVEL" value={user.level} />
          <InfoItem label="POINTS" value={user.points.toLocaleString()} />
          <InfoItem label="GAMES" value={user.gamesPlayed} />
          <InfoItem
            label="BEST SCORE"
            value={user.highScore.toLocaleString()}
          />
        </div>
      </div>
    </section>
  );
}
