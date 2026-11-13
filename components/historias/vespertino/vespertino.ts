// Datos de imprenta de cada tapa: número de edición, día y notas de relleno. Las notas son genéricas a propósito:
// no dicen nada de los casos (ni lugares de la ruta, ni testigos, ni pistas).

export type Brief = { kicker: string; title: string };

const WEEKDAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const BRIEFS: Brief[] = [
  { kicker: "Clima", title: "Se esperan lluvias para el fin de semana" },
  { kicker: "Barrio", title: "Inauguraron una plaza con juegos nuevos" },
  { kicker: "Cultura", title: "La feria del libro usado suma puestos" },
  { kicker: "Deportes", title: "Empate sin goles en el clásico del ascenso" },
  { kicker: "Transporte", title: "Cambian los horarios del tren de la tarde" },
  { kicker: "Espectáculos", title: "Vuelve la orquesta típica al teatro" },
  { kicker: "Campo", title: "Buena cosecha y precios que no acompañan" },
  { kicker: "Ciencia", title: "Un cometa se verá a simple vista el martes" },
  { kicker: "Gastronomía", title: "El concurso de empanadas ya tiene finalistas" },
  { kicker: "Turismo", title: "Récord de viajeros en el fin de semana largo" },
];

const CLASSIFIEDS = [
  "Vendo bicicleta rodado 26, poco uso.",
  "Alquilo depto. 2 amb. luminoso, con balcón.",
  "Se ofrece costurera, arreglos en el día.",
  "Clases de guitarra a domicilio. Consultar.",
  "Compro discos de pasta y tocadiscos viejos.",
  "Perdido: gato atigrado. Responde a «Mate».",
];

export function editionNumber(level: number) {
  return (1000 + level * 37).toLocaleString("es-AR");
}

export function weekday(level: number) {
  return WEEKDAYS[(level * 3) % WEEKDAYS.length];
}

export function briefsFor(level: number): Brief[] {
  return [0, 1].map((k) => BRIEFS[(level * 3 + k * 5) % BRIEFS.length]);
}

export function classifiedsFor(level: number) {
  return [0, 1, 2].map((k) => CLASSIFIEDS[(level + k * 2) % CLASSIFIEDS.length]);
}
