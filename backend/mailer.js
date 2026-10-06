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

// Base send function with dual-port 465/587 auto-fallback
async function sendEmail({ to, subject, html, text, replyTo, channel = "appointment" }) {
  const config = getSmtpConfig(channel);
  const recipients = Array.isArray(to) ? to : [to];
  const validRecipients = recipients
    .map((r) => normalizeEmail(r, ""))
    .filter((r) => r.length > 0);

  if (validRecipients.length === 0) {
    return { ok: false, error: "No valid recipient email address provided." };
  }

  const portsToTry = config.port === 587 ? [587, 465] : [465, 587];

  const defaultUser = channel === "support" ? "support@talkastrologer.com" : "myappointment@talkastrologer.com";
  const defaultPass = channel === "support" ? "SupportTalk@1153#$" : "TalkAstrologer@1153#$";

  const credentialsToTry = [{ user: config.user, pass: config.pass }];
  if (config.user !== defaultUser || config.pass !== defaultPass) {
    credentialsToTry.push({ user: defaultUser, pass: defaultPass });
  }

  let lastError = null;

  for (const creds of credentialsToTry) {
    const fromAddress = `"${config.fromName}" <${creds.user}>`;

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
          to: validRecipients.join(", "),
          replyTo: replyTo ? normalizeEmail(replyTo, undefined) : undefined,
          subject: subject.trim(),
          html,
          text: text || html.replace(/<[^>]+>/g, " ").trim(),
        });

        console.log(`[Backend Mailer] Delivered on ${channel} via port ${port} with ${creds.user}! MessageId: ${info.messageId}`);
        return { ok: true, messageId: info.messageId };
      } catch (err) {
        lastError = err;
        console.warn(`[Backend Mailer] Port ${port} attempt with ${creds.user} failed (${err.message}), trying alternative...`);
      }
    }
  }

  console.error(`[Backend Mailer] All SMTP ports and credentials failed for ${channel}:`, lastError?.message);
  return { ok: false, error: lastError?.message || "Unable to send email via SMTP." };
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

    // Await client receipt so serverless runtime doesn't cut it off
    try {
      await sendEmail({
        to: payload.email,
        subject: `Your Consultation Request with TalkAstrologer - ${payload.service}`,
        html: clientHtml,
        replyTo: adminEmail,
        channel: "appointment",
      });
    } catch (e) {
      console.warn("[Backend Mailer] Client receipt delivery failed:", e.message);
    }
  }

  return adminResult;
}

/**
 * 2. Dispatches Contact / Support Message Notification (Alert to Support Desk + Receipt to User)
 */
async function sendContactNotificationEmail(payload) {
  const config = getSmtpConfig("support");
  const supportInbox = config.supportEmail || "support@talkastrologer.com";

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safePhone = payload.phone ? escapeHtml(payload.phone) : "Not provided";
  const safeSubject = payload.subject ? escapeHtml(payload.subject) : "General Inquiry";
  const safeMessage = escapeHtml(payload.message);

  const adminHtml = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f3eb; margin: 0; padding: 25px 15px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7d6bc; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
          <div style="background-color: #38070e; padding: 22px; text-align: center; border-bottom: 2px solid #d4af37;">
            <h1 style="color: #fcf9f2; margin: 0; font-size: 20px; font-weight: 700; text-transform: uppercase;">TalkAstrologer Support Desk</h1>
            <p style="color: #f6e27a; margin: 4px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">New Support Enquiry</p>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px;">
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #7a5f64; width: 35%;">Sender Name</td><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #2a1114; font-weight: 700;">${safeName}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #7a5f64;">Email Address</td><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #2a1114;">${safeEmail}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #7a5f64;">Phone Number</td><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #2a1114;">${safePhone}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #7a5f64;">Subject</td><td style="padding: 8px 10px; border-bottom: 1px solid #f0e6d6; color: #8b1827; font-weight: 700;">${safeSubject}</td></tr>
              <tr><td style="padding: 8px 10px; color: #7a5f64; vertical-align: top;">Message</td><td style="padding: 8px 10px; color: #2a1114; background-color: #faf6ee;">${safeMessage}</td></tr>
            </table>
            <div style="margin-top: 20px; text-align: center;">
              <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(payload.subject || "Support Inquiry")}" style="display: inline-block; background-color: #38070e; color: #f6e27a; font-weight: 700; text-decoration: none; padding: 10px 20px; border-radius: 50px; font-size: 13px; border: 1px solid #d4af37;">
                Reply Directly to ${safeName} &rarr;
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  // 1. Send alert ONLY to Support mailbox
  const adminResult = await sendEmail({
    to: supportInbox,
    subject: `[Support Desk] ${payload.subject || "New Enquiry"} - ${payload.name}`,
    html: adminHtml,
    replyTo: payload.email,
    channel: "support",
  });

  // 2. Send acknowledgment receipt to client from Support Desk
  if (adminResult.ok && payload.email) {
    const clientHtml = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f3eb; margin: 0; padding: 25px 15px;">
          <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7d6bc;">
            <div style="background-color: #38070e; padding: 20px; text-align: center; border-bottom: 2px solid #d4af37;">
              <h1 style="color: #fcf9f2; margin: 0; font-size: 18px; font-weight: 700;">TalkAstrologer Support</h1>
              <p style="color: #f6e27a; margin: 4px 0 0; font-size: 12px;">We Have Received Your Message</p>
            </div>
            <div style="padding: 24px; color: #3b171c; font-size: 14px; line-height: 1.6;">
              <p>Namaste <strong>${safeName}</strong>,</p>
              <p>Thank you for reaching out to the <strong>TalkAstrologer Support Team</strong>. We have received your inquiry regarding "<strong>${safeSubject}</strong>".</p>
              <p>Our team reviews every request attentively and will get back to you at <strong>${safeEmail}</strong> within 24 hours.</p>
              <div style="background: #faf6ee; padding: 14px; border-radius: 8px; margin: 18px 0; font-size: 13px;">
                <strong>Need immediate assistance?</strong><br>
                Call or WhatsApp our desk at <a href="tel:+12146699699" style="color: #8b1827; font-weight: 700;">+1 214 669 9699</a> or write to <a href="mailto:${supportInbox}" style="color: #8b1827;">${supportInbox}</a>.
              </div>
              <p style="font-size: 12px; color: #7a5f64;">TalkAstrologer Support Desk • Strictly Confidential</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      await sendEmail({
        to: payload.email,
        subject: `We have received your support inquiry - TalkAstrologer`,
        html: clientHtml,
        replyTo: supportInbox,
        channel: "support",
      });
    } catch (e) {
      console.warn("[Backend Mailer] Support client receipt delivery failed:", e.message);
    }
  }

  return adminResult;
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
