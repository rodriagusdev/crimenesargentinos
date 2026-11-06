# Case 16 (El Gran Robo del Alfajor) image review

## Result
No files or DB values were changed. The Downloads images are the same artwork already used by case 16, so replacing them would not improve quality. Nothing needed a backup (`case16-backup` was never created; the earlier attempt left no case 16 changes in git, only unrelated modified files under `public/images/suspects/level1`, etc.).

DB was not queried directly (`.env` only has `NEXT_PUBLIC_API_URL`; no DB credentials). Case 16 paths were taken from the `remake-back` migration `20261030100000_AddCases16To18.cs` (read only) and checked against `public/`.

## Mapping
| Downloads file | DB entity / path | Finding |
|---|---|---|
| dialogo_*.png (9) | dialogs NpcCompleteUrl `/images/dialogbackground/level16/alfajor/dialogo_*.webp` | SHA-256 identical to the `.png` already in the repo folder; webp (1452x720) derives from it. No change |
| icono_la_pampa / san_juan / san_luis.png | locations `/images/locations/level16/alfajor/icono_*.webp` | Identical to repo PNGs. No change |
| alfajor / bandoneon / camiseta86.png | `/images/levelcardspreview/*.webp` | Identical to repo PNGs. No change |
| difuntacorrea / dique / valledelaluna.png | `/images/loadingscreens/level16/province_sanjuan/*.webp` | Same 1536x1024 artwork as the current webps (compared dique visually, same). No change |

## Unmatched / uncertain (untouched)
- icono_catamarca, icono_chubut, icono_formosa, icono_la_rioja, icono_santiago_del_estero: not referenced by case 16 (it uses La Pampa, San Juan and San Luis). Likely other cases.
- Mapa pixel art.png: no clear case 16 entity (case 16 maps are `maps/level16/alfajor/mapa_*.webp`).

## Likely real low-quality items
- `/images/portraits/level16/alfajor/cara_*.webp`: all 9 files are byte-identical (same hash, 30,798 B), so they are one placeholder. Downloads has no portraits to replace them, so they need new art. Generating them would be a new content decision.
- Loading screens for La Pampa (casadepiedra, lagunadontomas, parqueluro) and the San Luis ones have no Downloads source.

The temp previews folder was removed.
