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
 * Resolves Hostinger SMTP configuration for appointment or support channels.
 */
function getSmtpConfig(channel: MailChannel = "appointment") {
  loadEnvFallback();

  const host = process.env.SMTP_HOST || "smtp.hostinger.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE !== "false";
  const adminAlertEmail = process.env.ADMIN_ALERT_EMAIL || "myappointment@TalkAstrologer";
  const supportEmail = process.env.SUPPORT_EMAIL || "support@TalkAstrologer";

  if (channel === "support") {
    const user = process.env.SUPPORT_SMTP_USER || "support@TalkAstrologer";
    const pass = process.env.SUPPORT_SMTP_PASSWORD || "";
    const fromEmail = process.env.SUPPORT_MAIL_FROM || user;
    const fromName = process.env.SUPPORT_MAIL_FROM_NAME || "TalkAstrologer Support";
    return { host, port, secure, user, pass, fromEmail, fromName, adminAlertEmail, supportEmail };
  }

  const user = process.env.SMTP_USER || "myappointment@TalkAstrologer";
  const pass = process.env.SMTP_PASSWORD || "";
  const fromEmail = process.env.MAIL_FROM || user;
  const fromName = process.env.MAIL_FROM_NAME || "TalkAstrologer";
  return { host, port, secure, user, pass, fromEmail, fromName, adminAlertEmail, supportEmail };
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
 * Base email dispatching function
 */
export async function sendEmail(options: SendMailOptions): Promise<SendMailResult> {
  try {
    const channel = options.channel || "appointment";
    const mailSetup = getTransporter(channel);
    if (!mailSetup) {
      return {
        ok: false,
        error: `Mail server configuration for ${channel} is missing. Please contact system administrator.`,
      };
    }

    const { transporter, fromAddress } = mailSetup;

    // Validate recipient(s)
    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    const sanitizedRecipients = recipients
      .map((r) => sanitizeHeader(r))
      .filter((r) => isValidEmail(r));

    if (sanitizedRecipients.length === 0) {
      return { ok: false, error: "Invalid recipient email address provided." };
    }

    // Sanitize subject & reply-to
    const sanitizedSubject = sanitizeHeader(options.subject);
    if (!sanitizedSubject) {
      return { ok: false, error: "Email subject cannot be empty." };
    }

    let sanitizedReplyTo: string | undefined = undefined;
    if (options.replyTo && isValidEmail(options.replyTo)) {
      sanitizedReplyTo = sanitizeHeader(options.replyTo);
    }

    const textContent = options.text || htmlToPlainText(options.html);

    logMailDebug("send_email_attempt", true);

    const info = await transporter.sendMail({
      from: fromAddress,
      to: sanitizedRecipients.join(", "),
      subject: sanitizedSubject,
      text: textContent,
      html: options.html,
      replyTo: sanitizedReplyTo,
    });

    logMailDebug("send_email_dispatched", true, { messageId: info.messageId });
    return { ok: true, messageId: info.messageId };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const errCode = (err as { code?: string })?.code || "TRANSPORTER_SEND_ERROR";
    logMailDebug("send_email_failed", false, { safeCode: `${errCode}: ${errMsg}` });
    console.error("[MailService] Failed to send email:", errMsg);

    return {
      ok: false,
      error: "Unable to send email. Please try again or reach out directly by phone.",
    };
  }
}

/**
 * Dispatches appointment notifications:
 * 1. An alert to the Astrologer's desk with complete booking details
 * 2. An acknowledgment receipt to the client
 */
export async function sendAppointmentNotificationEmail(
  payload: AppointmentEmailPayload
): Promise<SendMailResult> {
  const config = getSmtpConfig();
  const adminEmail = config.adminAlertEmail || config.fromEmail || "myappointment@TalkAstrologer";

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

  // HTML Template for Client Acknowledgment
  const clientHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Appointment Request Received</title>
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
              Namaste ${safeFullName},
            </p>
            <p style="color: #5c474b; font-size: 14px; line-height: 1.6;">
              Thank you for reaching out to <strong>TalkAstrologer</strong>. We have received your consultation request for <strong>${safeService}</strong>.
            </p>
            <p style="color: #5c474b; font-size: 14px; line-height: 1.6;">
              Our consultation team will review your details and contact you via phone or email within a few hours to confirm your sacred consultation time slot.
            </p>

            <div style="background-color: #faf6ee; border: 1px solid #ebdcc2; border-radius: 8px; padding: 18px; margin: 22px 0;">
              <h3 style="margin: 0 0 10px; color: #420813; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
                Your Request Summary:
              </h3>
              <p style="margin: 4px 0; color: #5c474b; font-size: 13px;"><strong>Service:</strong> ${safeService}</p>
              <p style="margin: 4px 0; color: #5c474b; font-size: 13px;"><strong>City:</strong> ${safeCity}</p>
              <p style="margin: 4px 0; color: #5c474b; font-size: 13px;"><strong>Contact Phone:</strong> ${safePhone}</p>
            </div>

            <p style="color: #5c474b; font-size: 13px; line-height: 1.6;">
              If your matter is urgent, you may also reach our team directly by phone at <a href="tel:+12146699699" style="color: #8b1827; font-weight: 700; text-decoration: none;">+1 214 669 9699</a>.
            </p>

            <p style="color: #420813; font-size: 14px; font-weight: 600; margin-top: 24px;">
              With blessings and cosmic peace,<br>
              <span style="color: #8b1827;">Master Vijay Ji & The TalkAstrologer Team</span>
            </p>
          </div>
          
          <div style="background-color: #faf6ee; padding: 16px; text-align: center; border-top: 1px solid #ebdcc2; font-size: 11px; color: #7a5f64;">
            TalkAstrologer • Frisco, TX & Serving Nationwide Across USA<br>
            Strictly Private & Confidential Consultations
          </div>
        </div>
      </body>
    </html>
  `;

  // 1. Send alert to administration
  logMailDebug("send_appointment_alert", true);
  const adminResult = await sendEmail({
    to: adminEmail,
    subject: `[New Appointment] ${payload.service} - ${payload.fullName}`,
    html: adminHtml,
    channel: "appointment",
  });
  logMailDebug("send_appointment_alert_result", adminResult.ok, { messageId: adminResult.messageId });

  // 2. Send receipt to client (in background, non-blocking failure)
  if (adminResult.ok && isValidEmail(payload.email)) {
    sendEmail({
      to: payload.email,
      subject: `Your Consultation Request with TalkAstrologer - ${payload.service}`,
      html: clientHtml,
      replyTo: adminEmail,
      channel: "appointment",
    }).catch((err) => {
      console.warn("[MailService] Failed to send client acknowledgment receipt:", err);
    });
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
  const config = getSmtpConfig();
  const supportEmail = config.supportEmail || "support@TalkAstrologer";
  const adminEmail = config.adminAlertEmail || config.fromEmail || "myappointment@TalkAstrologer";

  // Build target recipients: both support@TalkAstrologer and admin mailbox (deduplicated)
  const alertRecipients = Array.from(new Set([supportEmail, adminEmail].filter(isValidEmail)));

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
              New Support Enquiry (${supportEmail})
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
            This support enquiry was submitted via the contact form on TalkAstrologer and routed to ${supportEmail} &amp; admin dashboard.
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

  // 1. Send alert to administration & support inbox (using support SMTP channel)
  const adminResult = await sendEmail({
    to: alertRecipients.length > 0 ? alertRecipients : [supportEmail],
    subject: `[Support Enquiry] ${payload.subject || "Contact Form Inquiry"} - ${payload.name}`,
    html: adminHtml,
    replyTo: payload.email,
    channel: "support",
  });

  // 2. Send receipt to client from support desk (using support SMTP channel)
  if (adminResult.ok && isValidEmail(payload.email)) {
    sendEmail({
      to: payload.email,
      subject: `We have received your support inquiry - TalkAstrologer`,
      html: clientHtml,
      replyTo: supportEmail,
      channel: "support",
    }).catch((err) => {
      console.warn("[MailService] Failed to send contact acknowledgment receipt:", err);
    });
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
  const config = getSmtpConfig();
  const adminEmail = config.fromEmail;

  const safeClientName = escapeHtml(payload.clientName);
  const safeSecondName = payload.secondName ? escapeHtml(payload.secondName) : "";
  const safePhone = payload.clientPhone ? escapeHtml(payload.clientPhone) : "";
  const safeService = escapeHtml(payload.service);
  const safeScheduledTime = escapeHtml(payload.scheduledTime);
  const safeMedium = payload.sessionMedium ? escapeHtml(payload.sessionMedium) : "Direct Phone / WhatsApp Call";
  const safeInstructions = payload.meetingLinkOrInstructions ? escapeHtml(payload.meetingLinkOrInstructions) : "";
  const safeCustomNote = payload.customNote ? escapeHtml(payload.customNote) : "";

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
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f3eb; margin: 0; padding: 30px 15px; color: #2a1114;">
        <!-- Container -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e7d6bc; box-shadow: 0 10px 30px rgba(56,7,14,0.07); margin: 0 auto;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #38070e; padding: 28px 24px; text-align: center; border-bottom: 3px solid #d4af37;">
              <div style="font-size: 11px; letter-spacing: 0.25em; color: #f6e27a; text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">
                ✦ Vedic Astrology Guidance ✦
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; font-family: Georgia, serif;">
                TalkAstrologer
              </h1>
              <p style="color: #ecd29b; margin: 6px 0 0; font-size: 13px; letter-spacing: 0.06em;">
                Sacred Consultations with Master Vijay Ji
              </p>
            </td>
          </tr>

          <!-- Confirmation Badge Bar -->
          <tr>
            <td style="background-color: #faf6ee; padding: 14px 24px; text-align: center; border-bottom: 1px solid #ebdcc2;">
              <span style="display: inline-block; background-color: #27522e; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 6px 16px; border-radius: 50px;">
                ✓ Appointment Confirmed &amp; Scheduled
              </span>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 28px 24px;">
              <p style="color: #38070e; font-size: 17px; font-weight: 700; margin: 0 0 14px; font-family: Georgia, serif;">
                Namaste ${safeClientName},
              </p>
              
              <p style="color: #4a383b; font-size: 14.5px; line-height: 1.65; margin: 0 0 20px;">
                We are pleased to inform you that your consultation with <strong>Master Vijay Ji</strong> has been officially confirmed. Please review your scheduled appointment time and consultation details below:
              </p>

              <!-- Sacred Session Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fbf8f2; border: 1.5px solid #d4af37; border-radius: 12px; margin: 20px 0 26px; overflow: hidden;">
                <tr>
                  <td style="background-color: #f4ecdc; padding: 12px 18px; border-bottom: 1px solid #ebdcc2;">
                    <span style="color: #38070e; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">
                      ✦ Confirmed Consultation Details
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 18px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 7px 0; color: #7a585f; font-size: 13px; font-weight: 600; width: 38%;">Guidance Service:</td>
                        <td style="padding: 7px 0; color: #8b1827; font-size: 14.5px; font-weight: 700;">${safeService}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; color: #7a585f; font-size: 13px; font-weight: 600; vertical-align: middle;">Confirmed Time:</td>
                        <td style="padding: 10px 0; vertical-align: middle;">
                          <div style="display: inline-block; background-color: #38070e; color: #f6e27a; font-weight: 700; font-size: 14.5px; padding: 6px 14px; border-radius: 6px; letter-spacing: 0.02em;">
                            🗓️ ${safeScheduledTime}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 7px 0; color: #7a585f; font-size: 13px; font-weight: 600;">Consultation Format:</td>
                        <td style="padding: 7px 0; color: #2a1114; font-size: 14px; font-weight: 600;">${safeMedium}</td>
                      </tr>
                      ${safeSecondName
      ? `
                      <tr>
                        <td style="padding: 7px 0; color: #7a585f; font-size: 13px; font-weight: 600;">Partner / Second Person:</td>
                        <td style="padding: 7px 0; color: #2a1114; font-size: 14px;">${safeSecondName}</td>
                      </tr>`
      : ""
    }
                      ${safePhone
      ? `
                      <tr>
                        <td style="padding: 7px 0; color: #7a585f; font-size: 13px; font-weight: 600;">Your Phone Number:</td>
                        <td style="padding: 7px 0; color: #2a1114; font-size: 14px;">${safePhone}</td>
                      </tr>`
      : ""
    }
                    </table>

                    ${safeInstructions
      ? `
                      <div style="margin-top: 14px; padding-top: 14px; border-top: 1px dashed #decbb2;">
                        <span style="display: block; color: #7a585f; font-size: 12px; font-weight: 600; margin-bottom: 4px;">Meeting Link / Connection Notes:</span>
                        ${safeMeetingUrl
        ? `<a href="${escapeHtml(safeMeetingUrl)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #8b1827; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 700; margin-top: 4px;">Join Consultation Online &rarr;</a>`
        : `<div style="color: #2a1114; font-size: 13.5px; background: #ffffff; padding: 8px 12px; border-radius: 6px; border: 1px solid #e7d6bc;">${safeInstructions}</div>`
      }
                      </div>`
      : ""
    }
                  </td>
                </tr>
              </table>

              ${safeCustomNote
      ? `
                <!-- Personal Note from Master Vijay Ji -->
                <div style="background-color: #fffdf9; border-left: 4px solid #c59b27; padding: 14px 18px; margin: 0 0 24px; border-radius: 0 8px 8px 0; border-top: 1px solid #f0e4cf; border-right: 1px solid #f0e4cf; border-bottom: 1px solid #f0e4cf;">
                  <span style="display: block; color: #8b1827; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px;">
                    Personal Note from Master Vijay Ji:
                  </span>
                  <p style="margin: 0; color: #3d2c2f; font-size: 14px; font-style: italic; line-height: 1.55;">
                    "${safeCustomNote}"
                  </p>
                </div>`
      : ""
    }

              <!-- Preparation Checklist -->
              <div style="background-color: #faf6ee; border-radius: 10px; padding: 18px 20px; margin-bottom: 24px; border: 1px solid #ebdcc2;">
                <h3 style="margin: 0 0 12px; color: #38070e; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;">
                  ✦ How to Prepare for Your Sacred Reading
                </h3>
                <ul style="margin: 0; padding-left: 18px; color: #554044; font-size: 13px; line-height: 1.6;">
                  <li style="margin-bottom: 6px;"><strong>Birth Information:</strong> If available, keep your exact Date, Time, and City of Birth ready for precise horoscope analysis.</li>
                  <li style="margin-bottom: 6px;"><strong>Peaceful Environment:</strong> Please be in a tranquil space where you can speak freely in complete privacy.</li>
                  <li style="margin-bottom: 6px;"><strong>Questions in Advance:</strong> Feel free to jot down the core questions or dilemmas you wish to explore.</li>
                  <li><strong>Prompt Connection:</strong> Master Vijay Ji will connect with you at your exact confirmed time.</li>
                </ul>
              </div>

              <!-- Assistance Callout -->
              <p style="color: #5c474b; font-size: 13px; line-height: 1.6; margin: 0 0 20px;">
                Need to reschedule or have urgent questions prior to your session? Simply reply directly to this email or call our desk at <a href="tel:+12146699699" style="color: #8b1827; font-weight: 700; text-decoration: none;">+1 214 669 9699</a>.
              </p>

              <!-- Blessing & Signature -->
              <div style="margin-top: 26px; padding-top: 18px; border-top: 1px solid #ebdcc2;">
                <p style="margin: 0; color: #5c474b; font-size: 13.5px; font-style: italic;">
                  May divine planetary wisdom bring peace, harmony, and prosperity to your journey.
                </p>
                <p style="margin: 10px 0 0; color: #38070e; font-size: 15px; font-weight: 700; font-family: Georgia, serif;">
                  Master Vijay Ji
                </p>
                <p style="margin: 2px 0 0; color: #8b1827; font-size: 12.5px; font-weight: 600;">
                  TalkAstrologer • Vedic Astrology &amp; Spiritual Guidance Desk
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #38070e; padding: 20px 24px; text-align: center; border-top: 1px solid #5a141f; color: #e5d0ad; font-size: 11.5px; line-height: 1.6;">
              <strong>TalkAstrologer</strong> • Frisco, TX &amp; Serving Clients Nationwide Across the USA<br>
              Direct Phone: +1 214 669 9699 • Email: myappointment@TalkAstrologer<br>
              <span style="color: #c9b189; font-size: 10.5px;">All consultations are strictly private, personal, and 100% confidential.</span>
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

