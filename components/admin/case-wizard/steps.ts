import type { CaseWizardCatalog } from "@/hooks/useCaseWizardCatalog";
import type { CaseDraft } from "@/models/ICaseDraft";

// Pasos en el orden en que dependen los datos: el caso, después las provincias (de ellas salen las locaciones),
// el recorrido, los sospechosos (de sus rasgos salen las pistas), las pistas, los testigos que las dan y la revisión
export const WIZARD_STEPS = [
  { title: "Caso", subtitle: "Título, nivel y textos" },
  { title: "Provincias", subtitle: "Dónde transcurre" },
  { title: "Recorrido", subtitle: "Inicio y escondite" },
  { title: "Sospechosos", subtitle: "Y el culpable" },
  { title: "Pistas", subtitle: "Una pista, un dato" },
  { title: "Testigos", subtitle: "Uno por locación" },
  { title: "Revisión", subtitle: "Costos y tiempo inicial" },
] as const;

// Lo mínimo para pasar al paso siguiente; el resto lo valida el backend en la revisión
export function stepError(step: number, draft: CaseDraft, catalog: CaseWizardCatalog): string | null {
  switch (step) {
    case 0:
      return !draft.title.trim() || !draft.description.trim() ? "Completá el título y la descripción." : null;
    case 1:
      return draft.provinces.length < 2 ? "Elegí al menos 2 provincias." : null;
    case 2: {
      if (!draft.startLocationId || !draft.criminalLocationId) return "Elegí la locación inicial y el escondite.";
      const provinceOf = (id: string) => catalog.locations.find((l) => l.id === id)?.provinceId;
      return provinceOf(draft.startLocationId) === provinceOf(draft.criminalLocationId)
        ? "La locación inicial y el escondite tienen que estar en provincias distintas."
        : null;
    }
    case 3:
      if (draft.suspects.length < 2) return "Elegí al menos 2 sospechosos.";
      return draft.suspects.filter((s) => s.isGuilty).length !== 1 ? "Marcá cuál es el culpable." : null;
    case 4:
      if (!draft.clues.some((c) => c.isInitial)) return "Agregá al menos una pista inicial.";
      return draft.clues.some((c) => !c.description.trim()) ? "Hay pistas sin texto." : null;
    default:
      return null;
  }
}
