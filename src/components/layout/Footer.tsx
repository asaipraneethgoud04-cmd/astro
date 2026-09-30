import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ShieldCheck, Clock } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-[#20050a] text-[#f5ebd9] border-t border-[#c59b27]/40 overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. BACKGROUND CELESTIAL ELEMENTS (High visibility & luminosity)
      ───────────────────────────────────────────────────────────── */}
      {/* Planetary row — black background drops out, planets stay bright */}
      <div className="absolute inset-0 z-[1] pointer-events-none mix-blend-screen brightness-[3.2] contrast-125 saturate-150">
        <Image
          src="/images/footer layer.png"
          alt="Cosmic Planetary Alignments"
          fill
          unoptimized
          className="object-contain object-center"
        />
      </div>

      {/* Bottom Left Corner Zodiac Wheel — flush to the corner */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 w-[min(38vw,250px)] aspect-[216/367] translate-y-[6%] -translate-x-[1%] opacity-90">
        <Image
          src="/images/footer-corners-left.png"
          alt=""
          fill
          unoptimized
          className="object-fill object-left-bottom"
        />
      </div>

      {/* Bottom Right Corner Zodiac Wheel — flush to the corner */}
      <div className="pointer-events-none absolute bottom-0 right-0 z-0 w-[min(38vw,250px)] aspect-[216/369] translate-y-[6%] translate-x-[1%] opacity-90">
        <Image
          src="/images/footer-corners-right.png"
          alt=""
          fill
          unoptimized
          className="object-fill object-right-bottom"
        />
      </div>

      {/* Center scrim for text; corners stay clear so the wheels meet the edges */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(32,5,10,0.22)_0%,transparent_62%)]" />

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN 4-COLUMN BALANCED FOOTER CONTENT
      ───────────────────────────────────────────────────────────── */}
      <div className="site-container pt-8 pb-14 lg:pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Column 1: Brand & Heritage */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#f6e27a]/90 shrink-0 bg-[#240409] shadow-[0_0_12px_rgba(246,226,122,0.4)]">
                <Image
                  src="/images/logo.png"
                  alt="Talk Astrologer Sacred Zodiac Logo"
                  fill
                  unoptimized
                  className="object-cover object-center"
                />
              </div>
              <h3 className="font-serif text-lg font-bold tracking-wider text-white">
                Talk Astrologer
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-[#f0e2d3] font-normal">
              Supportive astrology guidance and positive life insight in Texas and throughout the USA. Rooted in a revered six-generation ancestral Vedic lineage for clarity, peace of mind, and confidence.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-[#f6e27a] font-semibold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-[#f6e27a] shrink-0" />
              <span>22+ Years & 6 Generations of Ancestral Wisdom</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-sm font-semibold text-[#f6e27a] tracking-wider border-b border-[#c59b27]/50 pb-1.5 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/"
                  className="text-[#f5ebd9] hover:text-[#f6e27a] transition-colors flex items-center gap-2 font-medium"
                >
                  <span className="text-[#f6e27a] text-xs">◆</span> Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#f5ebd9] hover:text-[#f6e27a] transition-colors flex items-center gap-2 font-medium"
                >
                  <span className="text-[#f6e27a] text-xs">◆</span> About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-[#f5ebd9] hover:text-[#f6e27a] transition-colors flex items-center gap-2 font-medium"
                >
                  <span className="text-[#f6e27a] text-xs">◆</span> Sacred Services
                </Link>
              </li>
              <li>
                <Link
                  href="/book-appointment"
                  className="text-[#f5ebd9] hover:text-[#f6e27a] transition-colors flex items-center gap-2 font-medium"
                >
                  <span className="text-[#f6e27a] text-xs">◆</span> Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#f5ebd9] hover:text-[#f6e27a] transition-colors flex items-center gap-2 font-medium"
                >
                  <span className="text-[#f6e27a] text-xs">◆</span> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Consultations */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-sm font-semibold text-[#f6e27a] tracking-wider border-b border-[#c59b27]/50 pb-1.5 inline-block">
              Consultations
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/services#horoscope-kundli"
                  className="text-[#f5ebd9] hover:text-[#f6e27a] transition-colors flex items-center gap-2 font-medium"
                >
                  <span className="text-[#f6e27a] text-xs">◆</span> Horoscope & Kundli
                </Link>
              </li>
              <li>
                <Link
                  href="/services#love-relationship-guidance"
                  className="text-[#f5ebd9] hover:text-[#f6e27a] transition-colors flex items-center gap-2 font-medium"
                >
                  <span className="text-[#f6e27a] text-xs">◆</span> Love & Relationship
                </Link>
              </li>
              <li>
                <Link
                  href="/services#marriage-compatibility"
                  className="text-[#f5ebd9] hover:text-[#f6e27a] transition-colors flex items-center gap-2 font-medium"
                >
                  <span className="text-[#f6e27a] text-xs">◆</span> Marriage Compatibility
                </Link>
              </li>
              <li>
                <Link
                  href="/services#career-education-job"
                  className="text-[#f5ebd9] hover:text-[#f6e27a] transition-colors flex items-center gap-2 font-medium"
                >
                  <span className="text-[#f6e27a] text-xs">◆</span> Career Guidance
                </Link>
              </li>
              <li>
                <Link
                  href="/services#vastu-shastra"
                  className="text-[#f5ebd9] hover:text-[#f6e27a] transition-colors flex items-center gap-2 font-medium"
                >
                  <span className="text-[#f6e27a] text-xs">◆</span> Vastu Shastra
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact (High visibility & clarity) */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-sm font-semibold text-[#f6e27a] tracking-wider border-b border-[#c59b27]/50 pb-1.5 inline-block">
              Direct Contact
            </h4>
            <div className="space-y-2 text-xs text-[#f5ebd9]">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-3.5 h-3.5 text-[#f6e27a] mt-0.5 shrink-0" />
                <span className="leading-snug text-[#f5ebd9] font-medium">
                  11572 Lenox Ln, Frisco, TX 75033, USA
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-3.5 h-3.5 text-[#f6e27a] shrink-0" />
                <a
                  href="tel:+12146699699"
                  className="hover:text-[#f6e27a] text-[#ffffff] font-bold text-sm tracking-wide transition-colors"
                >
                  +1 214 669 9699
                </a>
              </div>

              {/* Emails - Clearly visible and highlighted */}
              <div className="flex items-start gap-3">
                <Mail className="w-3.5 h-3.5 text-[#f6e27a] mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                  <a
                    href="mailto:myappointment@talkastrologer.com"
                    className="text-[#ffffff] hover:text-[#f6e27a] text-xs font-semibold transition-colors break-all"
                  >
                    myappointment@talkastrologer.com
                  </a>
                  <a
                    href="mailto:support@talkastrologer.com"
                    className="text-[#f0e2d3] hover:text-[#f6e27a] text-xs font-medium transition-colors break-all"
                  >
                    support@talkastrologer.com
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#f6e27a] mt-0.5 shrink-0" />
                <p className="text-xs text-[#eedcc9] leading-relaxed">
                  Monday – Sunday, 9:00 AM – 8:00 PM <br />
                  <span className="text-[#f6e27a] font-medium">Central Time (Texas)</span>
                </p>
              </div>

              {/* Social Media */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f6e27a]/70">Follow Us</span>
                <a
                  href="https://www.instagram.com/talk_astrologer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-8 h-8 rounded-full border border-[#c59b27]/50 bg-[#240409] hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:border-transparent transition-all duration-300 shadow-[0_0_8px_rgba(212,175,55,0.2)] hover:shadow-[0_0_14px_rgba(225,48,108,0.4)]"
                  aria-label="Follow TalkAstrologer on Instagram"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#f6e27a] group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. BOTTOM BAR (Aligned & styled with clearance from floating buttons)
        ───────────────────────────────────────────────────────────── */}
        <div className="mt-6 pt-4 border-t border-[#c59b27]/30 flex flex-col lg:flex-row items-center justify-between gap-3 text-[11px] text-[#eedcc9] pr-0 sm:pr-20 lg:pr-28">
          <p className="text-center lg:text-left text-[#f5ebd9] font-medium">
            © 2026 TalkAstrologer.com. All rights reserved.
          </p>

          <p className="text-center lg:text-right text-[#f6e27a] font-medium">
            Private Vedic consultations · Frisco, Texas & nationwide
          </p>
        </div>
      </div>
    </footer>
  );
}
