# Level 16 marker positions

Cause: the seed (remake-back migration 20261030100000_AddCases16To18.cs, read only) gives case 16 pins Top/Left values that don't match the tactical-monitor map. Cases 1-5 are overridden in `lib/mapCalibration.ts`; case 16 was not, so the raw seed values were used.

Fix: added case 16 entries (by province id and by name) in `lib/mapCalibration.ts`. `levelService.getLevelProvinces` already applies this table.

| Province | Old (seed) top/left | New top/left |
|---|---|---|
| San Juan | 32% / 29% | 28% / 36% |
| San Luis | 48% / 39% | 35% / 41% |
| La Pampa | 61% / 46% | 44% / 42% |

New values were derived from the existing calibrated pins (Cordoba 29/45, Mendoza 34/37, Buenos Aires 42/54, Neuquen 45/37) by interpolating latitude/longitude. San Juan is north of Mendoza, San Luis east of it, La Pampa south of San Luis.

Localities inside a province (/level/16/<provinceId>) are rendered as polaroid cards with no coordinates, so no positioning issue exists there.

Checks: `npx tsc --noEmit` passes (exit 0), re-run in the review iteration.
Not done: no visual/screenshot check. The API returns 401 without a login session, and I did not run the dev server, so the positions are not confirmed on screen. Please open /level/16 to confirm and nudge values if needed.
