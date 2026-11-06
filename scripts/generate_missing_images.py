from pathlib import Path
import shutil

root = Path(r"C:\Desarrollo\seminario\crimenesargentinos\public\images")
root.mkdir(parents=True, exist_ok=True)

source_login = root / "principal_background.webp"
source_dialog = root / "slate_board.webp"
source_map = root / "maps" / "level1" / "Mapa_buenos_aires.jpg"

files = [
    (source_login, root / "backgroundlogin.jpeg"),
    (source_dialog, root / "default-dialog-overlay.jpg"),
    (source_map, root / "test_map.jpg"),
]

for src, dst in files:
    if not src.exists():
        raise FileNotFoundError(f"Missing source asset: {src}")
    shutil.copy2(src, dst)
    print(f"copied: {src.name} -> {dst.name}")

print("finished:", sorted(p.name for p in root.iterdir() if p.name in {'backgroundlogin.jpeg', 'default-dialog-overlay.jpg', 'test_map.jpg'}))
