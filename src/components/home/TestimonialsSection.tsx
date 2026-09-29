import React from "react";
import Link from "next/link";
import { Star, Quote } from "lucide-react";
import { getAcceptedReviews } from "@/lib/reviews";

function ReviewCard({
  name,
  city,
  quote,
  pinned = false,
}: {
  name: string;
  city: string;
  quote: string;
  pinned?: boolean;
}) {
  return (
    <article className="relative w-full max-w-[360px] pt-5 pb-2 px-2 flex">
      <div
        className={`relative w-full rounded-[24px] border bg-gradient-to-b from-white via-[#fdfaf5] to-[#f8f2e7] px-7 pt-8 pb-7 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between text-center group ${pinned
          ? "border-[#c59b27] shadow-[0_14px_36px_rgba(197,155,39,0.15)] ring-1 ring-[#c59b27]/30 hover:shadow-[0_20px_48px_rgba(107,30,43,0.16)]"
          : "border-[#e8dac5] shadow-[0_12px_32px_rgba(56,7,14,0.06)] hover:shadow-[0_20px_44px_rgba(107,30,43,0.12)] hover:border-[#c59b27]/70"
          }`}
      >
        {/* Top Centered Elegant Quote Medallion */}
        <div
          className={`absolute -top-4 left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full text-[#f6e27a] border-2 shadow-[0_4px_12px_rgba(56,7,14,0.25)] transition-transform duration-300 group-hover:scale-110 ${pinned
            ? "bg-gradient-to-br from-[#c59b27] to-[#8b1827] border-[#f6e27a]"
            : "bg-gradient-to-br from-[#38070e] to-[#5a111c] border-[#d4af37]"
            }`}
          aria-hidden="true"
        >
          <Quote className="h-4 w-4 fill-current rotate-180" />
        </div>

        {/* Top subtle golden shimmer line */}
        <div
          className={`absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent pointer-events-none ${pinned ? "via-[#c59b27] opacity-100" : "via-[#c59b27]/60"
            } to-transparent`}
        />

        {/* Card Content */}
        <div>
          {/* 5-Star Rating */}
          <div className="mb-4 mt-1 flex items-center justify-center gap-1.5" aria-label="5 star rating">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-[#d4af37] text-[#d4af37] drop-shadow-xs" />
            ))}
          </div>

          {/* Testimonial Quote */}
          <blockquote className="font-serif italic text-[15px] sm:text-[16px] leading-[1.8] text-[#38070e]/90 px-1">
            “{quote}”
          </blockquote>
        </div>

        {/* Footer: Divider & Author Details */}
        <div className="mt-6 pt-5 border-t border-[#ebdcc7]/60">
          <h3 className="font-serif text-lg font-bold tracking-wide text-[#38070e] capitalize">
            {name}
          </h3>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[#8b1827]">
            {city}
          </p>
        </div>
      </div>
    </article>
  );
}

export default async function TestimonialsSection() {
  const reviews = await getAcceptedReviews();

  // Pinned reviews are guaranteed to be placed first, followed by the rest
  const sortedReviews = [...reviews].sort((a, b) => {
    if (Boolean(a.pinned) === Boolean(b.pinned)) return 0;
    return a.pinned ? -1 : 1;
  });

  return (
    <section className="relative overflow-hidden bg-[#fdfbf7] section-t">
      <div className="site-container">
        <div className="mx-auto header-gap max-w-2xl space-y-3 text-center">
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-[#38070e] sm:text-4xl lg:text-5xl">
            Voices of the Blessed
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="h-px w-12 bg-[#c59b27]/40" />
            <span className="text-xs text-[#c59b27]">◆</span>
            <span className="h-px w-12 bg-[#c59b27]/40" />
          </div>
        </div>

        {sortedReviews.length > 0 ? (
          <div className="flex flex-wrap items-stretch justify-center gap-x-6 grid-rows-gap sm:gap-x-8">
            {sortedReviews.map((item) => (
              <ReviewCard
                key={item.id}
                name={item.name}
                city={item.city}
                quote={item.quote}
                pinned={item.pinned}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-[#614b4f]">
            Client reviews appear here after they are accepted.
          </p>
        )}

        <div className="content-gap flex justify-center">
          <Link
            href="/review"
            className="inline-flex items-center justify-center rounded-full border border-[#c59b27] bg-white px-6 py-3 text-sm font-semibold text-[#38070e] transition-colors hover:bg-[#f6e27a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38070e]"
          >
            Share your experience
          </Link>
        </div>
      </div>
    </section>
  );
}
