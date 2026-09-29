"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Reply } from "lucide-react";
import { setMessageStatus } from "../actions";
import { messageStatuses, type ContactMessage, type MessageStatus } from "@/lib/inbox-types";

type Filter = MessageStatus | "all";

const statusLabel: Record<MessageStatus, string> = {
  new: "New",
  replied: "Replied",
  closed: "Closed",
};

const statusBadge: Record<MessageStatus, string> = {
  new: "border-amber-200 bg-amber-50 text-amber-800",
  replied: "border-emerald-200 bg-emerald-50 text-emerald-800",
  closed: "border-stone-200 bg-stone-100 text-stone-600",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessagesBoard({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("new");
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const count = (status: Filter) =>
    status === "all" ? messages.length : messages.filter((m) => m.status === status).length;
  const visible = filter === "all" ? messages : messages.filter((m) => m.status === filter);

  function update(id: string, status: MessageStatus) {
    setError("");
    setPendingId(id);
    startTransition(async () => {
      const result = await setMessageStatus(id, status);
      setPendingId(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  const tabs: Filter[] = [...messageStatuses, "all"];

  return (
    <div className="mt-8 space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tabs.map((tab) => {
          const active = filter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-[#38070e] bg-[#38070e] text-white shadow-md"
                  : "border-[#eadcc4] bg-white text-[#38070e] hover:border-[#c59b27]"
              }`}
            >
              <span className="block font-serif text-2xl font-bold">{count(tab)}</span>
              <span className={`mt-0.5 block text-xs font-medium ${active ? "text-[#f6e27a]" : "text-[#7a4816]"}`}>
                {tab === "all" ? "All" : statusLabel[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">{error}</div>
      ) : null}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-[#e5d8c3] bg-white px-6 py-16 text-center">
          <Mail className="mx-auto mb-2 h-8 w-8 text-[#c59b27]/60" />
          <p className="font-serif text-lg font-bold text-[#38070e]">
            {filter === "new" ? "No new messages" : "Nothing here yet"}
          </p>
          <p className="mt-1 text-xs text-[#7a585f]">Messages from the Contact page show up here.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {visible.map((item) => {
            const busy = isPending && pendingId === item.id;
            const replySubject = encodeURIComponent(`Re: ${item.subject || "Your message to TalkAstrologer.com"}`);

            return (
              <li
                key={item.id}
                className={`rounded-2xl border bg-white p-5 shadow-[0_4px_24px_rgba(56,7,14,0.05)] sm:p-6 ${
                  item.status === "new" ? "border-[#c59b27]" : "border-[#e5d8c3]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c59b27]/40 bg-[#38070e] font-serif text-sm font-bold text-[#f6e27a]">
                      {item.name.trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="font-serif text-base font-bold capitalize text-[#38070e]">{item.name}</p>
                      <p className="text-xs text-[#7a585f]">Received {formatDate(item.created_at)}</p>
                    </div>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadge[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#3b171c]">
                  <a href={`mailto:${item.email}`} className="flex min-w-0 items-center gap-2 hover:text-[#8b1827]">
                    <Mail className="h-4 w-4 shrink-0 text-[#9e701e]" />
                    <span className="truncate">{item.email}</span>
                  </a>
                  {item.phone ? (
                    <a href={`tel:${item.phone}`} className="flex items-center gap-2 hover:text-[#8b1827]">
                      <Phone className="h-4 w-4 shrink-0 text-[#9e701e]" />
                      {item.phone}
                    </a>
                  ) : null}
                </div>

                {item.subject ? <p className="mt-4 font-serif text-sm font-bold text-[#38070e]">{item.subject}</p> : null}
                <p className="mt-2 whitespace-pre-line rounded-xl bg-[#f8f3ea] px-4 py-3 text-sm leading-relaxed text-[#38070e]">
                  {item.message}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#f2e8dc] pt-4">
                  <a
                    href={`mailto:${item.email}?subject=${replySubject}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#c59b27] bg-[#f6e27a] px-3 py-1.5 text-xs font-bold text-[#38070e] hover:bg-[#ebd255]"
                  >
                    <Reply className="h-3.5 w-3.5" />
                    Reply by email
                  </a>
                  <span className="ml-1 mr-1 text-xs font-medium text-[#7a585f]">Mark as:</span>
                  {messageStatuses
                    .filter((status) => status !== item.status)
                    .map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={busy}
                        onClick={() => update(item.id, status)}
                        className="rounded-lg bg-[#38070e] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#200408] disabled:opacity-50"
                      >
                        {statusLabel[status]}
                      </button>
                    ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
