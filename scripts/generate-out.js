/**
 * ============================================================================
 * TALKASTROLOGER - FRONTEND DEPLOYMENT OUTPUT GENERATOR
 * ============================================================================
 * Generates the clean `out/` deployment directory for the frontend.
 *
 * Rules:
 * 1. start script runs: `next build && next start -p 3000`
 * 2. NO stale `.next` folder included (fresh build generated on the server)
 * 3. package.json, src, public sit at the root level of `out/` (no extra wrapping)
 * 4. Node.js 22 / npm compatible
 * ============================================================================
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT_DIR, "out");

console.log("\n📦 [Deploy Bundler] Assembling frontend deployment folder: out/ ...");

// 1. Clean or create out directory
if (fs.existsSync(OUT_DIR)) {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUT_DIR, { recursive: true });

// Helper: Copy directory recursively
function copyDirRecursive(src, dest, ignoreNames = []) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (ignoreNames.includes(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, ignoreNames);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 2. Copy source code (src/) - needed for `next build` on the server
console.log("  → Copying src/ directory...");
copyDirRecursive(path.join(ROOT_DIR, "src"), path.join(OUT_DIR, "src"), [
  ".DS_Store",
]);

// 3. Copy public assets (public/)
console.log("  → Copying public/ assets...");
copyDirRecursive(
  path.join(ROOT_DIR, "public"),
  path.join(OUT_DIR, "public"),
  [".DS_Store"]
);

// 4. Copy configuration files to the root level of out/
const configFiles = [
  "next.config.ts",
  "tsconfig.json",
  "postcss.config.mjs",
  "eslint.config.mjs",
  ".htaccess",
  "package-lock.json",
];

for (const file of configFiles) {
  const filePath = path.join(ROOT_DIR, file);
  if (fs.existsSync(filePath)) {
    console.log(`  → Copying ${file}...`);
    fs.copyFileSync(filePath, path.join(OUT_DIR, file));
  }
}

// 5. Generate package.json at root level of out/
console.log("  → Writing package.json with 'start': 'next build && next start -p 3000'...");
const rootPackageJson = JSON.parse(
  fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf-8")
);

const deployPackageJson = {
  name: "talkastrologer-frontend",
  version: rootPackageJson.version || "1.0.0",
  private: true,
  scripts: {
    start: "next build && next start -p 3000",
    build: "next build",
    dev: "next dev -p 3000",
  },
  dependencies: { ...rootPackageJson.dependencies },
  devDependencies: { ...rootPackageJson.devDependencies },
  engines: {
    node: ">=20.0.0",
    npm: ">=9.0.0",
  },
};

// Remove backend-only express/cors if present
if (deployPackageJson.dependencies) {
  delete deployPackageJson.dependencies["cors"];
}

fs.writeFileSync(
  path.join(OUT_DIR, "package.json"),
  JSON.stringify(deployPackageJson, null, 2)
);

// Clean up any stale zip file if present
const zipPath = path.join(ROOT_DIR, "out.zip");
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

console.log("\n✅ [Deploy Bundler] Frontend 'out' folder successfully generated at:");
console.log(`   ${OUT_DIR}\n`);
console.log("   Root files inside 'out/':");
const outFiles = fs.readdirSync(OUT_DIR);
for (const file of outFiles) {
  const stat = fs.statSync(path.join(OUT_DIR, file));
  console.log(`     - ${file} ${stat.isDirectory() ? "(directory)" : ""}`);
}
console.log("\n   * No stale .next folder (server will build clean on 'npm start').");
console.log("   * package.json sits directly at out/ root with no wrapper folder.\n");
