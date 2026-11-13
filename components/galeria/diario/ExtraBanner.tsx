import styles from "./diario.module.css";

// Pregón del canillita cuando sale la edición especial
export default function ExtraBanner({ count }: { count: number }) {
  return (
    <div role="status" className={`flex items-center gap-3 rounded-sm bg-[#c81e1e] px-3 py-2.5 text-white shadow-[0_10px_24px_rgba(0,0,0,0.6)] ${styles.shout}`}>
      <span className={`text-2xl sm:text-3xl ${styles.shake}`} aria-hidden>
        📣
      </span>
      <p className="min-w-0">
        <span className="block font-serif font-black text-lg sm:text-2xl leading-none">¡EXTRA! ¡EXTRA!</span>
        <span className="block mt-1 text-[10px] sm:text-xs leading-relaxed">
          ¡SALIÓ LA EDICIÓN ESPECIAL! ¡{count} CARAS NUEVAS EN LA GALERÍA!
        </span>
      </p>
      <span className="ml-auto hidden sm:block text-3xl" aria-hidden>
        🗞️
      </span>
    </div>
  );
}
