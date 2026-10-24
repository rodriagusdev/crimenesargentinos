const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PUBLIC_DIR = path.resolve(__dirname, "../public/images");

async function optimizeFile(filePath) {
  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const relPath = path.relative(PUBLIC_DIR, filePath);

  // 1. Suspect avatars & portraits: resize to max 384x384 with WebP quality 82
  if ((relPath.includes("suspects") || relPath.includes("portraits")) && ext === ".webp" && stat.size > 80 * 1024) {
    const inputBuffer = fs.readFileSync(filePath);
    const buffer = await sharp(inputBuffer)
      .resize(384, 384, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    if (buffer.length < stat.size) {
      fs.writeFileSync(filePath, buffer);
      console.log(`[OPTIMIZED] Character/Suspect: ${relPath} (${formatBytes(stat.size)} -> ${formatBytes(buffer.length)})`);
      return { original: stat.size, saved: stat.size - buffer.length };
    }
  }

  // 2. Location & map icons: resize to max 256x256 WebP
  if ((relPath.includes("locations") || relPath.includes("icons")) && ext === ".webp" && stat.size > 50 * 1024) {
    const inputBuffer = fs.readFileSync(filePath);
    const buffer = await sharp(inputBuffer)
      .resize(256, 256, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    if (buffer.length < stat.size) {
      fs.writeFileSync(filePath, buffer);
      console.log(`[OPTIMIZED] Icon: ${relPath} (${formatBytes(stat.size)} -> ${formatBytes(buffer.length)})`);
      return { original: stat.size, saved: stat.size - buffer.length };
    }
  }

  // 3. Logo: resize to max width 800 with high-compression PNG
  if (relPath === "logofinal.png" && stat.size > 100 * 1024) {
    const inputBuffer = fs.readFileSync(filePath);
    const buffer = await sharp(inputBuffer)
      .resize(600, null, { fit: "inside", withoutEnlargement: true })
      .png({ compressionLevel: 9, quality: 85 })
      .toBuffer();

    if (buffer.length < stat.size) {
      fs.writeFileSync(filePath, buffer);
      console.log(`[OPTIMIZED] Logo: ${relPath} (${formatBytes(stat.size)} -> ${formatBytes(buffer.length)})`);
      return { original: stat.size, saved: stat.size - buffer.length };
    }
  }

  // 4. Heavy backgrounds, provinces, and dialog scenes (> 150 KB)
  if ((ext === ".jpg" || ext === ".jpeg" || ext === ".jfif") && stat.size > 150 * 1024) {
    const inputBuffer = fs.readFileSync(filePath);
    const buffer = await sharp(inputBuffer)
      .resize(1600, 900, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();

    if (buffer.length < stat.size) {
      fs.writeFileSync(filePath, buffer);
      console.log(`[OPTIMIZED] Background: ${relPath} (${formatBytes(stat.size)} -> ${formatBytes(buffer.length)})`);
      return { original: stat.size, saved: stat.size - buffer.length };
    }
  }

  // 5. Heavy WebP backgrounds (maps, dialogs > 250 KB)
  if (ext === ".webp" && stat.size > 250 * 1024) {
    const inputBuffer = fs.readFileSync(filePath);
    const buffer = await sharp(inputBuffer)
      .resize(1600, 1000, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    if (buffer.length < stat.size) {
      fs.writeFileSync(filePath, buffer);
      console.log(`[OPTIMIZED] Map/Scene WebP: ${relPath} (${formatBytes(stat.size)} -> ${formatBytes(buffer.length)})`);
      return { original: stat.size, saved: stat.size - buffer.length };
    }
  }

  return { original: stat.size, saved: 0 };
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
}

async function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(await walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  console.log("--- Starting Image Pipeline Optimization ---");
  const files = await walkDir(PUBLIC_DIR);
  let totalSaved = 0;
  let totalOptimized = 0;

  for (const file of files) {
    try {
      const res = await optimizeFile(file);
      if (res && res.saved > 0) {
        totalSaved += res.saved;
        totalOptimized++;
      }
    } catch (err) {
      console.warn(`Failed to process ${file}:`, err.message);
    }
  }

  console.log("--------------------------------------------");
  console.log(`Images optimized: ${totalOptimized}`);
  console.log(`Total bandwidth saved: ${formatBytes(totalSaved)}`);
}

main().catch(console.error);
