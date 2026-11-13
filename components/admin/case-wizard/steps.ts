import type { CaseWizardCatalog } from "@/hooks/useCaseWizardCatalog";
import type { CaseDraft } from "@/models/ICaseDraft";
import type { StepsMessageKey } from "./steps.messages";

// Pasos en el orden en que dependen los datos: el caso, después las provincias (de ellas salen las locaciones),
// el recorrido, los sospechosos (de sus rasgos salen las pistas), las pistas, los testigos que las dan y la revisión.
// title / subtitle: claves de steps.messages.ts
export const WIZARD_STEPS = [
  { title: "caseTitle", subtitle: "caseSubtitle" },
  { title: "provincesTitle", subtitle: "provincesSubtitle" },
  { title: "routeTitle", subtitle: "routeSubtitle" },
  { title: "suspectsTitle", subtitle: "suspectsSubtitle" },
  { title: "cluesTitle", subtitle: "cluesSubtitle" },
  { title: "witnessesTitle", subtitle: "witnessesSubtitle" },
  { title: "reviewTitle", subtitle: "reviewSubtitle" },
] as const satisfies readonly { title: StepsMessageKey; subtitle: StepsMessageKey }[];

// Lo mínimo para pasar al paso siguiente; el resto lo valida el backend en la revisión.
// Devuelve la clave del mensaje a mostrar (steps.messages.ts). El inglés del contenido es opcional: no se valida
export function stepError(step: number, draft: CaseDraft, catalog: CaseWizardCatalog): StepsMessageKey | null {
  switch (step) {
    case 0:
      return !draft.title.trim() || !draft.description.trim() ? "errTitleDescription" : null;
    case 1:
      return draft.provinces.length < 2 ? "errProvinces" : null;
    case 2: {
      if (!draft.startLocationId || !draft.criminalLocationId) return "errRoute";
      const provinceOf = (id: string) => catalog.locations.find((l) => l.id === id)?.provinceId;
      return provinceOf(draft.startLocationId) === provinceOf(draft.criminalLocationId) ? "errSameProvince" : null;
    }
    case 3:
      if (draft.suspects.length < 2) return "errSuspects";
      return draft.suspects.filter((s) => s.isGuilty).length !== 1 ? "errGuilty" : null;
    case 4:
      if (!draft.clues.some((c) => c.isInitial)) return "errInitialClue";
      return draft.clues.some((c) => !c.description.trim()) ? "errEmptyClue" : null;
    default:
      return null;
  }
}
