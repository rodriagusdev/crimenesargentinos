# Case 16 province pins recalibrated in mapCalibration (final values)

Adds name and id overrides for San Juan (27/39), San Luis (36/44) and La Pampa (46/46) in lib/mapCalibration.ts, the same table that positions cases 1-5. Final state is commit 23eb7d7 on top of 94ecda3; only mapCalibration.ts and verification.md changed. Watch for: no live on-screen confirmation, only a sharp-rendered composite (possible, non-blocking).

**Verdict**: APPROVED

## High-level view

Case 16 had no calibration entries, so the raw seed Top/Left values were used and San Juan landed off-territory. The fix adds entries to the existing override table, which is the mechanism levels 1-5 use, so behavior is consistent.

The final values are coherent with the calibrated anchors: San Juan sits north of Mendoza (34/37), San Luis is south-east of Mendoza and south of San Juan, La Pampa lies below San Luis, east of Neuquen (45/37) and west of Buenos Aires (42/54). All are inside the territory. Localities in /level/16/<provinceId> are cards without coordinates, so nothing applies there.

Other levels are untouched: the diff only adds keys, with case 16 GUIDs and three by-name keys. The name keys could affect another level only if it contains those provinces and has no ID override (possible, not verified).

<details>
<summary>Issues (1)</summary>

1. **No live visual confirmation** — verified only via a rendered composite, not the running page; open /level/16 once and nudge if needed (possible, non-blocking).

</details>

<details><summary>Details</summary>

The earlier review pass described the first-fix values (28/36, 35/41, 44/42); those were superseded by the nudge in 23eb7d7, which moved San Juan off the western border glow and San Luis off Mendoza. This pass evaluates the final values only. La Pampa (46/46) is close to Rio Negro (52/44) but about 6% of monitor height apart, enough to avoid overlap.

</details>

<details><summary>File map</summary>

- lib/mapCalibration.ts: case 16 entries by name and by id
- .agents/tasks/level16-markers/verification.md: evidence notes

Full diff: git diff 94ecda3~1 HEAD
</details>
