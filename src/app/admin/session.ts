import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      redirect("/admin/login");
    }

    return data.user;
  } catch {
    redirect("/admin/login");
  }
}
