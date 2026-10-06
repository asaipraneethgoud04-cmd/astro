"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Calendar,
  Navigation,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import ContactForm from "./ContactForm";

const contactFaqs = [
  {
    q: "How do I schedule a consultation with the ancestral astrologers?",
    a: "You can book directly through our online Book Appointment page, or reach out directly via Phone or WhatsApp at +91 98765 43210. Our consultation desk will confirm your preferred sacred time slot.",
  },
  {
    q: "Are phone and WhatsApp consultations available across Texas & nationwide USA?",
    a: "Yes! A significant portion of our seekers consult with us from Dallas, Houston, Austin, San Antonio, and across all 50 US states via private Phone, WhatsApp audio/video, or Zoom with zero travel needed.",
  },
  {
    q: "What information should I have ready before my consultation?",
    a: "Your Full Name, Date of Birth, Exact Time of Birth, and Place of Birth are ideal for precise Kundali (birth chart) casting. If your exact birth time is unknown, our astrologers utilize Prashna Kundali (Horary chart) and Palmistry to guide you.",
  },
  {
    q: "Is my personal situation and consultation strictly confidential?",
    a: "Absolute 100% confidentiality is guaranteed. Rooted in sacred ancestral ethics, all personal details, family dynamics, birth charts, and conversations remain completely private and are never disclosed.",
  },
  {
    q: "Can I discuss multiple life concerns in a single session?",
    a: "Yes. In your 30–45 minute consultation, you are free to discuss all interconnected life matters—including love compatibility, marriage timing, career transitions, business decisions, and family wellness.",
  },
  {
    q: "How quickly will your team respond after I send an inquiry?",
    a: "Our consultation desk responds to online inquiries and WhatsApp messages within 1 to 2 hours during active business hours (8:00 AM – 10:00 PM). Urgent same-day slots can also be accommodated.",
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="flex flex-col min-h-screen bg-[#fcf9f2] text-[#2a1114]">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER TITLE (Strictly matching reference screenshot)
      ───────────────────────────────────────────────────────────── */}
      <section className="site-container page-top header-gap">
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-[50px] font-bold text-[#420813] tracking-tight">
            Connect With TalkAstrologer
          </h1>

          {/* Small Golden Ornament Line matching screenshot */}
          <div className="flex items-center justify-center gap-3 pt-1 pb-1">
            <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#b88e39]" />
            <div className="text-[#b88e39] flex items-center gap-1.5 text-xs">
              <span className="text-[10px] opacity-70">‹</span>
              <span className="text-xs">❦</span>
              <span className="text-[10px] opacity-70">›</span>
            </div>
            <div className="w-12 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#b88e39]" />
          </div>

          <p className="text-xs sm:text-sm text-[#5d474b] max-w-xl mx-auto font-normal">
            Reach out to us for spiritual guidance, inquiries, or support. We are here to illuminate your path.
          </p>

          {/* Start With a Conversation Section */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#faf2e4] border border-[#ebd6b0] text-center space-y-2 shadow-xs">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#420813]">
                Start With a Conversation
              </h2>
              <p className="text-xs sm:text-[13px] text-[#5c4549] leading-relaxed">
                If something in your life has been weighing on your mind, you are welcome to reach out to TalkAstrologer. Share what you are seeking guidance about, and the team can help you choose an appropriate consultation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. TWO-COLUMN MAIN CONTENT (Google Maps + Info & Actions)
      ───────────────────────────────────────────────────────────── */}
      <section className="site-container section-b w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-x-6 grid-rows-gap lg:gap-x-8 items-stretch">
          {/* Left Column: Google Maps + Location Note + "Ready to find clarity?" */}
          <div className="flex flex-col gap-4">
            {/* Google Maps (iframe embed: styled frame only, map itself is Google's) */}
            <figure className="relative flex flex-1 flex-col rounded-2xl border border-[#ebd6b0] bg-[#fbf4e4] p-2 shadow-[0_20px_50px_rgba(36,4,9,0.12)] sm:p-2.5">
              {[
                "left-1 top-1 border-l border-t rounded-tl-xl",
                "right-1 top-1 border-r border-t rounded-tr-xl",
                "bottom-1 left-1 border-b border-l rounded-bl-xl",
                "bottom-1 right-1 border-b border-r rounded-br-xl",
              ].map((corner) => (
                <span
                  key={corner}
                  aria-hidden="true"
                  className={`pointer-events-none absolute h-6 w-6 border-[#c59b27]/70 ${corner}`}
                />
              ))}

              {/* Location card: header above the map on phones, top-right overlay from sm (clear of Google's place link, zoom and logo) */}
              <div className="relative z-10 mb-2 rounded-xl border border-[#e5cb9b] bg-[#fdf8ee] p-3 sm:absolute sm:right-6 sm:top-6 sm:mb-0 sm:w-[min(15.5rem,calc(100%-19rem))] sm:rounded-2xl sm:bg-[#fdf8ee]/95 sm:p-3.5 sm:shadow-[0_10px_28px_rgba(36,4,9,0.18)] sm:backdrop-blur-sm">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d4af37] bg-[#240409] text-[#f6e27a] shadow-[0_0_10px_rgba(212,175,55,0.35)]">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9e701e]">
                      Current Office
                    </p>
                    <p className="mt-0.5 font-serif text-[13px] font-bold leading-snug text-[#420813] sm:text-sm">
                      Indian Astrologer and Psychic Gangadhar
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-[#5c4549] sm:hidden">
                      11572 Lenox Ln, Frisco, TX 75033
                    </p>
                  </div>
                </div>
                <div className="my-2 hidden h-px bg-gradient-to-r from-[#c59b27]/70 via-[#c59b27]/30 to-transparent sm:block" />
                <p className="hidden text-xs leading-relaxed text-[#5c4549] sm:block">
                  11572 Lenox Ln,
                  <br />
                  Frisco, TX 75033
                </p>
              </div>

              <div className="relative min-h-[360px] flex-1 overflow-hidden rounded-xl border border-[rgba(180,130,35,0.35)] bg-[#f3e7d0] sm:min-h-[400px] lg:min-h-[420px]">
                <iframe
                  title="Indian Astrologer and Psychic Gangadhar, Frisco Texas"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3339.4959032725465!2d-96.85605269999999!3d33.17485859999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c39989a615fcb%3A0xbc65acdbe86fc29b!2sIndian%20Astrologer%20and%20Psychic%20Gangadhar!5e0!3m2!1sen!2sin!4v1790591796127!5m2!1sen!2sin"
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_0_1px_rgba(212,175,55,0.25),inset_0_0_36px_rgba(36,4,9,0.14)]"
                />
              </div>

              <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl bg-[#240409] px-4 py-3 text-[#f6eedc] sm:mt-2.5">
                <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] sm:text-xs">
                  <span className="text-[#d4af37]">✦</span>
                  Frisco · North Texas
                  <span className="hidden text-[#f6eedc]/60 sm:inline">· Temporary location</span>
                </span>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Indian+Astrologer+and+Psychic+Gangadhar,+11572+Lenox+Ln,+Frisco,+TX+75033"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/60 px-3.5 py-1.5 text-xs font-semibold text-[#f6e27a] transition-colors hover:bg-[#d4af37] hover:text-[#240409] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37]"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Get directions
                </a>
              </figcaption>
            </figure>

            {/* Current Location Note Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#faf6ee] border border-[#ebdcc2] text-left space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8b1827] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#8b1827]" />
                <span>Current Location Note</span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#634e52] leading-relaxed">
                The current office address and Google Maps details are temporary. The current address is <strong>11572 Lenox Ln, Frisco, TX 75033</strong>, and the current Google Maps listing is <em>“Indian Astrologer and Psychic Gangadhar.”</em> These details are expected to be changed shortly. Once the new permanent office location is finalized, the new address and Google Maps listing will replace the current details throughout the website.
              </p>
            </div>

            {/* "Ready to find clarity?" Card */}
            <div className="bg-white rounded-2xl border border-[#ebdcc2] p-6 sm:p-8 text-center space-y-3.5 shadow-sm flex flex-col items-center justify-center">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#420813]">
                Ready to find clarity?
              </h2>
              <p className="text-xs sm:text-sm text-[#614b4f] max-w-md mx-auto">
                Schedule a personalized consultation with our expert astrologers today.
              </p>
              <div className="pt-1">
                <Link
                  href="/book-appointment"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#3d0812] hover:bg-[#250409] text-white font-serif font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#f6e27a]" />
                  <span>Book An Appointment Now</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Information + Quick Actions */}
          <div className="flex flex-col gap-6">
            {/* Contact Information Card (Golden Parchment style) */}
            <div className="flex flex-1 flex-col gap-5 bg-[#fbf4e4] rounded-2xl border border-[#ebd6b0] p-6 sm:p-7 shadow-sm">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#420813]">
                Contact Information
              </h2>

              <div className="w-full h-px bg-[#e5cb9b]" />

              <div className="flex flex-1 flex-col justify-between gap-4 text-xs sm:text-sm">
                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ebd6b0] flex items-center justify-center text-[#9e701e] shrink-0 shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#420813] uppercase tracking-wider">
                      Primary Phone
                    </div>
                    <a
                      href="tel:+12146699699"
                      className="text-xs sm:text-sm font-semibold text-[#420813] hover:text-[#8b1827] transition-colors"
                    >
                      +1 214 669 9699
                    </a>
                    <div className="text-[11px] text-[#735d61]">
                      Monday – Sunday: 9:00 AM – 8:00 PM Central Time (Texas)
                    </div>
                  </div>
                </div>

                {/* Email Channels (Segregated) */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ebd6b0] flex items-center justify-center text-[#9e701e] shrink-0 shadow-xs">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[11px] font-bold text-[#420813] uppercase tracking-wider">
                        Support Email
                      </div>
                      <a
                        href="mailto:support@talkastrologer.com"
                        className="text-xs sm:text-sm font-semibold text-[#420813] hover:text-[#8b1827] transition-colors break-all"
                      >
                        support@talkastrologer.com
                      </a>
                      <p className="text-[11px] text-[#735d61] leading-relaxed pt-0.5">
                        Used for technical and non-technical discussions, including initiating, coordinating and resolving service-related queries.
                      </p>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-[#420813] uppercase tracking-wider">
                        Appointment Email
                      </div>
                      <a
                        href="mailto:myappointment@talkastrologer.com"
                        className="text-xs sm:text-sm font-semibold text-[#8b1827] hover:underline transition-colors break-all"
                      >
                        myappointment@talkastrologer.com
                      </a>
                      <p className="text-[11px] text-[#735d61] leading-relaxed pt-0.5">
                        Dedicated exclusively to clients who want to book an appointment for consulting Guruji.
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ebd6b0] flex items-center justify-center text-[#9e701e] shrink-0 shadow-xs">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#420813] uppercase tracking-wider">
                      WhatsApp Guidance
                    </div>
                    <a
                      href="https://wa.me/12146699699"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-semibold text-[#420813] hover:text-[#1f7e3c] transition-colors"
                    >
                      +1 214 669 9699
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ebd6b0] flex items-center justify-center text-[#9e701e] shrink-0 shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#420813] uppercase tracking-wider">
                      Current Office Address (Temporary)
                    </div>
                    <p className="text-xs text-[#553e43] leading-relaxed">
                      11572 Lenox Ln, Frisco, TX 75033, USA
                    </p>
                    <p className="text-[10px] text-[#7d6569] italic pt-0.5">
                      Listed as: Indian Astrologer and Psychic Gangadhar
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl border border-[#ebdcc2] p-5 sm:p-6 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#420813] text-center">
                Quick Actions
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {/* 1. Call Now */}
                <a
                  href="tel:+12146699699"
                  className="flex flex-col items-center justify-center py-3.5 px-3 rounded-xl border border-[#ebdcc2] hover:border-[#b88e39] hover:bg-[#faf6ee] transition-all group cursor-pointer text-center"
                >
                  <Phone className="w-4 h-4 text-[#8b1827] group-hover:scale-110 transition-transform mb-1.5" />
                  <span className="text-xs font-semibold text-[#420813]">
                    Call Now
                  </span>
                </a>

                {/* 2. WhatsApp */}
                <a
                  href="https://wa.me/12146699699"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center py-3.5 px-3 rounded-xl border border-[#ebdcc2] hover:border-[#25D366] hover:bg-[#f0faef] transition-all group cursor-pointer text-center"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform mb-1.5" />
                  <span className="text-xs font-semibold text-[#420813]">
                    WhatsApp
                  </span>
                </a>

                {/* 3. Email Us */}
                <a
                  href="mailto:myappointment@talkastrologer.com"
                  className="flex flex-col items-center justify-center py-3.5 px-3 rounded-xl border border-[#ebdcc2] hover:border-[#b88e39] hover:bg-[#faf6ee] transition-all group cursor-pointer text-center"
                >
                  <Mail className="w-4 h-4 text-[#8b1827] group-hover:scale-110 transition-transform mb-1.5" />
                  <span className="text-xs font-semibold text-[#420813]">
                    Appointment Email
                  </span>
                </a>

                {/* 4. Get Directions */}
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Indian+Astrologer+and+Psychic+Gangadhar,+11572+Lenox+Ln,+Frisco,+TX+75033"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center py-3.5 px-3 rounded-xl border border-[#ebdcc2] hover:border-[#b88e39] hover:bg-[#faf6ee] transition-all group cursor-pointer text-center"
                >
                  <Navigation className="w-4 h-4 text-[#8b1827] group-hover:scale-110 transition-transform mb-1.5" />
                  <span className="text-xs font-semibold text-[#420813]">
                    Get Directions
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Send a message */}
      <section id="send-message" className="site-container scroll-mt-28 section-b">
        <div>
          <div className="rounded-2xl border border-[#ebdcc2] bg-white p-5 shadow-sm sm:p-8 lg:p-10">
            <div className="mb-6 space-y-1.5 text-center sm:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b1827]">Write to us</p>
              <h2 className="font-serif text-3xl font-bold text-[#420813] sm:text-4xl">Send a Message</h2>
              <p className="text-xs text-[#614b4f] sm:text-sm">
                For questions about services or support. To book a consultation, use the Book Appointment page.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FREQUENTLY ASKED QUESTIONS SECTION (As requested)
      ───────────────────────────────────────────────────────────── */}
      <section className="section-y bg-[#faf6ee] border-t border-[#ebdcc2]">
        <div className="site-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-2.5 header-gap">
              <span className="text-[#a07421] text-xs font-semibold tracking-[0.25em] uppercase flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#b88e39]" />
                Clear Answers for Seekers
                <Sparkles className="w-3.5 h-3.5 text-[#b88e39]" />
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#3a0812] tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-[#5d474b] max-w-xl mx-auto">
                Find quick clarity regarding session procedures, remote USA consultations, and what to expect during your sacred guidance.
              </p>
            </div>

            {/* Accordion FAQ List */}
            <div className="space-y-3">
              {contactFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-[#e5d6c2] overflow-hidden transition-all shadow-xs hover:border-[#b88e39]"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-[#a07421] shrink-0" />
                        <span className="font-serif text-sm sm:text-base font-bold text-[#3a0812]">
                          {faq.q}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#8b1827] transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#584448] leading-relaxed border-t border-[#f4ede2] pl-12 bg-[#fdfbf7]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom callout */}
            <div className="content-gap text-center flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#5d474b]">
              <span>Have a more specific or personalized question?</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/+12146699699"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#1f7e3c] hover:underline"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. CELESTIAL MOON PHASE DIVIDER (Strictly matching screenshot)
      ───────────────────────────────────────────────────────────── */}
      <section className="pt-(--space-page-top) page-bottom max-w-4xl mx-auto px-4 w-full flex items-center justify-center">
        <div className="w-full flex items-center justify-center gap-2 sm:gap-4 text-[#a67c2e] select-none">
          {/* Left crescent and dots */}
          <span className="text-xl sm:text-2xl font-serif">☾</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#a67c2e]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#a67c2e]" />
          <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#b88e39] to-[#b88e39]" />
          <span className="text-xs sm:text-sm">✦</span>
          <span className="text-base sm:text-lg font-serif">☾</span>

          {/* Central Celestial Medallion */}
          <div className="relative w-11 h-11 rounded-full bg-[#3c0711] border-2 border-[#d4af37] flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.4)] shrink-0">
            <div className="absolute inset-0.5 rounded-full border border-dashed border-[#d4af37]/60" />
            <span className="text-base sm:text-lg text-[#f8e285] font-serif">☽</span>
          </div>

          {/* Right crescent and dots */}
          <span className="text-base sm:text-lg font-serif">☽</span>
          <span className="text-xs sm:text-sm">✦</span>
          <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent via-[#b88e39] to-[#b88e39]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#a67c2e]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#a67c2e]" />
          <span className="text-xl sm:text-2xl font-serif">☽</span>
        </div>
      </section>
    </div>
  );
}
