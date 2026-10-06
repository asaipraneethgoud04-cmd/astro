import fs from "fs";
import path from "path";
import { headers } from "next/headers";

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window cache per rate limit bucket
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries periodically to prevent memory accumulation
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

// Persistent storage path in server cache directory
function getStoragePath(): string {
  const cacheDir = path.join(process.cwd(), ".next", "cache");
  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
  } catch {}
  return path.join(cacheDir, "rate-limits.json");
}

let storeLoaded = false;
function loadPersistentStore() {
  if (storeLoaded) return;
  storeLoaded = true;
  try {
    const file = getStoragePath();
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, "utf-8");
      const parsed = JSON.parse(raw) as Record<string, number[]>;
      const now = Date.now();
      for (const [k, ts] of Object.entries(parsed)) {
        if (Array.isArray(ts)) {
          // Only keep entries within the last 24 hours
          const recent = ts.filter((t) => typeof t === "number" && now - t < 86400000);
          if (recent.length > 0) {
            rateLimitStore.set(k, { timestamps: recent });
          }
        }
      }
    }
  } catch {}
}

let saveTimeout: NodeJS.Timeout | null = null;
function scheduleSave() {
  if (saveTimeout) return;
  saveTimeout = setTimeout(() => {
    saveTimeout = null;
    try {
      const file = getStoragePath();
      const tmpFile = `${file}.tmp.${Date.now()}`;
      const obj: Record<string, number[]> = {};
      const now = Date.now();
      for (const [k, v] of rateLimitStore.entries()) {
        const recent = v.timestamps.filter((t) => now - t < 86400000);
        if (recent.length > 0) {
          obj[k] = recent;
        }
      }
      fs.writeFileSync(tmpFile, JSON.stringify(obj), "utf-8");
      fs.renameSync(tmpFile, file);
    } catch {}
  }, 1000);
}

function purgeExpiredRecords(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  for (const [key, record] of rateLimitStore.entries()) {
    const active = record.timestamps.filter((t) => now - t < windowMs);
    if (active.length === 0) {
      rateLimitStore.delete(key);
    } else {
      record.timestamps = active;
    }
  }
  scheduleSave();
}

export interface RateLimitOptions {
  bucket: string;
  limit: number;
  windowSeconds: number;
  identifier?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

const IP_V4_OR_V6_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}$/;

/**
 * Resolves the client IP address from standard reverse-proxy headers with IP format validation.
 */
export async function getClientIp(): Promise<string> {
  try {
    const headersList = await headers();

    // Priority 1: Cloudflare Connecting IP (authenticated proxy header when behind Cloudflare)
    const cfConnectingIp = headersList.get("cf-connecting-ip");
    if (cfConnectingIp && IP_V4_OR_V6_REGEX.test(cfConnectingIp.trim())) {
      return cfConnectingIp.trim();
    }

    // Priority 2: Nginx / Apache X-Real-IP
    const realIp = headersList.get("x-real-ip");
    if (realIp && IP_V4_OR_V6_REGEX.test(realIp.trim())) {
      return realIp.trim();
    }

    // Priority 3: Forwarded IP list (take first valid IP)
    const forwarded = headersList.get("x-forwarded-for");
    if (forwarded) {
      const parts = forwarded.split(",").map((s) => s.trim());
      for (const part of parts) {
        if (IP_V4_OR_V6_REGEX.test(part)) {
          return part;
        }
      }
    }
  } catch {
    // Ignore header resolution errors when called outside request context
  }

  return "127.0.0.1";
}

/**
 * Enforces a sliding window rate limit.
 */
export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  loadPersistentStore();
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const ip = options.identifier || (await getClientIp());
  const storeKey = `${options.bucket}:${ip}`;

  purgeExpiredRecords(windowMs);

  let record = rateLimitStore.get(storeKey);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(storeKey, record);
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= options.limit) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  record.timestamps.push(now);
  scheduleSave();
  const remaining = Math.max(0, options.limit - record.timestamps.length);

  return {
    allowed: true,
    remaining,
    retryAfterSeconds: 0,
  };
}
