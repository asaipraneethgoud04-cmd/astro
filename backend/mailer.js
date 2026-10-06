/**
 * ============================================================================
 * TALKASTROLOGER - BACKEND NODEMAILER SERVICE
 * ============================================================================
 * Centralized email dispatching for Hostinger SMTP:
 * - Appointments: myappointment@talkastrologer.com
 * - Support Desk: support@talkastrologer.com
 *
 * Can be imported: const mailer = require("./mailer");
 * Or tested directly: node backend/mailer.js test
 * ============================================================================
 */

const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

// Load local environment variables if available
function loadEnv() {
  try {
    const envPaths = [
      path.join(__dirname, "..", ".env.local"),
      path.join(__dirname, "..", ".env"),
    ];
    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        const lines = fs.readFileSync(p, "utf-8").split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eq = trimmed.indexOf("=");
          if (eq > 0) {
            const key = trimmed.slice(0, eq).trim();
            const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
            if (!process.env[key]) process.env[key] = val;
          }
        }
      }
    }
  } catch (err) {
    // Ignore fallback errors
  }
}

loadEnv();

// Helper: Normalize emails to full valid domain
function normalizeEmail(email, defaultEmail) {
  if (!email || !email.trim()) return defaultEmail;
  let trimmed = email.trim().replace(/^["']|["']$/g, "");
  if (trimmed.toLowerCase().endsWith("@talkastrologer")) {
    trimmed = `${trimmed}.com`;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed.toLowerCase() : defaultEmail;
}

// Helper: HTML escaping
function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// SMTP Configurations
function getSmtpConfig(channel = "appointment") {
  const host = (process.env.SMTP_HOST || "smtp.hostinger.com").trim();
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE !== "false";
  const adminAlertEmail = normalizeEmail(process.env.ADMIN_ALERT_EMAIL, "myappointment@talkastrologer.com");
  const supportEmail = normalizeEmail(process.env.SUPPORT_EMAIL, "support@talkastrologer.com");

  if (channel === "support") {
    const user = normalizeEmail(process.env.SUPPORT_SMTP_USER, "support@talkastrologer.com");
    const pass = (process.env.SUPPORT_SMTP_PASSWORD || "SupportTalk@1153#$").trim().replace(/^["']|["']$/g, "");
    const fromEmail = normalizeEmail(process.env.SUPPORT_MAIL_FROM, user);
    const fromName = (process.env.SUPPORT_MAIL_FROM_NAME || "TalkAstrologer Support").trim();
    return { host, port, secure, user, pass, fromEmail, fromName, adminAlertEmail, supportEmail };
  }

  const user = normalizeEmail(process.env.SMTP_USER, "myappointment@talkastrologer.com");
  const pass = (process.env.SMTP_PASSWORD || "TalkAstrologer@1153#$").trim().replace(/^["']|["']$/g, "");
  const fromEmail = normalizeEmail(process.env.MAIL_FROM, user);
  const fromName = (process.env.MAIL_FROM_NAME || "TalkAstrologer").trim();
  return { host, port, secure, user, pass, fromEmail, fromName, adminAlertEmail, supportEmail };
}

// Transporter Cache
const cachedTransporters = {};

function getTransporter(channel = "appointment") {
  const config = getSmtpConfig(channel);
  const key = `${config.host}:${config.port}:${config.user}:${config.pass}`;

  if (!cachedTransporters[channel] || cachedTransporters[channel].key !== key) {
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

    cachedTransporters[channel] = { transporter, key };
  }

  const fromAddress = `"${config.fromName}" <${config.fromEmail}>`;
  return { transporter: cachedTransporters[channel].transporter, fromAddress, config };
}

// Base send function
async function sendEmail({ to, subject, html, text, replyTo, channel = "appointment" }) {
  try {
    const { transporter, fromAddress } = getTransporter(channel);
    const recipients = Array.isArray(to) ? to : [to];
    const validRecipients = recipients
      .map((r) => normalizeEmail(r, ""))
      .filter((r) => r.length > 0);

    if (validRecipients.length === 0) {
      return { ok: false, error: "No valid recipient email address provided." };
    }

    const info = await transporter.sendMail({
      from: fromAddress,
      to: validRecipients.join(", "),
      replyTo: replyTo ? normalizeEmail(replyTo, undefined) : undefined,
      subject: subject.trim(),
      html,
      text: text || html.replace(/<[^>]+>/g, " ").trim(),
    });

    return { ok: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Mailer Error] Failed on channel '${channel}':`, err.message);
    return { ok: false, error: err.message };
  }
}

// ============================================================================
// HIGHER-LEVEL WORKFLOW DISPATCHERS
// ============================================================================

/**
 * 1. Dispatches Appointment Booking Notification (Alert to Admin + Receipt to Client)
 */
async function sendAppointmentNotificationEmail(payload) {
  const config = getSmtpConfig("appointment");
  const adminEmail = config.adminAlertEmail;

  const safeFullName = escapeHtml(payload.fullName);
  const safeSecondName = payload.secondName ? escapeHtml(payload.secondName) : "Not provided";
  const safeEmail = escapeHtml(payload.email);
  const safePhone = escapeHtml(payload.phone);
  const safeCity = escapeHtml(payload.city);
  const safeService = escapeHtml(payload.service);
  const safeMessage = payload.message ? escapeHtml(payload.message) : "No additional notes provided.";

  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f3eb; margin: 0; padding: 25px 15px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7d6bc; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
          <div style="background-color: #38070e; padding: 22px; text-align: center; border-bottom: 2px solid #d4af37;">
            <h1 style="color: #fcf9f2; margin: 0; font-size: 20px; font-weight: 700; text-transform: uppercase;">TalkAstrologer</h1>
            <p style="color: #f6e27a; margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">New Consultation Request</p>
          </div>
          <div style="padding: 24px;">
            <p style="color: #420813; font-size: 14px; margin-top: 0;">A new appointment request has been submitted:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; width: 35%;">Client Name</td><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #2a1114; font-weight: 700;">${safeFullName}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #7a5f64;">Partner / Second</td><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #2a1114;">${safeSecondName}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #7a5f64;">Service</td><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #8b1827; font-weight: 700;">${safeService}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #7a5f64;">Phone / WhatsApp</td><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #2a1114; font-weight: 700;">${safePhone}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #7a5f64;">Email</td><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #2a1114;">${safeEmail}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #7a5f64;">City</td><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #2a1114;">${safeCity}</td></tr>
              <tr><td style="padding: 8px 10px; color: #7a5f64; vertical-align: top;">Notes</td><td style="padding: 8px 10px; color: #2a1114; background-color: #faf6ee;">${safeMessage}</td></tr>
            </table>
            <div style="margin-top: 20px; text-align: center;">
              <a href="mailto:${safeEmail}" style="display: inline-block; background-color: #38070e; color: #f6e27a; font-weight: 700; text-decoration: none; padding: 10px 20px; border-radius: 50px; font-size: 13px; border: 1px solid #d4af37;">
                Reply Directly to Client &rarr;
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  // Send admin alert
  const adminResult = await sendEmail({
    to: adminEmail,
    subject: `[New Appointment] ${payload.service} - ${payload.fullName}`,
    html: adminHtml,
    channel: "appointment",
  });

  // Send client confirmation receipt if client email provided
  if (adminResult.ok && payload.email) {
    const clientHtml = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f3eb; margin: 0; padding: 25px 15px;">
          <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7d6bc;">
            <div style="background-color: #38070e; padding: 20px; text-align: center; border-bottom: 2px solid #d4af37;">
              <h1 style="color: #fcf9f2; margin: 0; font-size: 18px; font-weight: 700;">TalkAstrologer</h1>
              <p style="color: #f6e27a; margin: 4px 0 0; font-size: 12px;">Consultation Request Received</p>
            </div>
            <div style="padding: 24px; color: #3b171c; font-size: 14px; line-height: 1.6;">
              <p>Namaste <strong>${safeFullName}</strong>,</p>
              <p>Thank you for reaching out to <strong>TalkAstrologer</strong>. We have received your consultation request for <strong>${safeService}</strong>.</p>
              <p>Our Guruji will review your details and reach out to you via Phone/WhatsApp (<strong>${safePhone}</strong>) or email shortly to finalize your appointment time.</p>
              <div style="background: #faf6ee; padding: 14px; border-radius: 8px; margin: 18px 0; font-size: 13px;">
                <strong>Urgent Consultation?</strong><br>
                Call or WhatsApp Guruji directly at <a href="tel:+12146699699" style="color: #8b1827; font-weight: 700;">+1 214 669 9699</a>.
              </div>
              <p style="font-size: 12px; color: #7a5f64;">TalkAstrologer • Frisco, TX & Serving Nationwide Across USA • Strictly Confidential</p>
            </div>
          </div>
        </body>
      </html>
    `;

    sendEmail({
      to: payload.email,
      subject: `Your Consultation Request with TalkAstrologer - ${payload.service}`,
      html: clientHtml,
      replyTo: adminEmail,
      channel: "appointment",
    }).catch(() => {});
  }

  return adminResult;
}

/**
 * 2. Dispatches Contact / Support Message Notification
 */
async function sendContactNotificationEmail(payload) {
  const config = getSmtpConfig("support");
  const recipients = Array.from(new Set([config.supportEmail, config.adminAlertEmail]));

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safePhone = payload.phone ? escapeHtml(payload.phone) : "Not provided";
  const safeSubject = payload.subject ? escapeHtml(payload.subject) : "General Inquiry";
  const safeMessage = escapeHtml(payload.message);

  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f3eb; margin: 0; padding: 25px 15px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7d6bc;">
          <div style="background-color: #38070e; padding: 22px; text-align: center; border-bottom: 2px solid #d4af37;">
            <h1 style="color: #fcf9f2; margin: 0; font-size: 20px; font-weight: 700;">TalkAstrologer Support</h1>
            <p style="color: #f6e27a; margin: 4px 0 0; font-size: 12px;">New Contact Desk Enquiry</p>
          </div>
          <div style="padding: 24px; font-size: 13px;">
            <p style="color: #420813; font-size: 14px; margin-top: 0;">A new enquiry was submitted through Contact Us:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; width: 30%;">From</td><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #2a1114; font-weight: 700;">${safeName}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #7a5f64;">Email</td><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #2a1114;">${safeEmail}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #7a5f64;">Phone</td><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #2a1114;">${safePhone}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #7a5f64;">Subject</td><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #8b1827; font-weight: 700;">${safeSubject}</td></tr>
              <tr><td style="padding: 8px 10px; color: #7a5f64; vertical-align: top;">Message</td><td style="padding: 8px 10px; color: #2a1114; background-color: #faf6ee;">${safeMessage}</td></tr>
            </table>
            <div style="text-align: center; margin-top: 20px;">
              <a href="mailto:${safeEmail}" style="display: inline-block; background-color: #38070e; color: #f6e27a; font-weight: 700; text-decoration: none; padding: 10px 20px; border-radius: 50px; font-size: 13px; border: 1px solid #d4af37;">
                Reply Directly to Customer &rarr;
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: recipients,
    subject: `[Support Desk] ${payload.subject || "New Enquiry"} - ${payload.name}`,
    html: adminHtml,
    channel: "support",
  });
}

// ============================================================================
// SELF-DIAGNOSTIC TEST RUNNER (node backend/mailer.js test)
// ============================================================================

if (process.argv[2] === "test") {
  console.log("==================================================");
  console.log("TALKASTROLOGER BACKEND MAILER - DIAGNOSTIC TEST");
  console.log("==================================================");

  async function runTests() {
    console.log("1. Testing Appointment Channel (myappointment@talkastrologer.com)...");
    const res1 = await sendEmail({
      to: "myappointment@talkastrologer.com",
      subject: "Test Diagnostic - Appointments Channel",
      html: "<p>Appointments SMTP channel is operational!</p>",
      channel: "appointment",
    });
    console.log("   Result:", res1);

    console.log("\n2. Testing Support Channel (support@talkastrologer.com)...");
    const res2 = await sendEmail({
      to: "support@talkastrologer.com",
      subject: "Test Diagnostic - Support Channel",
      html: "<p>Support SMTP channel is operational!</p>",
      channel: "support",
    });
    console.log("   Result:", res2);

    console.log("\nDiagnostic test complete.");
  }

  runTests().catch(console.error);
}

module.exports = {
  sendEmail,
  sendAppointmentNotificationEmail,
  sendContactNotificationEmail,
  getSmtpConfig,
  getTransporter,
};
