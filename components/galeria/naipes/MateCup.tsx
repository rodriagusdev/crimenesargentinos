import styles from "./naipes.module.css";

// Mate con bombilla y vapor, apoyado en la mesa
export default function MateCup() {
  return (
    <div className="relative w-14 h-20 shrink-0" aria-hidden>
      {/* Vapor */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`absolute top-3 h-5 w-2 rounded-full bg-white/50 blur-[3px] ${styles.steam}`}
          style={{ left: `${14 + i * 9}px`, animationDelay: `${i * 1.05}s` }}
        />
      ))}
      {/* Bombilla */}
      <span className="absolute left-[30px] top-0 h-12 w-[3px] rotate-[20deg] origin-bottom rounded-full bg-[linear-gradient(90deg,#9aa0a8,#f0f2f5,#9aa0a8)]" />
      {/* Calabaza */}
      <span className="absolute bottom-0 left-1 h-14 w-12 rounded-[45%_45%_50%_50%] bg-[radial-gradient(circle_at_35%_35%,#a0663a,#5e3417_70%)] shadow-[0_6px_10px_rgba(0,0,0,0.5)]" />
      {/* Virola y yerba */}
      <span className="absolute bottom-[50px] left-0.5 h-2.5 w-[52px] rounded-full bg-[linear-gradient(180deg,#f0f2f5,#9aa0a8)]" />
      <span className="absolute bottom-[52px] left-2 h-1.5 w-10 rounded-full bg-[#6f8f3a]" />
    </div>
  );
}
