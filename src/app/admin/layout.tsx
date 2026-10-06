import Image from "next/image";
import { getNewCounts } from "@/lib/inbox";
import { signOutAdmin } from "./actions";
import AdminNav from "./AdminNav";

import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    user = null;
  }

  // If no authenticated user (e.g. on /admin/login), render children directly without the admin sidebar
  if (!user) {
    return <>{children}</>;
  }

  const counts = await getNewCounts();

  return (
    <div className="min-h-screen bg-[#f4efe6] text-[#2a1114] md:grid md:grid-cols-[250px_1fr]">
      <aside className="flex flex-col bg-[#240409] text-white md:sticky md:top-0 md:h-screen">
        <div className="px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-[#c59b27] shrink-0 bg-[#240409] shadow-inner">
              <Image
                src="/images/logo.png"
                alt="Talk Astrologer Logo"
                fill
                unoptimized
                className="object-cover object-center"
              />
            </div>
            <div>
              <p className="font-serif text-sm font-bold tracking-wide text-white">Talk Astrologer</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#f6e27a]">Admin</p>
            </div>
          </div>
          <AdminNav counts={counts} />
        </div>
        <div className="border-t border-white/10 px-5 py-5 md:mt-auto md:pb-16">
          <p className="truncate text-xs text-[#f0e2d3]">{user.email}</p>
          <form action={signOutAdmin} className="mt-3">
            <button
              type="submit"
              className="w-full rounded-full border border-[#f6e27a]/50 px-4 py-2 text-xs font-semibold text-[#f6e27a] hover:bg-white/10"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 px-4 py-6 sm:px-8 sm:py-8">{children}</div>
    </div>
  );
}
