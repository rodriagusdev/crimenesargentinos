import styles from "./cartelera.module.css";

const SEATS = 22;

// Siluetas del público en la platea; en la noche de estreno se paran a aplaudir y gritan "¡BRAVO!"
export default function Audience({ cheering }: { cheering: boolean }) {
  return (
    <div className="relative h-20 sm:h-24 overflow-hidden rounded-b-xl bg-[linear-gradient(180deg,#120808,#050304)]" aria-hidden>
      {cheering && (
        <p className={`${styles.pulse} absolute top-1 inset-x-0 text-center text-[10px] sm:text-xs text-[#ffd447]`}>¡BRAVO! ¡BRAVO! 👏</p>
      )}
      <div className="absolute inset-x-0 bottom-0 flex justify-between px-1">
        {Array.from({ length: SEATS }, (_, i) => (
          <span
            key={i}
            className={`flex flex-col items-center ${i >= 13 ? "hidden lg:flex" : i >= 9 ? "hidden sm:flex" : ""} ${cheering ? styles.cheer : styles.head}`}
            style={{ animationDelay: `${(i * 0.37) % (cheering ? 0.45 : 3.2)}s` }}
          >
            <span className="size-5 sm:size-6 rounded-full bg-[#020102]" />
            <span className="-mt-1 h-6 sm:h-7 w-8 sm:w-10 rounded-t-full bg-[#020102]" />
          </span>
        ))}
      </div>
      {/* Respaldo de las butacas */}
      <span className="absolute inset-x-0 bottom-0 h-4 bg-[repeating-linear-gradient(90deg,#4a0c12_0_28px,#2a060a_28px_32px)]" />
    </div>
  );
}
