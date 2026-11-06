# Case 16 dialog image data fix (intro vs NPC)

Frontend code is unchanged. The only change is a new idempotent FluentMigrator migration in remake-back that resets `OverlayBackgroundUrl` (intro preview) and `NpcCompleteUrl` (NPC scene) for the 9 case 16 dialogs, matching the case 1 convention. The frontend flow (`LevelLocation` shows `LocationIntro` while `!showDialog && !introSeen`, then `DialogBox` with `npcCompleteUrl`) is case-agnostic and was confirmed by grep. The 9 Dialog Ids and the Overlay/Npc pairings in the migration match the seed in `20261030100000_AddCases16To18.cs` and all referenced loadingscreen and dialogo_*.webp files exist.

Watch for: the deployed DB values were never read, so the migration is a blind reset and the user's actual symptom is not proven to be fixed by it (possible); the migration only takes effect after the API restarts; San Luis intros still show the NPC image because no loadingscreens exist (confirmed); test sessions with `IntroSeen=1` will still skip the intro (confirmed).

**Verdict**: APPROVED

## High-level view

The reported symptom (intro skipped, dialog showing the location image) cannot come from the frontend, which treats case 16 like case 1. It has to come from data: either dialog rows whose Overlay/Npc values differ from the seed, or sessions with `IntroSeen` already set. The change addresses the first with an additive migration and documents the SQL for the second.

The migration keeps Pampa and San Juan on loadingscreens for the intro and `dialogbackground/level16/alfajor` for the NPC. San Luis has no loadingscreen assets, so its Overlay equals the NPC image; the intro screen appears but shows the NPC scene until assets are produced.

Scope is clean: `lib/mapCalibration.ts` has no working-tree changes and the migration file is the only new code. No applied migration was modified by this change.

<details>
<summary>Issues (4)</summary>

1. **Root cause unverified (possible)** — live DB was not readable (401, no client). After restart, check one Pampa and one San Juan location with a fresh session and confirm intro then NPC; if still wrong, query `Dialogs` for the 9 ids.
2. **San Luis intro shows NPC image (confirmed)** — 3 locations lack loadingscreens; add assets under `loadingscreens/level16/province_sanluis/` and a follow-up migration updating `OverlayBackgroundUrl`.
3. **Skipped intro for used sessions (confirmed)** — `GameSessionLocations.IntroSeen=1` bypasses the intro regardless of data; run the documented optional reset on test sessions only.
4. **Pre-existing uncommitted edits to applied migrations (confirmed, not from this change)** — `remake-back` working tree modifies `AddCases6And7`, `8And9`, `10And11`, `16To18` (level1 to level16 paths). Applied migrations are not re-run, so those edits only affect fresh DBs; the new migration covers existing DBs. Should be committed or reverted by the owning workflow.

</details>

<details>
<summary>Details</summary>

## Migration as the only delivery mechanism

Because the seed for case 16 is already applied in existing databases, an additive migration is the right vehicle. Using `Update.Table("Dialogs")` keyed by Id and `CaseId = 16` is safe to re-run and `Down` is a no-op, so rollback leaves the corrected values. The dotnet build of `Data.Dapper` reported 0 errors, but the migration has not been executed against any DB and no browser check was done (report says no token and no DB access). That gap is why the root cause stays at "possible" rather than "confirmed".

## Evidence reviewed

The coder's report records `tsc` exit 0 (irrelevant since no frontend edits) and a Data.Dapper build with 0 errors; the full solution build failed only on file locks from the running API. I did not rerun builds. The `lib/` directory has no changes in `git status` for the frontend repo.

</details>

<details>
<summary>File map</summary>

- `remake-back/Data.Dapper/Migrations/20261107100000_FixCase16DialogImages.cs` (new): idempotent update of 9 case 16 dialogs.
- `.agents/tasks/case16-intro-plan.md`, `case16-intro-report.md`: task docs.

Unrelated working-tree changes (not part of this change): modified binary images under `public/images`, untracked `public/images/dialogbackground/level1/alfajor/Music/`, and the four modified applied migrations noted above.

</details>
