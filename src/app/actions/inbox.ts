"use server";

import { revalidatePath } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limiter";
import {
  sendAppointmentNotificationEmail,
  sendContactNotificationEmail,
} from "@/lib/mail";
import { validatePhoneNumber } from "@/lib/phone";

type Result = { ok: true } | { ok: false; error: string };

function text(value: FormDataEntryValue | null, max: number): string {
  if (typeof value !== "string") return "";
  // Strip null bytes and truncate to max length
  return value.replace(/\0/g, "").trim().slice(0, max);
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitAppointment(formData: FormData): Promise<Result> {
  // Anti-Bot Honeypot field (hidden from legitimate human users)
  const honeypot = text(formData.get("website_hp"), 100);
  if (honeypot) {
    // Silently succeed to deny feedback loop to automated scrapers
    return { ok: true };
  }

  // Rate Limiting: 6 bookings per 10 minutes per IP
  const rate = await checkRateLimit({
    bucket: "appointments",
    limit: 6,
    windowSeconds: 600,
  });
  if (!rate.allowed) {
    return {
      ok: false,
      error: `Too many requests from your network. Please wait ${rate.retryAfterSeconds} seconds before booking again.`,
    };
  }

  const fullName = text(formData.get("fullName"), 120);
  const secondName = text(formData.get("secondName"), 120);
  const email = text(formData.get("email"), 200).toLowerCase();
  const phone = text(formData.get("phone"), 40);
  const city = text(formData.get("city"), 120);
  const service = text(formData.get("service"), 160);
  const message = text(formData.get("message"), 2000);

  if (fullName.length < 2) return { ok: false, error: "Please add your full name." };
  if (!emailPattern.test(email)) return { ok: false, error: "Please add a valid email address." };

  const phoneCheck = validatePhoneNumber(phone, true);
  if (!phoneCheck.isValid) {
    return { ok: false, error: phoneCheck.error || "Please enter a valid phone number." };
  }
  const verifiedPhone = phoneCheck.formatted || phone;

  if (city.length < 2) return { ok: false, error: "Please add the city you are in now." };
  if (service.length < 2) return { ok: false, error: "Please choose an area of guidance." };

  const supabase = createPublicClient();

  // Idempotency / Double-click protection: Check if an identical submission occurred in the last 5 seconds
  const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
  const { data: recentExisting } = await supabase
    .from("appointments")
    .select("id")
    .eq("email", email)
    .eq("service", service)
    .gte("created_at", fiveSecondsAgo)
    .limit(1);

  if (recentExisting && recentExisting.length > 0) {
    // Treat as successful idempotent request to prevent duplicate bookings and spam
    return { ok: true };
  }
  const { error: dbError } = await supabase.from("appointments").insert({
    full_name: fullName,
    second_name: secondName || null,
    email,
    phone: verifiedPhone,
    city,
    service,
    message: message || null,
    status: "new",
  });

  if (dbError) {
    console.error("[Appointments] Database insert error:", dbError.message);
    return { ok: false, error: "We could not send your request yet. Please try again or call +1 214 669 9699." };
  }

  // Trigger centralized Nodemailer email notification
  const emailResult = await sendAppointmentNotificationEmail({
    fullName,
    secondName,
    email,
    phone: verifiedPhone,
    city,
    service,
    message,
  });

  if (!emailResult.ok) {
    console.error("[Appointments] Email notification dispatch FAILED:", emailResult.error);
  } else {
    console.log("[Appointments] Email notification dispatch SUCCESS! MessageId:", emailResult.messageId);
  }

  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function submitContactMessage(formData: FormData): Promise<Result> {
  // Anti-Bot Honeypot field (hidden from legitimate human users)
  const honeypot = text(formData.get("website_hp"), 100);
  if (honeypot) {
    return { ok: true };
  }

  // Rate Limiting: 6 contact messages per 10 minutes per IP
  const rate = await checkRateLimit({
    bucket: "contact",
    limit: 6,
    windowSeconds: 600,
  });
  if (!rate.allowed) {
    return {
      ok: false,
      error: `Too many submissions from your network. Please wait ${rate.retryAfterSeconds} seconds before sending again.`,
    };
  }

  const name = text(formData.get("name"), 120);
  const email = text(formData.get("email"), 200).toLowerCase();
  const phone = text(formData.get("phone"), 40);
  const subject = text(formData.get("subject"), 160);
  const message = text(formData.get("message"), 2000);

  if (name.length < 2) return { ok: false, error: "Please add your name." };
  if (!emailPattern.test(email)) return { ok: false, error: "Please add a valid email address." };

  let verifiedPhone: string | null = null;
  if (phone) {
    const phoneCheck = validatePhoneNumber(phone, false);
    if (!phoneCheck.isValid) {
      return { ok: false, error: phoneCheck.error || "Please enter a valid phone number." };
    }
    verifiedPhone = phoneCheck.formatted || phone;
  }

  if (message.length < 10) return { ok: false, error: "Please write a short message (at least 10 characters)." };

  const supabase = createPublicClient();

  // Idempotency / Double-click protection: Check if an identical submission occurred in the last 5 seconds
  const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
  const { data: recentExisting } = await supabase
    .from("contact_messages")
    .select("id")
    .eq("email", email)
    .gte("created_at", fiveSecondsAgo)
    .limit(1);

  if (recentExisting && recentExisting.length > 0) {
    // Treat as successful idempotent request to prevent duplicate messages and spam
    return { ok: true };
  }
  const { error: dbError } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone: verifiedPhone,
    subject: subject || null,
    message,
    status: "new",
  });

  if (dbError) {
    console.error("[Contact] Database insert error:", dbError.message);
    return { ok: false, error: "We could not send your message yet. Please try again or email support@talkastrologer.com." };
  }

  // Trigger centralized Nodemailer email notification
  const emailResult = await sendContactNotificationEmail({
    name,
    email,
    phone: verifiedPhone,
    subject,
    message,
  });

  if (!emailResult.ok) {
    console.warn("[Contact] Email notification dispatch warning:", emailResult.error);
  }

  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function submitReview(formData: FormData): Promise<Result> {
  // Anti-Bot Honeypot field (hidden from legitimate human users)
  const honeypot = text(formData.get("website_hp"), 100);
  if (honeypot) {
    return { ok: true };
  }

  // Rate Limiting: 5 review submissions per 10 minutes per IP
  const rate = await checkRateLimit({
    bucket: "reviews",
    limit: 5,
    windowSeconds: 600,
  });
  if (!rate.allowed) {
    return {
      ok: false,
      error: `Too many submissions from your network. Please wait ${rate.retryAfterSeconds} seconds before submitting again.`,
    };
  }

  const name = text(formData.get("name"), 80);
  const city = text(formData.get("city"), 80);
  const quote = text(formData.get("quote"), 600);

  if (name.length < 2 || city.length < 2) {
    return { ok: false, error: "Please add your name and city." };
  }
  if (quote.length < 20) {
    return { ok: false, error: "Please write at least a few sentences about your experience (minimum 20 characters)." };
  }

  const supabase = createPublicClient();
  const { error: dbError } = await supabase.from("reviews").insert({
    name,
    city,
    quote,
    status: "pending",
    pinned: false,
  });

  if (dbError) {
    console.error("[Reviews] Database insert error:", dbError.message);
    return { ok: false, error: "We could not save your review yet. Please try again in a moment." };
  }

  revalidatePath("/admin", "layout");
  return { ok: true };
}

