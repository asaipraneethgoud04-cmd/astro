"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Building2 } from "lucide-react";

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
    imageUrl:
      "https://images.unsplash.com/photo-1691635187988-d03b9ac5e045?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "plano",
    name: "Plano",
    landmark: "Legacy West",
    imageUrl:
      "https://images.unsplash.com/photo-1604329003703-dcd7f21527e2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "the-colony",
    name: "The Colony",
    landmark: "Grandscape",
    imageUrl:
      "https://images.unsplash.com/photo-1691635188006-78cfe07dadcc?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "little-elm",
    name: "Little Elm",
    landmark: "Little Elm Park",
    imageUrl:
      "https://images.unsplash.com/photo-1730749219049-b5c5fef792ba?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "allen",
    name: "Allen",
    landmark: "Watters Creek",
    imageUrl:
      "https://images.unsplash.com/photo-1621904878414-d4ca4756bd7e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "mckinney",
    name: "McKinney",
    landmark: "Historic Downtown",
    imageUrl:
      "https://images.unsplash.com/photo-1563219125-60d10ffe8877?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "prosper",
    name: "Prosper",
    landmark: "Downtown Prosper",
    imageUrl:
      "https://images.unsplash.com/photo-1623621029767-913a0c0038b4?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "dallas",
    name: "Dallas",
    landmark: "Downtown",
    imageUrl:
      "https://images.unsplash.com/photo-1754592326881-745afc0f9c84?auto=format&fit=crop&w=600&q=80",
  },
];

function SanctuaryCard({ city }: { city: SanctuaryCity }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[#1c1917] shadow-[0_14px_32px_rgba(24,16,12,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(24,16,12,0.24)]">
      {!imageError ? (
        <Image
          src={city.imageUrl}
          alt={`${city.name} - ${city.landmark}`}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
          onError={() => setImageError(true)}
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#241c1a]">
          <Building2 className="h-8 w-8 text-white/80" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* {city.id === "frisco" ? (
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-[#1c1917] shadow-sm">
          Our studio
        </span>
      ) : null} */}

      <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
        <h3 className="font-serif text-base sm:text-lg font-bold leading-tight text-white">
          {city.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{city.landmark}</span>
        </p>
      </div>
    </article>
  );
}

export default function GlobalSanctuariesSection() {
  return (
    <section className="section-t page-bottom bg-[#faf6ee] border-t border-[#ebdcc2] relative">
      <div className="site-container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 header-gap">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#38070e] tracking-tight">
            Our Global Sanctuaries
          </h2>
          <div className="flex items-center justify-center gap-1 text-[#c59b27]">
            <span className="text-xs">▲</span>
          </div>
          <p className="text-xs sm:text-sm text-[#665154] tracking-wide uppercase">
            Communities around our Frisco studio in North Texas
          </p>
        </div>

        {/* 8 City Cards Grid (2 rows of 4 columns) strictly matching screenshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 grid-rows-gap sm:gap-x-5">
          {sanctuariesData.map((city) => (
            <SanctuaryCard key={city.id} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
}
