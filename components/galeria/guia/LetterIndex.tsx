// Índice de uñero: una pestaña por letra. Las letras sin nadie quedan apagadas; la de la página que se ve, resaltada
type Props = {
  letters: Map<string, number>;
  current: Set<string>;
  onJump: (page: number) => void;
  vertical: boolean;
};

const ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

export default function LetterIndex({ letters, current, onJump, vertical }: Props) {
  return (
    <nav
      aria-label="Índice alfabético"
      className={vertical ? "flex flex-col gap-0.5 py-3" : "flex flex-wrap justify-center gap-1"}
    >
      {ALPHABET.map((l) => {
        const page = letters.get(l);
        const here = current.has(l);
        return (
          <button
            key={l}
            type="button"
            disabled={page === undefined}
            onClick={() => page !== undefined && onJump(page)}
            aria-label={`Ir a la letra ${l}`}
            className={`text-[10px] cursor-pointer transition-all disabled:cursor-default disabled:opacity-25 ${
              vertical ? "w-9 py-1 rounded-r-md text-center hover:translate-x-1" : "min-w-7 px-1 py-1.5 rounded-md"
            } ${here ? "bg-[#c81e1e] text-white translate-x-1" : "bg-[#1d3f8a] text-[#f6e7a1] hover:bg-[#2a56b5]"}`}
          >
            {l}
          </button>
        );
      })}
    </nav>
  );
}
