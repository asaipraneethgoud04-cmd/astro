"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Pin, PinOff, Clock, CheckCircle2, XCircle } from "lucide-react";
import { setReviewPinned, setReviewStatus } from "./actions";
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
                <th scope="col" className="px-5 py-4">Client</th>
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
                  <td colSpan={6} className="px-6 py-16 text-center text-[#614b4f]">
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

                  return (
                    <tr
                      key={review.id}
                      className={`transition-colors hover:bg-[#fdfbf7] ${
                        review.pinned ? "bg-[#fdfcf7]" : ""
                      }`}
                    >
                      {/* Client Info */}
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

                      {/* Review Quote */}
                      <td className="px-5 py-4 align-top">
                        <blockquote className="font-serif italic text-sm text-[#38070e]/90 leading-relaxed max-w-md">
                          “{review.quote}”
                        </blockquote>
                      </td>

                      {/* Submitted Date */}
                      <td className="px-5 py-4 align-top whitespace-nowrap text-xs text-[#7a585f]">
                        {new Date(review.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status Badge */}
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

                      {/* Pinned Status */}
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

                      {/* Action Buttons */}
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
