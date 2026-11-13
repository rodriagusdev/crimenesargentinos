// Cartel de anuncios que corre al pie del tablero (el texto va dos veces para que el loop no tenga salto)
const DEFAULT_LINES = [
  "BIENVENIDOS A LA REPÚBLICA ARGENTINA",
  "WELCOME TO ARGENTINA",
  "NO DEJE SU EQUIPAJE SIN VIGILANCIA",
  "CAMBIO DE MONEDA EN EL HALL CENTRAL",
  "LA CENTRAL LE DESEA UNA FELIZ ESTADÍA",
];

export default function ArrivalsTicker({ highlight }: { highlight?: string }) {
  const lines = highlight ? [highlight, ...DEFAULT_LINES] : DEFAULT_LINES;
  const text = lines.join("   ✦   ");
  return (
    <div className="overflow-hidden rounded-b-xl border-4 border-t-0 border-[#2a2f38] bg-[#0b0d10] py-2" aria-label={lines.join(". ")}>
      <div className="arribos-ticker flex w-max whitespace-nowrap text-[10px] sm:text-xs text-[#ff9f43]" aria-hidden>
        <span className="pr-12">{text}</span>
        <span className="pr-12">{text}</span>
      </div>
    </div>
  );
}
