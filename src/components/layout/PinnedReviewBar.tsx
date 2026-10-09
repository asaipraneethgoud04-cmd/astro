"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  BadgeCheck,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import type { PinnedReview } from "@/lib/reviews";

const SLIDE_MS = 6000;

function usePinnedSlide(count: number) {
  const [rawIndex, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const index = count === 0 ? 0 : rawIndex % count;

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  const go = useCallback(
    (direction: -1 | 1) => {
      setIndex((current) => (current + direction + count) % count);
    },
    [count]
  );

  return { index, setIndex, paused, setPaused, go };
}

export default function PinnedReviewBar({ reviews }: { reviews: PinnedReview[] }) {
  const { index, setIndex, paused, setPaused, go } = usePinnedSlide(reviews.length);
  const [selectedReview, setSelectedReview] = useState<PinnedReview | null>(null);

  // Close modal on Escape key and lock body scroll
  useEffect(() => {
    if (!selectedReview) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedReview(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedReview]);

  if (reviews.length === 0) return null;

  const several = reviews.length > 1;
  const currentReview = reviews[index];

  return (
    <>
      <aside
        role="region"
        aria-label="Featured Client Reviews"
        className="fixed inset-x-0 top-0 z-[60] h-10 border-b border-[#c59b27]/35 bg-[#240409]/98 shadow-[0_2px_12px_rgba(0,0,0,0.5)] backdrop-blur-md"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* ─────────────────────────────────────────────────────────────
              1. CREATIVE INDICATION: Glowing Badge + Dynamic Gold Stars
          ───────────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-1.5 shrink-0 z-10">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#c59b27]/60 bg-gradient-to-r from-[#38070e] to-[#240409] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#f6e27a] shadow-[0_0_10px_rgba(212,175,55,0.25)] sm:text-[10px]">
              <Quote className="h-2.5 w-2.5 fill-[#f6e27a] text-[#f6e27a] shrink-0" />
              <span className="hidden xs:inline">
                {reviews[index]?.rating ?? 5}★ Client Review
              </span>
              <span className="xs:hidden">
                {reviews[index]?.rating ?? 5}★ Review
              </span>
            </span>

            {/* Dynamic Gold Stars */}
            <div
              className="hidden sm:flex items-center gap-0.5 text-[#f6e27a] shrink-0"
              aria-label={`${reviews[index]?.rating ?? 5} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`h-2.5 w-2.5 ${
                    starIdx <= (reviews[index]?.rating ?? 5)
                      ? "fill-[#f6e27a] text-[#f6e27a] drop-shadow-xs"
                      : "text-[#f6e27a]/30 fill-transparent"
                  }`}
                />
              ))}
            </div>

            <span className="hidden md:inline-block text-xs text-[#c59b27]/40 font-light select-none">
              |
            </span>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              2. REVIEW CONTENT: Snippet + Clickable to Expand Multi-Line
          ───────────────────────────────────────────────────────────── */}
          <div className="relative flex-1 h-full mx-2 sm:mx-3 overflow-hidden">
            {reviews.map((review, slideIndex) => {
              const isCurrent = slideIndex === index;
              return (
                <div
                  key={review.id}
                  onClick={() => setSelectedReview(review)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedReview(review);
                    }
                  }}
                  role="button"
                  tabIndex={isCurrent ? 0 : -1}
                  aria-label={`Read full review by ${review.name}: “${review.quote}”`}
                  className={`absolute inset-0 flex items-center justify-center cursor-pointer group transition-all duration-700 ${
                    isCurrent
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 pointer-events-none translate-y-1"
                  }`}
                  title="Click to view full review and details"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 max-w-full min-w-0 text-xs sm:text-[13px] text-[#fdfaf4] overflow-hidden">
                    <span className="truncate min-w-0 font-serif italic text-white group-hover:text-[#f6e27a] transition-colors break-all">
                      “{review.quote}”
                    </span>
                    <span className="hidden md:inline shrink-0 font-medium text-[#ecd9c6]/80 text-xs whitespace-nowrap">
                      — {review.name}, {review.city}
                    </span>
                    <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 bg-[#f6e27a]/15 text-[#f6e27a] text-[10px] font-semibold tracking-normal shrink-0 border border-[#c59b27]/40 group-hover:bg-[#f6e27a] group-hover:text-[#240409] transition-all whitespace-nowrap">
                      <span>Read full</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              3. RIGHT SLIDE CONTROLS: Previous / Next & Counter
          ───────────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-1 shrink-0 z-10">
            {several ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous client review"
                  className="p-1 rounded text-[#ecd9c6]/70 hover:text-[#f6e27a] hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-medium text-[#ecd9c6]/80 tabular-nums min-w-[24px] text-center">
                  {index + 1}/{reviews.length}
                </span>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next client review"
                  className="p-1 rounded text-[#ecd9c6]/70 hover:text-[#f6e27a] hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          4. REDESIGNED FULL REVIEW MODAL: Complete Multi-Line Presentation
      ───────────────────────────────────────────────────────────── */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedReview(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-[#c59b27] bg-gradient-to-b from-[#240409] via-[#35070f] to-[#1c0307] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(212,175,55,0.3)] text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient gold glow */}
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-[#d4af37]/15 blur-3xl rounded-full" />

            {/* Decorative background quotation mark */}
            <div className="pointer-events-none absolute -top-5 -right-2 text-[140px] font-serif leading-none text-[#f6e27a]/5 select-none">
              “
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedReview(null)}
              aria-label="Close review"
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#c59b27]/40 bg-[#240409] text-[#ecd9c6] hover:border-[#f6e27a] hover:text-[#f6e27a] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: Verified Review Pill & Dynamic Golden Stars */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c59b27]/60 bg-[#240409] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f6e27a] shadow-[0_0_12px_rgba(212,175,55,0.25)]">
                  <Sparkles className="w-3.5 h-3.5 text-[#f6e27a] animate-pulse" />
                  Verified Client Blessing
                </span>
                {selectedReview.service ? (
                  <span className="inline-block rounded-full bg-[#f6e27a]/20 border border-[#c59b27]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f6e27a]">
                    ✦ {selectedReview.service}
                  </span>
                ) : null}
              </div>
              <div
                className="flex items-center gap-1 text-[#f6e27a] pt-1"
                aria-label={`${selectedReview.rating ?? 5} star rating`}
              >
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-4 h-4 ${
                      starIdx <= (selectedReview.rating ?? 5)
                        ? "fill-[#f6e27a] text-[#f6e27a] drop-shadow-sm"
                        : "text-[#f6e27a]/30 fill-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Multi-Line Review Body (Fully readable without any clipping) */}
            <div className="relative z-10 my-6 max-h-[50vh] overflow-y-auto px-1 sm:px-2 text-center custom-scrollbar max-w-full overflow-x-hidden">
              <blockquote className="font-serif italic text-lg sm:text-xl text-[#fdfaf4] leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere]">
                “{selectedReview.quote}”
              </blockquote>
            </div>

            {/* Reviewer Signature & Location */}
            <div className="relative z-10 border-t border-[#c59b27]/30 pt-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5">
                <h3
                  id="review-modal-title"
                  className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#f6e27a] capitalize"
                >
                  {selectedReview.name}
                </h3>
                <BadgeCheck className="w-4 h-4 text-[#f6e27a]" />
              </div>
              <p className="text-xs uppercase tracking-wider text-[#ecd9c6]/80 font-medium">
                {selectedReview.city} • Verified Astrology Guidance
              </p>
            </div>

            {/* Multi-Review Navigation in Modal */}
            {several && (
              <div className="relative z-10 mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-[#ecd9c6]">
                <button
                  type="button"
                  onClick={() => {
                    const prevIdx = (index - 1 + reviews.length) % reviews.length;
                    setIndex(prevIdx);
                    setSelectedReview(reviews[prevIdx]);
                  }}
                  className="inline-flex items-center gap-1 text-[#ecd9c6] hover:text-[#f6e27a] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <span className="text-[11px] tabular-nums text-[#ecd9c6]/60">
                  {index + 1} of {reviews.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (index + 1) % reviews.length;
                    setIndex(nextIdx);
                    setSelectedReview(reviews[nextIdx]);
                  }}
                  className="inline-flex items-center gap-1 text-[#ecd9c6] hover:text-[#f6e27a] transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Call to Action Buttons */}
            <div className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/book-appointment"
                onClick={() => setSelectedReview(null)}
                className="inline-flex items-center justify-center rounded-full border border-[#c59b27] bg-[#f6e27a] px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#240409] hover:bg-white transition-colors shadow-md"
              >
                Book Consultation
              </Link>
              <Link
                href="/review"
                onClick={() => setSelectedReview(null)}
                className="inline-flex items-center justify-center rounded-full border border-[#c59b27]/60 bg-transparent px-4 py-2 text-xs font-semibold text-[#f6e27a] hover:bg-white/10 transition-colors"
              >
                Share Your Experience
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
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
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#c59b27]/60 bg-[#38070e] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#f6e27a]">
              <Quote className="h-2.5 w-2.5 fill-[#f6e27a] text-[#f6e27a]" />
              5★ Review Preview
            </span>
          </div>
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
              <div key={review.id} className="w-full shrink-0 text-center">
                <div className="flex items-center justify-center gap-1 text-[#f6e27a] mb-2">
                  {[1, 2, 3, 4, 5].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-3.5 h-3.5 ${
                        starIdx <= (review.rating ?? 5)
                          ? "fill-[#f6e27a] text-[#f6e27a]"
                          : "text-[#f6e27a]/30 fill-transparent"
                      }`}
                    />
                  ))}
                </div>
                <blockquote className="font-serif text-lg leading-relaxed text-white sm:text-xl italic whitespace-pre-line px-2 break-words [overflow-wrap:anywhere]">
                  “{review.quote}”
                </blockquote>
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
                  className={`h-1.5 rounded-full transition-all ${
                    slideIndex === index
                      ? "w-5 bg-[#f6e27a]"
                      : "w-1.5 bg-[#f6e27a]/35 hover:bg-[#f6e27a]/70"
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
