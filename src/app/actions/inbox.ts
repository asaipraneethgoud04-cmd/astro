"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

function text(value: FormDataEntryValue | null, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitAppointment(formData: FormData): Promise<Result> {
  const fullName = text(formData.get("fullName"), 120);
  const secondName = text(formData.get("secondName"), 120);
  const email = text(formData.get("email"), 200);
  const phone = text(formData.get("phone"), 40);
  const city = text(formData.get("city"), 120);
  const service = text(formData.get("service"), 160);
  const message = text(formData.get("message"), 2000);

  if (fullName.length < 2) return { ok: false, error: "Please add your full name." };
  if (!emailPattern.test(email)) return { ok: false, error: "Please add a valid email address." };
  if (phone.length < 6) return { ok: false, error: "Please add a phone number we can reach you on." };
  if (city.length < 2) return { ok: false, error: "Please add the city you are in now." };
  if (service.length < 2) return { ok: false, error: "Please choose an area of guidance." };

  const supabase = await createClient();
  const { error } = await supabase.from("appointments").insert({
    full_name: fullName,
    second_name: secondName || null,
    email,
    phone,
    city,
    service,
    message: message || null,
    status: "new",
  });

  if (error) {
    return { ok: false, error: "We could not send your request yet. Please try again or call +1 214 669 9699." };
  }

  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function submitContactMessage(formData: FormData): Promise<Result> {
  const name = text(formData.get("name"), 120);
  const email = text(formData.get("email"), 200);
  const phone = text(formData.get("phone"), 40);
  const subject = text(formData.get("subject"), 160);
  const message = text(formData.get("message"), 2000);

  if (name.length < 2) return { ok: false, error: "Please add your name." };
  if (!emailPattern.test(email)) return { ok: false, error: "Please add a valid email address." };
  if (message.length < 10) return { ok: false, error: "Please write a short message (at least 10 characters)." };

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone: phone || null,
    subject: subject || null,
    message,
    status: "new",
  });

  if (error) {
    return { ok: false, error: "We could not send your message yet. Please try again or email support@talkastrologer.com." };
  }

  revalidatePath("/admin", "layout");
  return { ok: true };
}
