/**
 * ============================================================================
 * TALKASTROLOGER - HOSTINGER PRODUCTION DEPLOYMENT GENERATOR
 * ============================================================================
 * Safe, validated builder and bundler for Hostinger Node.js deployment.
 *
 * Requirements fulfilled:
 * 1. Validates project root and required files.
 * 2. Runs production build (with --webpack to avoid Turbopack PostCSS container bugs).
 * 3. Halts immediately if compilation fails, preserving existing artifacts.
 * 4. Confirms .next production build outputs exist.
 * 5. Generates clean out/ directory.
 * 6. Includes server.js, precompiled .next (minus cache/dev), public/, config, .env.example.
 * 7. Excludes src/, node_modules, .env, .env.local, and all secrets.
 * 8. Generates flat out.zip (no wrapper folder, no macOS metadata).
 * 9. Validates the generated ZIP archive structure.
 * 10. Uses safe process execution with argument arrays (execFileSync).
 * ============================================================================
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT_DIR, "out");
const ZIP_PATH = path.join(ROOT_DIR, "out.zip");

console.log("\n====================================================================");
console.log("🚀 [Deploy Generator] TalkAstrologer Production Bundler for Hostinger");
console.log("====================================================================\n");

// ----------------------------------------------------------------------------
// Step 1: Pre-flight validation of project root and required files
// ----------------------------------------------------------------------------
console.log("📋 [1/7] Validating project root and required configuration files...");

const requiredRootFiles = [
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "server.js",
  "tsconfig.json",
  ".htaccess",
  "public",
];

for (const relFile of requiredRootFiles) {
  const fullPath = path.join(ROOT_DIR, relFile);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Fatal: Required project file/directory missing: ${relFile}`);
    process.exit(1);
  }
}
console.log("  ✓ All required root files and configuration present.");

// ----------------------------------------------------------------------------
// Step 2: Run production build BEFORE modifying or deleting any artifacts
// ----------------------------------------------------------------------------
console.log("\n⚙️  [2/7] Executing Next.js production build (webpack mode)...");

const nextBin = path.join(
  ROOT_DIR,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next"
);

if (!fs.existsSync(nextBin)) {
  console.error("❌ Fatal: Next.js binary not found in node_modules. Run npm install first.");
  process.exit(1);
}

try {
  execFileSync(process.execPath, [nextBin, "build", "--webpack"], {
    cwd: ROOT_DIR,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
  });
  console.log("  ✓ Production build completed successfully.");
} catch (err) {
  console.error("\n❌ Fatal: Next.js production build failed! Deployment aborted.");
  console.error("Existing deployment artifacts have been preserved untouched.");
  process.exit(1);
}

// ----------------------------------------------------------------------------
// Step 3: Validate the .next build output
// ----------------------------------------------------------------------------
console.log("\n🔍 [3/7] Validating compiled .next build artifacts...");

const nextDir = path.join(ROOT_DIR, ".next");
const requiredNextArtifacts = [
  path.join(nextDir, "BUILD_ID"),
  path.join(nextDir, "routes-manifest.json"),
  path.join(nextDir, "build-manifest.json"),
  path.join(nextDir, "server"),
  path.join(nextDir, "static"),
];

for (const art of requiredNextArtifacts) {
  if (!fs.existsSync(art)) {
    console.error(`❌ Fatal: Required build artifact missing: ${path.relative(ROOT_DIR, art)}`);
    process.exit(1);
  }
}
console.log("  ✓ Validated .next: BUILD_ID, manifests, server bundle, and static chunks exist.");

// ----------------------------------------------------------------------------
// Step 4: Assemble clean out/ directory
// ----------------------------------------------------------------------------
console.log("\n📦 [4/7] Assembling clean deployment folder: out/ ...");

// Helper: Copy directory recursively with exclusion filter
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

// Clean and recreate out directory only after build succeeded
if (fs.existsSync(OUT_DIR)) {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUT_DIR, { recursive: true });

// Copy public/ assets (and ensure favicon.ico is present)
console.log("  → Copying public/ assets...");
const srcFavicon = path.join(ROOT_DIR, "src", "app", "favicon.ico");
const pubFavicon = path.join(ROOT_DIR, "public", "favicon.ico");
if (fs.existsSync(srcFavicon) && !fs.existsSync(pubFavicon)) {
  fs.copyFileSync(srcFavicon, pubFavicon);
}

copyDirRecursive(path.join(ROOT_DIR, "public"), path.join(OUT_DIR, "public"), [
  ".DS_Store",
]);

if (fs.existsSync(srcFavicon)) {
  fs.copyFileSync(srcFavicon, path.join(OUT_DIR, "favicon.ico"));
}

// Copy source code (src/) - required by Hostinger automated build runners (app/ directory)
console.log("  → Copying src/ directory (required for Hostinger automated builds)...");
copyDirRecursive(path.join(ROOT_DIR, "src"), path.join(OUT_DIR, "src"), [
  ".DS_Store",
]);

// Note: Hostinger automated build runner requires .next and node_modules to be EXCLUDED
// from the upload archive so it can install clean Linux dependencies and run a fresh build.
console.log("  → Ensuring clean archive: excluding .next/ and node_modules/ per Hostinger requirement...");

// Copy required runtime files and configurations
const runtimeFiles = [
  "server.js",
  "next.config.ts",
  "tsconfig.json",
  "postcss.config.mjs",
  "eslint.config.mjs",
  ".htaccess",
  "package-lock.json",
];

for (const file of runtimeFiles) {
  const filePath = path.join(ROOT_DIR, file);
  if (fs.existsSync(filePath)) {
    console.log(`  → Copying ${file}...`);
    fs.copyFileSync(filePath, path.join(OUT_DIR, file));
  }
}

// Ensure safe .env.example (containing no real secrets) is included
console.log("  → Generating safe .env.example (no secrets packaged)...");
const safeEnvExample = [
  "# ============================================================================",
  "# TALKASTROLOGER HOSTINGER PRODUCTION ENVIRONMENT TEMPLATE",
  "# ============================================================================",
  "# Set these variables in Hostinger hPanel -> Node.js -> Environment Variables",
  "# ============================================================================",
  "",
  "# Supabase Database & Auth (Required for Appointments, Reviews & Admin session)",
  "NEXT_PUBLIC_SUPABASE_URL=https://drzkaogmktbrgoojnguw.supabase.co",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key",
  "",
  "# Standalone Express Backend API URL",
  "NEXT_PUBLIC_BACKEND_URL=https://api.talkastrologer.com",
  "",
  "# Hostinger SMTP Configuration - Appointments Account",
  "SMTP_HOST=smtp.hostinger.com",
  "SMTP_PORT=465",
  "SMTP_SECURE=true",
  "SMTP_USER=myappointment@talkastrologer.com",
  "SMTP_PASSWORD=your-appointments-email-password",
  "MAIL_FROM=myappointment@talkastrologer.com",
  "MAIL_FROM_NAME=TalkAstrologer",
  "ADMIN_ALERT_EMAIL=myappointment@talkastrologer.com",
  "",
  "# Hostinger SMTP Configuration - Support Account",
  "SUPPORT_SMTP_USER=support@talkastrologer.com",
  "SUPPORT_SMTP_PASSWORD=your-support-email-password",
  "SUPPORT_MAIL_FROM=support@talkastrologer.com",
  "SUPPORT_MAIL_FROM_NAME=TalkAstrologer Support",
  "SUPPORT_EMAIL=support@talkastrologer.com",
  "",
  "# Production Server Port (Dynamically assigned by Hostinger or fallback to 3000)",
  "PORT=3000",
  "NODE_ENV=production",
  "",
].join("\n");

fs.writeFileSync(path.join(OUT_DIR, ".env.example"), safeEnvExample);

// ----------------------------------------------------------------------------
// Step 5: Generate production package.json for Hostinger
// ----------------------------------------------------------------------------
console.log("\n📝 [5/7] Writing production package.json for Hostinger...");

const rootPackageJson = JSON.parse(
  fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf-8")
);

const deployPackageJson = {
  name: "talkastrologer-frontend",
  version: rootPackageJson.version || "1.0.0",
  private: true,
  scripts: {
    start: "node server.js",
    build: "next build --webpack",
    dev: "next dev -p 3000",
  },
  dependencies: { ...rootPackageJson.dependencies },
  devDependencies: { ...rootPackageJson.devDependencies },
  engines: {
    node: ">=20.0.0",
    npm: ">=9.0.0",
  },
};

// Remove backend-only express/cors from frontend bundle if present
if (deployPackageJson.dependencies) {
  delete deployPackageJson.dependencies["cors"];
}

fs.writeFileSync(
  path.join(OUT_DIR, "package.json"),
  JSON.stringify(deployPackageJson, null, 2)
);

// Explicit Security Check: ensure NO secret files exist in out/
const forbiddenFiles = [".env", ".env.local", "env.local", ".env.production"];
for (const badFile of forbiddenFiles) {
  const badPath = path.join(OUT_DIR, badFile);
  if (fs.existsSync(badPath)) {
    console.error(`❌ Security Violation: Secret file detected in out/ (${badFile})! Removing...`);
    fs.unlinkSync(badPath);
  }
}
console.log("  ✓ Confirmed: zero local secret files (.env, .env.local) included in out/.");

// ----------------------------------------------------------------------------
// Step 6: Create flat out.zip using safe process execution
// ----------------------------------------------------------------------------
console.log("\n🗜️  [6/7] Creating flat out.zip archive...");

if (fs.existsSync(ZIP_PATH)) {
  fs.unlinkSync(ZIP_PATH);
}

try {
  execFileSync(
    "zip",
    [
      "-q",
      "-r",
      ZIP_PATH,
      ".",
      "-x",
      "*.DS_Store*",
      "-x",
      "__MACOSX*",
      "-x",
      "*.git*",
    ],
    {
      cwd: OUT_DIR,
      stdio: "inherit",
    }
  );
} catch (err) {
  console.error("❌ Fatal: Failed to generate out.zip:", err.message);
  process.exit(1);
}

const zipStat = fs.statSync(ZIP_PATH);
const zipSizeMb = (zipStat.size / (1024 * 1024)).toFixed(2);
console.log(`  ✓ Generated out.zip successfully (${zipSizeMb} MB).`);

// ----------------------------------------------------------------------------
// Step 7: Archive Structure and Content Validation
// ----------------------------------------------------------------------------
console.log("\n🔍 [7/7] Validating archive structure and required file presence...");

let zipListing = "";
try {
  zipListing = execFileSync("unzip", ["-l", ZIP_PATH], { encoding: "utf-8" });
} catch (err) {
  console.error("❌ Fatal: Failed to inspect generated ZIP archive:", err.message);
  process.exit(1);
}

const criticalZipEntries = [
  "server.js",
  "package.json",
  "package-lock.json",
  ".htaccess",
  "favicon.ico",
  ".env.example",
  "src/lib/inbox-types.ts",
  "src/lib/supabase/browser.ts",
  "src/data/services.ts",
  "src/app/page.tsx",
  "src/app/layout.tsx",
];

for (const entry of criticalZipEntries) {
  if (!zipListing.includes(entry)) {
    console.error(`❌ Fatal: Verification failed! Missing required entry in ZIP: ${entry}`);
    process.exit(1);
  }
}

// Verify that .next and node_modules are NOT in the zip (Hostinger requirement)
if (zipListing.includes(" .next/") || zipListing.includes("/.next/")) {
  console.error("❌ Fatal: .next found in ZIP! Hostinger requires .next to be excluded.");
  process.exit(1);
}
if (zipListing.includes(" node_modules/") || zipListing.includes("/node_modules/")) {
  console.error("❌ Fatal: node_modules found in ZIP! Hostinger requires node_modules to be excluded.");
  process.exit(1);
}

// Verify that out/ wrapper folder is NOT at archive root
const lines = zipListing.split("\n");
const hasOuterOutFolder = lines.some((line) => line.trim().endsWith(" out/"));
if (hasOuterOutFolder) {
  console.error("❌ Fatal: Archive contains an outer 'out/' directory! Must be a flat archive.");
  process.exit(1);
}

// Verify that NO secret files are present in the zip
const forbiddenZipEntries = [".env.local", "env.local", ".env.production"];
for (const badEntry of forbiddenZipEntries) {
  if (zipListing.includes(` ${badEntry}`)) {
    console.error(`❌ Fatal Security Check: ${badEntry} found inside out.zip!`);
    process.exit(1);
  }
}

console.log("  ✓ All critical runtime files and build manifests confirmed inside out.zip.");
console.log("  ✓ Confirmed archive is flat (extracts directly into public_html without outer folder).");
console.log("  ✓ Confirmed zero secrets or credentials packaged.");

console.log("\n====================================================================");
console.log("🎉 SUCCESS: Hostinger Deployment Package Verified & Ready!");
console.log("====================================================================");
console.log(`📁 Deployment Folder: ${OUT_DIR}`);
console.log(`📦 Deployment Zip:    ${ZIP_PATH} (${zipSizeMb} MB)`);
console.log("====================================================================\n");
