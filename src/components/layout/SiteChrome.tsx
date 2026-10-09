"use client";

import React from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PinnedReviewBar from "@/components/layout/PinnedReviewBar";
import type { PinnedReview } from "@/lib/reviews";

const FloatingActions = dynamic(() => import("@/components/home/FloatingActions"), {
  ssr: false,
});

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
      <main
        className={`flex-grow ${hasPinned ? "pt-10" : ""}`}
        style={{ "--chrome-top": hasPinned ? "2.5rem" : "0px" } as React.CSSProperties}
      >
        {children}
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
