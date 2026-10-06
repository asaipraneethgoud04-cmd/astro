"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";

export interface SanctuaryCity {
  id: string;
  name: string;
  landmark: string;
  imageUrl: string;
}

export const sanctuariesData: SanctuaryCity[] = [
  {
    id: "frisco",
    name: "Frisco",
    landmark: "The Star",
    imageUrl: "/images/locations/frisco.png",
  },
  {
    id: "plano",
    name: "Plano",
    landmark: "Legacy West",
    imageUrl: "/images/locations/plano.png",
  },
  {
    id: "the-colony",
    name: "The Colony",
    landmark: "Grandscape",
    imageUrl: "/images/locations/the-colony.png",
  },
  {
    id: "little-elm",
    name: "Little Elm",
    landmark: "Little Elm Park",
    imageUrl: "/images/locations/little-elm.png",
  },
  {
    id: "dallas",
    name: "Dallas",
    landmark: "Downtown",
    imageUrl: "/images/locations/dallas.png",
  },
  {
    id: "irving",
    name: "Irving",
    landmark: "Las Colinas",
    imageUrl: "/images/locations/irving.png",
  },
  {
    id: "fort-worth",
    name: "Fort Worth",
    landmark: "Sundance Square",
    imageUrl: "/images/locations/fort-worth.png",
  },
  {
    id: "houston",
    name: "Houston",
    landmark: "Downtown Houston",
    imageUrl: "/images/locations/houston.png",
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
          unoptimized
          priority
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
            Astrology guidance, wherever you are
          </p>

          {/* Golden Star Divider below Subtitle */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="w-14 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#c59b27]/70 to-[#c59b27]" />
            <span className="text-[#b3821a] text-xs sm:text-sm">✦</span>
            <span className="w-14 sm:w-24 h-px bg-gradient-to-l from-transparent via-[#c59b27]/70 to-[#c59b27]" />
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. 8 LOCATION PILLS IN RESPONSIVE GRID (2 cols on mobile, 4 cols on tablet & desktop)
        ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-5">
          {sanctuariesData.map((city) => (
            <Link
              key={city.id}
              href={`/contact?location=${encodeURIComponent(city.name)}`}
              className="group relative flex items-center justify-between px-2.5 py-1.5 sm:px-3 sm:py-2 lg:px-3.5 lg:py-2.5 rounded-full bg-[#fbf5e8] border border-[#ebdcc2] hover:bg-[#38070e] hover:border-[#c59b27] shadow-[0_2px_10px_rgba(197,155,39,0.1)] hover:shadow-[0_12px_28px_rgba(56,7,14,0.32)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              {/* Circular City Thumbnail with Golden Ring */}
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden shrink-0 border-[1.5px] sm:border-2 border-[#c59b27] group-hover:border-[#f6e27a] shadow-sm transition-colors duration-300">
                <Image
                  src={city.imageUrl}
                  alt={`${city.name} Vedic Astrology Guidance`}
                  fill
                  sizes="(max-width: 640px) 36px, 48px"
                  unoptimized
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Center: Golden MapPin + City Title */}
              <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1 ml-2 sm:ml-2.5 mr-1">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#c59b27] fill-[#c59b27]/25 group-hover:text-[#f6e27a] group-hover:fill-[#f6e27a]/25 shrink-0 hidden xs:inline-block transition-colors duration-300" />
                <span className="font-serif text-[13px] sm:text-base lg:text-lg font-bold text-[#2d070d] group-hover:text-white transition-colors duration-300 truncate">
                  {city.name}
                </span>
              </div>

              {/* Right: Chevron Arrow */}
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c59b27] group-hover:text-white shrink-0 transition-all duration-300 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            4. BOTTOM ORNAMENTAL STAR DIVIDER
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
