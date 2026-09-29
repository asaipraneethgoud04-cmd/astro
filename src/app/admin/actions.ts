"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ReviewStatus } from "@/lib/reviews";
import {
  appointmentStatuses,
  messageStatuses,
  type AppointmentStatus,
  type MessageStatus,
} from "@/lib/inbox-types";

async function signedInClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
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

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
