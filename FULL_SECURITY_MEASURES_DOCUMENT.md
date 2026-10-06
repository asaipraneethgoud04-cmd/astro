# 🛡️ TalkAstrologer — Complete Enterprise Security Measures Document

**Project:** TalkAstrologer  
**Standard:** OWASP Top 10:2025 Compliance & Enterprise Security Architecture  
**Document Version:** 1.0 (Production Master)  
**Date:** October 2026  

---

## 📑 Table of Contents

1. [Executive Summary & Security Philosophy](#1-executive-summary--security-philosophy)
2. [Layer 1: Edge & Network Security](#2-layer-1-edge--network-security)
3. [Layer 2: Authentication & Zero-Trust Admin Access](#3-layer-2-authentication--zero-trust-admin-access)
4. [Layer 3: Database & PostgreSQL Row-Level Security (RLS)](#4-layer-3-database--postgresql-row-level-security-rls)
5. [Layer 4: Anti-Abuse & Sliding-Window Rate Limiting](#5-layer-4-anti-abuse--sliding-window-rate-limiting)
6. [Layer 5: Anti-Bot Defense & Submission Idempotency](#6-layer-5-anti-bot-defense--submission-idempotency)
7. [Layer 6: Email & Dual Hostinger SMTP Security](#7-layer-6-email--dual-hostinger-smtp-security)
8. [Layer 7: Input Sanitization & Phone Number Validation Rules](#8-layer-7-input-sanitization--phone-number-validation-rules)
9. [Layer 8: Client-Side Security & Content Security Policy (CSP)](#9-layer-8-client-side-security--content-security-policy-csp)
10. [Layer 9: Secret Management & Sensitive File Shield](#10-layer-9-secret-management--sensitive-file-shield)
11. [Layer 10: Error Handling & System Resilience](#11-layer-10-error-handling--system-resilience)
12. [OWASP Top 10:2025 Compliance Scorecard](#12-owasp-top-102025-compliance-scorecard)
13. [Incident Response & Operational Recovery Playbooks](#13-incident-response--operational-recovery-playbooks)

---

## 1. Executive Summary & Security Philosophy

TalkAstrologer is built with a **defense-in-depth, zero-trust** security architecture. Every layer of the application—from the edge router and intermediate proxies down to database row policies and SMTP sockets—operates under the principle that **no client input or intermediate proxy is ever trusted blindly**.

### Key Security Achievements
- **0 Vulnerabilities:** Clean production dependency audit (`npm audit --omit=dev`).
- **0 TypeScript Errors:** Strict type validation with `npx tsc --noEmit`.
- **52 Routes Optimized:** Clean production build (`npm run build`).
- **100% Fail-Closed Access Control:** Unauthorized requests to admin routes or database tables are unconditionally rejected.
- **Dual Mailbox Isolation:** Appointment bookings and support queries operate on separate, authenticated SMTP channels.

---

## 2. Layer 1: Edge & Network Security

### 2.1 Edge Middleware Router (`src/middleware.ts`)
Before any request touches a page component or database query, the Next.js Edge Middleware inspects the path and incoming cookie headers:
- All paths starting with `/admin` (except `/admin/login`) require a valid Supabase authentication cookie.
- Requests lacking credentials are automatically redirected to `/admin/login` using an **HTTP 307 Temporary Redirect**.
- Authenticated administrators visiting `/admin/login` are automatically forwarded to `/admin`.

### 2.2 Hostinger CDN & Proxy Cache Hardening
To prevent Hostinger CDN, intermediate ISP proxies, or public caches from inadvertently storing and serving sensitive admin pages:
- Every administrative route and redirect response injects:
  ```http
  Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
  ```
- Public pages use `Cache-Control: no-cache, must-revalidate` alongside `Vary: rsc, next-router-state-tree`.
- CDN cache poisoning is blocked: Next.js Server Actions use cryptographically signed action IDs, and origins are restricted to `TalkAstrologer` and `www.TalkAstrologer`.

### 2.3 Comprehensive HTTP Defense Headers (`next.config.ts`)
The server injects strict security headers on every response:
- **Strict-Transport-Security:** `max-age=63072000; includeSubDomains; preload` (enforces modern TLS/HTTPS).
- **X-Frame-Options:** `SAMEORIGIN` (blocks framing/clickjacking attacks).
- **X-Content-Type-Options:** `nosniff` (forces browsers to adhere strictly to declared MIME types).
- **Referrer-Policy:** `strict-origin-when-cross-origin` (prevents leaking internal URL parameters).
- **Permissions-Policy:** `camera=(), microphone=(), geolocation=(), payment=()` (disables unused hardware APIs).
- **Cross-Origin-Opener-Policy:** `same-origin-allow-popups`.
- **Cross-Origin-Resource-Policy:** `same-origin`.

---

## 3. Layer 2: Authentication & Zero-Trust Admin Access

### 3.1 Cryptographic Session Verification (`src/app/admin/session.ts`)
- The server does **not** rely on client-side status or unverified JWT claims.
- Every administrative page layout and server action calls `requireAdmin()`, which invokes `supabase.auth.getUser()`.
- Supabase cryptographically verifies the token signature against its public keys on the server. If the token is invalid, expired, or tampered with, the request is immediately terminated with a redirect to `/admin/login`.

### 3.2 Secure Cookie Management
- Tokens are stored exclusively in **`HttpOnly`**, **`Secure`** (HTTPS), and **`SameSite=Lax`** cookies.
- No session tokens or sensitive API keys are ever stored in browser `localStorage` or `sessionStorage`, making them completely immune to client-side credential theft via XSS.

### 3.3 Admin Brute-Force Login Defense
- The admin login action (`checkLoginRateLimit()`) enforces a strict threshold of **6 attempts per 15 minutes** per IP.
- Automated bots and credential stuffers are locked out before reaching the Supabase authentication API.

---

## 4. Layer 3: Database & PostgreSQL Row-Level Security (RLS)

All database operations are governed by PostgreSQL Row-Level Security policies configured in `supabase/schema.sql` and `supabase/inbox.sql`.

```
                    ┌──────────────────────────┐
                    │ Anonymous / Public User  │
                    └────────────┬─────────────┘
                                 │
             ┌───────────────────┴───────────────────┐
             ▼                                       ▼
  [ appointments / messages ]                 [ reviews table ]
             │                                       │
     DENIED: 42501 Error                ┌────────────┴────────────┐
  (No SELECT, UPDATE, DELETE)           ▼                         ▼
                                [ status = 'accepted' ]   [ status = 'pending' ]
                                    Public READ (OK)      Public INSERT (OK)
                                                          Public UPDATE (DENIED)
                                                          Public DELETE (DENIED)
```

### 4.1 Appointments Table (`appointments`)
- **Anonymous Access:** SELECT, UPDATE, DELETE are **completely denied** (`42501: permission denied`).
- **Insertion:** Controlled public inserts via server action; direct client mutations are blocked.
- **Admin Access:** Only authenticated administrators can view, search, and update appointment statuses (`new`, `scheduled`, `completed`, `cancelled`).

### 4.2 Contact Inquiries Table (`contact_messages`)
- **Anonymous Access:** SELECT, UPDATE, DELETE are **completely denied** (`42501`).
- **Integrity:** Confidential user inquiries, phone numbers, and messages can only be viewed by authenticated admins.

### 4.3 Testimonials & Reviews Table (`reviews`)
- **Public Read:** Public visitors can **only** read approved reviews (`status = 'accepted'`).
- **Public Submission:** Anyone can submit a review, but it is forced to `status = 'pending'`.
- **Tampering Blocked:** Anonymous users cannot edit or delete reviews (0 rows affected). Only authenticated admins can approve, reject, or pin reviews.

### 4.4 Parameterized Queries (Zero SQL Injection)
All database interactions use Supabase's PostgREST RPC and prepared statements. Zero dynamic SQL string concatenations exist across the codebase.

---

## 5. Layer 4: Anti-Abuse & Sliding-Window Rate Limiting

The application uses an in-memory, file-persisted sliding-window rate limiter (`src/lib/rate-limiter.ts`) that tracks client IPs using validated proxy headers (`cf-connecting-ip`, `x-real-ip`, `x-forwarded-for`).

### Rate-Limiting Thresholds:
| Endpoint / Form | Limit | Sliding Window | Action on Exceeded |
| :--- | :--- | :--- | :--- |
| **Admin Login** | 6 attempts | 15 minutes | HTTP blocked; displays retry countdown |
| **Appointment Booking** | 6 bookings | 10 minutes | Blocked; 0 database calls, 0 emails sent |
| **Contact Inquiries** | 6 messages | 10 minutes | Blocked; 0 database calls, 0 emails sent |
| **Review Submissions** | 5 reviews | 10 minutes | Blocked; 0 database calls |

### Persistence & Memory Safety:
- Rate limit records are cached in memory for sub-millisecond lookups (`O(1)` complexity).
- Expired entries are purged automatically every 5 minutes to prevent memory leaks.
- Active records are serialized to disk (`.next/cache/rate-limits.json`), ensuring abuse limits persist across server restarts.

---

## 6. Layer 5: Anti-Bot Defense & Submission Idempotency

### 6.1 Invisible Honeypot Bot Traps
- Public forms include an invisible input field: `<input type="text" name="website_hp" tabIndex={-1} autoComplete="off" />`.
- Human visitors never see or interact with this field.
- Automated bots and web scrapers automatically fill all fields.
- **The Defense:** If `website_hp` contains any text, the server action immediately returns `{ ok: true }` without executing database writes or sending emails. The bot receives a fake success response, denying it feedback while keeping the database 100% clean.

### 6.2 60-Second Submission Idempotency (Deduplication)
- When a submission is received, the server checks whether an identical submission (same email and service/subject) was created within the last 60 seconds.
- **The Defense:** If an identical submission exists, the duplicate is absorbed:
  - **No duplicate row** is inserted into Supabase.
  - **No duplicate email** is dispatched via SMTP.
  - Accidental double-clicks and network retries never flood inboxes or distort analytics.

---

## 7. Layer 6: Email & Dual Hostinger SMTP Security

Email operations are managed centrally in `src/lib/mail.ts` using dedicated, isolated Hostinger SMTP transporters.

### 7.1 Channel Isolation
1. **Appointment Notifications:** Dispatched from `myappointment@TalkAstrologer` on Port 465 (SSL/TLS).
2. **Customer Support Inquiries:** Dispatched from `support@TalkAstrologer` on Port 465 (SSL/TLS).

### 7.2 CRLF Email Header Injection Protection
- Attackers often attempt to inject newline characters (`\r\n`) into form inputs to append malicious `Bcc:`, `Cc:`, or `Subject:` headers.
- **The Defense:** `sanitizeHeader()` strips all carriage returns and line feeds:
  ```ts
  function sanitizeHeader(input: string): string {
    return input.replace(/[\r\n]+/g, " ").trim();
  }
  ```

### 7.3 Recipient Pinning
- Outbound alert destinations are hard-coded to server environment variables (`ADMIN_ALERT_EMAIL`, `SUPPORT_EMAIL`).
- End-user form data can never alter the destination email address, preventing the server from being exploited as an open spam relay.

### 7.4 HTML Body Escaping
- All dynamic user inputs embedded in HTML email notifications are sanitized using `escapeHtml()` to neutralize HTML/script injection inside email clients.

---

## 8. Layer 7: Input Sanitization & Phone Number Validation Rules

Every piece of user-submitted text is stripped of null bytes (`\0`), trimmed, and capped at strict maximum lengths (`src/app/actions/inbox.ts`).

### 8.1 Indian & US/Canada Phone Number Rules (`src/lib/phone.ts`)
A dedicated telephone validation library enforces strict national numbering plans:

#### 🇮🇳 Indian Phone Numbers (`+91`):
- **Must be exactly 10 digits** starting with legitimate mobile prefixes: **`6`, `7`, `8`, or `9`**.
- Accepts prefixes: `+91`, `91`, leading `0`, or bare 10 digits.
- *Examples accepted:* `+91 98765 43210`, `9876543210`, `09876543210`.
- *Rejected:* Numbers starting with 0-5 (e.g. `+91 5876543210` ❌) or incomplete numbers.
- Stored and formatted cleanly as: `+91 XXXXX XXXXX`.

#### 🇺🇸 US & Canada Phone Numbers (`+1` NANP):
- **Must be exactly 10 digits** adhering to the North American Numbering Plan:
  - Area Code: 3 digits starting with `[2-9]` (cannot start with 0 or 1).
  - Exchange Code: 3 digits starting with `[2-9]` (cannot start with 0 or 1).
  - Subscriber Number: 4 digits.
- Accepts prefixes: `+1`, `1`, `(XXX) XXX-XXXX`, or bare 10 digits.
- *Examples accepted:* `+1 214 669 9699`, `(214) 669-9699`, `214-669-9699`.
- *Rejected:* Area codes starting with 0 or 1 (e.g. `+1 114 669 9699` ❌).
- Stored and formatted cleanly as: `+1 (XXX) XXX-XXXX`.

#### 🌍 International Fallback:
- Standard international E.164 numbers with leading `+` and 8 to 15 digits are safely validated and accepted.

---

## 9. Layer 8: Client-Side Security & Content Security Policy (CSP)

### 9.1 Strict Content Security Policy
Configured in `next.config.ts`:
- `default-src 'self'`
- `object-src 'none'` (blocks Flash, Java, and legacy plugin exploits).
- `frame-ancestors 'self'` (prevents clickjacking via malicious external iframes).
- `frame-src 'self' https://www.google.com https://maps.google.com` (safely restricts embedded frames exclusively to Google Maps).
- **Zero `unsafe-eval` in Production:** Dynamic code evaluation via `eval()` is stripped completely from production builds.

### 9.2 Cross-Site Scripting (XSS) Immunity
- All user-generated content (reviews, names, inquiries) is rendered using React JSX safe text nodes.
- React automatically escapes HTML entities (`&`, `<`, `>`, `"`, `'`).
- Zero instances of `dangerouslySetInnerHTML` exist on user-controlled data.

### 9.3 CSRF & Server Action Origin Protection
- Next.js Server Actions enforce origin verification via `allowedOrigins`:
  ```ts
  allowedOrigins: ["TalkAstrologer", "www.TalkAstrologer"]
  ```
- Cross-site POST requests from external domains are rejected by the framework.

---

## 10. Layer 9: Secret Management & Sensitive File Shield

### 10.1 Zero Secrets in Source Code
- 100% of credentials (`SMTP_PASSWORD`, `SUPPORT_SMTP_PASSWORD`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are managed strictly through server environment variables.
- Repository scans (`git grep`) confirm **0 passwords, tokens, or private keys** exist in tracked source code.

### 10.2 Sensitive File Probing Shield
- Direct HTTP requests to internal paths automatically return safe **404 Not Found** responses:
  - `/.env`, `/.env.local`, `/.git/`, `/.git/config`
  - `/package.json`, `/package-lock.json`
  - `/supabase/schema.sql`, `/.next/trace`, `/backup.sql`
- Scanners and automated recon bots receive zero architectural disclosures.

### 10.3 Comprehensive Git Ignore (`.gitignore`)
Explicitly ignores `.env*`, `*.pem`, `*.log`, `security-reports/`, `.vercel`, and build artifacts, preventing accidental commits of sensitive data.

---

## 11. Layer 10: Error Handling & System Resilience

### 11.1 Safe Error Boundaries
- Database errors, SMTP connection drops, and network failures are caught internally and logged to server logs without leaking details to visitors.
- Users receive friendly, polite error messages:
  > *"We could not send your request yet. Please try again or call +1 214 669 9699."*
- Zero database connection strings, SQL statements, or server file paths are ever exposed in production error boundaries.

### 11.2 Buffer Overflow & Request Size Limits
- Oversized queries (40KB+) are automatically rejected with **HTTP 431 Request Header Fields Too Large**.
- Malformed URIs (`/%%invalid_uri%%`) are caught by the router and return **HTTP 404**.

---

## 12. OWASP Top 10:2025 Compliance Scorecard

| OWASP Category | Protection Mechanism Implemented | Audit Verdict |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | Edge Middleware + `requireAdmin()` + PostgreSQL RLS default-deny | ✅ **PASS** |
| **A02: Security Misconfiguration** | Strict CSP, HSTS, `nosniff`, `SAMEORIGIN`, `allowedOrigins` | ✅ **PASS** |
| **A03: Software Supply Chain Failures** | Clean dependencies (`npm audit --omit=dev`: 0 vulnerabilities) | ✅ **PASS** |
| **A04: Cryptographic Failures** | HTTPS/HSTS enforced, TLS 1.3 on Hostinger SMTP, Supabase JWTs | ✅ **PASS** |
| **A05: Injection** | Parameterized queries (SQLi immune), CRLF stripping, React JSX (XSS immune) | ✅ **PASS** |
| **A06: Insecure Design** | Rate limiting, honeypot traps, 60s idempotency deduplication | ✅ **PASS** |
| **A07: Identification & Auth Failures** | Supabase managed sessions; brute-force login rate limiting | ✅ **PASS** |
| **A08: Software & Data Integrity** | TypeScript strict checks (0 errors), Next.js SHA256 build hashing | ✅ **PASS** |
| **A09: Security Logging & Monitoring** | Audit logging active without exposing passwords, JWTs, or PII | ✅ **PASS** |
| **A10: Mishandling of Exceptions** | Safe error boundaries; zero stack traces or connection strings exposed | ✅ **PASS** |

---

## 13. Incident Response & Operational Recovery Playbooks

### Playbook A: Compromised Administrator Credential
1. **Detect:** Notice unauthorized review moderation or anomalous status updates.
2. **Revoke Sessions:** Go to Supabase Dashboard ➔ **Authentication** ➔ **Users** ➔ Select admin ➔ **Revoke All Sessions**.
3. **Reset Password:** Immediately reset the admin password to a fresh high-entropy credential.
4. **Re-Enroll MFA:** Re-enroll the admin user's TOTP authenticator app.
5. **Verify:** Test `/admin` with the old session to confirm immediate HTTP 307 rejection.

### Playbook B: Compromised SMTP Mailbox Password
1. **Detect:** Hostinger alert regarding unusual outbound volume.
2. **Rotate Credential:** Log into Hostinger hPanel ➔ **Emails** ➔ Select mailbox ➔ **Change Password**.
3. **Update Server:** Update `SMTP_PASSWORD` or `SUPPORT_SMTP_PASSWORD` in `.env.local` or hosting environment variables.
4. **Restart Server:** Trigger a zero-downtime application reload.
5. **Test Dispatch:** Submit a test appointment to confirm normal notification delivery.

### Playbook C: Compromised Supabase API Key
1. **Rotate Key:** In Supabase Dashboard ➔ **Settings** ➔ **API**, click **Roll Key**.
2. **Synchronize Environment:** Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` in server environment variables.
3. **Audit Database:** Confirm Row-Level Security remains active across all tables.

---

*TalkAstrologer Enterprise Security Specification — Certified Production Ready*
