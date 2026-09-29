import React from "react";
import Link from "next/link";
import { Sparkles, HelpCircle, Phone, ArrowRight } from "lucide-react";
import CtaBannerSection from "@/components/home/CtaBannerSection";

export const metadata = {
  title: "Frequently Asked Questions | TalkAstrologer.com",
};

const faqs = [
  {
    q: "How can I book a session with TalkAstrologer.com?",
    a: "You can easily book through our online Book Appointment form, or call/WhatsApp directly at +91 98765 43210. Our consultation team will coordinate your preferred time slot.",
  },
  {
    q: "What if I do not know my exact time of birth?",
    a: "If your birth time is unknown or approximate, our ancestral astrologers employ Prashna Kundali (Horary Astrology based on the moment your question is asked), Palmistry, and facial aura reading to arrive at accurate answers.",
  },
  {
    q: "What issues can Vedic Astrology help resolve?",
    a: "Our consultations provide supportive guidance for Love & Marriage compatibility, Relationship understanding, Career direction & Job growth, Business planning, Family harmony, Stress & emotional clarity, and Positive energy insight.",
  },
  {
    q: "Are the suggested solutions fear-based or difficult?",
    a: "No, never. TalkAstrologer.com strictly rejects fear-based predictions and unrealistic promises. Our consultations provide practical, uplifting, and motivational guidance designed to support confidence, focus, and peace of mind.",
  },
  {
    q: "Can consultations be held online across Texas and the USA?",
    a: "Yes! Clients from Dallas, Houston, Austin, San Antonio, and across the USA, as well as worldwide seekers, consult regularly via private phone call, WhatsApp, or Zoom.",
  },
  {
    q: "How long does a consultation session last?",
    a: "Standard consultations typically last 30 to 45 minutes, allowing ample time for complete horoscope scrutiny and detailed answers to all your personal questions.",
  },
];

export default function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative page-top section-b bg-[#240409] text-white overflow-hidden">
        <div className="absolute inset-0 bg-hero-shiva pointer-events-none" />
        <div className="relative z-10 site-container text-center space-y-4">
          <span className="text-[#f6e27a] text-xs font-semibold tracking-[0.3em] uppercase flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            Seeker Queries & Answers
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="max-w-2xl mx-auto text-[#ebd8c5] text-sm sm:text-base leading-relaxed font-light">
            Everything you need to know about our astrological consultations, remedies,
            and booking procedure.
          </p>
        </div>
      </section>

      <section className="section-t bg-[#fdfbf7]">
        <div className="site-container">
          <div className="max-w-4xl mx-auto grid grid-rows-gap">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#ebdcc2] px-6 card-y sm:px-8 shadow-sm space-y-3"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-[#8b1827] shrink-0 mt-0.5" />
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#38070e]">
                  {faq.q}
                </h3>
              </div>
              <p className="text-sm text-[#543e42] leading-relaxed pl-8">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
        </div>
      </section>

      <CtaBannerSection last />
    </div>
  );
}
