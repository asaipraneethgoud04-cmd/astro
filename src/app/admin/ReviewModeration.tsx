"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Pin, PinOff, Clock, CheckCircle2, XCircle, Star, Sparkles, Trash2 } from "lucide-react";
import { setReviewPinned, setReviewStatus, deleteReview } from "./actions";
import type { Review, ReviewStatus } from "@/lib/reviews";

type FilterType = ReviewStatus | "all" | "pinned";

export default function ReviewModeration({
  reviews,
  pinReady,
}: {
  reviews: Review[];
  pinReady: boolean;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");
  const [message, setMessage] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pinnedReviews = reviews.filter((r) => r.pinned && r.status === "accepted");

  const counts: Record<FilterType, number> = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    accepted: reviews.filter((r) => r.status === "accepted").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
    pinned: pinnedReviews.length,
  };

  const ratedReviews = reviews.filter((r) => typeof r.rating === "number" && r.rating > 0);
  const avgRating =
    ratedReviews.length > 0
      ? (ratedReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / ratedReviews.length).toFixed(1)
      : "5.0";

  const visible = reviews.filter((review) => {
    if (filter === "all") return true;
    if (filter === "pinned") return review.pinned && review.status === "accepted";
    return review.status === filter;
  });

  function update(id: string, status: ReviewStatus) {
    setMessage("");
    setPendingId(id);
    startTransition(async () => {
      const result = await setReviewStatus(id, status);
      setPendingId(null);
      if (result?.error) {
        setMessage(result.error);
        return;
      }
      router.refresh();
    });
  }

  function pin(id: string, pinned: boolean) {
    setMessage("");
    setPendingId(id);
    startTransition(async () => {
      const result = await setReviewPinned(id, pinned);
      setPendingId(null);
      if (result?.error) {
        setMessage(result.error);
        return;
      }
      router.refresh();
    });
  }

  function remove(id: string, clientName: string) {
    const ok = window.confirm(
      `Are you sure you want to permanently delete the review from "${clientName}"? This action cannot be undone.`
    );
    if (!ok) return;

    setMessage("");
    setPendingId(id);
    startTransition(async () => {
      const result = await deleteReview(id);
      setPendingId(null);
      if (result?.error) {
        setMessage(result.error);
        return;
      }
      router.refresh();
    });
  }

  const filterTabs: { id: FilterType; label: string; count: number }[] = [
    { id: "all", label: "All Reviews", count: counts.all },
    { id: "pending", label: "Waiting", count: counts.pending },
    { id: "accepted", label: "Accepted", count: counts.accepted },
    { id: "rejected", label: "Not Accepted", count: counts.rejected },
    { id: "pinned", label: "Above Header", count: counts.pinned },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Tabs / Stat Counters */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {filterTabs.map((item) => {
          const isActive = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-[#38070e] bg-[#38070e] text-white shadow-md shadow-[#38070e]/15"
                  : "border-[#eadcc4] bg-white text-[#38070e] hover:border-[#c59b27] hover:bg-[#faf7f0]"
              }`}
            >
              <span className="block font-serif text-2xl font-bold">{item.count}</span>
              <span
                className={`mt-0.5 block text-xs font-medium tracking-wide ${
                  isActive ? "text-[#f6e27a]" : "text-[#7a4816]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Average Satisfaction Overview */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#eadcc4] bg-[#faf6ee] px-5 py-3 text-xs text-[#5c3e43]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#38070e]">Average Client Rating:</span>
          <div className="inline-flex items-center gap-1 rounded-full bg-white border border-[#e5d0ad] px-2.5 py-0.5 text-[#8c6708] font-bold shadow-2xs">
            <Star className="h-3.5 w-3.5 fill-[#d4af37] text-[#c59b27]" />
            <span>{avgRating} / 5.0</span>
          </div>
          <span className="text-[11px] text-[#7a585f]">
            ({ratedReviews.length} client submissions)
          </span>
        </div>
        <div className="text-[11px] text-[#7a585f]">
          Showing <strong className="text-[#38070e]">{visible.length}</strong> {filter} review{visible.length === 1 ? "" : "s"}
        </div>
      </div>

      {message ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
          {message}
        </div>
      ) : null}

      {/* Reviews Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e5d8c3] bg-white shadow-[0_4px_24px_rgba(56,7,14,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#ebdcc7] bg-[#faf6ef] text-[11px] font-semibold uppercase tracking-wider text-[#7a4816]">
                <th scope="col" className="px-5 py-4 whitespace-nowrap">Client</th>
                <th scope="col" className="px-5 py-4 whitespace-nowrap">Rating</th>
                <th scope="col" className="px-5 py-4 min-w-[280px]">Review Quote</th>
                <th scope="col" className="px-5 py-4 whitespace-nowrap">Submitted</th>
                <th scope="col" className="px-5 py-4 whitespace-nowrap">Status</th>
                <th scope="col" className="px-5 py-4 whitespace-nowrap">Header Pin</th>
                <th scope="col" className="px-5 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2e8dc] text-sm">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-[#614b4f]">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <Clock className="h-8 w-8 text-[#c59b27]/60 mb-2" />
                      <p className="font-serif text-lg font-bold text-[#38070e]">No reviews found</p>
                      <p className="mt-1 text-xs text-[#7a585f]">
                        There are currently no reviews matching the selected &quot;{filter}&quot; filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                visible.map((review) => {
                  const busy = isPending && pendingId === review.id;
                  const initial = review.name ? review.name.trim().charAt(0).toUpperCase() : "✦";
                  const rating = typeof review.rating === "number" && review.rating >= 1 && review.rating <= 5 ? review.rating : 5;

                  return (
                    <tr
                      key={review.id}
                      className={`transition-colors hover:bg-[#fdfbf7] ${
                        review.pinned ? "bg-[#fdfcf7]" : ""
                      }`}
                    >
                      {/* 1. Client Info */}
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#38070e] font-serif text-sm font-bold text-[#f6e27a] border border-[#c59b27]/40 shadow-2xs">
                            {initial}
                          </span>
                          <div className="min-w-0">
                            <p className="font-serif font-bold text-[#38070e] text-sm capitalize whitespace-nowrap">
                              {review.name}
                            </p>
                            <p className="text-xs text-[#7a585f] capitalize whitespace-nowrap">
                              {review.city}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Rating Stars & Service Badge */}
                      <td className="px-5 py-4 align-top whitespace-nowrap">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
                            {[1, 2, 3, 4, 5].map((starIdx) => {
                              const isFilled = starIdx <= rating;
                              return (
                                <Star
                                  key={starIdx}
                                  className={`h-4 w-4 ${
                                    isFilled
                                      ? rating <= 2
                                        ? "fill-red-500 text-red-500"
                                        : rating === 3
                                        ? "fill-amber-500 text-amber-500"
                                        : "fill-[#d4af37] text-[#c59b27] drop-shadow-2xs"
                                      : "text-stone-300 fill-transparent"
                                  }`}
                                />
                              );
                            })}
                            <span
                              className={`ml-1 font-serif text-xs font-bold ${
                                rating <= 2
                                  ? "text-red-700"
                                  : rating === 3
                                  ? "text-amber-700"
                                  : "text-[#38070e]"
                              }`}
                            >
                              {rating}.0
                            </span>
                          </div>

                          {review.service ? (
                            <span
                              className="inline-block max-w-[200px] truncate rounded-full bg-[#faf6ee] border border-[#e5d0ad] px-2.5 py-0.5 text-[10px] font-medium text-[#7a4816]"
                              title={review.service}
                            >
                              ✦ {review.service}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* 3. Review Quote */}
                      <td className="px-5 py-4 align-top">
                        <blockquote className="font-serif italic text-sm text-[#38070e]/90 leading-relaxed max-w-md">
                          “{review.quote}”
                        </blockquote>
                      </td>

                      {/* 4. Submitted Date */}
                      <td className="px-5 py-4 align-top whitespace-nowrap text-xs text-[#7a585f]">
                        {new Date(review.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* 5. Status Badge */}
                      <td className="px-5 py-4 align-top whitespace-nowrap">
                        {review.status === "accepted" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            Accepted
                          </span>
                        ) : review.status === "rejected" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600 border border-stone-200">
                            <XCircle className="h-3.5 w-3.5 text-stone-500" />
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Waiting
                          </span>
                        )}
                      </td>

                      {/* 6. Pinned Status */}
                      <td className="px-5 py-4 align-top whitespace-nowrap">
                        {review.pinned && review.status === "accepted" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#f6e27a] px-2.5 py-1 text-xs font-bold text-[#38070e] border border-[#c59b27]/60 shadow-xs">
                            <Pin className="h-3 w-3 fill-current rotate-45" />
                            Pinned
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400 pl-2">—</span>
                        )}
                      </td>

                      {/* 7. Action Buttons */}
                      <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {review.status !== "accepted" ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => update(review.id, "accepted")}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#38070e] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#200408] transition disabled:opacity-50 cursor-pointer"
                              title="Accept review to publish"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Accept
                            </button>
                          ) : null}

                          {review.status !== "rejected" ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => update(review.id, "rejected")}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#e5d0ad] bg-white px-3 py-1.5 text-xs font-semibold text-[#8b1827] hover:border-[#8b1827] hover:bg-red-50/50 transition disabled:opacity-50 cursor-pointer"
                              title="Reject review"
                            >
                              <X className="h-3.5 w-3.5" />
                              Reject
                            </button>
                          ) : null}

                          {pinReady && review.status === "accepted" ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => pin(review.id, !review.pinned)}
                              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 cursor-pointer ${
                                review.pinned
                                  ? "border border-[#c59b27] bg-[#f6e27a] text-[#38070e] hover:bg-[#ebd255] shadow-xs"
                                  : "border border-[#e5d0ad] bg-stone-50 text-[#7a4816] hover:border-[#c59b27] hover:bg-[#faf6ee]"
                              }`}
                              title={review.pinned ? "Remove from top header bar" : "Feature in top header bar"}
                            >
                              {review.pinned ? (
                                <>
                                  <PinOff className="h-3.5 w-3.5" />
                                  Unpin
                                </>
                              ) : (
                                <>
                                  <Pin className="h-3.5 w-3.5" />
                                  Pin
                                </>
                              )}
                            </button>
                          ) : null}

                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => remove(review.id, review.name)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/70 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:border-red-300 hover:bg-red-100 transition disabled:opacity-50 cursor-pointer"
                            title="Delete review permanently"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-600" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
