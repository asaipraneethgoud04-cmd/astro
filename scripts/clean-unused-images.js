const fs = require("fs");
const path = require("path");

const IMAGES_DIR = path.resolve(__dirname, "../public/images");
const SRC_DIR = path.resolve(__dirname, "../src");

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

function getSrcContent() {
  const allFiles = walkDir(SRC_DIR);
  let combined = "";
  for (const f of allFiles) {
    if (/\.(tsx?|jsx?|css|json)$/.test(f)) {
      combined += " " + fs.readFileSync(f, "utf8");
    }
  }
  return combined;
}

function cleanUnusedImages() {
  console.log("=== Checking for Unused / Redundant Image Files ===\n");
  const srcContent = getSrcContent();
  const allImages = walkDir(IMAGES_DIR);

  const unused = [];
  let reclaimedBytes = 0;

  for (const file of allImages) {
    const basename = path.basename(file);
    const rel = "/images" + file.slice(IMAGES_DIR.length);
    const encodedRel = rel.replace(/ /g, "%20");

    // Keep active files
    const isUsed =
      srcContent.includes(rel) ||
      srcContent.includes(encodedRel) ||
      srcContent.includes(basename);

    if (!isUsed) {
      const size = fs.statSync(file).size;
      unused.push({ file, size });
      reclaimedBytes += size;
    }
  }

  console.log(`Found ${unused.length} unused files (${(reclaimedBytes / 1024 / 1024).toFixed(2)} MB).\n`);

  for (const { file, size } of unused) {
    fs.unlinkSync(file);
    console.log(`🗑️ Removed: ${path.relative(IMAGES_DIR, file)} (${(size / 1024).toFixed(0)} KB)`);
  }

  // Remove empty directories if any
  function removeEmptyDirs(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    if (files.length > 0) {
      for (const f of files) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
          removeEmptyDirs(full);
        }
      }
    }
    // Re-check after removing child dirs
    if (fs.readdirSync(dir).length === 0 && dir !== IMAGES_DIR) {
      fs.rmdirSync(dir);
      console.log(`Removed empty directory: ${path.relative(IMAGES_DIR, dir)}`);
    }
  }

  removeEmptyDirs(IMAGES_DIR);

  console.log(`\n✓ Reclaimed ${(reclaimedBytes / 1024 / 1024).toFixed(2)} MB of disk space.`);
}

cleanUnusedImages();
