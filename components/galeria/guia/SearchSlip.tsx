// Papelito con el buscador "¿A quién busca?": lo escrito hojea la guía hasta la primera coincidencia
type Props = { query: string; matches: number; onChange: (q: string) => void };

export default function SearchSlip({ query, matches, onChange }: Props) {
  const searching = query.trim().length >= 2;
  return (
    <label className="relative block w-full max-w-sm -rotate-1 bg-[#fffbe8] px-4 pt-5 pb-3 shadow-[0_10px_20px_rgba(0,0,0,0.55)] bg-[repeating-linear-gradient(180deg,transparent_0_23px,#b9d3ef_23px_24px)]">
      <span className="absolute top-0 inset-x-0 h-2.5 bg-[#c81e1e]/85" aria-hidden />
      <span className="block font-serif italic text-base text-[#1d3f8a]">¿A quién busca?</span>
      <input
        type="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escribí un nombre…"
        className="mt-1 w-full bg-transparent border-b-2 border-[#1d3f8a]/50 font-mono text-base text-[#1b1813] placeholder:text-[#1b1813]/35 outline-none focus:border-[#c81e1e]"
      />
      <span className="mt-1.5 block h-4 font-mono text-xs text-[#1d3f8a]" aria-live="polite">
        {searching ? (matches ? `${matches} en la guía ✓` : "No figura en esta edición") : ""}
      </span>
    </label>
  );
}
