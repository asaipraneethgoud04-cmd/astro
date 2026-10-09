"use client";

import React, { useState } from "react";
import { Star, Quote, Pin, ChevronDown, ChevronUp } from "lucide-react";

export default function TestimonialCard({
  name,
  city,
  quote,
  pinned = false,
  rating = 5,
  service,
}: {
  name: string;
  city: string;
  quote: string;
  pinned?: boolean;
  rating?: number;
  service?: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const displayRating = typeof rating === "number" && rating >= 1 && rating <= 5 ? rating : 5;
  const isLong = quote.length > 170;

  return (
    <article className="relative w-full max-w-[360px] pt-6 pb-2 px-2 flex min-w-0">
      <div
        className={`relative w-full rounded-[24px] border bg-gradient-to-b from-white via-[#fdfaf5] to-[#f8f2e7] px-6 sm:px-7 pt-9 pb-7 transition-all duration-300 flex flex-col justify-between text-center group min-w-0 overflow-hidden ${
          pinned
            ? "border-2 border-[#c59b27] shadow-[0_16px_40px_rgba(197,155,39,0.2)] ring-2 ring-[#c59b27]/30 hover:shadow-[0_22px_50px_rgba(107,30,43,0.2)]"
            : "border-[#e8dac5] shadow-[0_12px_32px_rgba(56,7,14,0.06)] hover:shadow-[0_20px_44px_rgba(107,30,43,0.12)] hover:border-[#c59b27]/70"
        }`}
      >
        {/* Top Centered Elegant Quote Medallion */}
        <div
          className={`absolute -top-4 left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full text-[#f6e27a] border-2 shadow-[0_4px_12px_rgba(56,7,14,0.25)] transition-transform duration-300 group-hover:scale-110 ${
            pinned
              ? "bg-gradient-to-br from-[#c59b27] to-[#8b1827] border-[#f6e27a]"
              : "bg-gradient-to-br from-[#38070e] to-[#5a111c] border-[#d4af37]"
          }`}
          aria-hidden="true"
        >
          <Quote className="h-4 w-4 fill-current rotate-180" />
        </div>

        {/* Card Header Content */}
        <div className="min-w-0 w-full">
          {/* Pinned Badge if pinned */}
          {pinned ? (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#38070e] text-[#f6e27a] border border-[#c59b27] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-xs">
                <Pin className="w-2.5 h-2.5 rotate-45 fill-current" />
                Featured Client Blessing
              </span>
            </div>
          ) : null}

          {/* Service Tag if present */}
          {service ? (
            <div className="mb-2">
              <span className="inline-block rounded-full bg-[#f6e27a]/25 border border-[#c59b27]/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#734e06] truncate max-w-full">
                ✦ {service}
              </span>
            </div>
          ) : null}

          {/* Dynamic Star Rating */}
          <div className="mb-3.5 mt-1 flex items-center justify-center gap-1.5" aria-label={`${displayRating} star rating`}>
            {[1, 2, 3, 4, 5].map((starIdx) => (
              <Star
                key={starIdx}
                className={`h-4 w-4 drop-shadow-xs transition-colors ${
                  starIdx <= displayRating
                    ? "fill-[#d4af37] text-[#d4af37]"
                    : "text-[#dcd0bf] fill-transparent"
                }`}
              />
            ))}
          </div>

          {/* Testimonial Quote with overflow protection and read more toggle */}
          <div className="w-full min-w-0">
            <blockquote
              className={`font-serif italic text-[14px] sm:text-[15px] leading-[1.75] text-[#38070e]/90 px-1 break-words [overflow-wrap:anywhere] transition-all scrollbar-transparent ${
                !expanded && isLong ? "line-clamp-4" : "max-h-[260px] overflow-y-auto"
              }`}
            >
              “{quote}”
            </blockquote>

            {isLong ? (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-[11px] font-bold uppercase tracking-wider text-[#8b1827] hover:text-[#38070e] transition-colors inline-flex items-center gap-0.5 cursor-pointer underline underline-offset-2"
              >
                <span>{expanded ? "Show Less" : "Read Full Blessing"}</span>
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            ) : null}
          </div>
        </div>

        {/* Footer: Author Details */}
        <div className="mt-5 pt-3 border-t border-[#ebdcc2]/60 min-w-0">
          <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#38070e] capitalize truncate">
            {name}
          </h3>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[#8b1827] truncate">
            {city}
          </p>
        </div>
      </div>
    </article>
  );
}
