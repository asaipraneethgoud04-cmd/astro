"use client";

import React, { useState } from "react";
import { submitReview } from "@/app/actions/inbox";

const fieldClass =
  "w-full rounded-xl border border-[#e5d0ad] bg-white px-4 py-3 text-sm text-[#2a1114] outline-none transition focus:border-[#8b1827] focus:ring-2 focus:ring-[#8b1827]/20";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [quote, setQuote] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedCity = city.trim();
    const trimmedQuote = quote.trim();

    if (trimmedName.length < 2 || trimmedCity.length < 2) {
      setError("Please add your name and city.");
      return;
    }
    if (trimmedQuote.length < 20) {
      setError("Please write at least a few sentences about your experience.");
      return;
    }

    setSending(true);
    const fd = new FormData();
    fd.append("name", trimmedName);
    fd.append("city", trimmedCity);
    fd.append("quote", trimmedQuote);
    if (honeypot) fd.append("website_hp", honeypot);

    const result = await submitReview(fd);
    setSending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[26px] border border-[#e5d0ad] bg-white p-8 text-center shadow-sm">
        <h2 className="font-serif text-3xl font-bold text-[#38070e]">Thank you</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#614b4f]">
          Your words have been received. They will appear in Voices of the Blessed after they are accepted.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[26px] border border-[#e5d0ad] bg-white p-6 sm:p-8 shadow-sm space-y-5">
      {/* Honeypot field for bot protection */}
      <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
        <input
          type="text"
          name="website_hp"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="review-name" className="text-sm font-medium text-[#38070e]">
          Your name
        </label>
        <input
          id="review-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={80}
          required
          className={fieldClass}
          placeholder="Name"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="review-city" className="text-sm font-medium text-[#38070e]">
          City
        </label>
        <input
          id="review-city"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          maxLength={80}
          required
          className={fieldClass}
          placeholder="City"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="review-quote" className="text-sm font-medium text-[#38070e]">
          Your experience
        </label>
        <textarea
          id="review-quote"
          value={quote}
          onChange={(event) => setQuote(event.target.value)}
          maxLength={600}
          required
          rows={6}
          className={fieldClass}
          placeholder="Share how the consultation helped you."
        />
      </div>
      {error ? <p className="text-sm text-[#8b1827]">{error}</p> : null}
      <button
        type="submit"
        disabled={sending}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#38070e] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#200408] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38070e]"
      >
        {sending ? "Sending…" : "Submit review"}
      </button>
    </form>
  );
}
