# Case 16 portraits (level16/alfajor)

Output: 384x384 webp (q85), same as the existing level1 placeholders and 384px portraits. Source: dialogo_<npc>.png (1536x1024), lanczos3 resize. Backup of the 9 placeholders: .agents/tasks/portraits-backup/. DB/seed (PortraitUrl) filenames match existing files; nothing changed there.

| NPC (seed) | File | Crop in source px (left, top, side) |
|---|---|---|
| Don Beto, camionero | cara_camionero.webp | 514, 250, 260 (tight redo; face is small in scene) |
| Lucía, corredora | cara_corredora.webp | 280, 20, 400 |
| Don Remigio, cuidador | cara_cuidador_santuario.webp | 260, 80, 380 |
| Doña Nelly, dulcera | cara_dulcera.webp | 240, 40, 380 |
| Rocío, guía Valle | cara_guia_ischigualasto.webp | 230, 10, 440 |
| Doña Elsa, guía Luro | cara_guia_luro.webp | 300, 60, 380 |
| Marga, paleontóloga | cara_paleontologa.webp | 210, 0, 400 |
| Flaco Ruiz, remero | cara_remero.webp | 280, 30, 400 |
| Facu, windsurfista | cara_windsurfista.webp | 230, 30, 400 |

Verified: 9 distinct hashes, all 384x384 webp, faces visually checked in a contact sheet.

Uncertain: AgentPortraitHUD.tsx / DialogBox.tsx grep found no "ortrait" matches, so I did not confirm how they consume PortraitUrl; sizing follows existing files. Paleontóloga/corredora are cropped close at the chin/shoulders. Camionero crop is lower resolution (260px upscaled). No commit made.
