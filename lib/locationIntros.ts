// El backend guarda la misma imagen para la intro y el interrogatorio en algunos casos;
// acá se asigna un paisaje sin el testigo para la pantalla previa al diálogo.
const DIALOG = "/images/dialogbackground/level17/camiseta86";
const INTRO = "/images/loadingscreens/level17";

const INTRO_BY_SCENE: Record<string, string> = {
  [`${DIALOG}/dialogo_banero.webp`]: `${INTRO}/province_santiago/termas.webp`,
  [`${DIALOG}/dialogo_empanadera.webp`]: `${INTRO}/province_santiago/catedral.webp`,
  [`${DIALOG}/dialogo_changuito.webp`]: `${INTRO}/province_santiago/parqueaguirre.webp`,
  [`${DIALOG}/dialogo_promesante.webp`]: `${INTRO}/province_catamarca/virgendelvalle.webp`,
  [`${DIALOG}/dialogo_tejedora.webp`]: `${INTRO}/province_catamarca/portezuelo.webp`,
  [`${DIALOG}/dialogo_sandboard.webp`]: `${INTRO}/province_catamarca/fiambala.webp`,
  [`${DIALOG}/dialogo_minero.webp`]: `${INTRO}/province_larioja/cablecarril.webp`,
  [`${DIALOG}/dialogo_pescador.webp`]: `${INTRO}/province_larioja/diquelossauces.webp`,
  [`${DIALOG}/dialogo_guardaparque.webp`]: `${INTRO}/province_larioja/talampaya.webp`,
};

export function introForScene(sceneUrl: string | undefined): string | undefined {
  return sceneUrl ? INTRO_BY_SCENE[sceneUrl] : undefined;
}
