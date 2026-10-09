import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (!error && data?.user) {
      redirect("/admin");
    }
  } catch {
    // Stale or invalid session, allow login page to render
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f0e4] px-4">
      <div className="w-full max-w-md rounded-[26px] border border-[#e5d0ad] bg-white p-8 shadow-[0_16px_40px_rgba(56,7,14,0.08)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-[#c59b27] shrink-0 bg-[#240409] shadow-sm">
            <Image
              src="/images/logo.png"
              alt="Talk Astrologer Logo"
              fill
              sizes="48px"
              className="object-cover object-center"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#aa8016]">
              Talk Astrologer
            </p>
            <h1 className="font-serif text-2xl font-bold text-[#38070e]">Admin Portal</h1>
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[#614b4f]">
          Sign in to read new reviews and choose which ones appear on the homepage.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
