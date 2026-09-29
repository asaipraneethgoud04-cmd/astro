import React from "react";
import Link from "next/link";
import { Sparkles, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service | TalkAstrologer.com",
};

export default function TermsPage() {
  return (
    <div className="page-top page-bottom bg-[#fdfbf7] min-h-screen">
      <div className="site-container">
        <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-[#ebdcc2] pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8b1827]">
            <FileText className="w-4 h-4 text-[#c59b27]" />
            Consultation Guidelines
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#38070e]">
            Terms of Service
          </h1>
          <p className="text-xs text-[#735e61]">
            Last Updated: January 2026 • TalkAstrologer.com
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#4d393d] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#38070e]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing TalkAstrologer.com, booking an astrological reading, or
              requesting consultations, you agree to these Terms of Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#38070e]">
              2. Consultation Nature & Purpose
            </h2>
            <p>
              All consultations, horoscopic evaluations, and guidance provided by
              TalkAstrologer.com are based on the ancestral spiritual principles of Vedic
              astrology (Jyotish Shastra). Readings are intended to provide spiritual
              insight, self-reflection, emotional balance, and positive life direction.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#38070e]">
              3. Rescheduling & Punctuality
            </h2>
            <p>
              Seekers may reschedule their appointment up to 12 hours prior to the
              scheduled time. Due to Guruji&apos;s packed schedule, please ensure
              punctuality for telephone or video sessions.
            </p>
          </section>
        </div>
        </div>
      </div>
    </div>
  );
}
