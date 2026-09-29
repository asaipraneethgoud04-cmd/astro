import React from "react";
import Link from "next/link";
import { AlertTriangle, Sparkles } from "lucide-react";

export const metadata = {
  title: "Astrological Disclaimer | TalkAstrologer.com",
};

export default function DisclaimerPage() {
  return (
    <div className="page-top page-bottom bg-[#fdfbf7] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#ebdcc2] pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8b1827]">
            <AlertTriangle className="w-4 h-4 text-[#c59b27]" />
            Spiritual & Ethical Disclosure
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#38070e]">
            Astrology Disclaimer
          </h1>
          <p className="text-xs text-[#735e61]">
            TalkAstrologer.com • Vedic Advisory Practice
          </p>
        </div>

        <div className="space-y-6 text-sm text-[#4d393d] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#38070e]">
              Spiritual Perspective & Free Will
            </h2>
            <p>
              Vedic Astrology (Jyotish) is an ancient, revered science of tendencies,
              planetary cycles, and karmic potentials. It is not an absolute deterministic
              fate; human free will (Purushartha) and divine grace play decisive roles
              in shaping one&apos;s destiny.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#38070e]">
              No Substitute for Professional Medical, Legal, or Financial Counsel
            </h2>
            <p>
              Astrological insights, recommendations, and consultations provided
              by TalkAstrologer.com are supportive and spiritual in nature. They should never be
              treated as substitutes for professional psychiatric, medical, legal, or
              certified financial advisory services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#38070e]">
              Remedies & Individual Outcomes
            </h2>
            <p>
              Vedic remedies (mantras, yantras, pujas) operate at subtle karmic and
              vibrational levels. Outcomes and timings vary per individual depending on
              faith, diligence, and karmic intensity.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
