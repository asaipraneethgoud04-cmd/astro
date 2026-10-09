"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  Quote,
  Sparkles,
  ShieldCheck,
  Check,
  Lock,
  Eye,
  ArrowRight,
  Phone,
  MessageCircle,
  MapPin,
  HelpCircle,
  HeartHandshake,
  Bell,
  SlidersHorizontal,
} from "lucide-react";
import { submitReview } from "@/app/actions/inbox";

const SERVICES_LIST = [
  { id: "horoscope", title: "Horoscope & Birth Chart Analysis", category: "Astrology & Charts" },
  { id: "love-marriage", title: "Love Marriage & Relationship Guidance", category: "Love & Marriage" },
  { id: "marriage-compatibility", title: "Marriage Compatibility & Dosha", category: "Love & Marriage" },
  { id: "career-job", title: "Career, Education & Job Milestones", category: "Career & Wealth" },
  { id: "business", title: "Business Problem Solution & Growth", category: "Career & Wealth" },
  { id: "vashikaran", title: "Vashikaran Specialist Guidance", category: "Spiritual & Remedies" },
  { id: "divorce", title: "Divorce & Relationship Reconciliation", category: "Love & Marriage" },
  { id: "evil-spirits", title: "Spiritual Healing & Negative Energy Removal", category: "Spiritual & Remedies" },
  { id: "abroad", title: "Overseas & Foreign Relocation Yogas", category: "Destiny & Life" },
  { id: "palmistry", title: "Palmistry & Numerology Insight", category: "Destiny & Life" },
  { id: "general", title: "Other Sacred Guidance & Consultation", category: "Spiritual & Remedies" },
];

const CONSULTATION_FORMATS = [
  { id: "phone", label: "Phone Consultation", icon: Phone },
  { id: "online", label: "WhatsApp / Video Call", icon: MessageCircle },
  { id: "in-person", label: "In-Person (Texas)", icon: MapPin },
];

const INSPIRATION_TAGS = [
  "Accurate Timing & Predictions",
  "Compassionate & Patient Listening",
  "Simple, Effective Remedies",
  "Immense Peace of Mind",
  "Career & Financial Breakthrough",
  "Restored Family Harmony",
  "No False Promises or Fear",
  "Highly Recommended to All",
];

const RATING_DATA: Record<number, { title: string; subtitle: string; percent: string }> = {
  5: {
    title: "5.0 ★ Exceptional & Life-Transforming",
    subtitle: "Guruji's ancestral insight provided profound clarity, relief, and divine direction.",
    percent: "100%",
  },
  4: {
    title: "4.0 ★ Very Good & Insightful",
    subtitle: "Thoughtful astrological analysis and supportive practical guidance.",
    percent: "80%",
  },
  3: {
    title: "3.0 ★ Good Consultation",
    subtitle: "Helpful perspective on my questions and life situation.",
    percent: "60%",
  },
  2: {
    title: "2.0 ★ Fair Experience",
    subtitle: "A few helpful points were discussed.",
    percent: "40%",
  },
  1: {
    title: "1.0 ★ Needs Improvement",
    subtitle: "Did not meet expectations.",
    percent: "20%",
  },
};

const inputClass =
  "w-full rounded-2xl border border-[#e5d0ad] bg-[#fffdfa] px-4 py-3.5 text-sm text-[#2a1114] placeholder:text-[#a08b8e] outline-none transition-all duration-200 focus:border-[#c59b27] focus:bg-white focus:ring-3 focus:ring-[#c59b27]/20 shadow-xs";

export default function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [service, setService] = useState(SERVICES_LIST[0].title);
  const [consultFormat, setConsultFormat] = useState(CONSULTATION_FORMATS[0].label);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [quote, setQuote] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [previewMode, setPreviewMode] = useState<"card" | "banner">("card");

  const effectiveRating = hoverRating > 0 ? hoverRating : rating;

  // Formatted public display name based on privacy toggle
  const displayName = isAnonymous
    ? name.trim()
      ? `${name.trim().charAt(0).toUpperCase()}.`
      : "A Seeker"
    : name.trim() || "Your Name";

  const displayCity = city.trim() || "Your City, State";
  const displayQuote =
    quote.trim() ||
    "Share how Master Vijay Ji's consultation helped illuminate your choices, what predictions or traditional remedies proved accurate, and the clarity and relief you experienced.";

  function addInspirationTag(tag: string) {
    if (quote.includes(tag)) return;
    const cleanQuote = quote.trim();
    const separator = cleanQuote.length > 0 ? (cleanQuote.endsWith(".") ? " " : ". ") : "";
    setQuote(`${cleanQuote}${separator}${tag}.`);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedCity = city.trim();
    const trimmedQuote = quote.trim();

    if (trimmedName.length < 2) {
      setError("Please provide your name.");
      return;
    }
    if (trimmedCity.length < 2) {
      setError("Please provide your city and state.");
      return;
    }
    if (trimmedQuote.length < 15) {
      setError("Please write at least a few sentences about your consultation (minimum 15 characters).");
      return;
    }

    setSending(true);
    const fd = new FormData();
    fd.append("name", isAnonymous ? `${trimmedName.charAt(0).toUpperCase()}.` : trimmedName);
    fd.append("city", trimmedCity);
    fd.append("quote", trimmedQuote);
    fd.append("rating", rating.toString());
    fd.append("service", service);
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
      <div className="relative overflow-hidden rounded-[32px] border-2 border-[#c59b27] bg-gradient-to-b from-[#240409] via-[#35070f] to-[#1c0307] p-8 sm:p-14 text-center text-white shadow-[0_25px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(212,175,55,0.25)]">
        {/* Ambient gold glow */}
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#d4af37]/25 blur-3xl rounded-full" />

        {/* Central Sacred Medallion */}
        <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#f6e27a] bg-gradient-to-br from-[#38070e] to-[#5a111c] text-[#f6e27a] shadow-[0_0_25px_rgba(246,226,122,0.45)] mb-6">
          <Sparkles className="h-10 w-10 animate-pulse text-[#f6e27a]" />
        </div>

        {/* 5 Shimmering Gold Stars */}
        <div className="relative z-10 flex items-center justify-center gap-2 text-[#f6e27a] mb-4" aria-label="5 star rating">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-6 w-6 fill-[#f6e27a] text-[#f6e27a] drop-shadow-md" />
          ))}
        </div>

        <h2 className="relative z-10 font-serif text-3xl sm:text-5xl font-extrabold text-[#fdfaf4] tracking-tight">
          May Blessings Be Upon You, {displayName}
        </h2>

        <p className="relative z-10 mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-[#edd6be]">
          Your {rating}-star reflection has been offered with reverence. To protect the sanctity of our community, our team reviews each submission personally. Once verified, your words will illuminate <strong className="text-[#f6e27a]">Voices of the Blessed</strong>.
        </p>

        {/* Verification Pill */}
        <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-[#c59b27]/60 bg-[#240409]/80 px-4 py-1.5 text-xs text-[#f6e27a] mt-6">
          <ShieldCheck className="w-4 h-4 text-[#f6e27a]" />
          <span>Status: Submitted for Verification · Protected by Vedic Ethics</span>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border-2 border-[#c59b27] bg-[#f6e27a] px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#240409] hover:bg-white transition-all shadow-[0_6px_20px_rgba(246,226,122,0.35)]"
          >
            Return to Home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full border border-[#c59b27]/80 bg-[#38070e]/80 px-7 py-3.5 text-xs sm:text-sm font-semibold text-[#f6e27a] hover:bg-[#38070e] transition-all"
          >
            Explore Sacred Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Mobile Form / Live Preview Toggle Pills */}
      <div className="lg:hidden flex items-center justify-center p-1.5 bg-[#ecdcc4]/70 rounded-full max-w-sm mx-auto border border-[#e5d0ad] shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
            activeTab === "form"
              ? "bg-[#38070e] text-[#f6e27a] shadow-md"
              : "text-[#614b4f] hover:text-[#38070e]"
          }`}
        >
          Review Form
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "preview"
              ? "bg-[#38070e] text-[#f6e27a] shadow-md"
              : "text-[#614b4f] hover:text-[#38070e]"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Live Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* ─────────────────────────────────────────────────────────────
            LEFT COLUMN: INTERACTIVE FORM (7 COLS)
        ───────────────────────────────────────────────────────────── */}
        <div className={`lg:col-span-7 ${activeTab === "preview" ? "hidden lg:block" : "block"}`}>
          <form
            onSubmit={onSubmit}
            className="rounded-[30px] border-2 border-[#e5d0ad] bg-white p-6 sm:p-9 shadow-[0_16px_45px_rgba(56,7,14,0.06)] space-y-7 relative overflow-hidden"
          >
            {/* Corner Decorative Accent */}
            <div className="pointer-events-none absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#c59b27]/10 to-transparent rounded-bl-full" />

            {/* Anti-Bot Honeypot */}
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

            {/* ─── 1. INTERACTIVE STAR RATING SECTION ─── */}
            <div className="rounded-2xl border-2 border-[#eedec7] bg-gradient-to-b from-[#fdfbf7] via-[#faf5eb] to-[#f7f0e1] p-5 sm:p-6 text-center space-y-3 shadow-inner">
              <div className="flex items-center justify-center gap-2">
                <span className="w-8 h-px bg-[#c59b27]/50" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#aa8016]">
                  Select Your Consultation Rating
                </span>
                <span className="w-8 h-px bg-[#c59b27]/50" />
              </div>

              {/* 5 Big Radiant Stars */}
              <div
                className="flex items-center justify-center gap-2.5 sm:gap-4 py-2"
                role="radiogroup"
                aria-label="Select star rating"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = starValue <= effectiveRating;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      role="radio"
                      aria-checked={rating === starValue}
                      aria-label={`${starValue} out of 5 stars`}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      className="group relative p-1.5 focus:outline-none transition-transform duration-200 hover:scale-125 focus-visible:scale-125 active:scale-95"
                    >
                      <Star
                        className={`h-9 w-9 sm:h-11 sm:w-11 transition-all duration-200 ${
                          isFilled
                            ? "fill-[#d4af37] text-[#c59b27] drop-shadow-[0_4px_12px_rgba(212,175,55,0.5)]"
                            : "text-[#dcd0bf] hover:text-[#e5cf94]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Interactive Sentiment Badge & Score */}
              <div className="space-y-1.5 pt-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#ebdcc2] shadow-xs">
                  <span className="font-serif text-base sm:text-lg font-bold text-[#38070e]">
                    {RATING_DATA[effectiveRating]?.title}
                  </span>
                </div>
                <p className="text-xs text-[#6d5458] max-w-sm mx-auto">
                  {RATING_DATA[effectiveRating]?.subtitle}
                </p>

                {/* Smooth Sentiment Bar */}
                <div className="w-48 h-1.5 bg-[#e8dac2] rounded-full mx-auto overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#c59b27] to-[#d4af37] transition-all duration-300 rounded-full"
                    style={{ width: RATING_DATA[effectiveRating]?.percent }}
                  />
                </div>
              </div>
            </div>

            {/* ─── 2. CONSULTATION DETAILS ─── */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="review-service"
                  className="text-sm font-bold text-[#38070e] flex items-center justify-between"
                >
                  <span>1. Area of Consultation</span>
                  <span className="text-[11px] font-normal text-[#8c7377]">
                    Which service did Guruji assist you with?
                  </span>
                </label>
                <select
                  id="review-service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={`${inputClass} cursor-pointer font-medium`}
                >
                  {SERVICES_LIST.map((srv) => (
                    <option key={srv.id} value={srv.title}>
                      {srv.title} ({srv.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Consultation Format Chips */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-[#38070e] block">
                  2. Consultation Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CONSULTATION_FORMATS.map((fmt) => {
                    const Icon = fmt.icon;
                    const isSelected = consultFormat === fmt.label;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setConsultFormat(fmt.label)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? "bg-[#38070e] border-[#38070e] text-[#f6e27a] shadow-sm"
                            : "bg-[#faf6ee] border-[#e7d2af] text-[#5c4448] hover:bg-white hover:border-[#c59b27]"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{fmt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ─── 3. CLIENT IDENTITY & PRIVACY SHIELD ─── */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#38070e] block">
                3. Your Identity & Location
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-[#6d5458]">Full Name</span>
                  <input
                    id="review-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                    required
                    className={inputClass}
                    placeholder="e.g. Priya Sharma"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-[#6d5458]">City & State</span>
                  <input
                    id="review-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    maxLength={80}
                    required
                    className={inputClass}
                    placeholder="e.g. Dallas, TX or Austin"
                  />
                </div>
              </div>

              {/* PRIVACY SHIELD TOGGLE CARD */}
              <div
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition-all ${
                  isAnonymous
                    ? "border-[#c59b27] bg-[#fbf5e6] shadow-sm"
                    : "border-[#e5d0ad] bg-[#faf6ee] hover:bg-[#fbf7f0]"
                }`}
              >
                <div className="pt-0.5">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                      isAnonymous
                        ? "border-[#38070e] bg-[#38070e] text-[#f6e27a]"
                        : "border-[#c59b27] bg-white text-transparent"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                </div>
                <div className="flex-1 text-xs select-none">
                  <p className="font-bold text-[#38070e] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#aa8016]" />
                    <span>Privacy Shield Mode</span>
                  </p>
                  <p className="text-[#6d5458] mt-0.5 leading-relaxed">
                    Display only my first initial for confidentiality. On the public site, this will show as:{" "}
                    <strong className="text-[#38070e]">
                      {name.trim() ? `${name.trim().charAt(0).toUpperCase()}.` : "Initial"} · {city.trim() || "City"}
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            {/* ─── 4. CONSULTATION EXPERIENCE ─── */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="review-quote" className="text-sm font-bold text-[#38070e]">
                  4. Your Consultation Journey
                </label>
                <span
                  className={`text-[11px] font-semibold tabular-nums ${
                    quote.length < 15 ? "text-[#a08b8e]" : "text-[#38070e]"
                  }`}
                >
                  {quote.length} / 600 characters
                </span>
              </div>

              {/* Quick Inspiration Tags */}
              <div className="rounded-xl border border-[#ebdcc2] bg-[#fbf8f2] p-3 space-y-1.5">
                <p className="text-[11px] font-semibold text-[#8c7377] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#aa8016]" />
                  <span>Tap tags to include inspiration:</span>
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {INSPIRATION_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addInspirationTag(tag)}
                      className="rounded-full border border-[#e5d0ad] bg-white px-2.5 py-1 text-[11px] font-medium text-[#4d3236] hover:bg-[#38070e] hover:text-[#f6e27a] hover:border-[#38070e] transition-all cursor-pointer shadow-2xs"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                id="review-quote"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                maxLength={600}
                required
                rows={5}
                className={`${inputClass} leading-relaxed font-serif text-[15px] sm:text-[16px] scrollbar-transparent`}
                placeholder="Describe your consultation with Guruji. Which life questions or hurdles were examined? What predictions or traditional remedies proved accurate? How did the guidance bring clarity or relief to you and your loved ones?"
              />

              {/* Dynamic Length / Quality Indicator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] pt-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full transition-colors ${
                      quote.length >= 15 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-[#c59b27]"
                    }`}
                  />
                  <span className="font-medium text-[#6d5458]">
                    {quote.length === 0
                      ? "Minimum 15 characters required"
                      : quote.length < 15
                      ? `${15 - quote.length} more characters needed to meet sacred minimum`
                      : quote.length < 80
                      ? "Good start · Add details on remedies or accuracy"
                      : quote.length < 250
                      ? "Detailed reflection · Inspires fellow seekers"
                      : "Profound heartfelt testimonial ✨"}
                  </span>
                </div>
                <span className="text-[#aa8016] font-semibold tabular-nums self-end sm:self-auto">
                  {quote.length} / 600 characters
                </span>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-[#e5b1b7] bg-[#fdf2f3] p-4 text-xs font-medium text-[#8b1827]">
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={sending}
              className="group relative inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#38070e] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#f6e27a] transition-all duration-300 hover:bg-[#200408] hover:shadow-[0_12px_28px_rgba(56,7,14,0.35)] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38070e] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#f6e27a] group-hover:scale-125 transition-transform" />
              <span>{sending ? "Submitting Your Blessing…" : "Submit Customer Review"}</span>
              <ArrowRight className="w-4 h-4 text-[#f6e27a] group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT COLUMN: REAL-TIME LIVE CARD PREVIEW & GUIDANCE (5 COLS)
        ───────────────────────────────────────────────────────────── */}
        <div className={`lg:col-span-5 ${activeTab === "form" ? "hidden lg:block" : "block"}`}>
          <div className="sticky top-28 space-y-6">
            {/* Live Preview Header & Format Toggle */}
            <div className="flex items-center justify-between px-2 flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#aa8016] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#aa8016]" />
                Live Preview
              </span>
              <div className="flex items-center gap-1 bg-[#ede0c9]/60 p-1 rounded-full border border-[#e5d0ad]">
                <button
                  type="button"
                  onClick={() => setPreviewMode("card")}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all ${
                    previewMode === "card"
                      ? "bg-[#38070e] text-[#f6e27a] shadow-xs"
                      : "text-[#614b4f] hover:text-[#38070e]"
                  }`}
                >
                  Grid Card
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("banner")}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all flex items-center gap-1 ${
                    previewMode === "banner"
                      ? "bg-[#38070e] text-[#f6e27a] shadow-xs"
                      : "text-[#614b4f] hover:text-[#38070e]"
                  }`}
                >
                  <Bell className="w-2.5 h-2.5" />
                  Top Banner
                </button>
              </div>
            </div>

            {/* PREVIEW: 1. GRID TESTIMONIAL CARD */}
            {previewMode === "card" ? (
              <article className="relative w-full pt-5 pb-2 transition-all duration-300 min-w-0 max-w-full overflow-hidden">
                <div className="relative w-full rounded-[26px] border-2 border-[#c59b27] bg-gradient-to-b from-white via-[#fdfaf5] to-[#f8f2e7] px-6 sm:px-7 pt-9 pb-7 transition-all duration-300 flex flex-col justify-between text-center group shadow-[0_18px_45px_rgba(56,7,14,0.09)] ring-1 ring-[#c59b27]/30 min-w-0 max-w-full overflow-hidden">
                  {/* Top Quote Medallion */}
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full text-[#f6e27a] border-2 shadow-[0_4px_12px_rgba(56,7,14,0.25)] bg-gradient-to-br from-[#38070e] to-[#5a111c] border-[#d4af37]"
                    aria-hidden="true"
                  >
                    <Quote className="h-4 w-4 fill-current rotate-180" />
                  </div>

                  {/* Header details */}
                  <div className="w-full min-w-0">
                    {/* Service Tag */}
                    <div className="mb-2.5">
                      <span className="inline-block rounded-full bg-[#f6e27a]/25 border border-[#c59b27]/40 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#734e06] truncate max-w-full">
                        ✦ {service}
                      </span>
                    </div>

                    {/* Selected Review Stars */}
                    <div className="mb-4 mt-1 flex items-center justify-center gap-1.5" aria-label={`${rating} star rating`}>
                      {[1, 2, 3, 4, 5].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`h-4 w-4 drop-shadow-xs transition-colors ${
                            starIdx <= rating
                              ? "fill-[#d4af37] text-[#d4af37]"
                              : "text-[#dcd0bf] fill-transparent"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Quote Content - Controlled Scroll & Strict Word Wrap for up to 600 chars */}
                    <div className="my-2 max-h-[190px] overflow-y-auto px-1 text-center w-full min-w-0 scrollbar-transparent custom-scrollbar">
                      <blockquote className="font-serif italic text-[14px] sm:text-[15px] leading-[1.8] text-[#38070e]/90 break-words [overflow-wrap:anywhere] whitespace-pre-wrap">
                        “{displayQuote}”
                      </blockquote>
                    </div>
                  </div>

                  {/* Customer Signature & Details */}
                  <div className="mt-5 pt-3 border-t border-[#ebdcc2]/60 w-full min-w-0">
                    <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#38070e] capitalize truncate">
                      {displayName}
                    </h3>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[#8b1827] truncate">
                      {displayCity}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-[#8c7377] font-medium truncate">
                      {consultFormat} · Verified Consultation
                    </p>
                  </div>
                </div>
              </article>
            ) : (
              /* PREVIEW: 2. TOP SITE-WIDE ANNOUNCEMENT BAR */
              <div className="rounded-[26px] border-2 border-[#c59b27] bg-gradient-to-b from-[#240409] via-[#35070f] to-[#1c0307] p-5 text-white shadow-[0_16px_40px_rgba(0,0,0,0.35)] space-y-3 transition-all duration-300 w-full min-w-0 max-w-full overflow-hidden">
                <div className="flex items-center justify-between text-[11px] text-[#f6e27a]">
                  <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#f6e27a] animate-pulse" />
                    Top Announcement Bar View
                  </span>
                  <span className="text-[10px] bg-[#38070e] px-2 py-0.5 rounded-full border border-[#c59b27]/40">
                    Live Header Simulation
                  </span>
                </div>

                <div className="rounded-xl border border-[#c59b27]/50 bg-[#2d050c]/90 p-3.5 space-y-2 w-full min-w-0 max-w-full overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0 max-w-full overflow-hidden">
                    <span className="bg-[#5a111c] text-[#f6e27a] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#f6e27a]/30 flex items-center gap-1 shrink-0">
                      <span>“ {rating}★</span>
                      <span className="hidden sm:inline">CLIENT REVIEW</span>
                    </span>
                    <p className="text-[#fdfaf5] italic text-xs truncate flex-1 min-w-0 break-all">
                      “{displayQuote}”
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#edd6be] border-t border-[#c59b27]/20 pt-2 min-w-0">
                    <span className="truncate mr-2">
                      — <strong className="text-[#f6e27a]">{displayName}</strong> ({displayCity})
                    </span>
                    <span className="text-[10px] text-[#f6e27a] underline flex items-center gap-1 shrink-0">
                      Read Full Blessing <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#edd6be]/80 text-center italic leading-relaxed pt-1">
                  Accepted reflections rotate continuously at the very top of TalkAstrologer.com above the navigation bar across all pages.
                </p>
              </div>
            )}

            {/* 3 Tips for a Helpful Review */}
            <div className="rounded-2xl border border-[#ebdcc2] bg-white p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#38070e] flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#c59b27]" />
                <span>Tips for an Impactful Review</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#5c4448] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#c59b27] font-bold">1.</span>
                  <span>Share the challenge or transition that led you to seek consultation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c59b27] font-bold">2.</span>
                  <span>Describe the astrological analysis and remedies suggested.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c59b27] font-bold">3.</span>
                  <span>Highlight the positive clarity, timeline accuracy, or peace of mind you felt.</span>
                </li>
              </ul>
            </div>

            {/* Sacred Assurance Badge */}
            <div className="rounded-2xl border border-[#ebdcc2] bg-[#fbf8f2] p-4 text-xs leading-relaxed text-[#614b4f] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#38070e]">
                <ShieldCheck className="w-4 h-4 text-[#c59b27]" />
                <span>Ancestral Lineage Ethics & Privacy</span>
              </div>
              <p>
                TalkAstrologer adheres to centuries-old Vedic confidentiality. Your email and phone are strictly private and never disclosed or sold.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
