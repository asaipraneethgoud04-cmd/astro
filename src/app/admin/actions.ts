"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { ReviewStatus } from "@/lib/reviews";
import {
  appointmentStatuses,
  messageStatuses,
  type AppointmentStatus,
  type MessageStatus,
} from "@/lib/inbox-types";
import { sendAppointmentConfirmedEmail } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function checkLoginRateLimit() {
  return checkRateLimit({
    bucket: "admin-login",
    limit: 6,
    windowSeconds: 900, // 6 attempts per 15 minutes per IP
  });
}

async function signedInClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

export interface ApproveAndScheduleParams {
  id: string;
  scheduledTime: string;
  sessionMedium?: string;
  meetingLinkOrInstructions?: string;
  customNote?: string;
}

export async function approveAndScheduleAppointment(params: ApproveAndScheduleParams) {
  if (!params.id) return { error: "Appointment ID is required." };
  if (!params.scheduledTime?.trim()) return { error: "Scheduled date and time is required." };

  const supabase = await signedInClient();

  // 1. Fetch the appointment to get client details
  const { data: appointment, error: fetchErr } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", params.id)
    .single();

  if (fetchErr || !appointment) {
    return { error: "Appointment record not found." };
  }

  // 2. Append schedule details to admin_note for clear audit history
  const sessionMedium = params.sessionMedium?.trim() || "Phone / WhatsApp Call";
  const timestamp = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const scheduleLog = `[SCHEDULED & CONFIRMED: ${timestamp}]\nTime: ${params.scheduledTime.trim()}\nFormat: ${sessionMedium}${
    params.meetingLinkOrInstructions ? `\nDetails: ${params.meetingLinkOrInstructions.trim()}` : ""
  }${params.customNote ? `\nNote sent to client: ${params.customNote.trim()}` : ""}`;
  
  const existingNote = appointment.admin_note?.trim();
  const nextNote = existingNote ? `${scheduleLog}\n\n---\n${existingNote}` : scheduleLog;

  // 3. Update appointment in database to "scheduled"
  const { error: updateErr } = await supabase
    .from("appointments")
    .update({
      status: "scheduled",
      admin_note: nextNote.slice(0, 2000),
    })
    .eq("id", params.id);

  if (updateErr) {
    return { error: "Failed to update appointment status in database." };
  }

  // 4. Send official branded confirmation email to client
  const emailRes = await sendAppointmentConfirmedEmail({
    clientName: appointment.full_name,
    clientEmail: appointment.email,
    clientPhone: appointment.phone,
    secondName: appointment.second_name,
    service: appointment.service,
    scheduledTime: params.scheduledTime.trim(),
    sessionMedium,
    meetingLinkOrInstructions: params.meetingLinkOrInstructions?.trim(),
    customNote: params.customNote?.trim(),
  });

  revalidatePath("/admin", "layout");
  revalidatePath("/admin/appointments");

  if (!emailRes.ok) {
    return {
      error: null,
      warning: `Appointment status set to Scheduled, but confirmation email failed: ${emailRes.error}`,
    };
  }

  return { error: null, success: true };
}

export async function setAppointmentStatus(id: string, status: AppointmentStatus) {
  if (!appointmentStatuses.includes(status)) return { error: "Unknown status." };
  const supabase = await signedInClient();
  const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
  if (error) return { error: "This appointment could not be updated." };
  revalidatePath("/admin", "layout");
  return { error: null };
}

export async function saveAppointmentNote(id: string, note: string) {
  const supabase = await signedInClient();
  const trimmed = note.trim().slice(0, 2000);
  const { error } = await supabase
    .from("appointments")
    .update({ admin_note: trimmed || null })
    .eq("id", id);
  if (error) return { error: "The note could not be saved." };
  revalidatePath("/admin/appointments");
  return { error: null };
}

export async function setMessageStatus(id: string, status: MessageStatus) {
  if (!messageStatuses.includes(status)) return { error: "Unknown status." };
  const supabase = await signedInClient();
  const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
  if (error) return { error: "This message could not be updated." };
  revalidatePath("/admin", "layout");
  return { error: null };
}

export async function setReviewStatus(id: string, status: ReviewStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const next = status === "accepted" ? { status } : { status, pinned: false };
  let { error } = await supabase.from("reviews").update(next).eq("id", id);

  if (error && status !== "accepted") {
    ({ error } = await supabase.from("reviews").update({ status }).eq("id", id));
  }

  if (error) {
    return { error: "This review could not be updated." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  return { error: null };
}

export async function setReviewPinned(id: string, pinned: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (pinned) {
    const { error } = await supabase.from("reviews").update({ pinned: true, status: "accepted" }).eq("id", id);
    if (error) {
      return { error: "This review could not be pinned." };
    }
  } else {
    const { error } = await supabase.from("reviews").update({ pinned: false }).eq("id", id);
    if (error) {
      return { error: "This review could not be unpinned." };
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  return { error: null };
}

export async function deleteReview(id: string) {
  if (!id) return { error: "Review ID is required." };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  let error;
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const adminClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );
    const res = await adminClient.from("reviews").delete().eq("id", id);
    error = res.error;
  } else {
    const res = await supabase.from("reviews").delete().eq("id", id);
    error = res.error;
  }

  if (error) {
    console.error("[deleteReview error]", error);
    return { error: error.message || "This review could not be deleted." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  return { error: null, success: true };
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
