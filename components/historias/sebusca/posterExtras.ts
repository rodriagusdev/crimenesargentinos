// Textos propios de los carteles: la recompensa y cómo concuerda "visto por última vez" con lo que se busca.
// Solo juegan con lo que ya cuenta CASE_STORIES: nada de rutas, escondites, testigos ni rasgos de quien lo hizo.

type PosterExtra = { seen: string; reward: string };

const EXTRAS: Record<string, PosterExtra> = {
  estrellas: { seen: "Visto por última vez", reward: "Gloria eterna y una vuelta olímpica para el detective que lo recupere" },
  mananeros: { seen: "Vistos por última vez", reward: "Un asado para todo el grupo, y gloria eterna para el detective que los traiga de vuelta" },
  patagonia: { seen: "Vista por última vez", reward: "Gloria eterna para el detective que la saque a la luz" },
  ruta40: { seen: "Visto por última vez", reward: "El abrazo de su familia y gloria eterna para el detective que lo encuentre" },
  provincias: { seen: "Vistos por última vez", reward: "Un lugar de honor en el próximo corso para el detective que los recupere" },
  alfajor: { seen: "Visto por última vez", reward: "Alfajores de por vida para el detective que lo recupere" },
  camiseta: { seen: "Vista por última vez", reward: "Gloria eterna para el detective que la devuelva a su vitrina" },
  bandoneon: { seen: "Visto por última vez", reward: "Un tango dedicado y gloria eterna para el detective que lo recupere" },
};

const FALLBACK: PosterExtra = { seen: "Visto por última vez", reward: "Gloria eterna para el detective que lo recupere" };

export const posterExtra = (id: string): PosterExtra => EXTRAS[id] ?? FALLBACK;
