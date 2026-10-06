"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  X,
  AlertCircle,
} from "lucide-react";
import {
  approveAndScheduleAppointment,
  saveAppointmentNote,
  setAppointmentStatus,
} from "../actions";
import {
  appointmentStatuses,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/inbox-types";

type Filter = AppointmentStatus | "all";

interface ScheduleFormData {
  dateInput: string;
  timeInput: string;
  sessionMedium: string;
  meetingLinkOrInstructions: string;
  customNote: string;
}

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
  const [activeScheduleId, setActiveScheduleId] = useState<string | null>(null);
  const [scheduleForms, setScheduleForms] = useState<Record<string, ScheduleFormData>>({});
  const [feedback, setFeedback] = useState<Record<string, { type: "success" | "warning" | "error"; text: string }>>({});
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

  function getScheduleForm(id: string): ScheduleFormData {
    if (scheduleForms[id]) return scheduleForms[id];
    // Default tomorrow at 4:00 PM CDT
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    return {
      dateInput: dateStr,
      timeInput: "16:00",
      sessionMedium: "Direct Phone Call (+1 214 669 9699)",
      meetingLinkOrInstructions: "Master Vijay Ji will connect with you directly by phone.",
      customNote: "Please have your exact birth time and date on hand for the reading.",
    };
  }

  function updateScheduleForm(id: string, updates: Partial<ScheduleFormData>) {
    setScheduleForms((prev) => ({
      ...prev,
      [id]: { ...getScheduleForm(id), ...updates },
    }));
  }

  function handleScheduleAndEmail(item: Appointment) {
    const form = getScheduleForm(item.id);
    if (!form.dateInput || !form.timeInput) {
      setFeedback((prev) => ({
        ...prev,
        [item.id]: { type: "error", text: "Please choose both a date and time for the consultation." },
      }));
      return;
    }

    // Format human-friendly scheduled time string (e.g. "Friday, October 10, 2026 at 4:00 PM CDT")
    const combined = new Date(`${form.dateInput}T${form.timeInput}`);
    const scheduledTimeStr = isNaN(combined.getTime())
      ? `${form.dateInput} at ${form.timeInput}`
      : combined.toLocaleString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });

    setPendingId(item.id);
    startTransition(async () => {
      const res = await approveAndScheduleAppointment({
        id: item.id,
        scheduledTime: scheduledTimeStr,
        sessionMedium: form.sessionMedium,
        meetingLinkOrInstructions: form.meetingLinkOrInstructions,
        customNote: form.customNote,
      });

      setPendingId(null);

      if (res.error) {
        setFeedback((prev) => ({
          ...prev,
          [item.id]: { type: "error", text: res.error || "Failed to schedule appointment." },
        }));
      } else if (res.warning) {
        setFeedback((prev) => ({
          ...prev,
          [item.id]: { type: "warning", text: res.warning },
        }));
        router.refresh();
      } else {
        setFeedback((prev) => ({
          ...prev,
          [item.id]: {
            type: "success",
            text: `Appointment scheduled! Professional confirmation email sent to ${item.email}.`,
          },
        }));
        setActiveScheduleId(null);
        router.refresh();
      }
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
        <ul className="space-y-5">
          {visible.map((item) => {
            const busy = isPending && pendingId === item.id;
            const note = notes[item.id] ?? item.admin_note ?? "";
            const noteChanged = note.trim() !== (item.admin_note ?? "").trim();
            const isScheduling = activeScheduleId === item.id;
            const scheduleForm = getScheduleForm(item.id);
            const cardFeedback = feedback[item.id];

            return (
              <li
                key={item.id}
                className={`rounded-2xl border bg-white p-5 shadow-[0_4px_24px_rgba(56,7,14,0.05)] transition sm:p-6 ${
                  item.status === "new"
                    ? "border-[#c59b27] ring-1 ring-[#c59b27]/20"
                    : item.status === "scheduled"
                    ? "border-violet-300"
                    : "border-[#e5d8c3]"
                }`}
              >
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c59b27]/50 bg-[#38070e] font-serif text-base font-bold text-[#f6e27a] shadow-xs">
                      {item.full_name.trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="font-serif text-lg font-bold capitalize text-[#38070e]">
                        {item.full_name}
                        {item.second_name ? (
                          <span className="font-sans text-sm font-normal text-[#7a585f]"> &amp; {item.second_name}</span>
                        ) : null}
                      </p>
                      <p className="text-xs text-[#7a585f]">Received {formatDate(item.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge[item.status]}`}>
                      {statusLabel[item.status]}
                    </span>
                  </div>
                </div>

                {/* Feedback Alert for Card */}
                {cardFeedback ? (
                  <div
                    className={`mt-4 flex items-center justify-between rounded-xl border p-3 text-xs font-medium ${
                      cardFeedback.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : cardFeedback.type === "warning"
                        ? "border-amber-200 bg-amber-50 text-amber-900"
                        : "border-red-200 bg-red-50 text-red-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {cardFeedback.type === "success" ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                      )}
                      <span>{cardFeedback.text}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFeedback((prev) => {
                          const next = { ...prev };
                          delete next[item.id];
                          return next;
                        })
                      }
                      className="text-stone-400 hover:text-stone-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : null}

                {/* Details Grid */}
                <div className="mt-4 grid gap-2.5 text-sm text-[#3b171c] sm:grid-cols-2 lg:grid-cols-4">
                  <p className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-[#9e701e]" />
                    <span className="font-medium text-[#8b1827]">{item.service}</span>
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
                  <p className="mt-3.5 whitespace-pre-line rounded-xl bg-[#f8f3ea] px-4 py-3 text-sm leading-relaxed text-[#38070e]">
                    <span className="mb-1 block text-xs font-bold text-[#7a4816]">Client&apos;s Initial Note:</span>
                    {item.message}
                  </p>
                ) : null}

                {/* Inline Scheduling & Email Client Card */}
                {isScheduling ? (
                  <div className="mt-5 rounded-2xl border-2 border-[#d4af37] bg-gradient-to-br from-[#fdfbf7] to-[#f8f2e6] p-5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#e5d5be] pb-3">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="h-5 w-5 text-[#8b1827]" />
                        <h4 className="font-serif text-lg font-bold text-[#38070e]">
                          Approve Consultation &amp; Send Confirmation Email
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveScheduleId(null)}
                        className="rounded-full p-1 text-[#7a585f] hover:bg-[#eadcc4]/50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-[#68494f]">
                      This will officially schedule the appointment in the database and send a luxury, professional Vedic email with the confirmed appointment time directly to <strong>{item.email}</strong>.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-[#7a4816]">Consultation Date *</label>
                        <input
                          type="date"
                          value={scheduleForm.dateInput}
                          onChange={(e) => updateScheduleForm(item.id, { dateInput: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-[#d8c3a5] bg-white px-3 py-2 text-sm text-[#38070e] focus:border-[#8b1827] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#7a4816]">Consultation Time *</label>
                        <input
                          type="time"
                          value={scheduleForm.timeInput}
                          onChange={(e) => updateScheduleForm(item.id, { timeInput: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-[#d8c3a5] bg-white px-3 py-2 text-sm text-[#38070e] focus:border-[#8b1827] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-bold text-[#7a4816]">Session Format / Medium</label>
                      <select
                        value={scheduleForm.sessionMedium}
                        onChange={(e) => updateScheduleForm(item.id, { sessionMedium: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-[#d8c3a5] bg-white px-3 py-2 text-sm text-[#38070e] focus:border-[#8b1827] focus:outline-none"
                      >
                        <option value="Direct Phone Call (+1 214 669 9699)">Direct Phone Call (+1 214 669 9699)</option>
                        <option value="WhatsApp Audio / Video Call">WhatsApp Audio / Video Call</option>
                        <option value="Zoom Video Consultation">Zoom Video Consultation</option>
                        <option value="Google Meet Video Consultation">Google Meet Video Consultation</option>
                        <option value="In-Person Consultation (Frisco, TX Office)">In-Person Consultation (Frisco, TX Office)</option>
                      </select>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-bold text-[#7a4816]">
                        Meeting Link or Connection Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={scheduleForm.meetingLinkOrInstructions}
                        onChange={(e) => updateScheduleForm(item.id, { meetingLinkOrInstructions: e.target.value })}
                        placeholder="e.g. https://zoom.us/j/... or 'Master Vijay Ji will call your phone number'"
                        className="mt-1 w-full rounded-lg border border-[#d8c3a5] bg-white px-3 py-2 text-sm text-[#38070e] focus:border-[#8b1827] focus:outline-none"
                      />
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-bold text-[#7a4816]">
                        Personalized Note from Master Vijay Ji (Included in Client Email)
                      </label>
                      <textarea
                        rows={2}
                        value={scheduleForm.customNote}
                        onChange={(e) => updateScheduleForm(item.id, { customNote: e.target.value })}
                        placeholder="e.g. Please be in a quiet place and have your exact birth time ready..."
                        className="mt-1 w-full resize-none rounded-lg border border-[#d8c3a5] bg-white px-3 py-2 text-sm text-[#38070e] focus:border-[#8b1827] focus:outline-none"
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5 border-t border-[#e5d5be] pt-3">
                      <button
                        type="button"
                        onClick={() => setActiveScheduleId(null)}
                        className="rounded-lg border border-[#d8c3a5] bg-white px-4 py-2 text-xs font-semibold text-[#5c474b] hover:bg-stone-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleScheduleAndEmail(item)}
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#8b1827] via-[#5a0c16] to-[#38070e] px-5 py-2 text-xs font-bold text-[#f6e27a] shadow-md transition hover:brightness-110 disabled:opacity-50"
                      >
                        <Send className="h-3.5 w-3.5" />
                        {busy ? "Scheduling & Sending Email..." : "Approve & Send Confirmation Email"}
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Admin private note */}
                <div className="mt-4 space-y-2">
                  <label htmlFor={`note-${item.id}`} className="text-xs font-semibold text-[#7a4816]">
                    Admin audit log &amp; private notes
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <textarea
                      id={`note-${item.id}`}
                      rows={2}
                      value={note}
                      maxLength={2000}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                      placeholder="e.g. Called on Tuesday, session details..."
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

                {/* Action Bar */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#f2e8dc] pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-xs font-medium text-[#7a585f]">Mark status:</span>
                    {appointmentStatuses
                      .filter((status) => status !== item.status)
                      .map((status) => (
                        <button
                          key={status}
                          type="button"
                          disabled={busy}
                          onClick={() => run(item.id, () => setAppointmentStatus(item.id, status))}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50 ${
                            status === "cancelled"
                              ? "border border-[#e5d0ad] bg-white text-[#8b1827] hover:border-[#8b1827]"
                              : "bg-[#38070e] text-white hover:bg-[#200408]"
                          }`}
                        >
                          {statusLabel[status]}
                        </button>
                      ))}
                  </div>

                  {/* Primary Approval & Scheduling Trigger */}
                  <div>
                    {!isScheduling ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveScheduleId(item.id);
                          setFeedback((prev) => {
                            const next = { ...prev };
                            delete next[item.id];
                            return next;
                          });
                        }}
                        className="flex items-center gap-1.5 rounded-xl border border-[#c59b27] bg-gradient-to-r from-[#8b1827] to-[#38070e] px-4 py-2 text-xs font-bold text-[#f6e27a] shadow-sm transition hover:shadow hover:brightness-110"
                      >
                        <CalendarCheck className="h-3.5 w-3.5" />
                        {item.status === "scheduled" ? "Reschedule / Re-email Client" : "Approve & Schedule Session"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

