"use client";

import React, { useState } from "react";
import { CheckCircle2, Mail, MessageSquare, Phone, Send, User } from "lucide-react";
import { submitContactMessage } from "@/app/actions/inbox";
import { validatePhoneNumber } from "@/lib/phone";

const fieldClass =
  "w-full rounded-lg border border-[#e2d6c3] bg-[#fffcf7] px-3.5 py-2.5 text-sm text-[#420813] placeholder-[#a69295] transition-all focus:border-[#8b1827] focus:outline-none focus:ring-2 focus:ring-[#8b1827]/30";

const labelClass = "flex items-center gap-1.5 text-xs font-semibold text-[#420813]";

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const phoneRaw = String(data.get("phone") ?? "").trim();
    if (phoneRaw) {
      const phoneCheck = validatePhoneNumber(phoneRaw, false);
      if (!phoneCheck.isValid) {
        setError(phoneCheck.error || "Please enter a valid phone number.");
        return;
      }
    }

    setSending(true);
    const result = await submitContactMessage(data);
    setSending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSentTo(String(data.get("name") ?? "").trim() || "there");
    form.reset();
  }

  if (sentTo) {
    return (
      <div className="space-y-4 py-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c59b27] bg-[#faf2e4]">
          <CheckCircle2 className="h-7 w-7 text-[#1f7a45]" />
        </div>
        <h3 className="font-serif text-3xl font-bold text-[#38070e]">Message received</h3>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-[#5c474b]">
          Thank you, {sentTo}. The support desk will reply to you by email.
        </p>
        <button
          type="button"
          onClick={() => setSentTo(null)}
          className="rounded-full border border-[#c59b27] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#38070e] hover:bg-[#faf6ee]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Invisible honeypot field for anti-bot defense */}
      <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
        <input type="text" name="website_hp" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className={labelClass}>
            <User className="h-3.5 w-3.5 text-[#9e701e]" />
            Name
          </label>
          <input id="contact-name" name="name" required maxLength={120} placeholder="Your name" className={fieldClass} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className={labelClass}>
            <Mail className="h-3.5 w-3.5 text-[#9e701e]" />
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={200}
            placeholder="you@email.com"
            className={fieldClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contact-phone" className={labelClass}>
            <Phone className="h-3.5 w-3.5 text-[#9e701e]" />
            Phone <span className="font-normal text-[#8a7478]">(optional)</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            maxLength={40}
            placeholder="+1 214 669 9699 or +91 98765 43210"
            className={fieldClass}
          />
          <p className="text-[10px] text-[#7a6467]">
            Accepts US (+1) 10-digit or Indian (+91) 10-digit mobile number
          </p>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contact-subject" className={labelClass}>
            <MessageSquare className="h-3.5 w-3.5 text-[#9e701e]" />
            Subject <span className="font-normal text-[#8a7478]">(optional)</span>
          </label>
          <input
            id="contact-subject"
            name="subject"
            maxLength={160}
            placeholder="What is this about?"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className={labelClass}>
          <MessageSquare className="h-3.5 w-3.5 text-[#9e701e]" />
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder="Share your question or what you are seeking guidance about."
          className={`${fieldClass} resize-none`}
        />
      </div>

      {error ? (
        <p role="alert" className="rounded-lg border border-[#e8c4c4] bg-[#fdf2f2] px-3.5 py-2.5 text-sm text-[#8b1827]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={sending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#3d0812] px-6 py-3 font-serif text-sm font-bold text-white shadow-md transition hover:bg-[#250409] disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:px-10"
      >
        {sending ? "Sending…" : "Send message"}
        {sending ? null : <Send className="h-4 w-4 text-[#f6e27a]" />}
      </button>
    </form>
  );
}
