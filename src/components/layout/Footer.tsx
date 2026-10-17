
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ShieldCheck, Clock } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Sacred Services" },
  { href: "/book-appointment", label: "Book Appointment" },
  { href: "/contact", label: "Contact Us" },
];

const consultationLinks = [
  { href: "/services/horoscope-reading", label: "Horoscope Reading" },
  {
    href: "/services/love-marriage-specialist",
    label: "Love Marriage Specialist",
  },
  { href: "/services/kundali-matching", label: "Kundali matching" },
  {
    href: "/services/vashikaran-specialist",
    label: "Vashikaran Specialist",
  },
  {
    href: "/services/education-employment",
    label: "Education & Employment",
  },
  {
    href: "/services/business-problem-solution",
    label: "Business Problem Solution",
  },
];

const ADDRESS = "11572 Lenox Ln, Frisco, TX 75033, USA";

// Uses the coordinates from your supplied Google Maps embed.
const MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=33.15120657350944%2C-96.89738652432172";

function FooterLinks({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <ul className="space-y-2 text-sm">
      {links.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="flex items-center gap-2 font-medium text-[#f5ebd9] transition-colors hover:text-[#f6e27a]"
          >
            <span className="text-xs text-[#f6e27a]">◆</span>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#c59b27]/40 bg-[#20050a] text-[#f5ebd9]">
      {/* Background celestial elements */}
      <div className="pointer-events-none absolute inset-0 z-[1] mix-blend-screen opacity-30 brightness-[1.8] contrast-125 saturate-150">
        <Image
          src="/images/footer layer.png"
          alt="Cosmic Planetary Alignments"
          fill
          loading="lazy"
          decoding="async"
          className="object-contain object-center"
        />
      </div>

      {/* Bottom-left zodiac decoration */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 w-[min(38vw,250px)] aspect-[216/367] translate-y-[6%] -translate-x-[1%] opacity-90">
        <Image
          src="/images/footer-corners-left.png"
          alt=""
          fill
          loading="lazy"
          decoding="async"
          className="object-fill object-left-bottom"
        />
      </div>

      {/* Bottom-right zodiac decoration */}
      <div className="pointer-events-none absolute bottom-0 right-0 z-0 w-[min(38vw,250px)] aspect-[216/369] translate-y-[6%] translate-x-[1%] opacity-90">
        <Image
          src="/images/footer-corners-right.png"
          alt=""
          fill
          loading="lazy"
          decoding="async"
          className="object-fill object-right-bottom"
        />
      </div>

      {/* Subtle center overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(32,5,10,0.22)_0%,transparent_62%)]" />

      {/* Main footer content */}
      <div className="site-container relative z-10 pt-8 pb-14 lg:pb-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Brand and Heritage */}
          <div className="col-span-2 space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div
                className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#f6e27a]/90 bg-[#240409] shadow-[0_0_12px_rgba(246,226,122,0.4)] cursor-pointer select-none transition-transform hover:scale-105 active:scale-95"
                title="Double-click to preview Sacred Logo"
                onDoubleClick={() => window.dispatchEvent(new CustomEvent("open-logo-modal"))}
              >
                <Image
                  src="/images/logo.png"
                  alt="Talk Astrologer Sacred Zodiac Logo"
                  fill
                  loading="lazy"
                  decoding="async"
                  sizes="44px"
                  className="object-cover object-center"
                />
              </div>

              <h3 className="font-serif text-2xl font-bold tracking-wider text-white sm:text-[26px]">
                Talk Astrologer
              </h3>
            </div>

            <p className="text-sm font-normal leading-relaxed text-[#f0e2d3]">
              Supportive astrology guidance and positive life insight in Texas
              and throughout the USA. Rooted in a revered six-generation
              ancestral Vedic lineage for clarity, peace of mind, and confidence.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs font-semibold tracking-wide text-[#f6e27a] sm:text-[13px]">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#f6e27a]" />
              <span>30+ Years &amp; 6 Generations of Ancestral Wisdom</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-span-1 space-y-3">
            <h4 className="inline-block border-b border-[#c59b27]/50 pb-1.5 font-serif text-lg font-bold tracking-wider text-[#f6e27a] sm:text-xl">
              Quick Links
            </h4>

            <FooterLinks links={quickLinks} />
          </div>

          {/* Column 3: Consultations */}
          <div className="col-span-1 space-y-3">
            <h4 className="inline-block border-b border-[#c59b27]/50 pb-1.5 font-serif text-lg font-bold tracking-wider text-[#f6e27a] sm:text-xl">
              Consultations
            </h4>

            <FooterLinks links={consultationLinks} />
          </div>

          {/* Column 4: Direct Contact */}
          <div className="col-span-2 space-y-3 md:col-span-1">
            <h4 className="inline-block border-b border-[#c59b27]/50 pb-1.5 font-serif text-lg font-bold tracking-wider text-[#f6e27a] sm:text-xl">
              Direct Contact
            </h4>

            <div className="space-y-4 text-sm text-[#f5ebd9]">
              {/* Clickable Address — opens Google Maps */}
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f6e27a]" />

                <a
                  href={MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Get directions to ${ADDRESS}`}
                  className="font-medium leading-snug text-[#f5ebd9] underline decoration-[#c59b27]/50 underline-offset-4 transition-colors duration-300 hover:text-[#f6e27a] hover:decoration-[#f6e27a]"
                >
                  {ADDRESS}
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#f6e27a]" />

                <a
                  href="tel:+12146699699"
                  className="text-base font-bold tracking-wide text-white transition-colors hover:text-[#f6e27a]"
                >
                  +1 214 669 9699
                </a>
              </div>

              {/* Email addresses */}
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#f6e27a]" />

                <div className="flex min-w-0 flex-col gap-1">
                  <a
                    href="mailto:myappointment@talkastrologer.com"
                    className="break-all text-sm font-semibold text-white transition-colors hover:text-[#f6e27a]"
                  >
                    myappointment@talkastrologer.com
                  </a>

                  <a
                    href="mailto:support@talkastrologer.com"
                    className="break-all text-sm font-medium text-[#f0e2d3] transition-colors hover:text-[#f6e27a]"
                  >
                    support@talkastrologer.com
                  </a>
                </div>
              </div>

              {/* Working hours */}
              <div className="flex items-start gap-3 pt-1">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#f6e27a]" />

                <p className="text-sm leading-relaxed text-[#eedcc9]">
                  Monday – Sunday, 9:00 AM – 8:00 PM
                  <br />
                  <span className="font-medium text-[#f6e27a]">
                    Central Time (Texas)
                  </span>
                </p>
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#f6e27a]/80">
                  Follow Us
                </span>

                <a
                  href="https://www.instagram.com/talk_astrologer"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow TalkAstrologer on Instagram"
                  className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E1306C] bg-gradient-to-tr from-[#FFDC80] via-[#F77737] via-40% to-[#833AB4] shadow-[0_0_8px_rgba(225,48,108,0.25)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_14px_rgba(225,48,108,0.5)]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-white transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-[#c59b27]/30 pt-4 pr-0 text-xs text-[#eedcc9] sm:pr-20 sm:text-[13px] lg:flex-row lg:pr-28">
          <p className="text-center font-medium text-[#f5ebd9] lg:text-left">
            © 2026 TalkAstrologer. All rights reserved.
          </p>

          <p className="text-center font-medium text-[#f6e27a] lg:text-right">
            Private Vedic consultations · Frisco, Texas &amp; nationwide
          </p>
        </div>
      </div>
    </footer>
  );
}

