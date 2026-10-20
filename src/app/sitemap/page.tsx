import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Compass,
  Sparkles,
  ExternalLink,
  BookOpen,
  Heart,
  Briefcase,
  Moon,
  Shield,
  Phone,
  Calendar,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { servicesData } from "@/data/services";
import CtaBannerSection from "@/components/home/CtaBannerSection";

export const metadata: Metadata = {
  title: "Site Map | TalkAstrologer Directory & Navigation",
  description:
    "Complete directory of TalkAstrologer pages, 16 sacred Vedic astrology services, appointment booking, contact details, and client resources.",
  alternates: {
    canonical: "https://talkastrologer.com/sitemap",
  },
};

const mainPages = [
  {
    href: "/",
    title: "Home",
    description: "Welcome to TalkAstrologer. 30+ years and 6 generations of sacred ancestral Vedic astrology guidance.",
  },
  {
    href: "/about",
    title: "About Us",
    description: "Our authentic Vedic lineage, ancestral legacy, philosophy, and spiritual code of conduct.",
  },
  {
    href: "/services",
    title: "Sacred Services",
    description: "Overview of all 16 personalized astrological readings, compatibility consultations, and shastric remedies.",
  },
  {
    href: "/book-appointment",
    title: "Book Appointment",
    description: "Schedule a confidential phone, WhatsApp, or in-person consultation in Frisco, TX or nationwide.",
  },
  {
    href: "/contact",
    title: "Contact Us",
    description: "Reach our consultation team directly via phone (+1 214 669 9699), email, or office directions.",
  },
  {
    href: "/review",
    title: "Client Reviews",
    description: "Read genuine seeker testimonials and experiences from clients across Texas, USA, and worldwide.",
  },
  {
    href: "/faq",
    title: "Frequently Asked Questions",
    description: "Common questions regarding horoscope readings, birth details, online sessions, and remedies.",
  },
];

const legalPages = [
  {
    href: "/terms",
    title: "Terms of Service",
    description: "Terms governing our astrological advisory consultations and digital platform services.",
  },
  {
    href: "/privacy-policy",
    title: "Privacy Policy",
    description: "How we safeguard your birth data, personal questions, and privacy with strict confidentiality.",
  },
  {
    href: "/disclaimer",
    title: "Astrology Disclaimer",
    description: "Vedic advisory principles, free will, self-reflection, and professional compliance guidelines.",
  },
  {
    href: "/sitemap.xml",
    title: "XML Sitemap (Search Engines)",
    description: "Standard machine-readable XML feed of all active site routes and service endpoints for search engine indexing.",
    isExternal: true,
  },
];

export default function SitemapPage() {
  // Group services by category
  const servicesByCategory = servicesData.reduce((acc, service) => {
    const cat = service.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {} as Record<string, typeof servicesData>);

  const categoryIcons: Record<string, React.ReactNode> = {
    "Love & Marriage": <Heart className="w-5 h-5 text-[#f6e27a]" />,
    "Career & Business": <Briefcase className="w-5 h-5 text-[#f6e27a]" />,
    "Astrology & Charts": <Moon className="w-5 h-5 text-[#f6e27a]" />,
    "Spiritual & Wellness": <Sparkles className="w-5 h-5 text-[#f6e27a]" />,
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <section className="relative page-top section-b bg-[#240409] text-white overflow-hidden">
        <div className="absolute inset-0 bg-hero-shiva pointer-events-none opacity-40" />
        <div className="relative z-10 site-container text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f6e27a]/40 bg-[#c59b27]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#f6e27a] shadow-[0_0_12px_rgba(246,226,122,0.2)]">
            <Compass className="w-3.5 h-3.5" />
            <span>Complete Website Directory</span>
            <Compass className="w-3.5 h-3.5" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            TalkAstrologer Site Map
          </h1>

          <p className="max-w-2xl mx-auto text-[#ebd8c5] text-sm sm:text-base leading-relaxed font-light">
            Quickly navigate our complete catalog of 16 sacred Vedic astrology services, direct consultation booking, customer support, and helpful guides.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-[#f6e27a]">
            <Link
              href="#main-pages"
              className="rounded-full border border-[#f6e27a]/30 bg-[#20050a]/80 px-3 py-1 hover:border-[#f6e27a] hover:bg-[#c59b27]/20 transition-colors"
            >
              Main Pages
            </Link>
            <Link
              href="#astrology-services"
              className="rounded-full border border-[#f6e27a]/30 bg-[#20050a]/80 px-3 py-1 hover:border-[#f6e27a] hover:bg-[#c59b27]/20 transition-colors"
            >
              All 16 Services
            </Link>
            <Link
              href="#legal-pages"
              className="rounded-full border border-[#f6e27a]/30 bg-[#20050a]/80 px-3 py-1 hover:border-[#f6e27a] hover:bg-[#c59b27]/20 transition-colors"
            >
              Legal &amp; XML
            </Link>
          </div>
        </div>
      </section>

      {/* Main Sitemap Content */}
      <section className="section-y bg-[#fdfbf7]">
        <div className="site-container max-w-6xl mx-auto space-y-16">
          {/* Section 1: Main Pages */}
          <div id="main-pages" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3 border-b border-[#c59b27]/30 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#240409] text-[#f6e27a] shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#20050a]">
                  Core Pages &amp; Portals
                </h2>
                <p className="text-xs sm:text-sm text-[#735e52]">
                  Direct access to main destination pages across TalkAstrologer
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mainPages.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex flex-col justify-between rounded-xl border border-[#c59b27]/25 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c59b27] hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-lg font-bold text-[#20050a] group-hover:text-[#941328] transition-colors">
                        {item.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#c59b27] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs leading-relaxed text-[#685347]">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#f1e6d4] flex items-center text-[11px] font-semibold text-[#a07421] group-hover:text-[#20050a]">
                    <span>Visit page</span>
                    <span className="ml-1 text-[13px]">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Section 2: All 16 Sacred Services Categorized */}
          <div id="astrology-services" className="space-y-8 scroll-mt-24">
            <div className="flex items-center gap-3 border-b border-[#c59b27]/30 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#240409] text-[#f6e27a] shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#20050a]">
                  16 Sacred Vedic Services &amp; Consultations
                </h2>
                <p className="text-xs sm:text-sm text-[#735e52]">
                  In-depth personal readings, relationship harmony, career insight, and spiritual remedies
                </p>
              </div>
            </div>

            <div className="space-y-10">
              {Object.entries(servicesByCategory).map(([category, items]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#240409] text-[#f6e27a]">
                      {categoryIcons[category] || <Sparkles className="w-4 h-4" />}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#20050a]">
                      {category}
                    </h3>
                    <span className="text-xs font-semibold text-[#8c7465] bg-[#ebd8c5]/40 px-2 py-0.5 rounded-full">
                      {items.length} {items.length === 1 ? "Service" : "Services"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((service) => (
                      <Link
                        key={service.id}
                        href={`/services/${service.id}`}
                        className="group flex flex-col justify-between rounded-xl border border-[#c59b27]/25 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c59b27] hover:shadow-md"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-base font-bold text-[#20050a] group-hover:text-[#941328] transition-colors">
                              {service.title}
                            </span>
                            <ChevronRight className="w-4 h-4 text-[#c59b27] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                          <p className="text-xs leading-relaxed text-[#685347] line-clamp-3">
                            {service.description}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-[#f1e6d4] flex items-center justify-between text-[11px] font-semibold text-[#a07421]">
                          <span>Read full guide &amp; book</span>
                          <span className="text-[13px] group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Legal, Policy & XML Search Engine Feeds */}
          <div id="legal-pages" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3 border-b border-[#c59b27]/30 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#240409] text-[#f6e27a] shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#20050a]">
                  Compliance, Policies &amp; XML Feed
                </h2>
                <p className="text-xs sm:text-sm text-[#735e52]">
                  Transparent operational guidelines, client confidentiality commitments, and search index files
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {legalPages.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noopener noreferrer" : undefined}
                  className="group flex flex-col justify-between rounded-xl border border-[#c59b27]/25 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c59b27] hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-base font-bold text-[#20050a] group-hover:text-[#941328] transition-colors">
                        {item.title}
                      </span>
                      {item.isExternal ? (
                        <ExternalLink className="w-4 h-4 text-[#c59b27]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#c59b27] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-[#685347]">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#f1e6d4] flex items-center text-[11px] font-semibold text-[#a07421]">
                    <span>{item.isExternal ? "Open XML feed" : "Read policy"}</span>
                    <span className="ml-1 text-[13px]">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <CtaBannerSection last />
    </div>
  );
}
