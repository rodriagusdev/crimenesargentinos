import re
from pathlib import Path

PUBLIC_ROOT = Path(r"C:\Desarrollo\seminario\crimenesargentinos\public")
MIGRATION = Path(r"C:\Desarrollo\seminario\remake-back\Data.Dapper\Migrations\20261030100000_AddCases16To18.cs")


def main() -> None:
    text = MIGRATION.read_text(encoding="utf-8")
    rels = re.findall(r'"(/images/[^"]+)"', text)
    interesting = [
        rel for rel in rels
        if any(case in rel for case in ("alfajor", "camiseta86", "bandoneon"))
        or rel.startswith("/images/suspects/level1/")
    ]

    missing = []
    for rel in sorted(set(interesting)):
        full = PUBLIC_ROOT / rel.lstrip("/")
        if not full.exists():
            missing.append(rel)

    print(f"VALIDATION_ONLY {len(interesting)} referenced paths checked")
    print(f"MISSING {len(missing)}")
    for item in missing:
        print(item)


if __name__ == "__main__":
    main()
