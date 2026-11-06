# Missing DB image references

Checked 508 non-empty image/URL columns (cases.ImageUrl/VideoUrl, dialogs.PortraitUrl/OverlayBackgroundUrl/NpcCompleteUrl, locations.ImageUrl, provinces.BackgroundUrl, suspects.ImageUrl, users.AvatarUrl) against `crimenesargentinos/public`.

**Missing files after fix: 0**

No DB image reference points to a missing file.

## Before the fix

36 references (27 `dialogs.NpcCompleteUrl` + 9 `locations.ImageUrl`) pointed to `/images/dialogbackground/level1/*.jpg` but only `.webp` files exist on disk. The frontend rewrote `.jpg` to `.webp` in `services/levelService.ts` for dialogs/locations, but raw consumers (admin previews, direct requests) got 404. They were updated to `.webp`; old values are in `.agents/tasks/image-fix-db-backup.json`.

