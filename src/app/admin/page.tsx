import { getAllReviews } from "@/lib/reviews";
import { requireAdmin } from "./session";
import ReviewModeration from "./ReviewModeration";

export default async function AdminPage() {
  await requireAdmin();
  const { reviews, error, pinReady } = await getAllReviews();

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#aa8016]">Voices of the Blessed</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-[#38070e]">Reviews Management</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#614b4f]">
          Moderate client testimonials. Accepted reviews appear on the homepage. Reviews with &quot;Above Header&quot; enabled rotate in the top announcement bar.
        </p>
      </header>

      {error ? (
        <div className="mt-8 rounded-[22px] border border-[#e5d0ad] bg-white p-6 text-sm leading-relaxed text-[#3b171c]">
          <p className="font-semibold text-[#38070e]">The reviews table is not ready yet.</p>
          <p className="mt-2">
            Open the Supabase SQL editor and run <span className="font-medium">supabase/schema.sql</span>.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          {!pinReady ? (
            <div className="mb-6 rounded-[22px] border border-[#e5d0ad] bg-white p-5 text-sm leading-relaxed text-[#3b171c]">
              <p className="font-semibold text-[#38070e]">Featuring reviews is not ready yet.</p>
              <p className="mt-2">Run this once in the Supabase SQL editor:</p>
              <p className="mt-2 rounded-xl bg-[#f6f0e4] px-3 py-2 font-mono text-xs text-[#38070e]">
                alter table public.reviews add column if not exists pinned boolean not null default false;
              </p>
            </div>
          ) : null}
          <ReviewModeration reviews={reviews} pinReady={pinReady} />
        </div>
      )}
    </div>
  );
}
