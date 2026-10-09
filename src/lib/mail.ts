import fs from "fs";
import path from "path";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Mail service configuration interfaces & safe types
 */
export type MailChannel = "appointment" | "support";

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  channel?: MailChannel;
}

export interface SendMailResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

export interface AppointmentEmailPayload {
  fullName: string;
  secondName?: string | null;
  email: string;
  phone: string;
  city: string;
  service: string;
  message?: string | null;
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}

export interface AppointmentConfirmedEmailPayload {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  secondName?: string | null;
  service: string;
  scheduledTime: string;
  sessionMedium?: string;
  meetingLinkOrInstructions?: string;
  customNote?: string;
}

// Reusable singleton transporter instances keyed by channel ("appointment" | "support")
const cachedTransporters: Record<string, { transporter: Transporter; key: string }> = {};

function logMailDebug(operation: string, success: boolean, meta?: { messageId?: string; safeCode?: string }) {
  if (process.env.NODE_ENV === "production" && !process.env.ENABLE_MAIL_DEBUG) {
    return;
  }
  try {
    // Write outside public web directory into node_modules/.cache or OS temp
    const logDir = path.join(process.cwd(), ".next", "cache");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logPath = path.join(logDir, "mail-service.log");
    const entry = JSON.stringify({
      timestamp: new Date().toISOString(),
      operation,
      success,
      messageId: meta?.messageId,
      safeCode: meta?.safeCode,
    });
    fs.appendFileSync(logPath, `${entry}\n`, "utf-8");
  } catch { }
}

/**
 * Development-only fallback: populates process.env from local .env files if running locally
 * without a process manager. In production, environment variables are provided directly by the host runtime.
 */
function loadEnvFallback() {
  // Never read local files in production if environment variables are provided by the hosting environment
  if (process.env.NODE_ENV === "production" && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    return;
  }
  try {
    const candidates = [
      path.join(process.cwd(), ".env.local"),
      path.join(process.cwd(), ".env"),
    ];
    for (const envPath of candidates) {
      if (fs.existsSync(/*turbopackIgnore: true*/ envPath)) {
        const content = fs.readFileSync(/*turbopackIgnore: true*/ envPath, "utf-8");
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if (
              (val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))
            ) {
              val = val.slice(1, -1);
            }
            if (
              key.startsWith("SMTP_") ||
              key.startsWith("MAIL_") ||
              key.startsWith("SUPPORT_") ||
              key === "ADMIN_ALERT_EMAIL"
            ) {
              process.env[key] = val;
            }
          }
        }
      }
    }
    logMailDebug("load_env_fallback", true);
  } catch {
    logMailDebug("load_env_fallback", false, { safeCode: "FALLBACK_READ_FAILED" });
  }
}

/**
 * Sanitizes headers to prevent email-header injection (CRLF injection)
 */
function sanitizeHeader(input: string): string {
  return input.replace(/[\r\n]+/g, " ").trim();
}

/**
 * Standard email format validator
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Converts HTML content to plain text fallback
 */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/gi, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Escapes HTML characters in user text for safe email templates
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Normalizes email address and fixes missing domain extensions
 */
function normalizeEmail(email: string | undefined, defaultEmail: string): string {
  if (!email || !email.trim()) return defaultEmail;
  let trimmed = email.trim().replace(/^["']|["']$/g, "");
  if (trimmed.toLowerCase().endsWith("@talkastrologer")) {
    trimmed = `${trimmed}.com`;
  }
  return isValidEmail(trimmed) ? trimmed.toLowerCase() : defaultEmail;
}

/**
 * Cleans passwords and strips accidental wrapping quotes
 */
function cleanPassword(pass: string | undefined, fallback: string): string {
  if (!pass) return fallback;
  const cleaned = pass.trim().replace(/^["']|["']$/g, "");
  return cleaned || fallback;
}

/**
 * Resolves Hostinger SMTP configuration for appointment or support channels.
 */
function getSmtpConfig(channel: MailChannel = "appointment") {
  loadEnvFallback();

  const host = (process.env.SMTP_HOST || "smtp.hostinger.com").trim();
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE !== "false";
  const adminAlertEmail = normalizeEmail(process.env.ADMIN_ALERT_EMAIL, "myappointment@talkastrologer.com");
  const supportEmail = normalizeEmail(process.env.SUPPORT_EMAIL, "support@talkastrologer.com");

  if (channel === "support") {
    const user = normalizeEmail(process.env.SUPPORT_SMTP_USER, "support@talkastrologer.com");
    const pass = cleanPassword(process.env.SUPPORT_SMTP_PASSWORD, "SupportTalk@1153#$");
    const fromEmail = normalizeEmail(process.env.SUPPORT_MAIL_FROM, user);
    const fromName = (process.env.SUPPORT_MAIL_FROM_NAME || "TalkAstrologer Support").trim();
    const alertEmail = normalizeEmail(process.env.SUPPORT_EMAIL, "support@talkastrologer.com");
    return { host, port, secure, user, pass, fromEmail, fromName, alertEmail };
  }

  const user = normalizeEmail(process.env.SMTP_USER, "myappointment@talkastrologer.com");
  const pass = cleanPassword(process.env.SMTP_PASSWORD, "TalkAstrologer@1153#$");
  const fromEmail = normalizeEmail(process.env.MAIL_FROM, user);
  const fromName = (process.env.MAIL_FROM_NAME || "TalkAstrologer Appointments").trim();
  const alertEmail = normalizeEmail(process.env.ADMIN_ALERT_EMAIL, "myappointment@talkastrologer.com");
  return { host, port, secure, user, pass, fromEmail, fromName, alertEmail };
}

/**
 * Retrieves or initializes the central Nodemailer transporter for the given channel
 */
function getTransporter(channel: MailChannel = "appointment"): { transporter: Transporter; fromAddress: string } | null {
  const config = getSmtpConfig(channel);

  if (!config.user || !config.pass) {
    logMailDebug("get_transporter", false, { safeCode: `${channel.toUpperCase()}_CREDENTIALS_MISSING` });
    console.warn(
      `[MailService] SMTP credentials for ${channel} are not configured. Email delivery skipped.`
    );
    return null;
  }

  const currentKey = `${config.host}:${config.port}:${config.user}:${config.pass}`;
  const existing = cachedTransporters[channel];

  if (!existing || existing.key !== currentKey) {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
    cachedTransporters[channel] = { transporter, key: currentKey };
  }

  const fromAddress = `"${sanitizeHeader(config.fromName)}" <${sanitizeHeader(config.fromEmail)}>`;
  return { transporter: cachedTransporters[channel]!.transporter, fromAddress };
}

/**
 * Base email dispatching function with dual-port (465/587) automatic fallback for serverless hosting
 */
export async function sendEmail(options: SendMailOptions): Promise<SendMailResult> {
  const channel = options.channel || "appointment";
  const config = getSmtpConfig(channel);

  if (!config.user || !config.pass) {
    return {
      ok: false,
      error: `Mail server configuration for ${channel} is missing credentials.`,
    };
  }

  const recipients = Array.isArray(options.to) ? options.to : [options.to];
  const sanitizedRecipients = recipients
    .map((r) => sanitizeHeader(r))
    .filter((r) => isValidEmail(r));

  if (sanitizedRecipients.length === 0) {
    return { ok: false, error: "Invalid recipient email address provided." };
  }

  const sanitizedSubject = sanitizeHeader(options.subject);
  if (!sanitizedSubject) {
    return { ok: false, error: "Email subject cannot be empty." };
  }

  let sanitizedReplyTo: string | undefined = undefined;
  if (options.replyTo && isValidEmail(options.replyTo)) {
    sanitizedReplyTo = sanitizeHeader(options.replyTo);
  }

  const textContent = options.text || htmlToPlainText(options.html);

  // Dual-port strategy: Try primary port first (465), then alternative (587)
  const portsToTry = config.port === 587 ? [587, 465] : [465, 587];

  // Guaranteed credential recovery: If Netlify env variable has a typo/bad password, try verified Hostinger credentials
  const defaultUser = channel === "support" ? "support@talkastrologer.com" : "myappointment@talkastrologer.com";
  const defaultPass = channel === "support" ? "SupportTalk@1153#$" : "TalkAstrologer@1153#$";

  const credentialsToTry = [{ user: config.user, pass: config.pass }];
  if (config.user !== defaultUser || config.pass !== defaultPass) {
    credentialsToTry.push({ user: defaultUser, pass: defaultPass });
  }

  let lastError: Error | null = null;

  for (const creds of credentialsToTry) {
    const fromAddress = `"${sanitizeHeader(config.fromName)}" <${creds.user}>`;

    for (const port of portsToTry) {
      const isSecure = port === 465;
      try {
        const transporter = nodemailer.createTransport({
          host: config.host,
          port,
          secure: isSecure,
          connectionTimeout: 10000,
          greetingTimeout: 8000,
          socketTimeout: 15000,
          auth: {
            user: creds.user,
            pass: creds.pass,
          },
          tls: {
            rejectUnauthorized: true,
          },
        });

        const info = await transporter.sendMail({
          from: fromAddress,
          to: sanitizedRecipients.join(", "),
          subject: sanitizedSubject,
          text: textContent,
          html: options.html,
          replyTo: sanitizedReplyTo,
        });

        console.log(`[MailService] Dispatched on ${channel} via port ${port} with ${creds.user}! MessageId: ${info.messageId}`);
        return { ok: true, messageId: info.messageId };
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.warn(`[MailService] Attempt with ${creds.user} on port ${port} failed (${lastError.message}), trying next fallback...`);
      }
    }
  }

  console.error(`[MailService] All SMTP ports and credentials failed for ${channel}:`, lastError?.message);
  return {
    ok: false,
    error: lastError?.message || "Unable to send email via SMTP.",
  };
}

/**
 * Dispatches appointment notifications:
 * 1. An alert to the Astrologer's desk with complete booking details
 * 2. An acknowledgment receipt to the client
 */
export async function sendAppointmentNotificationEmail(
  payload: AppointmentEmailPayload
): Promise<SendMailResult> {
  const config = getSmtpConfig("appointment");
  const appointmentInbox = config.alertEmail || "myappointment@talkastrologer.com";
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://talkastrologer.com"
  ).replace(/\/$/, "");

  const safeFullName = escapeHtml(payload.fullName);
  const safeSecondName = payload.secondName ? escapeHtml(payload.secondName) : "Not provided";
  const safeEmail = escapeHtml(payload.email);
  const safePhone = escapeHtml(payload.phone);
  const safeCity = escapeHtml(payload.city);
  const safeService = escapeHtml(payload.service);
  const safeMessage = payload.message ? escapeHtml(payload.message) : "No additional notes provided.";

  // HTML Template for Admin Alert
  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Appointment Request</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f3eb; margin: 0; padding: 30px 15px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7d6bc; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
          <div style="background-color: #38070e; padding: 24px; text-align: center; border-bottom: 2px solid #d4af37;">
            <h1 style="color: #fcf9f2; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
              TalkAstrologer
            </h1>
            <p style="color: #f6e27a; margin: 6px 0 0; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">
              New Consultation Appointment Request
            </p>
          </div>
          
          <div style="padding: 28px;">
            <p style="color: #420813; font-size: 15px; line-height: 1.5; margin-top: 0;">
              A new appointment consultation request has been submitted on <strong>TalkAstrologer</strong>:
            </p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; font-size: 13px; font-weight: 600; width: 35%;">Client Full Name</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #2a1114; font-size: 14px; font-weight: 700;">${safeFullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; font-size: 13px; font-weight: 600;">Partner / Second Name</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #2a1114; font-size: 14px;">${safeSecondName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; font-size: 13px; font-weight: 600;">Service Requested</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #8b1827; font-size: 14px; font-weight: 700;">${safeService}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; font-size: 13px; font-weight: 600;">Phone / WhatsApp</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #2a1114; font-size: 14px; font-weight: 600;">${safePhone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; font-size: 13px; font-weight: 600;">Email Address</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #2a1114; font-size: 14px;">${safeEmail}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; font-size: 13px; font-weight: 600;">Current City</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #2a1114; font-size: 14px;">${safeCity}</td>
              </tr>
              <tr>
                <td style="padding: 12px; vertical-align: top; color: #7a5f64; font-size: 13px; font-weight: 600;">Client's Notes</td>
                <td style="padding: 12px; color: #2a1114; font-size: 14px; line-height: 1.5; background-color: #faf6ee; border-radius: 6px;">${safeMessage}</td>
              </tr>
            </table>

            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #ebdcc2; text-align: center;">
              <a href="mailto:${safeEmail}" style="display: inline-block; background-color: #38070e; color: #f6e27a; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-size: 13px; letter-spacing: 0.05em; border: 1px solid #d4af37;">
                Reply Directly to Client
              </a>
            </div>
          </div>
          
          <div style="background-color: #faf6ee; padding: 16px; text-align: center; border-top: 1px solid #ebdcc2; font-size: 12px; color: #7a5f64;">
            This alert was generated automatically from the TalkAstrologer booking system.
          </div>
        </div>
      </body>
    </html>
  `;

  // HTML Template for Client Acknowledgment (Premium Vedic Manuscript Experience)
  const clientHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Consultation Request with TalkAstrologer</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td { font-family: Georgia, 'Times New Roman', serif !important; }
      </style>
      <![endif]-->
      <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        @media only screen and (max-width: 620px) {
          .email-container { width: 100% !important; border-radius: 0 !important; }
          .content-padding { padding: 22px 16px !important; }
          .header-padding { padding: 28px 18px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 28px 12px; background-color: #F4ECE1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2A1114;">
      
      <!-- Outer Wrapper Table -->
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 620px; background-color: #FFFDF8; border-radius: 16px; overflow: hidden; border: 1.5px solid #E2D1B3; box-shadow: 0 12px 36px rgba(56, 7, 14, 0.09); margin: 0 auto;">
        
        <!-- Top Celestial Ribbon -->
        <tr>
          <td style="background-color: #240408; padding: 10px 20px; text-align: center; border-bottom: 1px solid #4A0D16;">
            <span style="color: #F6E27A; font-size: 11px;">✦</span>
            <span style="font-size: 10.5px; letter-spacing: 0.22em; color: #ECD29B; text-transform: uppercase; font-weight: 700; margin: 0 8px; font-family: Georgia, serif;">
              Vedic Astrology Guidance &amp; Spiritual Peace
            </span>
            <span style="color: #F6E27A; font-size: 11px;">✦</span>
          </td>
        </tr>

        <!-- Golden Shimmer Bar -->
        <tr>
          <td style="height: 4px; line-height: 4px; font-size: 1px; background: linear-gradient(90deg, #38070E 0%, #C59B27 25%, #FFF5C0 50%, #C59B27 75%, #38070E 100%);">
            &nbsp;
          </td>
        </tr>

        <!-- 1. BURGUNDY HEADER WITH CELESTIAL BRANDING -->
        <tr>
          <td style="background-color: #4A0712; background-image: radial-gradient(circle at 50% 30%, #5E0E18 0%, #4A0712 65%, #240408 100%); padding: 34px 24px 28px; text-align: center; border-bottom: 2.5px solid #D4AF37;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center">
                  <!-- Sacred Glowing Medallion with Om Symbol -->
                  <div style="display: inline-block; width: 68px; height: 68px; line-height: 68px; border-radius: 50%; background: radial-gradient(circle, #6B111D 0%, #4A0712 70%, #2A040A 100%); border: 2.5px solid #D4AF37; box-shadow: 0 0 20px rgba(212,175,55,0.45); text-align: center; font-size: 32px; margin: 0 auto 12px;">
                    🕉️
                  </div>
                  <!-- Brand Title -->
                  <h1 style="color: #FFFFFF; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; font-family: Georgia, 'Times New Roman', serif; text-shadow: 0 2px 10px rgba(0,0,0,0.85);">
                    TALKASTROLOGER
                  </h1>
                  <!-- Tagline -->
                  <p style="color: #F6E27A; margin: 8px 0 0; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; text-shadow: 0 1px 6px rgba(0,0,0,0.9);">
                    Sacred Consultations with Master Vijay Ji
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Status Badge Bar -->
        <tr>
          <td style="background-color: #FAF6EE; padding: 13px 20px; text-align: center; border-bottom: 1.5px solid #EBDCC2;">
            <div style="display: inline-block; background-color: #38070E; color: #F6E27A; padding: 7px 20px; border-radius: 50px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; border: 1.5px solid #C59B27; box-shadow: 0 2px 8px rgba(56,7,14,0.18);">
              <span style="display: inline-block; width: 8px; height: 8px; background: #F6E27A; border-radius: 50%; margin-right: 7px; vertical-align: middle; box-shadow: 0 0 6px #F6E27A;"></span>
              ⏳ CONSULTATION REQUEST RECEIVED • UNDER REVIEW
            </div>
          </td>
        </tr>

        <!-- 2. WARM IVORY BODY WITH VEDIC SACRED GEOMETRY BACKGROUND -->
        <tr>
          <td class="content-padding" style="background-color: #FAF5EA; background-image: url('${siteUrl}/images/email/vedic-pattern-bg.png'); background-repeat: repeat; background-position: center top; padding: 32px 26px 24px;">
            
            <!-- Elevated Opaque Consultation Card with Faint Zodiac Watermark (~8% opacity) -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFDF8; background-image: url('${siteUrl}/images/email/astrolabe-watermark.png'); background-repeat: no-repeat; background-position: right -20px bottom -20px; background-size: 290px 290px; border-radius: 14px; border: 1.5px solid #E2D1B3; box-shadow: 0 4px 20px rgba(56,7,14,0.06); margin-bottom: 24px;">
              <tr>
                <td style="padding: 28px 24px;">
                  
                  <!-- Client Greeting -->
                  <p style="color: #38070E; font-size: 20px; font-weight: 700; margin: 0 0 14px; font-family: Georgia, 'Times New Roman', serif;">
                    Namaste ${safeFullName},
                  </p>

                  <p style="color: #4A383B; font-size: 14.5px; line-height: 1.65; margin: 0 0 18px;">
                    Thank you for reaching out to <strong>TalkAstrologer</strong>. We have safely received your consultation booking inquiry for <strong>${safeService}</strong>.
                  </p>
                  <p style="color: #4A383B; font-size: 14px; line-height: 1.65; margin: 0 0 24px;">
                    Master Vijay Ji and our consultation desk are currently reviewing your planetary details. We will contact you shortly by phone or email to finalize your sacred consultation time slot.
                  </p>

                  <!-- Inner Details Panel (High Contrast & Clear) -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FBF8F2; border: 1.5px solid #E5D5BA; border-radius: 10px; overflow: hidden; margin-bottom: 22px;">
                    <tr>
                      <td colspan="2" style="background-color: #F4ECDC; padding: 12px 18px; border-bottom: 1px solid #E2D1B3;">
                        <span style="color: #38070E; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-family: Georgia, serif;">
                          ✦ Summary of Your Sacred Consultation Request
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #7A585F; font-size: 13px; font-weight: 600; width: 36%;">🔮 Requested Service</td>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0;">
                        <span style="display: inline-block; background-color: #38070E; color: #F6E27A; font-weight: 700; font-size: 13px; padding: 3px 10px; border-radius: 6px; border: 1px solid #C59B27;">
                          ${safeService}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #7A585F; font-size: 13px; font-weight: 600;">👤 Client Full Name</td>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #2A1114; font-size: 14px; font-weight: 700;">${safeFullName}</td>
                    </tr>
                    ${safeSecondName ? `
                    <tr>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #7A585F; font-size: 13px; font-weight: 600;">👥 Partner / Second Name</td>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #2A1114; font-size: 14px;">${safeSecondName}</td>
                    </tr>` : ""}
                    <tr>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #7A585F; font-size: 13px; font-weight: 600;">📍 City / Location</td>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #2A1114; font-size: 14px; font-weight: 600;">${safeCity}</td>
                    </tr>
                    <tr>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #7A585F; font-size: 13px; font-weight: 600;">📞 Contact Phone / WhatsApp</td>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #2A1114; font-size: 14px; font-weight: 700;">
                        <a href="tel:${safePhone}" style="color: #8B1827; text-decoration: none;">${safePhone}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #7A585F; font-size: 13px; font-weight: 600;">✉️ Email Address</td>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #2A1114; font-size: 14px;">
                        <a href="mailto:${safeEmail}" style="color: #8B1827; text-decoration: none;">${safeEmail}</a>
                      </td>
                    </tr>
                    ${safeMessage ? `
                    <tr>
                      <td style="padding: 12px 16px; vertical-align: top; color: #7A585F; font-size: 13px; font-weight: 600;">📝 Client's Notes / Intentions</td>
                      <td style="padding: 12px 16px; color: #2A1114; font-size: 13.5px; line-height: 1.55; background-color: #FAF5EA; border-left: 3px solid #C59B27;">
                        ${safeMessage}
                      </td>
                    </tr>` : ""}
                  </table>

                  <!-- Consultation Journey Steps -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px dashed #DECBB2; border-radius: 10px; padding: 14px 18px; margin-bottom: 22px;">
                    <tr>
                      <td>
                        <span style="display: block; color: #38070E; font-weight: 700; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; font-family: Georgia, serif;">
                          ✦ Your Consultation Journey:
                        </span>
                        <p style="margin: 3px 0; font-size: 12.5px; color: #27522E; font-weight: 600;">
                          ✓ Step 1: Request Received &amp; Logged (Completed)
                        </p>
                        <p style="margin: 3px 0; font-size: 12.5px; color: #8B1827; font-weight: 600;">
                          ⏳ Step 2: Astrologer Slot Confirmation (In Progress)
                        </p>
                        <p style="margin: 3px 0; font-size: 12.5px; color: #7A585F;">
                          ✦ Step 3: Sacred 1-on-1 Guidance Session
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Urgent Assistance Callout -->
                  <div style="background-color: #FAF5EA; border-left: 4px solid #C59B27; padding: 13px 16px; margin-bottom: 22px; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; color: #3D2C2F; font-size: 13px; line-height: 1.55;">
                      <strong>Need Immediate or Same-Day Consultation?</strong><br>
                      You may contact Guruji directly by phone or WhatsApp at 
                      <a href="tel:+12146699699" style="color: #8B1827; font-weight: 700; text-decoration: none;">+1 214 669 9699</a>.
                    </p>
                  </div>

                  <!-- Vedic Blessing & Signature -->
                  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #EBDCC2;">
                    <p style="margin: 0; color: #5C474B; font-size: 13px; font-style: italic;">
                      May divine planetary wisdom bring peace, harmony, and prosperity to your journey.
                    </p>
                    <p style="margin: 8px 0 0; color: #38070E; font-size: 15px; font-weight: 700; font-family: Georgia, 'Times New Roman', serif;">
                      Master Vijay Ji &amp; The TalkAstrologer Team
                    </p>
                    <p style="margin: 2px 0 0; color: #8B1827; font-size: 11.5px; font-weight: 600;">
                      TalkAstrologer • Vedic Astrology Services &amp; Spiritual Remedies
                    </p>
                  </div>

                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #38070E; padding: 22px 24px; text-align: center; border-top: 1px solid #5A141F; color: #E5D0AD; font-size: 11.5px; line-height: 1.6;">
            <strong>TalkAstrologer</strong> • Frisco, TX &amp; Serving Clients Nationwide Across the USA<br>
            Direct Phone: +1 214 669 9699 • Email: myappointment@talkastrologer.com<br>
            <span style="color: #C9B189; font-size: 10.5px;">All consultations are strictly private, personal, and 100% confidential.</span>
          </td>
        </tr>

      </table>

    </body>
    </html>
  `;

  // 1. Send alert ONLY to Appointments mailbox
  logMailDebug("send_appointment_alert", true);
  const adminResult = await sendEmail({
    to: appointmentInbox,
    subject: `[New Appointment] ${payload.service} - ${payload.fullName}`,
    html: adminHtml,
    channel: "appointment",
  });
  logMailDebug("send_appointment_alert_result", adminResult.ok, { messageId: adminResult.messageId });

  // 2. Send receipt to client from Appointments desk
  if (isValidEmail(payload.email)) {
    try {
      await sendEmail({
        to: payload.email,
        subject: `Your Consultation Request with TalkAstrologer - ${payload.service}`,
        html: clientHtml,
        replyTo: appointmentInbox,
        channel: "appointment",
      });
    } catch (err) {
      console.warn("[MailService] Failed to send client acknowledgment receipt:", err);
    }
  }

  return adminResult;
}

/**
 * Dispatches contact message notifications:
 * 1. An alert to the support desk
 * 2. An acknowledgment receipt to the sender
 */
export async function sendContactNotificationEmail(
  payload: ContactEmailPayload
): Promise<SendMailResult> {
  const config = getSmtpConfig("support");
  const supportInbox = config.alertEmail || "support@talkastrologer.com";

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safePhone = payload.phone ? escapeHtml(payload.phone) : "Not provided";
  const safeSubject = payload.subject ? escapeHtml(payload.subject) : "General Inquiry";
  const safeMessage = escapeHtml(payload.message);

  // HTML Template for Admin Alert
  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Message</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f3eb; margin: 0; padding: 30px 15px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7d6bc; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
          <div style="background-color: #38070e; padding: 24px; text-align: center; border-bottom: 2px solid #d4af37;">
            <h1 style="color: #fcf9f2; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
              TalkAstrologer Support Desk
            </h1>
            <p style="color: #f6e27a; margin: 6px 0 0; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">
              New Support Enquiry (${supportInbox})
            </p>
          </div>
          
          <div style="padding: 28px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; font-size: 13px; font-weight: 600; width: 35%;">Sender Name</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #2a1114; font-size: 14px; font-weight: 700;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; font-size: 13px; font-weight: 600;">Email Address</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #2a1114; font-size: 14px;">${safeEmail}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; font-size: 13px; font-weight: 600;">Phone Number</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #2a1114; font-size: 14px;">${safePhone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; font-size: 13px; font-weight: 600;">Subject</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d6; color: #8b1827; font-size: 14px; font-weight: 700;">${safeSubject}</td>
              </tr>
              <tr>
                <td style="padding: 12px; vertical-align: top; color: #7a5f64; font-size: 13px; font-weight: 600;">Inquiry Message</td>
                <td style="padding: 12px; color: #2a1114; font-size: 14px; line-height: 1.5; background-color: #faf6ee; border-radius: 6px;">${safeMessage}</td>
              </tr>
            </table>

            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #ebdcc2; text-align: center;">
              <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(payload.subject || "Support Inquiry")}" style="display: inline-block; background-color: #38070e; color: #f6e27a; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-size: 13px; letter-spacing: 0.05em; border: 1px solid #d4af37; margin: 4px;">
                Reply Directly to ${safeName}
              </a>
              <a href="https://TalkAstrologer/admin/messages" style="display: inline-block; background-color: #f6f0e4; color: #38070e; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 50px; font-size: 13px; letter-spacing: 0.05em; border: 1px solid #c59b27; margin: 4px;">
                Open Admin Dashboard
              </a>
            </div>
          </div>
          
          <div style="background-color: #faf6ee; padding: 16px; text-align: center; border-top: 1px solid #ebdcc2; font-size: 12px; color: #7a5f64;">
            This support enquiry was submitted via the contact form on TalkAstrologer and routed to ${supportInbox}.
          </div>
        </div>
      </body>
    </html>
  `;

  // HTML Template for User Confirmation
  const clientHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Message Received</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f3eb; margin: 0; padding: 30px 15px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7d6bc; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
          <div style="background-color: #38070e; padding: 24px; text-align: center; border-bottom: 2px solid #d4af37;">
            <h1 style="color: #fcf9f2; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
              TalkAstrologer
            </h1>
            <p style="color: #f6e27a; margin: 6px 0 0; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">
              Vedic Cosmic Guidance & Consultations
            </p>
          </div>
          
          <div style="padding: 28px;">
            <p style="color: #2a1114; font-size: 16px; font-weight: 600; margin-top: 0;">
              Namaste ${safeName},
            </p>
            <p style="color: #5c474b; font-size: 14px; line-height: 1.6;">
              Thank you for contacting <strong>TalkAstrologer</strong>. We have received your inquiry regarding <strong>${safeSubject}</strong>.
            </p>
            <p style="color: #5c474b; font-size: 14px; line-height: 1.6;">
              A member of our guidance desk will review your message and respond promptly.
            </p>

            <p style="color: #420813; font-size: 14px; font-weight: 600; margin-top: 24px;">
              With blessings and cosmic peace,<br>
              <span style="color: #8b1827;">The TalkAstrologer Team</span>
            </p>
          </div>
          
          <div style="background-color: #faf6ee; padding: 16px; text-align: center; border-top: 1px solid #ebdcc2; font-size: 11px; color: #7a5f64;">
            TalkAstrologer • Frisco, TX & Serving Nationwide Across USA
          </div>
        </div>
      </body>
    </html>
  `;

  // 1. Send alert ONLY to Support Desk mailbox
  const adminResult = await sendEmail({
    to: supportInbox,
    subject: `[Support Enquiry] ${payload.subject || "Contact Form Inquiry"} - ${payload.name}`,
    html: adminHtml,
    replyTo: payload.email,
    channel: "support",
  });

  // 2. Send receipt to client from Support Desk
  if (isValidEmail(payload.email)) {
    try {
      await sendEmail({
        to: payload.email,
        subject: `We have received your support inquiry - TalkAstrologer`,
        html: clientHtml,
        replyTo: supportInbox,
        channel: "support",
      });
    } catch (err) {
      console.warn("[MailService] Failed to send contact acknowledgment receipt:", err);
    }
  }

  return adminResult;
}

/**
 * Dispatches an official Consultation Confirmation email to the client
 * after the admin reviews and approves the scheduled appointment time.
 */
export async function sendAppointmentConfirmedEmail(
  payload: AppointmentConfirmedEmailPayload
): Promise<SendMailResult> {
  const config = getSmtpConfig("appointment");
  const adminEmail = config.fromEmail || "myappointment@talkastrologer.com";

  const safeClientName = escapeHtml(payload.clientName);
  const safeSecondName = payload.secondName ? escapeHtml(payload.secondName) : "";
  const safePhone = payload.clientPhone ? escapeHtml(payload.clientPhone) : "";
  const safeService = escapeHtml(payload.service);
  const safeScheduledTime = escapeHtml(payload.scheduledTime);
  const safeMedium = payload.sessionMedium ? escapeHtml(payload.sessionMedium) : "Direct Phone / WhatsApp Call";
  const safeInstructions = payload.meetingLinkOrInstructions ? escapeHtml(payload.meetingLinkOrInstructions) : "";
  const safeCustomNote = payload.customNote ? escapeHtml(payload.customNote) : "";
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://talkastrologer.com"
  ).replace(/\/$/, "");

  // Strict allowlist validation for meeting link URL (reject unknown or suspicious domains)
  let safeMeetingUrl: string | null = null;
  if (payload.meetingLinkOrInstructions) {
    try {
      const parsedUrl = new URL(payload.meetingLinkOrInstructions.trim());
      if (parsedUrl.protocol === "https:") {
        const allowedHosts = [
          "meet.google.com",
          "zoom.us",
          "teams.microsoft.com",
          "wa.me",
          "api.whatsapp.com",
          "TalkAstrologer",
          "www.TalkAstrologer",
        ];
        const isAllowed = allowedHosts.some(
          (host) => parsedUrl.hostname === host || parsedUrl.hostname.endsWith(`.${host}`)
        );
        if (isAllowed) {
          safeMeetingUrl = parsedUrl.toString();
        }
      }
    } catch {
      safeMeetingUrl = null;
    }
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Appointment is Confirmed - TalkAstrologer</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td { font-family: Georgia, 'Times New Roman', serif !important; }
      </style>
      <![endif]-->
      <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        @media only screen and (max-width: 620px) {
          .email-container { width: 100% !important; border-radius: 0 !important; }
          .content-padding { padding: 22px 16px !important; }
          .header-padding { padding: 28px 18px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 28px 12px; background-color: #F4ECE1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2A1114;">
      
      <!-- Outer Wrapper Table -->
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 620px; background-color: #FFFDF8; border-radius: 16px; overflow: hidden; border: 1.5px solid #E2D1B3; box-shadow: 0 12px 36px rgba(56, 7, 14, 0.09); margin: 0 auto;">
        
        <!-- Top Celestial Ribbon -->
        <tr>
          <td style="background-color: #240408; padding: 10px 20px; text-align: center; border-bottom: 1px solid #4A0D16;">
            <span style="color: #F6E27A; font-size: 11px;">✦</span>
            <span style="font-size: 10.5px; letter-spacing: 0.22em; color: #ECD29B; text-transform: uppercase; font-weight: 700; margin: 0 8px; font-family: Georgia, serif;">
              Vedic Astrology Guidance &amp; Spiritual Peace
            </span>
            <span style="color: #F6E27A; font-size: 11px;">✦</span>
          </td>
        </tr>

        <!-- Golden Shimmer Bar -->
        <tr>
          <td style="height: 4px; line-height: 4px; font-size: 1px; background: linear-gradient(90deg, #38070E 0%, #C59B27 25%, #FFF5C0 50%, #C59B27 75%, #38070E 100%);">
            &nbsp;
          </td>
        </tr>

        <!-- 1. BURGUNDY HEADER WITH CELESTIAL BRANDING -->
        <tr>
          <td style="background-color: #4A0712; background-image: radial-gradient(circle at 50% 30%, #5E0E18 0%, #4A0712 65%, #240408 100%); padding: 34px 24px 28px; text-align: center; border-bottom: 2.5px solid #D4AF37;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center">
                  <!-- Sacred Glowing Medallion with Om Symbol -->
                  <div style="display: inline-block; width: 68px; height: 68px; line-height: 68px; border-radius: 50%; background: radial-gradient(circle, #6B111D 0%, #4A0712 70%, #2A040A 100%); border: 2.5px solid #D4AF37; box-shadow: 0 0 20px rgba(212,175,55,0.45); text-align: center; font-size: 32px; margin: 0 auto 12px;">
                    🕉️
                  </div>
                  <!-- Brand Title -->
                  <h1 style="color: #FFFFFF; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; font-family: Georgia, 'Times New Roman', serif; text-shadow: 0 2px 10px rgba(0,0,0,0.85);">
                    TALKASTROLOGER
                  </h1>
                  <!-- Tagline -->
                  <p style="color: #F6E27A; margin: 8px 0 0; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; text-shadow: 0 1px 6px rgba(0,0,0,0.9);">
                    Sacred Consultations with Master Vijay Ji
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Confirmed Status Badge Bar -->
        <tr>
          <td style="background-color: #FAF6EE; padding: 13px 20px; text-align: center; border-bottom: 1.5px solid #EBDCC2;">
            <div style="display: inline-block; background-color: #1B4324; color: #E7F6E9; padding: 7px 20px; border-radius: 50px; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; border: 1.5px solid #48A359; box-shadow: 0 2px 8px rgba(27,67,36,0.18);">
              <span style="display: inline-block; width: 8px; height: 8px; background: #62D77B; border-radius: 50%; margin-right: 7px; vertical-align: middle; box-shadow: 0 0 6px #62D77B;"></span>
              ✓ APPOINTMENT OFFICIALLY CONFIRMED &amp; SCHEDULED
            </div>
          </td>
        </tr>

        <!-- 2. WARM IVORY BODY WITH VEDIC SACRED GEOMETRY BACKGROUND -->
        <tr>
          <td class="content-padding" style="background-color: #FAF5EA; background-image: url('${siteUrl}/images/email/vedic-pattern-bg.png'); background-repeat: repeat; background-position: center top; padding: 32px 26px 24px;">
            
            <!-- Elevated Opaque Consultation Card with Faint Zodiac Watermark (~8% opacity) -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFDF8; background-image: url('${siteUrl}/images/email/astrolabe-watermark.png'); background-repeat: no-repeat; background-position: right -20px bottom -20px; background-size: 290px 290px; border-radius: 14px; border: 1.5px solid #E2D1B3; box-shadow: 0 4px 20px rgba(56,7,14,0.06); margin-bottom: 24px;">
              <tr>
                <td style="padding: 28px 24px;">
                  
                  <!-- Client Greeting -->
                  <p style="color: #38070E; font-size: 20px; font-weight: 700; margin: 0 0 14px; font-family: Georgia, 'Times New Roman', serif;">
                    Namaste ${safeClientName},
                  </p>

                  <p style="color: #4A383B; font-size: 14.5px; line-height: 1.65; margin: 0 0 18px;">
                    We are pleased to inform you that your Vedic Astrology consultation with <strong>Master Vijay Ji</strong> has been officially confirmed and scheduled on our sacred calendar.
                  </p>
                  <p style="color: #4A383B; font-size: 14px; line-height: 1.65; margin: 0 0 24px;">
                    Please review your confirmed consultation time and session access details below:
                  </p>

                  <!-- Inner Details Panel (High Contrast & Clear) -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FBF8F2; border: 1.5px solid #E5D5BA; border-radius: 10px; overflow: hidden; margin-bottom: 22px;">
                    <tr>
                      <td colspan="2" style="background-color: #F4ECDC; padding: 12px 18px; border-bottom: 1px solid #E2D1B3;">
                        <span style="color: #38070E; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-family: Georgia, serif;">
                          ✦ Confirmed Consultation Details
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #7A585F; font-size: 13px; font-weight: 600; width: 36%;">🔮 Guidance Service</td>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #8B1827; font-size: 14.5px; font-weight: 700;">
                        ${safeService}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 13px 16px; border-bottom: 1px solid #F0E4D0; color: #7A585F; font-size: 13px; font-weight: 600; vertical-align: middle;">🗓️ Confirmed Time</td>
                      <td style="padding: 13px 16px; border-bottom: 1px solid #F0E4D0; vertical-align: middle;">
                        <div style="display: inline-block; background-color: #38070E; color: #F6E27A; font-weight: 700; font-size: 14px; padding: 6px 14px; border-radius: 6px; border: 1px solid #C59B27; letter-spacing: 0.02em;">
                          🗓️ ${safeScheduledTime}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #7A585F; font-size: 13px; font-weight: 600;">📡 Consultation Format</td>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #2A1114; font-size: 14px; font-weight: 600;">${safeMedium}</td>
                    </tr>
                    ${safeSecondName ? `
                    <tr>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #7A585F; font-size: 13px; font-weight: 600;">👥 Partner / Second Person</td>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #2A1114; font-size: 14px;">${safeSecondName}</td>
                    </tr>` : ""}
                    ${safePhone ? `
                    <tr>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #7A585F; font-size: 13px; font-weight: 600;">📞 Your Phone Number</td>
                      <td style="padding: 11px 16px; border-bottom: 1px solid #F0E4D0; color: #2A1114; font-size: 14px; font-weight: 700;">${safePhone}</td>
                    </tr>` : ""}
                    ${safeInstructions ? `
                    <tr>
                      <td style="padding: 12px 16px; vertical-align: top; color: #7A585F; font-size: 13px; font-weight: 600;">🔗 Connection Details</td>
                      <td style="padding: 12px 16px; color: #2A1114; font-size: 13.5px; line-height: 1.55;">
                        ${safeMeetingUrl ? `
                        <a href="${escapeHtml(safeMeetingUrl)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #8B1827; color: #FFFFFF; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 700; margin-top: 2px;">
                          Join Consultation Online &rarr;
                        </a>` : `<div style="background-color: #FAF5EA; padding: 8px 12px; border-radius: 6px; border: 1px solid #E5D5BA;">${safeInstructions}</div>`}
                      </td>
                    </tr>` : ""}
                  </table>

                  ${safeCustomNote ? `
                  <!-- Personal Note from Master Vijay Ji -->
                  <div style="background-color: #FFFDF9; border-left: 4px solid #C59B27; padding: 14px 18px; margin: 0 0 22px; border-radius: 0 8px 8px 0; border-top: 1px solid #F0E4CF; border-right: 1px solid #F0E4CF; border-bottom: 1px solid #F0E4CF;">
                    <span style="display: block; color: #8B1827; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px;">
                      ✦ Personal Note from Master Vijay Ji:
                    </span>
                    <p style="margin: 0; color: #3D2C2F; font-size: 14px; font-style: italic; line-height: 1.55;">
                      "${safeCustomNote}"
                    </p>
                  </div>` : ""}

                  <!-- Preparation Checklist -->
                  <div style="background-color: #FAF6EE; border-radius: 10px; padding: 18px 20px; margin-bottom: 22px; border: 1px solid #EBDCC2;">
                    <h3 style="margin: 0 0 10px; color: #38070E; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; font-family: Georgia, serif;">
                      ✦ How to Prepare for Your Sacred Reading:
                    </h3>
                    <ul style="margin: 0; padding-left: 18px; color: #554044; font-size: 13px; line-height: 1.6;">
                      <li style="margin-bottom: 6px;"><strong>Birth Information:</strong> If available, keep your exact Date, Time, and City of Birth ready for precise horoscope analysis.</li>
                      <li style="margin-bottom: 6px;"><strong>Peaceful Environment:</strong> Please be in a tranquil space where you can speak freely in complete privacy.</li>
                      <li style="margin-bottom: 6px;"><strong>Questions in Advance:</strong> Feel free to jot down the core questions or dilemmas you wish to explore.</li>
                      <li><strong>Prompt Connection:</strong> Master Vijay Ji will connect with you at your exact confirmed time.</li>
                    </ul>
                  </div>

                  <!-- Urgent Assistance Callout -->
                  <div style="background-color: #FAF5EA; border-left: 4px solid #C59B27; padding: 13px 16px; margin-bottom: 22px; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; color: #3D2C2F; font-size: 13px; line-height: 1.55;">
                      <strong>Need to Reschedule or Urgent Questions?</strong><br>
                      You may reply directly to this email or call our desk at 
                      <a href="tel:+12146699699" style="color: #8B1827; font-weight: 700; text-decoration: none;">+1 214 669 9699</a>.
                    </p>
                  </div>

                  <!-- Vedic Blessing & Signature -->
                  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #EBDCC2;">
                    <p style="margin: 0; color: #5C474B; font-size: 13px; font-style: italic;">
                      May divine planetary wisdom bring peace, harmony, and prosperity to your journey.
                    </p>
                    <p style="margin: 8px 0 0; color: #38070E; font-size: 15px; font-weight: 700; font-family: Georgia, 'Times New Roman', serif;">
                      Master Vijay Ji &amp; The TalkAstrologer Team
                    </p>
                    <p style="margin: 2px 0 0; color: #8B1827; font-size: 11.5px; font-weight: 600;">
                      TalkAstrologer • Vedic Astrology Services &amp; Spiritual Remedies
                    </p>
                  </div>

                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #38070E; padding: 22px 24px; text-align: center; border-top: 1px solid #5A141F; color: #E5D0AD; font-size: 11.5px; line-height: 1.6;">
            <strong>TalkAstrologer</strong> • Frisco, TX &amp; Serving Clients Nationwide Across the USA<br>
            Direct Phone: +1 214 669 9699 • Email: myappointment@talkastrologer.com<br>
            <span style="color: #C9B189; font-size: 10.5px;">All consultations are strictly private, personal, and 100% confidential.</span>
          </td>
        </tr>

      </table>

    </body>
    </html>
  `;

  return sendEmail({
    to: payload.clientEmail,
    subject: `✓ Confirmed: Your Consultation with Master Vijay Ji - ${payload.scheduledTime}`,
    html: emailHtml,
    replyTo: adminEmail,
    channel: "appointment",
  });
}

