import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | TalkAstrologer",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="page-top page-bottom bg-[#fdfbf7] min-h-screen">
      <div className="site-container">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="border-b border-[#ebdcc2] pb-6 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8b1827]">
              <ShieldCheck className="w-4 h-4 text-[#c59b27]" />
              Sacred Trust & Security
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#38070e]">
              Privacy Policy
            </h1>
            <p className="text-xs text-[#735e61]">
              Last Updated: January 2026 • TalkAstrologer
            </p>
          </div>

          <div className="space-y-6 text-sm text-[#4d393d] leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#38070e]">
                1. Our Sacred Commitment to Your Confidentiality
              </h2>
              <p>
                At TalkAstrologer, we treat every seeker&apos;s personal information,
                date/time/place of birth, astrological questions, and life experiences
                with the highest degree of reverence and secrecy.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#38070e]">
                2. Information We Collect
              </h2>
              <p>
                To generate and interpret accurate Vedic birth charts (Janam Kundali), we
                collect your Name, Contact Details (Phone/WhatsApp and Email), Date of
                Birth, Exact Time of Birth, and City of Birth.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#38070e]">
                3. Use of Birth Chart Data
              </h2>
              <p>
                Your birth chart data is solely utilized by our authorized ancestral
                astrologers to compute planetary positions, dashas, transits, and
                supportive guidance. We never sell, rent, or trade your personal or
                astrological data to third-party advertisers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#38070e]">
                4. Contact Us Regarding Your Privacy
              </h2>
              <p>
                If you have any questions or wish to delete your birth chart records
                following your consultation, please write to{" "}
                <a
                  href="mailto:consult@TalkAstrologer"
                  className="text-[#8b1827] font-semibold underline"
                >
                  consult@TalkAstrologer
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
