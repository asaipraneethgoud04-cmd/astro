"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Mail, MessageSquareQuote } from "lucide-react";

type Counts = { reviews: number; appointments: number; messages: number };

export default function AdminNav({ counts }: { counts: Counts }) {
  const pathname = usePathname();

  const items = [
    { href: "/admin/appointments", label: "Appointments", icon: CalendarCheck, count: counts.appointments, hint: "new" },
    { href: "/admin/messages", label: "Support Enquiries", icon: Mail, count: counts.messages, hint: "new" },
    { href: "/admin", label: "Reviews", icon: MessageSquareQuote, count: counts.reviews, hint: "waiting" },
  ];

  return (
    <nav className="mt-8 flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              active ? "bg-[#f6e27a] text-[#240409]" : "text-[#f0e2d3] hover:bg-white/10"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.count > 0 ? (
              <span
                title={`${item.count} ${item.hint}`}
                className={`min-w-6 rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold ${
                  active ? "bg-[#240409] text-[#f6e27a]" : "bg-[#c59b27] text-[#240409]"
                }`}
              >
                {item.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
