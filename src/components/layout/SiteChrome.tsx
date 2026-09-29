"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/home/FloatingActions";
import PinnedReviewBar from "@/components/layout/PinnedReviewBar";
import type { PinnedReview } from "@/lib/reviews";

export default function SiteChrome({
  children,
  pinnedReviews,
}: {
  children: React.ReactNode;
  pinnedReviews: PinnedReview[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const hasPinned = pinnedReviews.length > 0;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {hasPinned ? <PinnedReviewBar reviews={pinnedReviews} /> : null}
      <Navbar offsetTop={hasPinned} />
      <main className={`flex-grow ${hasPinned ? "pt-10" : ""}`}>{children}</main>
      <Footer />
      <FloatingActions />
    </>
  );
}
