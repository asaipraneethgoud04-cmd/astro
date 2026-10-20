import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { getPinnedReviews } from "@/lib/reviews";

const shivaraja = localFont({
  variable: "--font-shivaraja",
  display: "swap",
  src: "./fonts/Shivaraja.ttf",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://talkastrologer.com"),
  title: "TalkAstrologer | Six Generations of Ancestral Vedic Astrology | Texas, USA",
  description:
    "Rooted in a revered six-generation ancestral Vedic lineage. Supportive astrology guidance, horoscope reading, marriage compatibility, career direction, and spiritual wellness in Texas and across the USA.",
  keywords: [
    "TalkAstrologer",
    "Six Generation Astrologer",
    "Ancestral Vedic Astrology",
    "Texas Astrologer",
    "Dallas Astrology",
    "Houston Astrologer",
    "Horoscope Reading",
    "Love & Marriage Compatibility",
    "Career Astrology",
    "Palmistry & Numerology",
  ],
  icons: {
    icon: [
      { url: "/images/astrologo.webp", type: "image/webp" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/images/astrologo.webp", type: "image/webp" },
    ],
    shortcut: "/images/astrologo.webp",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pinnedReviews = await getPinnedReviews();

  return (
    <html lang="en" className={shivaraja.variable} suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-[#fdfaf4] text-[#2a1114] antialiased"
        suppressHydrationWarning
      >
        <SiteChrome pinnedReviews={pinnedReviews}>{children}</SiteChrome>
      </body>
    </html>
  );
}
