"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PinnedReview } from "@/lib/reviews";

const SLIDE_MS = 5000;

function usePinnedSlide(count: number) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setIndex((current) => (count === 0 ? 0 : current % count));
  }, [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  function go(direction: -1 | 1) {
    setIndex((current) => (current + direction + count) % count);
  }

  return { index, setIndex, paused, setPaused, go };
}

export default function PinnedReviewBar({ reviews }: { reviews: PinnedReview[] }) {
  const { index, setIndex, setPaused, go } = usePinnedSlide(reviews.length);
  if (reviews.length === 0) return null;

  const several = reviews.length > 1;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-10 border-b border-[#c59b27]/40 bg-[#240409]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-full site-container">
        {reviews.map((review, slideIndex) => (
          <p
            key={review.id}
            className={`absolute inset-0 flex items-center justify-center px-12 sm:px-16 text-center text-xs sm:text-sm uppercase tracking-wider transition-opacity duration-700 ${slideIndex === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            aria-hidden={slideIndex !== index}
          >
            <span className="max-w-full truncate text-[#fdfaf4]">
              <span className="font-medium text-[#f6e27a]">“{review.quote}”</span>
              <span className="text-[#f0e2d3]"> — {review.name}, {review.city}</span>
            </span>
          </p>
        ))}
        {several ? (
          <div className="absolute inset-y-0 right-4 sm:right-6 lg:right-8 2xl:right-10 flex items-center gap-1">
            {reviews.map((review, slideIndex) => (
              <button
                key={review.id}
                type="button"
                aria-label={`Show pinned review ${slideIndex + 1}`}
                onClick={() => setIndex(slideIndex)}
                className={`h-1.5 rounded-full transition-all ${slideIndex === index ? "w-4 bg-[#f6e27a]" : "w-1.5 bg-[#f6e27a]/40"
                  }`}
              />
            ))}
            <button type="button" aria-label="Previous pinned review" onClick={() => go(-1)} className="sr-only">
              Previous
            </button>
            <button type="button" aria-label="Next pinned review" onClick={() => go(1)} className="sr-only">
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function AdminPinnedSlideshow({ reviews }: { reviews: PinnedReview[] }) {
  const { index, setIndex, setPaused, go } = usePinnedSlide(reviews.length);
  if (reviews.length === 0) return null;

  const several = reviews.length > 1;
  const current = reviews[index];

  return (
    <div
      className="sticky top-4 z-30 mb-8 rounded-[24px] border border-[#c59b27]/40 bg-[#240409] px-5 py-5 shadow-[0_16px_36px_rgba(36,4,9,0.18)] sm:px-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-3xl">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <span />
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f6e27a]">
            Above the header
          </p>
          <p className="text-right text-[11px] font-medium tabular-nums text-[#f6e27a]/80">
            {several ? `${index + 1} / ${reviews.length}` : ""}
          </p>
        </div>

        <div className="mt-3 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {reviews.map((review) => (
              <div key={review.id} className="w-full shrink-0 text-center uppercase">
                <p className="font-serif text-lg leading-snug text-white sm:text-xl">“{review.quote}”</p>
                <p className="mt-2 text-xs tracking-wider text-[#f6e27a]">
                  {review.name} · {review.city}
                </p>
              </div>
            ))}
          </div>
        </div>

        {several ? (
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous pinned review"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#f6e27a]/40 text-[#f6e27a] hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Pinned reviews">
              {reviews.map((review, slideIndex) => (
                <button
                  key={review.id}
                  type="button"
                  role="tab"
                  aria-selected={slideIndex === index}
                  aria-label={`${review.name}, ${review.city}`}
                  onClick={() => setIndex(slideIndex)}
                  className={`h-1.5 rounded-full transition-all ${slideIndex === index ? "w-5 bg-[#f6e27a]" : "w-1.5 bg-[#f6e27a]/35 hover:bg-[#f6e27a]/70"
                    }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next pinned review"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#f6e27a]/40 text-[#f6e27a] hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
        <p className="sr-only" aria-live="polite">
          {current ? `${current.name}, ${current.city}. ${current.quote}` : ""}
        </p>
      </div>
    </div>
  );
}
