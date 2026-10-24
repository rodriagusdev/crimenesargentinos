const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const DIALOG_DIR = path.resolve(__dirname, "../public/images/dialogbackground");
const TARGET_WIDTH = 1280;
const WEBP_QUALITY = 70;
const WEBP_EFFORT = 6; // Squoosh max effort

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB";
  return bytes + " B";
}

async function convertFile(filePath) {
  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, ext);
  const relPath = path.relative(DIALOG_DIR, filePath);

  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".webp" && ext !== ".jfif") {
    return null;
  }

  const inputBuffer = fs.readFileSync(filePath);
  const metadata = await sharp(inputBuffer).metadata();

  // 1. Convert / re-encode to WebP with Squoosh parameters (effort 6, quality 70, max width 1280)
  const webpBuffer = await sharp(inputBuffer)
    .resize(TARGET_WIDTH, null, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
    .toBuffer();

  const webpTargetFile = path.join(dir, `${baseName}.webp`);
  fs.writeFileSync(webpTargetFile, webpBuffer);

  let jpgBufferLength = null;
  // If original was jpg, also optimize the jpg in place for 100% backend backward compatibility
  if (ext === ".jpg" || ext === ".jpeg") {
    const jpgBuffer = await sharp(inputBuffer)
      .resize(TARGET_WIDTH, null, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: WEBP_QUALITY, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(filePath, jpgBuffer);
    jpgBufferLength = jpgBuffer.length;
  }

  const saved = stat.size - webpBuffer.length;
  const pct = ((saved / stat.size) * 100).toFixed(1);

  console.log(
    `[SQUOOSH CONVERT] ${relPath} (${metadata.width}x${metadata.height}) -> WebP (${formatBytes(stat.size)} -> ${formatBytes(webpBuffer.length)}, saved ${pct}%)${
      jpgBufferLength ? ` + JPG fallback: ${formatBytes(jpgBufferLength)}` : ""
    }`
  );

  return { original: stat.size, newSize: webpBuffer.length };
}

async function run() {
  console.log(`Starting Squoosh-equivalent batch conversion for dialog backgrounds...`);
  console.log(`Settings: Format: WebP | Quality: ${WEBP_QUALITY} | Effort: ${WEBP_EFFORT} (MAX) | Max Width: ${TARGET_WIDTH}px\n`);

  const levels = ["level1", "level2", "level3", "level4", "level5"];
  let totalOriginal = 0;
  let totalNew = 0;
  let fileCount = 0;

  for (const lvl of levels) {
    const lvlDir = path.join(DIALOG_DIR, lvl);
    if (!fs.existsSync(lvlDir)) continue;

    console.log(`\n--- Processing ${lvl} ---`);
    const files = fs.readdirSync(lvlDir);

    for (const file of files) {
      const fullPath = path.join(lvlDir, file);
      if (fs.statSync(fullPath).isFile()) {
        try {
          const res = await convertFile(fullPath);
          if (res) {
            totalOriginal += res.original;
            totalNew += res.newSize;
            fileCount++;
          }
        } catch (err) {
          console.error(`Error converting ${file}:`, err);
        }
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Done! Converted ${fileCount} dialog background images.`);
  console.log(`Original total: ${formatBytes(totalOriginal)}`);
  console.log(`New WebP total: ${formatBytes(totalNew)}`);
  const totalSaved = totalOriginal - totalNew;
  const totalPct = ((totalSaved / totalOriginal) * 100).toFixed(1);
  console.log(`Total saved: ${formatBytes(totalSaved)} (-${totalPct}%)`);
  console.log(`========================================`);
}

run().catch(console.error);
