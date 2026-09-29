"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { saveAppointmentNote, setAppointmentStatus } from "../actions";
import { appointmentStatuses, type Appointment, type AppointmentStatus } from "@/lib/inbox-types";

type Filter = AppointmentStatus | "all";

const statusLabel: Record<AppointmentStatus, string> = {
  new: "New",
  contacted: "Contacted",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusBadge: Record<AppointmentStatus, string> = {
  new: "border-amber-200 bg-amber-50 text-amber-800",
  contacted: "border-sky-200 bg-sky-50 text-sky-800",
  scheduled: "border-violet-200 bg-violet-50 text-violet-800",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelled: "border-stone-200 bg-stone-100 text-stone-600",
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

export default function AppointmentsBoard({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("new");
  const [message, setMessage] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const count = (status: Filter) =>
    status === "all" ? appointments.length : appointments.filter((a) => a.status === status).length;

  const visible = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  function run(id: string, task: () => Promise<{ error: string | null }>) {
    setMessage("");
    setPendingId(id);
    startTransition(async () => {
      const result = await task();
      setPendingId(null);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      router.refresh();
    });
  }

  const tabs: Filter[] = ["new", ...appointmentStatuses.filter((s) => s !== "new"), "all"];

  return (
    <div className="mt-8 space-y-6">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {tabs.map((tab) => {
          const active = filter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-2xl border p-3 text-left transition sm:p-4 ${
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

      {message ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">{message}</div>
      ) : null}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-[#e5d8c3] bg-white px-6 py-16 text-center">
          <CalendarCheck className="mx-auto mb-2 h-8 w-8 text-[#c59b27]/60" />
          <p className="font-serif text-lg font-bold text-[#38070e]">
            {filter === "new" ? "No new requests" : "Nothing here yet"}
          </p>
          <p className="mt-1 text-xs text-[#7a585f]">New requests from the Book Appointment page show up here.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {visible.map((item) => {
            const busy = isPending && pendingId === item.id;
            const note = notes[item.id] ?? item.admin_note ?? "";
            const noteChanged = note.trim() !== (item.admin_note ?? "").trim();

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
                      {item.full_name.trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="font-serif text-base font-bold capitalize text-[#38070e]">
                        {item.full_name}
                        {item.second_name ? (
                          <span className="font-sans text-sm font-normal text-[#7a585f]"> &amp; {item.second_name}</span>
                        ) : null}
                      </p>
                      <p className="text-xs text-[#7a585f]">Received {formatDate(item.created_at)}</p>
                    </div>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadge[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-[#3b171c] sm:grid-cols-2 lg:grid-cols-4">
                  <p className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-[#9e701e]" />
                    <span className="font-medium">{item.service}</span>
                  </p>
                  <a href={`tel:${item.phone}`} className="flex items-center gap-2 hover:text-[#8b1827]">
                    <Phone className="h-4 w-4 shrink-0 text-[#9e701e]" />
                    {item.phone}
                  </a>
                  <a href={`mailto:${item.email}`} className="flex min-w-0 items-center gap-2 hover:text-[#8b1827]">
                    <Mail className="h-4 w-4 shrink-0 text-[#9e701e]" />
                    <span className="truncate">{item.email}</span>
                  </a>
                  <p className="flex items-center gap-2 capitalize">
                    <MapPin className="h-4 w-4 shrink-0 text-[#9e701e]" />
                    {item.city}
                  </p>
                </div>

                {item.message ? (
                  <p className="mt-4 whitespace-pre-line rounded-xl bg-[#f8f3ea] px-4 py-3 text-sm leading-relaxed text-[#38070e]">
                    {item.message}
                  </p>
                ) : null}

                <div className="mt-4 space-y-2">
                  <label htmlFor={`note-${item.id}`} className="text-xs font-semibold text-[#7a4816]">
                    Private note (only admins see this)
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <textarea
                      id={`note-${item.id}`}
                      rows={2}
                      value={note}
                      maxLength={2000}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                      placeholder="e.g. Called on Tuesday, session fixed for Friday 6 PM CT"
                      className="w-full resize-none rounded-lg border border-[#e2d6c3] bg-[#fffcf7] px-3 py-2 text-sm text-[#420813] focus:border-[#8b1827] focus:outline-none focus:ring-2 focus:ring-[#8b1827]/20"
                    />
                    <button
                      type="button"
                      disabled={busy || !noteChanged}
                      onClick={() => run(item.id, () => saveAppointmentNote(item.id, note))}
                      className="shrink-0 rounded-lg border border-[#e5d0ad] bg-white px-4 py-2 text-xs font-semibold text-[#38070e] hover:border-[#c59b27] disabled:opacity-40"
                    >
                      Save note
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#f2e8dc] pt-4">
                  <span className="mr-1 text-xs font-medium text-[#7a585f]">Mark as:</span>
                  {appointmentStatuses
                    .filter((status) => status !== item.status)
                    .map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={busy}
                        onClick={() => run(item.id, () => setAppointmentStatus(item.id, status))}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                          status === "cancelled"
                            ? "border border-[#e5d0ad] bg-white text-[#8b1827] hover:border-[#8b1827]"
                            : "bg-[#38070e] text-white hover:bg-[#200408]"
                        }`}
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
