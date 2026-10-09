import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function GET() {
  const host = (process.env.SMTP_HOST || "smtp.hostinger.com").trim();
  const user = (process.env.SMTP_USER || "myappointment@talkastrologer.com").trim();
  const pass = (process.env.SMTP_PASSWORD || "TalkAstrologer@1153#$").trim();

  const report: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    environment_variables: {
      SMTP_HOST: host,
      SMTP_PORT: process.env.SMTP_PORT || "465 (default)",
      SMTP_USER: user,
      SMTP_PASS_IS_SET: Boolean(process.env.SMTP_PASSWORD),
      SUPPORT_SMTP_USER: process.env.SUPPORT_SMTP_USER || "support@talkastrologer.com (default)",
      SUPPORT_SMTP_PASS_IS_SET: Boolean(process.env.SUPPORT_SMTP_PASSWORD),
    },
    tests: {},
  };

  const tests: Record<string, string> = {};

  // Test 1: Verify Port 465 (SSL)
  try {
    const t465 = nodemailer.createTransport({
      host,
      port: 465,
      secure: true,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      auth: { user, pass },
    });
    await t465.verify();
    tests.port_465_verify = "SUCCESS: Hostinger Port 465 connected and authenticated!";
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    tests.port_465_verify = `FAILED: ${msg}`;
  }

  // Test 2: Verify Port 587 (TLS/STARTTLS)
  try {
    const t587 = nodemailer.createTransport({
      host,
      port: 587,
      secure: false,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      auth: { user, pass },
    });
    await t587.verify();
    tests.port_587_verify = "SUCCESS: Hostinger Port 587 connected and authenticated!";
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    tests.port_587_verify = `FAILED: ${msg}`;
  }

  // Test 3: Actual Test Dispatch
  try {
    const usePort = tests.port_465_verify.startsWith("SUCCESS") ? 465 : 587;
    const isSecure = usePort === 465;

    const transporter = nodemailer.createTransport({
      host,
      port: usePort,
      secure: isSecure,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: `"TalkAstrologer Netlify Diagnostics" <${user}>`,
      to: user,
      subject: `Netlify Live Mail Diagnostic - Port ${usePort}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #c59b27; border-radius: 8px;">
          <h2 style="color: #38070e;">Netlify Live Mail Diagnostic Passed!</h2>
          <p>Your Netlify deployment successfully connected to Hostinger SMTP on <strong>Port ${usePort}</strong>.</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    tests.live_send_result = `SUCCESS: Email delivered to ${user}! MessageId: ${info.messageId}`;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    tests.live_send_result = `FAILED: ${msg}`;
  }

  report.tests = tests;
  return NextResponse.json(report, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, template } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Valid recipient email address is required." }, { status: 400 });
    }

    const {
      sendAppointmentNotificationEmail,
      sendContactNotificationEmail,
      sendAppointmentConfirmedEmail,
    } = await import("@/lib/mail");

    const sampleAppointment = {
      fullName: "Praneeth Goud",
      secondName: "Pooja Sharma",
      email: email.trim(),
      phone: "+1 (972) 555-0199",
      city: "Dallas / Frisco, Texas",
      service: "Vedic Kundali & Horoscope Reading",
      message: "Seeking astrological guidance regarding career ventures and family peace.",
    };

    let result;
    const choice = (template || "appointment-client").toLowerCase();

    if (choice === "confirmed") {
      result = await sendAppointmentConfirmedEmail({
        clientName: "Praneeth Goud",
        clientEmail: email.trim(),
        clientPhone: "+1 (972) 555-0199",
        secondName: "Pooja Sharma",
        service: "Vedic Kundali & Horoscope Reading",
        scheduledTime: "Saturday, 11:00 AM CST (Dallas Time)",
        sessionMedium: "Google Meet / Direct WhatsApp Video",
        meetingLinkOrInstructions: "https://meet.google.com/ast-ro-vedic",
        customNote: "Master Vijay Ji recommends keeping your birth date and time documents ready before joining.",
      });
    } else if (choice.includes("contact")) {
      result = await sendContactNotificationEmail({
        name: "Praneeth Goud",
        email: email.trim(),
        phone: "+1 (972) 555-0199",
        subject: "Vedic Muhurat Guidance",
        message: "Namaste Master Vijay Ji, seeking auspicious timing for our new enterprise launch.",
      });
    } else {
      result = await sendAppointmentNotificationEmail(sampleAppointment);
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: errorMsg }, { status: 500 });
  }
}
