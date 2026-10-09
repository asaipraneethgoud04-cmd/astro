import { unstable_noStore as noStore } from "next/cache";
import { createClient, createPublicClient } from "@/lib/supabase/server";

export type ReviewStatus = "pending" | "accepted" | "rejected";

export type Review = {
  id: string;
  name: string;
  city: string;
  quote: string;
  rating?: number;
  service?: string | null;
  status: ReviewStatus;
  pinned: boolean;
  created_at: string;
};

export type PinnedReview = Pick<Review, "id" | "name" | "city" | "quote"> & {
  rating?: number;
  service?: string | null;
};

export async function getAcceptedReviews(): Promise<Pick<Review, "id" | "name" | "city" | "quote" | "pinned" | "rating" | "service">[]> {
  noStore();
  try {
    const supabase = createPublicClient();
    const withPinAndRating = await supabase
      .from("reviews")
      .select("id, name, city, quote, pinned, rating, service")
      .eq("status", "accepted")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (!withPinAndRating.error && withPinAndRating.data) {
      return (withPinAndRating.data as any[]).map((r) => ({
        ...r,
        rating: typeof r.rating === "number" ? r.rating : 5,
        service: r.service || null,
      })) as Pick<Review, "id" | "name" | "city" | "quote" | "pinned" | "rating" | "service">[];
    }

    // fallback without rating/service if columns do not exist
    const fallback = await supabase
      .from("reviews")
      .select("id, name, city, quote")
      .eq("status", "accepted")
      .order("created_at", { ascending: false });

    if (fallback.error || !fallback.data) return [];
    return fallback.data.map((item) => ({ ...item, pinned: false, rating: 5, service: null }));
  } catch {
    return [];
  }
}

export async function getPinnedReviews(): Promise<PinnedReview[]> {
  noStore();
  try {
    const supabase = createPublicClient();
    const withRating = await supabase
      .from("reviews")
      .select("id, name, city, quote, rating, service")
      .eq("status", "accepted")
      .eq("pinned", true)
      .order("created_at", { ascending: false });

    if (!withRating.error && withRating.data) {
      return (withRating.data as any[]).map((r) => ({
        ...r,
        rating: typeof r.rating === "number" ? r.rating : 5,
        service: r.service || null,
      })) as PinnedReview[];
    }

    // fallback without rating/service
    const fallback = await supabase
      .from("reviews")
      .select("id, name, city, quote")
      .eq("status", "accepted")
      .eq("pinned", true)
      .order("created_at", { ascending: false });

    if (fallback.error || !fallback.data) return [];
    return fallback.data.map((r) => ({ ...r, rating: 5, service: null }));
  } catch {
    return [];
  }
}

export async function getAllReviews(): Promise<{
  reviews: Review[];
  error: string | null;
  pinReady: boolean;
}> {
  noStore();
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return { reviews: [], error: "Unauthorized", pinReady: false };
  }

  // Attempt with pinned, rating, service
  const withPinAndRating = await supabase
    .from("reviews")
    .select("id, name, city, quote, status, pinned, created_at, rating, service")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (!withPinAndRating.error) {
    const formatted = (withPinAndRating.data ?? []).map((review: any) => ({
      ...review,
      rating: typeof review.rating === "number" ? review.rating : 5,
      service: review.service || null,
    })) as Review[];
    return { reviews: formatted, error: null, pinReady: true };
  }

  // Fallback with pinned only
  const withPin = await supabase
    .from("reviews")
    .select("id, name, city, quote, status, pinned, created_at")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (!withPin.error) {
    return {
      reviews: (withPin.data ?? []).map((review) => ({
        ...review,
        rating: 5,
        service: null,
      })) as Review[],
      error: null,
      pinReady: true,
    };
  }

  // Fallback base
  const fallback = await supabase
    .from("reviews")
    .select("id, name, city, quote, status, created_at")
    .order("created_at", { ascending: false });

  if (fallback.error) {
    return { reviews: [], error: fallback.error.message, pinReady: false };
  }

  return {
    reviews: (fallback.data ?? []).map((review) => ({
      ...review,
      pinned: false,
      rating: 5,
      service: null,
    })) as Review[],
    error: null,
    pinReady: false,
  };
}
