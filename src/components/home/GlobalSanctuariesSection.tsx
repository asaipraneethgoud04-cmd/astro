"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ChevronRight, Sparkles, Phone, Calendar } from "lucide-react";

export interface SanctuaryCity {
  id: string;
  name: string;
  landmark: string;
  imageUrl: string;
}

export const ALL_50_US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas",
  "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

export const NATIONWIDE_FEATURES = [
  "✦ Serving All 50 US States Daily",
  "✦ 100% Confidential Phone & Video Consultations",
  "✦ Accurate Kundali & Janam Kundali Analysis",
  "✦ Career, Business & Financial Growth Insight",
  "✦ Love, Marriage & Relationship Clarity",
  "✦ Authentic Vedic Remedies & Mantras",
  "✦ Trusted Coast-to-Coast by Indian Families",
];

export const sanctuariesData: SanctuaryCity[] = [
  {
    id: "texas",
    name: "Texas",
    landmark: "Dallas · Houston · Austin",
    imageUrl: "/images/locations/texas.jpg",
  },
  {
    id: "california",
    name: "California",
    landmark: "Bay Area · Los Angeles",
    imageUrl: "/images/locations/california.jpg",
  },
  {
    id: "new-york",
    name: "New York",
    landmark: "NYC · Long Island",
    imageUrl: "/images/locations/new-york.jpg",
  },
  {
    id: "florida",
    name: "Florida",
    landmark: "Miami · Orlando · Tampa",
    imageUrl: "/images/locations/florida.jpg",
  },
  {
    id: "new-jersey",
    name: "New Jersey",
    landmark: "Jersey City · Edison",
    imageUrl: "/images/locations/new-jersey.jpg",
  },
  {
    id: "illinois",
    name: "Illinois",
    landmark: "Chicago · Naperville",
    imageUrl: "/images/locations/illinois.jpg",
  },
];

export default function GlobalSanctuariesSection() {
  return (
    <section className="relative overflow-hidden bg-[#faf6ee] pt-14 pb-20 sm:pt-16 sm:pb-24 border-t border-[#ebdcc2]">
      {/* ─────────────────────────────────────────────────────────────
          1. CELESTIAL BACKGROUND: CLOUDS, STARS & ZODIAC CHARTS
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Full celestial backdrop with clouds, zodiac wheels, and stars */}
        <Image
          src="/images/locations-bg.png"
          alt=""
          fill
          loading="lazy"
          decoding="async"
          className="object-cover object-bottom opacity-85"
        />

        {/* Soft overall parchment overlay to ensure high contrast */}
        <div className="absolute inset-0 bg-[#faf6ee]/65 pointer-events-none" />

        {/* Dedicated radial scrim behind header text */}
        <div className="absolute inset-x-0 top-0 h-72 sm:h-80 bg-[radial-gradient(ellipse_at_top,rgba(250,246,238,0.95)_0%,rgba(250,246,238,0.75)_55%,transparent_100%)] pointer-events-none" />

        {/* Ambient warm glow in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#d4af37]/10 blur-[100px] rounded-full" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SECTION CONTENT CONTAINER
      ───────────────────────────────────────────────────────────── */}
      <div className="site-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 header-gap relative">
          {/* Main Title: "Our Locations" with enhanced contrast */}
          <h2 className="font-serif text-5xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-[#2d070d] leading-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
            Our <span className="text-[#a06f15] font-serif font-extrabold">Locations</span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#473034] font-medium tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            Astrology guidance across key US states & nationwide
          </p>

          {/* Golden Star Divider below Subtitle */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="w-14 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#c59b27]/70 to-[#c59b27]" />
            <span className="text-[#b3821a] text-xs sm:text-sm">✦</span>
            <span className="w-14 sm:w-24 h-px bg-gradient-to-l from-transparent via-[#c59b27]/70 to-[#c59b27]" />
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. 6 HIGHLIGHTED US STATES IN BALANCED RESPONSIVE GRID (2 cols on mobile, 3 cols on tablet & desktop)
        ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {sanctuariesData.map((city) => (
            <Link
              key={city.id}
              href={`/contact?location=${encodeURIComponent(city.name)}`}
              className="group relative flex items-center justify-between px-3 py-2 sm:px-3.5 sm:py-2.5 lg:px-4 lg:py-3 rounded-full bg-[#fbf5e8] border border-[#ebdcc2] hover:bg-[#38070e] hover:border-[#c59b27] shadow-[0_2px_10px_rgba(197,155,39,0.1)] hover:shadow-[0_12px_28px_rgba(56,7,14,0.32)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              {/* Circular State Thumbnail with Golden Ring */}
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-13 lg:h-13 rounded-full overflow-hidden shrink-0 border-2 border-[#c59b27] group-hover:border-[#f6e27a] shadow-sm transition-colors duration-300">
                <Image
                  src={city.imageUrl}
                  alt={`${city.name} Vedic Astrology Guidance`}
                  fill
                  sizes="(max-width: 640px) 44px, 56px"
                  loading="lazy"
                  decoding="async"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Center: Golden MapPin + State Name & Key Cities */}
              <div className="flex flex-col min-w-0 flex-1 ml-2.5 sm:ml-3 mr-1">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#c59b27] fill-[#c59b27]/25 group-hover:text-[#f6e27a] group-hover:fill-[#f6e27a]/25 shrink-0 hidden xs:inline-block transition-colors duration-300" />
                  <span className="font-serif text-[13px] sm:text-base lg:text-lg font-bold text-[#2d070d] group-hover:text-white transition-colors duration-300 truncate">
                    {city.name}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#735a5e] group-hover:text-[#f6e27a]/85 transition-colors duration-300 truncate pl-0 xs:pl-4 sm:pl-5">
                  {city.landmark}
                </span>
              </div>

              {/* Right: Chevron Arrow */}
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c59b27] group-hover:text-white shrink-0 transition-all duration-300 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            4. NATIONWIDE 50-STATES CONTINUOUS MARQUEE CARD
        ───────────────────────────────────────────────────────────── */}
        <div className="mt-8 sm:mt-10 lg:mt-12 relative overflow-hidden rounded-3xl border border-[#c59b27]/40 bg-gradient-to-b from-[#240409] via-[#35070e] to-[#1c0206] p-5 sm:p-7 lg:p-9 shadow-[0_20px_50px_rgba(36,4,9,0.35),0_0_30px_rgba(212,175,55,0.12)] text-white">
          {/* Ambient golden glow */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#d4af37]/15 blur-3xl rounded-full" />

          {/* Header row: Pill badge + Headline */}
          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c59b27]/60 bg-[#240409]/90 px-3.5 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#f6e27a] shadow-[0_0_12px_rgba(212,175,55,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#f6e27a] animate-pulse" />
              <span>Nationwide Vedic Consultations</span>
              <span className="text-[#c59b27]/60">✦</span>
              <span>All 50 US States</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#fcf9f2] tracking-wide">
              Serving Seekers Across <span className="text-[#f6e27a]">All 50 US States</span>
            </h3>

            <p className="text-xs sm:text-sm text-[#ecd9c6]/85 font-light max-w-xl mx-auto">
              Private telephone and online video consultations available daily from the comfort of your home.
            </p>
          </div>

          {/* Marquee Track 1: All 50 States Continuous Loop */}
          <div className="relative overflow-hidden w-full py-2">
            {/* Soft Edge Fade Masks */}
            <div className="pointer-events-none absolute left-0 inset-y-0 w-12 sm:w-24 bg-gradient-to-r from-[#240409] via-[#240409]/80 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 inset-y-0 w-12 sm:w-24 bg-gradient-to-l from-[#240409] via-[#240409]/80 to-transparent z-10" />

            <div className="animate-marquee-flow flex items-center gap-2.5 sm:gap-3 select-none">
              {[...ALL_50_US_STATES, ...ALL_50_US_STATES].map((state, idx) => (
                <Link
                  key={`${state}-${idx}`}
                  href={`/contact?location=${encodeURIComponent(state)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-[#c59b27]/40 bg-[#38070e]/80 hover:bg-[#c59b27] text-xs sm:text-[13px] font-medium text-[#f6e27a] hover:text-[#240409] tracking-wide whitespace-nowrap shadow-xs hover:shadow-[0_0_15px_rgba(246,226,122,0.4)] transition-all duration-300"
                >
                  <MapPin className="w-3 h-3 text-[#c59b27] group-hover:text-[#240409] shrink-0" />
                  <span>{state}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Marquee Track 2: Trust Highlights & Vedic Guidance in Reverse Motion */}
          <div className="relative overflow-hidden w-full py-2 mt-2">
            {/* Soft Edge Fade Masks */}
            <div className="pointer-events-none absolute left-0 inset-y-0 w-12 sm:w-24 bg-gradient-to-r from-[#240409] via-[#240409]/80 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 inset-y-0 w-12 sm:w-24 bg-gradient-to-l from-[#240409] via-[#240409]/80 to-transparent z-10" />

            <div className="animate-marquee-flow-reverse flex items-center gap-3 sm:gap-4 select-none">
              {[...NATIONWIDE_FEATURES, ...NATIONWIDE_FEATURES].map((feature, idx) => (
                <span
                  key={`feat-${idx}`}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-serif italic text-[#ecd9c6]/90 tracking-wide whitespace-nowrap hover:text-[#f6e27a] transition-colors"
                >
                  <span>{feature}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer inside card */}
          <div className="relative z-10 mt-6 pt-5 border-t border-[#c59b27]/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#ecd9c6]/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Daily Consultations · 9:00 AM – 8:00 PM Central Time</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/book-appointment"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#c59b27] via-[#e5c158] to-[#c59b27] text-[#240409] font-serif font-bold text-xs sm:text-sm shadow-md hover:brightness-110 transition-all hover:scale-105"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Consultation</span>
              </Link>
              <a
                href="tel:+12146699699"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#c59b27]/60 bg-[#240409] text-[#f6e27a] hover:border-[#f6e27a] hover:text-white text-xs sm:text-sm font-medium transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+1 214 669 9699</span>
              </a>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            5. BOTTOM ORNAMENTAL STAR DIVIDER
        ───────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 pt-8 sm:pt-10">
          <span className="w-14 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#c59b27]/60 to-[#c59b27]/90" />
          <span className="text-[#c59b27] text-xs sm:text-sm">✦</span>
          <span className="w-14 sm:w-24 h-px bg-gradient-to-l from-transparent via-[#c59b27]/60 to-[#c59b27]/90" />
        </div>
      </div>
    </section>
  );
}
