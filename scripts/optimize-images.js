const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PUBLIC_DIR = path.resolve(__dirname, "../public/images");

async function optimizeFile(filePath) {
  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const relPath = path.relative(PUBLIC_DIR, filePath);

  // 1. Suspect avatars: resize to max 512x512 with high quality WebP
  if (relPath.includes("suspects") && ext === ".webp" && stat.size > 200 * 1024) {
    const inputBuffer = fs.readFileSync(filePath);
    const buffer = await sharp(inputBuffer)
      .resize(512, 512, { fit: "inside" })
      .webp({ quality: 85 })
      .toBuffer();

    if (buffer.length < stat.size) {
      fs.writeFileSync(filePath, buffer);
      console.log(`[OPTIMIZED] Suspect: ${relPath} (${formatBytes(stat.size)} -> ${formatBytes(buffer.length)})`);
      return { original: stat.size, saved: stat.size - buffer.length };
    }
  }

  // 2. Logo: resize to max width 800 with high-compression PNG
  if (relPath === "logofinal.png" && stat.size > 300 * 1024) {
    const inputBuffer = fs.readFileSync(filePath);
    const buffer = await sharp(inputBuffer)
      .resize(800, null, { fit: "inside" })
      .png({ compressionLevel: 9, quality: 90 })
      .toBuffer();

    if (buffer.length < stat.size) {
      fs.writeFileSync(filePath, buffer);
      console.log(`[OPTIMIZED] Logo: ${relPath} (${formatBytes(stat.size)} -> ${formatBytes(buffer.length)})`);
      return { original: stat.size, saved: stat.size - buffer.length };
    }
  }

  // 3. Heavy backgrounds (> 600 KB): resize to max 1920x1080 with quality 82
  if ((ext === ".jpg" || ext === ".jpeg") && stat.size > 600 * 1024) {
    const inputBuffer = fs.readFileSync(filePath);
    const buffer = await sharp(inputBuffer)
      .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    if (buffer.length < stat.size) {
      fs.writeFileSync(filePath, buffer);
      console.log(`[OPTIMIZED] Background: ${relPath} (${formatBytes(stat.size)} -> ${formatBytes(buffer.length)})`);
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
