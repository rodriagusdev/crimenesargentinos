# Case 16 intro/dialog report

## Root cause
Frontend (`LevelLocation`, `LocationIntro`, `DialogBox`) behaves as in case 1: intro (`overlayBackgroundUrl || npcCompleteUrl` + `infoBackground`) shows when `!showDialog && !introSeen`, then `DialogBox` uses `npcCompleteUrl`. The defect is in the case 16 dialog data:
- San Luis dialogs (corredora, paleontologa, dulcera) have `OverlayBackgroundUrl` = NPC image (no `loadingscreens/level16/province_sanluis/` exists).
- The live DB could not be read (API returns 401, no DB client), so deployed values are UNVERIFIED; earlier fixes edited the DB / applied migrations directly. The intro is also skipped when `GameSessionLocations.IntroSeen=1` for a test session.

## Files changed
- NEW `remake-back/Data.Dapper/Migrations/20261107100000_FixCase16DialogImages.cs`: idempotent UPDATE of the 9 case 16 Dialogs (by Id + CaseId=16): Overlay = loadingscreens (Pampa/San Juan), Npc = dialogbackground/level16/alfajor/dialogo_*.webp. San Luis overlay = NPC image (no loadingscreen yet). Applied migrations untouched.
- No frontend change.

## Verification
- `cmd.exe /c npx tsc --noEmit` in crimenesargentinos: exit 0.
- `dotnet build Data.Dapper`: 0 errors. Full solution build only failed on file locks because the API (PID 2312) is running.
- Not run: dev server / browser check (no auth token, DB not readable). Code path traced against seed data.

## Manual steps
1. Restart the API so FluentMigrator applies `20261107100000`.
2. Optional, test sessions only (resets the skipped intro):
   `UPDATE GameSessionLocations gsl JOIN Dialogs d ON d.LocationId = gsl.LocationId SET gsl.IntroSeen = 0 WHERE d.CaseId = 16;`
3. Check `/level/16/<province>/<location>` with a fresh session: intro first, NPC after AVANZAR.

## Notes for the user
- San Luis locations (Potrero de los Funes, Sierra de las Quijadas, Merlo) have no loadingscreen; their intro shows the NPC scene until images are added under `public/images/loadingscreens/level16/province_sanluis/` and `OverlayBackgroundUrl` is updated.
- `remake-back` has uncommitted edits to applied migrations (cases 6-11, 16-18) from another workflow; cases 17/18 share the Overlay = NPC defect (out of scope).
- Not committed in `remake-back` (AGENTS.md rule); the new file is untracked.
