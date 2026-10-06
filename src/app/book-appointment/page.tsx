"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { servicesData } from "@/data/services";
import { submitAppointment } from "@/app/actions/inbox";
import { validatePhoneNumber } from "@/lib/phone";

const fieldClass =
  "w-full px-3.5 py-2.5 rounded-lg border border-[#e2d6c3] bg-[#fffcf7] text-sm text-[#420813] placeholder-[#a69295] focus:outline-none focus:ring-2 focus:ring-[#8b1827]/30 focus:border-[#8b1827] transition-all";

function BookAppointmentForm() {
  const searchParams = useSearchParams();
  const rawService = searchParams.get("service") || "";
  const validService = servicesData.some((item) => item.id === rawService) ? rawService : "";

  const [formData, setFormData] = useState({
    fullName: "",
    secondName: "",
    email: "",
    phone: "",
    city: "",
    service: validService,
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const phoneCheck = validatePhoneNumber(formData.phone, true);
    if (!phoneCheck.isValid) {
      setError(phoneCheck.error || "Please enter a valid phone number.");
      return;
    }

    setSending(true);

    const serviceTitle =
      servicesData.find((service) => service.id === formData.service)?.title ?? formData.service;
    const payload = new FormData();
    Object.entries({ ...formData, service: serviceTitle }).forEach(([key, value]) =>
      payload.append(key, value)
    );
    if (honeypot) payload.append("website_hp", honeypot);

    const result = await submitAppointment(payload);
    setSending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  };

  const startOver = () => {
    setFormData({
      fullName: "",
      secondName: "",
      email: "",
      phone: "",
      city: "",
      service: "",
      message: "",
    });
    setHoneypot("");
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#f6f0e4] text-[#2a1114] page-top page-bottom">
      <div className="site-container">
        <header className="max-w-2xl header-gap">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b1827]">
            Private consultation
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#38070e] tracking-tight">
            Book an Appointment
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#5c474b] leading-relaxed">
            Share what you would like to discuss. The consultation desk confirms a time by phone or email. Sessions are available Monday through Sunday, 9:00 AM to 8:00 PM Central Time.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 grid-rows-gap lg:gap-x-8 items-start">
          <aside className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl bg-[#2d1814] p-5 text-[#f7efe4] shadow-md sm:p-6 md:flex md:items-center md:gap-8 lg:block">
              <div className="relative mx-auto mb-4 h-36 w-36 shrink-0 md:order-2 md:mx-0 md:mb-0 md:h-44 md:w-44 lg:mx-auto lg:mb-4 lg:h-36 lg:w-36">
                <Image
                  src="/images/book-consultation.png"
                  alt="Astrology consultation emblem"
                  fill
                  priority
                  unoptimized
                  className="object-contain md:[transform:scaleX(-1)] lg:[transform:none]"
                />
              </div>
              <div className="min-w-0 md:flex-1">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#f6e27a]">
                  How a request is handled
                </h2>
                <ol className="mt-4 space-y-3 text-sm text-[#ecd9c6]">
                  {[
                    "You send the question and the area of guidance.",
                    "The desk replies to confirm a suitable time.",
                    "The consultation is held by phone or online.",
                  ].map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#c59b27]/70 text-[11px] font-semibold text-[#f6e27a]">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e5d0ad] bg-white p-5 space-y-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8b1827]">
                  Appointment Email
                </p>
                <a
                  href="mailto:myappointment@talkastrologer.com"
                  className="mt-1 block text-sm font-semibold text-[#38070e] hover:text-[#8b1827] break-all"
                >
                  myappointment@talkastrologer.com
                </a>
                <p className="mt-1 text-xs text-[#6a5558] leading-relaxed">
                  Dedicated exclusively to clients who want to book an appointment for consulting Guruji.
                </p>
              </div>
              <div className="h-px bg-[#f0e2cc]" />
              <a
                href="tel:+12146699699"
                className="flex items-center gap-2 text-sm font-semibold text-[#38070e] hover:text-[#8b1827]"
              >
                <Phone className="w-4 h-4 text-[#9e701e]" />
                +1 214 669 9699
              </a>
              <p className="flex items-start gap-2 text-xs text-[#6a5558] leading-relaxed">
                <Clock className="w-4 h-4 text-[#9e701e] shrink-0 mt-0.5" />
                Monday – Sunday, 9:00 AM – 8:00 PM Central Time (Texas)
              </p>
              <p className="flex items-start gap-2 text-xs text-[#6a5558] leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-[#9e701e] shrink-0 mt-0.5" />
                What you share is treated as private and used only to prepare the consultation.
              </p>
            </div>
          </aside>

          <section className="lg:col-span-8">
            <div className="rounded-2xl border border-[#e5d0ad] bg-white p-5 sm:p-8 shadow-sm">
              {submitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c59b27] bg-[#faf2e4]">
                    <CheckCircle2 className="w-7 h-7 text-[#1f7a45]" />
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-[#38070e]">
                    Request received
                  </h2>
                  <p className="mx-auto max-w-md text-sm text-[#5c474b] leading-relaxed">
                    Thank you, {formData.fullName || "there"}. The consultation desk has your details and will confirm a time by phone or email.
                  </p>
                  <button
                    type="button"
                    onClick={startOver}
                    className="mt-2 rounded-full border border-[#c59b27] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#38070e] hover:bg-[#faf6ee]"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Invisible honeypot field for anti-bot defense */}
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

                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#38070e]">
                      Consultation request
                    </h2>
                    <p className="mt-1 text-xs text-[#6a5558]">
                      Fields marked as required are needed to reach you.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#420813]">
                        <User className="w-3.5 h-3.5 text-[#9e701e]" />
                        Full name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="Your full name"
                        className={fieldClass}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#420813]">
                        <User className="w-3.5 h-3.5 text-[#9e701e]" />
                        Partner or second name
                      </label>
                      <input
                        type="text"
                        value={formData.secondName}
                        onChange={(e) =>
                          setFormData({ ...formData, secondName: e.target.value })
                        }
                        placeholder="Optional"
                        className={fieldClass}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#420813]">
                        <Mail className="w-3.5 h-3.5 text-[#9e701e]" />
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="you@email.com"
                        className={fieldClass}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-[#420813]">
                        <Phone className="w-3.5 h-3.5 text-[#9e701e]" />
                        Phone <span className="font-normal text-[#8a7478]">(US or India)</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+1 214 669 9699 or +91 98765 43210"
                        className={fieldClass}
                      />
                      <p className="text-[10px] text-[#7a6467]">
                        Accepts US (+1) 10-digit or Indian (+91) 10-digit mobile number
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#420813]">
                      <MapPin className="w-3.5 h-3.5 text-[#9e701e]" />
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="City you are in now"
                      className={fieldClass}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#420813]">
                      <Sparkles className="w-3.5 h-3.5 text-[#9e701e]" />
                      Area of guidance
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.service}
                        onChange={(e) =>
                          setFormData({ ...formData, service: e.target.value })
                        }
                        className={`${fieldClass} appearance-none pr-10 cursor-pointer`}
                      >
                        <option value="" disabled>
                          Select a consultation
                        </option>
                        {servicesData.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.title}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#8b1827]">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#420813]">
                      <MessageSquare className="w-3.5 h-3.5 text-[#9e701e]" />
                      What you would like to discuss
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="A short note helps the consultation start from your question."
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
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#38070e] px-6 py-3 font-serif text-sm font-bold text-white shadow-sm transition hover:bg-[#240409] disabled:cursor-wait disabled:opacity-70"
                  >
                    {sending ? "Sending request…" : "Request appointment"}
                    {sending ? null : <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f6f0e4] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#8b1827] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BookAppointmentForm />
    </Suspense>
  );
}
