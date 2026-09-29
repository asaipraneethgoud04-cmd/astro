import type { Metadata } from "next";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = {
  title: "Share Your Experience | TalkAstrologer.com",
  description: "Share your consultation experience. Accepted reviews appear in Voices of the Blessed.",
};

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-[#f6f0e4] px-4 page-top page-bottom">
      <div className="mx-auto max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#aa8016]">
          Voices of the Blessed
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#38070e]">
          Share your experience
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#614b4f]">
          Tell us about your consultation. Your review is read first, and it appears on the homepage only after it is accepted.
        </p>
        <div className="content-gap">
          <ReviewForm />
        </div>
      </div>
    </div>
  );
}
