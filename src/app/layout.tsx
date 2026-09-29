import type { Metadata } from "next";
import { Cinzel, Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { getPinnedReviews } from "@/lib/reviews";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const shivaraja = localFont({
  variable: "--font-shivaraja",
  display: "swap",
  src: "./fonts/Shivaraja.ttf",
});

export const metadata: Metadata = {
  title: "TalkAstrologer.com | Six Generations of Ancestral Vedic Astrology | Texas, USA",
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
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pinnedReviews = await getPinnedReviews();

  return (
    <html lang="en" className={`${cinzel.variable} ${outfit.variable} ${shivaraja.variable}`} suppressHydrationWarning>
      <body
        className="min-h-screen flex flex-col bg-[#fdfaf4] text-[#2a1114] antialiased"
        suppressHydrationWarning
      >
        <SiteChrome pinnedReviews={pinnedReviews}>{children}</SiteChrome>
      </body>
    </html>
  );
}
