# Level 16 marker positions
Cause: the seed (remake-back migration 20261030100000_AddCases16To18.cs, read only) gives case 16 pins Top/Left values that don't match the tactical-monitor map. Cases 1-5 are overridden in `lib/mapCalibration.ts`; case 16 was not.
Fix: case 16 entries (by province id and by name) in `lib/mapCalibration.ts`, applied by `levelService.getLevelProvinces`.
| Province | Seed top/left | First fix | Final top/left |
|---|---|---|---|
| San Juan | 32% / 29% | 28% / 36% | 27% / 39% |
| San Luis | 48% / 39% | 35% / 41% | 36% / 44% |
| La Pampa | 61% / 46% | 44% / 42% | 46% / 46% |
Visual check: rendered test_composite.webp (resized to 1155x644), cropped to the tactical monitor box and drew the pins (plus Mendoza, Cordoba, Buenos Aires, Neuquen as references) using sharp. First fix left San Juan on the western border glow and San Luis overlapping Mendoza; final values put San Juan in the Cuyo/Andes strip north of Mendoza, San Luis east of it, La Pampa south-east of San Luis, all inside the territory.
Localities in /level/16/<provinceId> are polaroid cards without coordinates; nothing to fix.
Checks: `npx tsc --noEmit` exit 0. Dev server not started (API needs login); temp scripts removed.
