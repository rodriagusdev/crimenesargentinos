# Case 16 intro/dialog image plan

## What I read and checked
- Frontend flow (`components/Level/LevelLocation.tsx`): the historical screen (`LocationIntro`) shows when `!showDialog && !introSeen`. Otherwise it shows `DialogBox`. `introSeen` comes from the session's `visitedLocations[].introSeen`, which the backend stores in `GameSessionLocations.IntroSeen`. It is set to 1 only by `markIntroSeen` when the user clicks AVANZAR.
- `LocationIntro.tsx` uses `dialog.overlayBackgroundUrl || dialog.npcCompleteUrl` and `dialog.infoBackground`.
- `DialogBox.tsx` (line ~125) uses `dialog.npcCompleteUrl`.
- `services/levelService.ts` `getDialog` only rewrites `.jpg` to `.webp` for `/dialogbackground/` URLs. It does no swapping and no level remapping.
- The frontend logic matches case 1, so it is correct. No frontend change is needed.
- Case 1 seed (`20260925100006_SeedDialogs.cs`):
  - `OverlayBackgroundUrl` = `/images/loadingscreens/level1/province_x/<place>.webp` (intro image).
  - `NpcCompleteUrl` = `/images/dialogbackground/level1/dialogo_*` (NPC scene).
  - `InfoBackground` = historical text.
- Case 16 seed (`remake-back/Data.Dapper/Migrations/20261030100000_AddCases16To18.cs`, dialogs section ~line 615+):
  - Pampa (3) and San Juan (3): Overlay is `loadingscreens/level16/province_*/<x>.webp` and Npc is `dialogbackground/level16/alfajor/dialogo_*.webp`. All 6 loadingscreen files exist in `public/images/loadingscreens/level16/` and are correct.
  - San Luis (3: corredora, paleontologa, dulcera): `OverlayBackgroundUrl` is the NPC image (`dialogbackground/.../dialogo_*.webp`), the same as `NpcCompleteUrl`. There is no `loadingscreens/level16/province_sanluis/` folder. Here the intro shows the NPC scene instead of a place preview.
  - All `InfoBackground` texts are filled.
- Working-tree state:
  - `remake-back` has UNCOMMITTED edits to the already-applied migration. They rewrite `level1/alfajor` paths to `level16/alfajor` in `20261030100000_AddCases16To18.cs`. The same uncommitted edits appear in cases 6 to 11. They come from another workflow. Do not touch them or build on them.
  - In `crimenesargentinos`, the git status has only unrelated image changes and untracked `.agents` files. There are no partial code edits for this task.
- The live DB is NOT readable. The API at `https://localhost:7127` is up but returns 401 without a token, and there is no mysql client or docker. The real DB values for case 16 dialogs are therefore UNVERIFIED.

## Root cause (confirmed from code and seed; DB state to be confirmed)
The frontend is not at fault. It is a data problem in the case 16 dialogs:
1. San Luis dialogs have `OverlayBackgroundUrl` set to the NPC image, and there is no loadingscreen for San Luis. This is a confirmed seed defect.
2. The user's report is that the NPC is not shown and the dialog shows the historical image. Only a DB with `NpcCompleteUrl` pointing to a loadingscreen/location image, or Overlay and Npc swapped, would produce that. The seed does not do this for Pampa or San Juan. The deployed DB may differ from the seed. Earlier fixes wrote to the DB directly, and the `level1` to `level16` path edits happened after the migration was applied. Confirm in the DB first (step 1).
3. Intro skipped: the intro is skipped only when `IntroSeen=1` for that location in the player's session. Sessions already used for testing case 16 will skip it. The `/images/locations/level16/alfajor/icono_*.webp` files are province icons and do not belong in dialogs.

## Steps
- [ ] 1. Confirm the real DB values. Get a bearer token by logging in through the app or API (do not print it). Call `GET {NEXT_PUBLIC_API_URL}/Dialog/GetByLocation/16/{locationId}` for the 9 case 16 location ids, taken from the `Dialogs` rows in `20261030100000_AddCases16To18.cs`. Record `overlayBackgroundUrl`, `npcCompleteUrl` and `infoBackground` for each. If the API cannot be called, assume the seed values are what is deployed and proceed with step 2 as an idempotent UPDATE. Verify: a table of 9 rows is written in the step report.
- [ ] 2. Add a NEW additive migration `remake-back/Data.Dapper/Migrations/20261107100000_FixCase16DialogImages.cs`. Follow the pattern of `20261106120000_AddAvatarUrlToUsers.cs` for the attribute and base class. Never edit applied migrations. `Up` runs `Update.Table("Dialogs")` or `Execute.Sql` keyed by the 9 Dialog `Id` GUIDs from the seed:
  - Pampa and San Juan: `OverlayBackgroundUrl` is `/images/loadingscreens/level16/province_pampa|province_sanjuan/<x>.webp`. `NpcCompleteUrl` is `/images/dialogbackground/level16/alfajor/dialogo_<npc>.webp`. `InfoBackground` is the seed text.
  - San Luis: `NpcCompleteUrl` is `/images/dialogbackground/level16/alfajor/dialogo_corredora|paleontologa|dulcera.webp`. `OverlayBackgroundUrl`: no loadingscreen file exists. Keep it equal to the NPC image so the intro is not empty, and report this (see below). It must not point to `icono_*`.
  - `Down` is a no-op.
  Verify: `cmd.exe /c dotnet build` in `remake-back` succeeds. Run the migration against the dev DB only if the user can run the backend. Otherwise document `dotnet run` in API (FluentMigrator runs on startup) and the equivalent SQL as a fallback.
- [ ] 3. Reset the skipped intro for case 16 testing. Document this SQL, with a clear warning that it is optional and affects only test sessions: `UPDATE GameSessionLocations gsl JOIN Dialogs d ON d.LocationId = gsl.LocationId SET gsl.IntroSeen = 0 WHERE d.CaseId = 16;`. Put it as a comment or script `remake-back/Data.Dapper/Scripts/` only if that folder already exists. Otherwise put it in the final report. Verify: after the fix and with a fresh session, `/level/16/<province>/<location>` shows the intro first.
- [ ] 4. Frontend: no code change expected. Only if step 1 shows `overlayBackgroundUrl` empty or equal to `npcCompleteUrl`: no change either, since the fallback is already in `LocationIntro.tsx`. Verify with `cmd.exe /c npx tsc --noEmit` (the project's real check; npm/npx must be called via `cmd.exe /c`) only if any frontend file was edited.
- [ ] 5. Manual check in the browser at `http://localhost:3000/level/16`. Fresh session, open a Pampa location, then a San Juan one, then a San Luis one.
  - Expected: the intro with the loadingscreen image and historical text appears first.
  - After AVANZAR, the dialog shows the NPC scene.

## Report to the user (required by the notification)
Locations WITHOUT a loadingscreen image (not generated, content decision needed): the 3 San Luis locations (Potrero de los Funes, Sierra de las Quijadas, Merlo). Their intro shows the NPC image until loadingscreens are added under `public/images/loadingscreens/level16/province_sanluis/`, plus a follow-up update of `OverlayBackgroundUrl`. The Pampa locations (parqueluro, lagunadontomas, casadepiedra) DO have loadingscreens in `public/images/loadingscreens/level16/province_pampa/`. Everything for La Pampa and San Juan points to `loadingscreens` for the intro and to `dialogbackground` for the dialog, as in case 1.
Also tell the user: `remake-back` has uncommitted edits to already-applied migrations from another workflow. A new migration is the only safe way to change an existing DB. Cases 17 and 18 have the same defect in their seed (Overlay equals the NPC image), but they are out of scope here.

## Constraints
No tests. Do not touch `lib/mapCalibration.ts`. Do not open images directly. No temp previews are needed since the paths are enough.
