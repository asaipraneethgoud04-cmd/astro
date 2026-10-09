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


/**
 * 4. Dispatches Official Consultation Confirmation Email to Client
 */
async function sendAppointmentConfirmedEmail(payload) {
  const config = getSmtpConfig("appointment");
  const adminEmail = config.adminAlertEmail || "myappointment@talkastrologer.com";

  const safeClientName = escapeHtml(payload.clientName);
  const safeSecondName = payload.secondName ? escapeHtml(payload.secondName) : "";
  const safePhone = payload.clientPhone ? escapeHtml(payload.clientPhone) : "";
  const safeService = escapeHtml(payload.service);
  const safeScheduledTime = escapeHtml(payload.scheduledTime);
  const safeMedium = payload.sessionMedium ? escapeHtml(payload.sessionMedium) : "Direct Phone / WhatsApp Call";
  const safeInstructions = payload.meetingLinkOrInstructions ? escapeHtml(payload.meetingLinkOrInstructions) : "";
  const safeCustomNote = payload.customNote ? escapeHtml(payload.customNote) : "";

  let safeMeetingUrl = null;
  if (payload.meetingLinkOrInstructions) {
    try {
      const parsedUrl = new URL(payload.meetingLinkOrInstructions.trim());
      if (parsedUrl.protocol === "https:") {
        safeMeetingUrl = parsedUrl.toString();
      }
    } catch {
      safeMeetingUrl = null;
    }
  }

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://talkastrologer.com"
  ).replace(/\/$/, "");

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
    subject: `Confirmed: Your Sacred Vedic Consultation with Master Vijay Ji - ${payload.service}`,
    html: emailHtml,
    replyTo: adminEmail,
    channel: "appointment",
  });
}

module.exports = {
  sendAppointmentConfirmedEmail,
  sendEmail,
  sendAppointmentNotificationEmail,
  sendContactNotificationEmail,
  getSmtpConfig,
  getTransporter,
};
