import type { CaseWizardCatalog } from "@/hooks/useCaseWizardCatalog";
import type { CaseDraft } from "@/models/ICaseDraft";

export interface StepProps {
  draft: CaseDraft;
  update: (change: (draft: CaseDraft) => CaseDraft) => void;
  catalog: CaseWizardCatalog;
}

// Locaciones de las provincias elegidas, en el orden de las provincias
export function caseLocations(draft: CaseDraft, catalog: CaseWizardCatalog) {
  return draft.provinces.flatMap((p) => catalog.locations.filter((l) => l.provinceId === p.provinceId));
}
