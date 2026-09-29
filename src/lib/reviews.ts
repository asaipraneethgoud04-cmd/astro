import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ReviewStatus = "pending" | "accepted" | "rejected";

export type Review = {
  id: string;
  name: string;
  city: string;
  quote: string;
  status: ReviewStatus;
  pinned: boolean;
  created_at: string;
};

export type PinnedReview = Pick<Review, "id" | "name" | "city" | "quote">;

export async function getAcceptedReviews(): Promise<Pick<Review, "id" | "name" | "city" | "quote" | "pinned">[]> {
  noStore();
  try {
    const supabase = await createClient();
    const withPin = await supabase
      .from("reviews")
      .select("id, name, city, quote, pinned")
      .eq("status", "accepted")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (!withPin.error && withPin.data) {
      return withPin.data as Pick<Review, "id" | "name" | "city" | "quote" | "pinned">[];
    }

    const fallback = await supabase
      .from("reviews")
      .select("id, name, city, quote")
      .eq("status", "accepted")
      .order("created_at", { ascending: false });

    if (fallback.error || !fallback.data) return [];
    return fallback.data.map((item) => ({ ...item, pinned: false }));
  } catch {
    return [];
  }
}

export async function getPinnedReviews(): Promise<PinnedReview[]> {
  noStore();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("id, name, city, quote")
      .eq("status", "accepted")
      .eq("pinned", true)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data;
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
  const withPin = await supabase
    .from("reviews")
    .select("id, name, city, quote, status, pinned, created_at")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (!withPin.error) {
    return { reviews: (withPin.data ?? []) as Review[], error: null, pinReady: true };
  }

  const fallback = await supabase
    .from("reviews")
    .select("id, name, city, quote, status, created_at")
    .order("created_at", { ascending: false });

  if (fallback.error) {
    return { reviews: [], error: fallback.error.message, pinReady: false };
  }

  return {
    reviews: (fallback.data ?? []).map((review) => ({ ...review, pinned: false })) as Review[],
    error: null,
    pinReady: false,
  };
}
