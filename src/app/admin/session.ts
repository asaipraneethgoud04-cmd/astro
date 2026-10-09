import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (!error && data?.user) {
      user = data.user;
    }
  } catch {
    // Auth client failed or session expired
  }

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}
