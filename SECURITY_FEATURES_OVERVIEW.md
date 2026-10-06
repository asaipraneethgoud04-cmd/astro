# 🛡️ TalkAstrologer — Security Architecture & Defenses

This document provides a comprehensive overview of all the **enterprise-grade security features** implemented in the TalkAstrologer application, detailing what each feature is and exactly how it protects the website, its users, and the business.

---

## 📑 Table of Contents

1. [Edge Routing & Admin Protection](#1-edge-routing--admin-protection)
2. [Database Row-Level Security (RLS)](#2-database-row-level-security-rls)
3. [Zero-Trust Server-Side Admin Authentication](#3-zero-trust-server-side-admin-authentication)
4. [Persistent Sliding-Window Rate Limiting](#4-persistent-sliding-window-rate-limiting)
5. [Invisible Honeypot Anti-Bot Traps](#5-invisible-honeypot-anti-bot-traps)
6. [Hostinger CDN & Proxy Cache Hardening](#6-hostinger-cdn--proxy-cache-hardening)
7. [Dual Isolated SMTP & CRLF Injection Prevention](#7-dual-isolated-smtp--crlf-injection-prevention)
8. [Strict Content Security Policy (CSP) & Security Headers](#8-strict-content-security-policy-csp--security-headers)
9. [SQL Injection & Cross-Site Scripting (XSS) Immunity](#9-sql-injection--cross-site-scripting-xss-immunity)
10. [Submission Idempotency & Spam Burst Prevention](#10-submission-idempotency--spam-burst-prevention)
11. [Sensitive File Exposure Shield](#11-sensitive-file-exposure-shield)
12. [Zero-Secret Codebase & Safe Error Boundaries](#12-zero-secret-codebase--safe-error-boundaries)
13. [Threat Protection Matrix](#13-threat-protection-matrix)

---

## 1. Edge Routing & Admin Protection

### What It Is
An edge middleware layer (`src/middleware.ts`) that intercepts every single incoming request across the entire application before page rendering or database calls take place.

### How It Helps the Website
* **Stops Unauthorized Access at the Perimeter:** Anyone trying to visit `/admin`, `/admin/appointments`, or `/admin/messages` without valid credentials is instantly redirected to `/admin/login` using an HTTP 307 redirect.
* **Saves Server & Database Resources:** Unauthorized requests never reach the application database or server rendering engine, protecting server performance.

---

## 2. Database Row-Level Security (RLS)

### What It Is
PostgreSQL Row-Level Security policies enforced directly inside Supabase (`supabase/schema.sql`). Even if an attacker learns the database URL and public API key, the database engine itself rejects unauthorized queries.

### How It Helps the Website
* **Protects Confidential Client Data:** Anonymous users cannot read, edit, or delete any customer appointment bookings or contact messages (PostgreSQL error `42501: permission denied`).
* **Protects Review Integrity:** Public users can only read reviews that the admin has explicitly approved (`status = 'accepted'`). Hackers cannot alter reviews, delete existing testimonials, or approve their own submissions.

---

## 3. Zero-Trust Server-Side Admin Authentication

### What It Is
Every administrative page and server action invokes `requireAdmin()` (`src/app/admin/session.ts`), which cryptographically verifies the admin session token directly with Supabase's authentication service.

### How It Helps the Website
* **Prevents Session Forgery:** Even if an attacker fabricates a cookie named `sb-auth-token`, the server independently checks the cryptographic signature with Supabase and immediately expels the user.
* **Prevents Client-Side Token Theft:** Authentication cookies are marked `HttpOnly`, `Secure`, and `SameSite=Lax`. Malicious browser extensions or client-side scripts can never extract the session token.

---

## 4. Persistent Sliding-Window Rate Limiting

### What It Is
A file-persisted, in-memory sliding-window rate limiter (`src/lib/rate-limiter.ts`) that tracks client IPs across requests and survives server restarts.

### How It Helps the Website
* **Stops Credential Stuffing & Brute Force:** Limits admin login attempts to **6 per 15 minutes**, preventing automated bots from guessing passwords.
* **Prevents Form Spam & Resource Exhaustion:**
  - Appointment bookings: Maximum **6 submissions per 10 minutes**.
  - Contact messages: Maximum **6 messages per 10 minutes**.
  - Customer reviews: Maximum **5 submissions per 10 minutes**.
* **Keeps the Server Fast & Available:** Prevents denial-of-service (DoS) attacks from overloading the Hostinger hosting environment.

---

## 5. Invisible Honeypot Anti-Bot Traps

### What It Is
Hidden form fields (`website_hp`) added to appointment, contact, and review forms. These fields are invisible to human visitors via CSS positioning and accessibility tags, but automated spam scripts automatically populate them.

### How It Helps the Website
* **Neutralizes Automated Spam Bots:** When a bot fills the hidden field, the server silently accepts the request without writing to the database or triggering email alerts.
* **Deprives Spammers of Feedback:** Bots believe their submission succeeded, preventing them from modifying their attack strategy, while keeping your database and inboxes 100% spam-free.

---

## 6. Hostinger CDN & Proxy Cache Hardening

### What It Is
Custom HTTP response headers injected into all administrative routes and redirects:
```http
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
```

### How It Helps the Website
* **Prevents Accidental Admin Session Leaks:** Ensures that Hostinger CDN, intermediate ISP proxies, or shared office routers never cache sensitive admin dashboards, client records, or redirect responses.
* **Guarantees Fresh Data:** Ensures administrators always see live, real-time appointment and message counts.

---

## 7. Dual Isolated SMTP & CRLF Injection Prevention

### What It Is
Centralized email infrastructure (`src/lib/mail.ts`) utilizing two distinct, dedicated Hostinger mailboxes:
1. `myappointment@TalkAstrologer` on Port 465 (SSL/TLS) for booking alerts.
2. `support@TalkAstrologer` on Port 465 (SSL/TLS) for customer support inquiries.

### How It Helps the Website
* **CRLF Header Injection Protection:** Strips newline characters (`\r`, `\n`) from user-provided inputs to prevent malicious actors from injecting hidden `Bcc:` or `Cc:` headers to send spam through your domain.
* **Prevents Mailbox Hijacking:** Email recipients are hard-locked to server environment variables. Attackers cannot trick your server into sending emails to arbitrary external addresses.
* **Separates Operational Traffic:** Client bookings and customer support tickets run on independent mailboxes, ensuring billing/booking notices are never blocked if the support inbox experiences high volume.

---

## 8. Strict Content Security Policy (CSP) & Security Headers

### What It Is
A fortified Content Security Policy defined in `next.config.ts`:
- `default-src 'self'`
- `object-src 'none'`
- `frame-ancestors 'self'`
- `frame-src 'self' https://www.google.com https://maps.google.com`
- `unsafe-eval` completely stripped from production builds.

### How It Helps the Website
* **Blocks Clickjacking:** Prevents malicious websites from loading TalkAstrologer inside invisible iframes to trick users into accidental clicks.
* **Blocks Legacy Plugin Exploits:** `object-src 'none'` blocks Flash, Silverlight, and Java applet vulnerabilities.
* **Prevents Malicious Script Injection:** Ensures browsers only execute authorized scripts originating from your own domain and Supabase.

---

## 9. SQL Injection & Cross-Site Scripting (XSS) Immunity

### What It Is
* **SQL Injection:** All database operations strictly use parameterized queries through the Supabase client SDK. Zero dynamic SQL string concatenations exist.
* **XSS:** User testimonials, names, and inquiries are rendered as safe text nodes using React JSX auto-escaping, without `dangerouslySetInnerHTML`.

### How It Helps the Website
* **Total Database Protection:** Attackers cannot inject malicious SQL commands (e.g. `' OR 1=1 --`) to dump user tables or alter database schema.
* **Client-Side Safety:** Malicious JavaScript submitted in reviews or contact forms will simply render as harmless text, protecting visitors and administrators from cookie theft or page defacement.

---

## 10. Submission Idempotency & Spam Burst Prevention

### What It Is
A 60-second duplicate submission window check in server actions (`src/app/actions/inbox.ts`).

### How It Helps the Website
* **Stops Double-Clicks & Accidental Duplicates:** When a user double-clicks the "Book Appointment" or "Send Message" button, only one database record and one email notification are created.
* **Protects SMTP Quota:** Prevents rapid-fire automated submissions from exhausting your daily Hostinger SMTP sending limits.

---

## 11. Sensitive File Exposure Shield

### What It Is
Web server configuration and Next.js routing that automatically masks and returns **404 Not Found** for sensitive files and folders:
`/.env`, `/.env.local`, `/.git/`, `/package.json`, `/supabase/schema.sql`, `/.next/trace`.

### How It Helps the Website
* **Prevents Reconnaissance & Leaks:** Scanners and attackers looking for configuration files, source code, or git histories are blocked completely, revealing nothing about the server architecture.

---

## 12. Zero-Secret Codebase & Safe Error Boundaries

### What It Is
* All production database keys, SMTP passwords, and configuration values are loaded strictly via environment variables.
* Server operations wrap internal errors in try/catch blocks that return localized, user-friendly messages.

### How It Helps the Website
* **Clean Open Source Safety:** No production secrets exist in the git history or code files.
* **No Information Leakage via Crashes:** If the database or email server is temporarily unreachable, users see a polite message (e.g., *"We could not send your request yet. Please call +1 214 669 9699."*) instead of ugly database stack traces, file paths, or internal connection strings.

---

## 13. Indian & US/Canada Phone Number Validation Rules

### What It Is
A dedicated phone number validator (`src/lib/phone.ts`) implemented on both client forms (`BookAppointmentForm`, `ContactForm`) and backend server actions (`src/app/actions/inbox.ts`).

### Rules Enforced:
1. **Indian Numbers (`+91`):**
   - Must contain **10 digits** starting with valid Indian mobile telecom prefixes: `6`, `7`, `8`, or `9`.
   - Supports optional prefixes: `+91`, `91`, or leading `0` (e.g., `+91 98765 43210`, `9876543210`, `09876543210`).
   - Automatically cleans and formats to `+91 XXXXX XXXXX`.
2. **US / Canada Numbers (`+1`):**
   - Must adhere to the **North American Numbering Plan (NANP)**: exactly 10 digits.
   - Area code: 3 digits starting with `[2-9]` (cannot start with 0 or 1).
   - Exchange code: 3 digits starting with `[2-9]` (cannot start with 0 or 1).
   - Supports optional prefixes: `+1` or `1` (e.g., `+1 214 669 9699`, `(214) 669-9699`, `214-669-9699`).
   - Automatically cleans and formats to `+1 (XXX) XXX-XXXX`.
3. **International Fallback:**
   - Standard international numbers with leading `+` and 8 to 15 digits (E.164 compliant) are safely accepted.

### How It Helps the Website
* **Guarantees Reachability:** Prevents visitors from submitting dummy, incomplete, or corrupted phone numbers (like `12345` or `0000000000`), ensuring the astrologer and consultation desk can always reach clients for scheduled sessions.
* **Standardized Admin Records:** Automatically formats all numbers cleanly into international standards for one-click calling or WhatsApp messaging in the admin dashboard.

---

## 14. Threat Protection Matrix

| Threat / Attack Vector | Severity | Protection Mechanism | Status |
| :--- | :--- | :--- | :--- |
| **Unauthorized Admin Access** | Critical | Edge Middleware + Server-side `requireAdmin()` + Supabase JWT | 🛡️ Protected |
| **Customer Data Theft (Database)**| Critical | PostgreSQL Row Level Security (RLS) default deny | 🛡️ Protected |
| **SQL Injection (SQLi)** | Critical | Parameterized PostgREST client queries | 🛡️ Protected |
| **Credential Stuffing / Brute Force**| High | Sliding-window IP rate limiter (6 attempts / 15 min) | 🛡️ Protected |
| **Spam Bots / Form Flooding** | High | Invisible honeypot field + IP rate limiting | 🛡️ Protected |
| **Email Relay / CRLF Injection** | High | Header newline stripping + pinned recipients | 🛡️ Protected |
| **Clickjacking** | Medium | `X-Frame-Options: SAMEORIGIN` + `frame-ancestors 'self'` | 🛡️ Protected |
| **Cross-Site Scripting (XSS)** | Medium | React JSX auto-escaping + Strict CSP (no `unsafe-eval`) | 🛡️ Protected |
| **Proxy / CDN Session Caching** | Medium | `Cache-Control: private, no-store` on all admin paths | 🛡️ Protected |
| **Sensitive File Probing** | Low | Black-box routing returning 404 on `.env`, `.git`, etc. | 🛡️ Protected |
| **Stack Trace / Path Leakage** | Low | Custom error boundaries masking internal system errors | 🛡️ Protected |

---

*Document compiled: October 2026*  
*Standard: OWASP Top 10:2025 Compliance*  
*System: TalkAstrologer*
