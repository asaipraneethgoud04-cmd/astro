import React from "react";
import Link from "next/link";
import { getAcceptedReviews } from "@/lib/reviews";
import TestimonialCard from "./TestimonialCard";

export default async function TestimonialsSection() {
  const reviews = await getAcceptedReviews();

  // Pinned reviews are guaranteed to be placed first, followed by the rest
  const sortedReviews = [...reviews].sort((a, b) => {
    if (Boolean(a.pinned) === Boolean(b.pinned)) return 0;
    return a.pinned ? -1 : 1;
  });

  return (
    <section className="relative overflow-hidden bg-[#fdfbf7] section-t" id="testimonials">
      <div className="site-container">
        <div className="mx-auto header-gap max-w-2xl space-y-3 text-center">
          <h2 className="font-serif text-4xl font-extrabold tracking-tight text-[#38070e] sm:text-5xl lg:text-6xl">
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
              <TestimonialCard
                key={item.id}
                name={item.name}
                city={item.city}
                quote={item.quote}
                pinned={item.pinned}
                rating={item.rating ?? 5}
                service={item.service}
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
