import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { buildCaseAssetPath, type CaseAssetKind, slugify } from "@/lib/caseAssetPaths";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const rawKind = String(formData.get("kind") || "preview");
    const level = Number(formData.get("level") || 1);
    const slug = String(formData.get("slug") || "caso");

    if (!(file instanceof File)) {
      return Response.json({ error: "No se recibió un archivo válido." }, { status: 400 });
    }

    const kind = rawKind === "preview" || rawKind === "map" || rawKind === "dialog" || rawKind === "portrait" || rawKind === "location"
      ? rawKind
      : "preview";

    const safeSlug = slugify(slug);
    const asset = buildCaseAssetPath(kind, level, safeSlug, file.name);
    await mkdir(path.dirname(asset.absolutePath), { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(asset.absolutePath, buffer);

    return Response.json({
      url: asset.relativePath,
      path: asset.relativePath,
      filename: asset.filename,
      kind,
      level,
      slug: safeSlug,
    });
  } catch (error) {
    console.error("case asset upload failed", error);
    return Response.json(
      { error: "No se pudo guardar la imagen del caso." },
      { status: 500 },
    );
  }
}
