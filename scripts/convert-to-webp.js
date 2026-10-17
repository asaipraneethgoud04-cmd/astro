const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMAGES_DIR = path.resolve(__dirname, "../public/images");
const SRC_DIR = path.resolve(__dirname, "../src");

// Supported extensions for WebP conversion
const EXTENSIONS = [".png", ".jpg", ".jpeg"];

// Helper to recursively walk a directory
function walkDir(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (item === ".DS_Store") continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(walkDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

// Helper to find all src files
function getSrcFiles() {
  const allFiles = walkDir(SRC_DIR);
  return allFiles.filter((f) => /\.(tsx?|jsx?|css|json)$/.test(f));
}

// 1. Convert an image to WebP using sharp
async function convertToWebp(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!EXTENSIONS.includes(ext)) return null;

  const outPath = filePath.slice(0, -ext.length) + ".webp";
  const originalSize = fs.statSync(filePath).size;

  try {
    const isPng = ext === ".png";
    await sharp(filePath)
      .webp({
        quality: isPng ? 85 : 80,
        effort: 5,
        alphaQuality: 85,
        lossless: false,
      })
      .toFile(outPath);

    const newSize = fs.statSync(outPath).size;
    const saved = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

    console.log(
      `✓ [CONVERTED] ${path.relative(IMAGES_DIR, filePath)} -> ${path.basename(
        outPath
      )}: ${(originalSize / 1024).toFixed(0)}KB -> ${(newSize / 1024).toFixed(0)}KB (${saved}% reduction)`
    );

    return { original: filePath, webp: outPath, originalSize, newSize };
  } catch (err) {
    console.error(`✗ Error converting ${filePath}:`, err.message);
    return null;
  }
}

// 2. Update code references in src/
function updateReferences(mappings) {
  const srcFiles = getSrcFiles();
  let totalReplacements = 0;

  for (const srcFile of srcFiles) {
    let content = fs.readFileSync(srcFile, "utf8");
    let changed = false;

    for (const { oldRel, newRel } of mappings) {
      if (content.includes(oldRel)) {
        content = content.replaceAll(oldRel, newRel);
        changed = true;
        totalReplacements++;
      }
      // Also check URL-encoded form (for filenames with spaces)
      const oldEncoded = oldRel.replace(/ /g, "%20");
      const newEncoded = newRel.replace(/ /g, "%20");
      if (content.includes(oldEncoded)) {
        content = content.replaceAll(oldEncoded, newEncoded);
        changed = true;
        totalReplacements++;
      }
    }

    if (changed) {
      fs.writeFileSync(srcFile, content, "utf8");
      console.log(`Updated references in: ${path.relative(process.cwd(), srcFile)}`);
    }
  }

  console.log(`\nUpdated ${totalReplacements} image references across codebase.`);
}

async function main() {
  console.log("=== Starting WebP Image Conversion & Optimization ===\n");

  const allImages = walkDir(IMAGES_DIR);
  const imagesToConvert = allImages.filter((f) =>
    EXTENSIONS.includes(path.extname(f).toLowerCase())
  );

  console.log(`Found ${imagesToConvert.length} images to convert.\n`);

  const mappings = [];
  let totalOrigBytes = 0;
  let totalWebpBytes = 0;

  for (const img of imagesToConvert) {
    const result = await convertToWebp(img);
    if (result) {
      totalOrigBytes += result.originalSize;
      totalWebpBytes += result.newSize;

      const oldRel = "/images" + result.original.slice(IMAGES_DIR.length);
      const newRel = "/images" + result.webp.slice(IMAGES_DIR.length);
      mappings.push({ oldRel, newRel, original: result.original });
    }
  }

  console.log("\n=== Updating Code References in src/ ===");
  updateReferences(mappings);

  const shouldDelete = process.argv.includes("--delete");
  if (shouldDelete) {
    console.log("\n=== Removing Original Superseded Files (--delete) ===");
    for (const { original } of mappings) {
      if (fs.existsSync(original)) {
        fs.unlinkSync(original);
      }
    }
    console.log(`Removed ${mappings.length} original files.`);
  }

  const totalSavedMb = ((totalOrigBytes - totalWebpBytes) / 1024 / 1024).toFixed(2);
  const totalPercent = (((totalOrigBytes - totalWebpBytes) / totalOrigBytes) * 100).toFixed(1);

  console.log("\n=== Summary ===");
  console.log(`Original total size: ${(totalOrigBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized WebP size: ${(totalWebpBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Saved: ${totalSavedMb} MB (${totalPercent}% reduction)!`);
}

main().catch(console.error);
