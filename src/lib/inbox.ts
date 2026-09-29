import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Appointment, ContactMessage } from "@/lib/inbox-types";

export * from "@/lib/inbox-types";

export async function getAppointments(): Promise<{ appointments: Appointment[]; error: string | null }> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("id, full_name, second_name, email, phone, city, service, message, status, admin_note, created_at")
    .order("created_at", { ascending: false });

  if (error) return { appointments: [], error: error.message };
  return { appointments: (data ?? []) as Appointment[], error: null };
}

export async function getContactMessages(): Promise<{ messages: ContactMessage[]; error: string | null }> {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, phone, subject, message, status, created_at")
    .order("created_at", { ascending: false });

  if (error) return { messages: [], error: error.message };
  return { messages: (data ?? []) as ContactMessage[], error: null };
}

export async function getNewCounts(): Promise<{ reviews: number; appointments: number; messages: number }> {
  noStore();
  const supabase = await createClient();
  const count = async (table: string, status: string) => {
    const { count: total, error } = await supabase
      .from(table)
      .select("id", { count: "exact", head: true })
      .eq("status", status);
    return error ? 0 : total ?? 0;
  };

  const [reviews, appointments, messages] = await Promise.all([
    count("reviews", "pending"),
    count("appointments", "new"),
    count("contact_messages", "new"),
  ]);

  return { reviews, appointments, messages };
}
