/**
 * ============================================================================
 * TALKASTROLOGER - PRODUCTION NEXT.JS SERVER FOR HOSTINGER
 * ============================================================================
 * Production entry point for Hostinger Node.js Application Manager (Phusion Passenger/PM2)
 *
 * Startup File: server.js
 * Default Port: process.env.PORT || 3000
 * Host:         process.env.HOSTNAME || "0.0.0.0"
 * Mode:         Production (dev: false)
 * ============================================================================
 */

const { createServer } = require("http");
const { parse } = require("url");
const fs = require("fs");
const path = require("path");
const next = require("next");

// Optional: Auto-load .env or .env.production if user created one on the server
function loadEnv() {
  const envCandidates = [
    path.join(__dirname, ".env.production"),
    path.join(__dirname, ".env"),
  ];

  for (const envFile of envCandidates) {
    if (fs.existsSync(envFile)) {
      try {
        const content = fs.readFileSync(envFile, "utf-8");
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eq = trimmed.indexOf("=");
          if (eq > 0) {
            const key = trimmed.slice(0, eq).trim();
            const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
        console.log(`[Server] Environment loaded from: ${path.basename(envFile)}`);
      } catch (err) {
        console.warn(`[Server] Note: Could not parse ${path.basename(envFile)}:`, err.message);
      }
    }
  }
}
loadEnv();

const dev = false;
const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = process.env.HOSTNAME || "0.0.0.0";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log(`[Server] Initializing Next.js production server on ${hostname}:${port}...`);

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error(`[Server] Error processing ${req.method} ${req.url}:`, err.message || err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      }
    });

    server.once("error", (err) => {
      console.error("[Server] Fatal startup error:", err.message || err);
      process.exit(1);
    });

    server.listen(port, hostname, () => {
      console.log(`[Server] Application ready and listening on http://${hostname}:${port}`);
      console.log(`[Server] Mode: production (dev: ${dev})`);
    });
  })
  .catch((err) => {
    console.error("[Server] Next.js initialization failed:", err.message || err);
    process.exit(1);
  });
