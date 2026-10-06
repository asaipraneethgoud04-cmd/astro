import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Calendar,
  Phone,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Clock,
  Compass,
  Heart,
  ChevronRight,
  Flame,
  Star,
  BookOpen,
} from "lucide-react";
import {
  serviceDetailsData,
  getServiceDetail,
  getRelatedServices,
  getAllServiceDetails,
} from "@/data/serviceDetails";
import ImageToneCard from "@/components/ui/ImageToneCard";

interface ServicePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const allServices = getAllServiceDetails();
  return allServices.map((service) => ({
    id: service.id,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { id } = await params;
  const service = getServiceDetail(id);

  if (!service) {
    return {
      title: "Service Not Found | TalkAstrologer",
    };
  }

  return {
    title: `${service.title} | TalkAstrologer - Vedic Astrology Guidance`,
    description: service.metaDescription,
    keywords: service.keywords,
    openGraph: {
      title: `${service.title} | TalkAstrologer`,
      description: service.metaDescription,
      images: [
        {
          url: service.imageUrl,
          width: 800,
          height: 600,
          alt: service.title,
        },
      ],
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { id } = await params;
  const service = getServiceDetail(id);

  if (!service) {
    notFound();
  }

  const relatedServices = getRelatedServices(service.id, 3);

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfaf4] text-[#2a1114]">
      {/* ─────────────────────────────────────────────────────────────
          1. BREADCRUMBS BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="page-top bg-[#f8f2e4] border-b border-[#ebdcc2]">
        <div className="site-container py-3">
          <nav
            aria-label="Breadcrumbs"
            className="flex flex-wrap items-center gap-2 text-xs text-[#6e5559]"
          >
            <Link
              href="/"
              className="hover:text-[#38070e] transition-colors font-medium"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#b88e39]" />
            <Link
              href="/services"
              className="hover:text-[#38070e] transition-colors font-medium"
            >
              Sacred Services
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#b88e39]" />
            <span className="text-[#9e701e] font-medium">
              {service.category}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#b88e39]" />
            <span className="font-semibold text-[#38070e] truncate max-w-[220px] sm:max-w-none">
              {service.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="site-container section-y">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Title, Tagline, Trust Badges, CTAs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Category Pill with Celestial Diamonds */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#faf2e4] border border-[#ebd6b0] text-[#9e701e] text-xs font-semibold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#b88e39]" />
              <span>{service.category}</span>
              <span className="text-[10px] text-[#b88e39]">✦</span>
              <span>Ancestral Jyotish</span>
            </div>

            {/* Main Grand Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold text-[#38070e] leading-[1.18] tracking-tight">
              {service.title}
            </h1>

            {/* Hero Subtitle / Tagline */}
            <p className="font-serif text-base sm:text-lg text-[#8b1827] italic font-medium leading-relaxed">
              {service.heroTagline}
            </p>

            {/* Short Intro Overview */}
            <p className="text-sm sm:text-base text-[#5c474b] leading-relaxed">
              {service.shortDescription}
            </p>

            {/* Trust Highlight Badge */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#faf6ee] border border-[#ebdcc2]">
                <ShieldCheck className="w-4 h-4 text-[#9e701e] shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-[#420813]">
                  30+ Years & 6 Generations of Lineage
                </span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-4">
              <Link
                href={`/book-appointment?service=${service.id}`}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#38070e] hover:bg-[#200408] text-white font-serif font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all"
              >
                <Calendar className="w-4 h-4 text-[#f6e27a]" />
                <span>Book This Consultation</span>
              </Link>

              <a
                href="tel:+12146699699"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#faf2e4] hover:bg-[#f3e7d0] text-[#420813] border border-[#ebd6b0] font-semibold text-xs sm:text-sm transition-all"
              >
                <Phone className="w-4 h-4 text-[#8b1827]" />
                <span>Call +1 214 669 9699</span>
              </a>

              <a
                href="https://wa.me/+12146699699"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: High-Res Service Image with Vedic Gold Ornamental Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden border-2 border-[#d4af37]/70 bg-[#240409] shadow-[0_20px_50px_rgba(36,4,9,0.22)] group">
              {/* Corner Ornaments */}
              {[
                "top-2 left-2 border-t-2 border-l-2",
                "top-2 right-2 border-t-2 border-r-2",
                "bottom-2 left-2 border-b-2 border-l-2",
                "bottom-2 right-2 border-b-2 border-r-2",
              ].map((pos) => (
                <span
                  key={pos}
                  aria-hidden="true"
                  className={`pointer-events-none absolute w-5 h-5 border-[#f6e27a]/80 z-20 rounded-xs ${pos}`}
                />
              ))}

              <Image
                src={service.imageUrl}
                alt={service.title}
                fill
                priority
                unoptimized
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#240409] via-transparent to-black/20" />

              {/* Floating Badge at Bottom */}
              <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-2xl bg-[#240409]/90 backdrop-blur-md border border-[#c59b27]/60 text-center shadow-lg">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#f6e27a] font-semibold">
                  Ancestral Consultation
                </p>
                <p className="font-serif text-sm font-bold text-white mt-0.5">
                  Private Session with Guruji
                </p>
                <p className="text-[11px] text-[#f5ebd9]/80 mt-0.5">
                  Phone · WhatsApp Video · In-Person in Texas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. IN-DEPTH SACRED OVERVIEW
      ───────────────────────────────────────────────────────────── */}
      <section className="section-y bg-[#faf6ee] border-y border-[#ebdcc2]">
        <div className="site-container">
          <div className="w-full space-y-6">
            <div className="text-center space-y-2 header-gap">
              <span className="text-[#a07421] text-xs font-semibold tracking-[0.25em] uppercase flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#b88e39]" />
                Ancestral Wisdom
                <Sparkles className="w-3.5 h-3.5 text-[#b88e39]" />
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#38070e] tracking-tight">
                Understanding This Sacred Guidance
              </h2>
              <div className="flex items-center justify-center gap-3 pt-1">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#b88e39]" />
                <span className="text-xs text-[#b88e39]">❦</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#b88e39]" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#ebdcc2] p-6 sm:p-9 shadow-xs space-y-4 text-sm sm:text-base text-[#5c474b] leading-relaxed">
              {service.overview.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3B. SPECIALIST ASTROLOGER EDITORIAL GUIDE (When Available)
      ───────────────────────────────────────────────────────────── */}
      {service.specialistArticle && (
        <section className="section-y bg-[#fdfaf4] border-b border-[#ebdcc2]">
          <div className="site-container">
            <div className="w-full space-y-8">
              {/* Header */}
              <div className="text-center space-y-3 header-gap">
                <span className="text-[#a07421] text-xs font-semibold tracking-[0.25em] uppercase flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#b88e39]" />
                  Renowned Astrology Guidance
                  <Sparkles className="w-3.5 h-3.5 text-[#b88e39]" />
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#38070e] tracking-tight">
                  {service.specialistArticle.title}
                </h2>
                <div className="flex items-center justify-center gap-3 pt-1">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#b88e39]" />
                  <span className="text-xs text-[#b88e39]">❦</span>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#b88e39]" />
                </div>
              </div>

              {/* Intro Card */}
              <div className="rounded-2xl border border-[#ebd6b0] bg-[#faf2e4] p-6 sm:p-8 space-y-4 shadow-xs">
                {service.specialistArticle.intro.map((p, idx) => (
                  <p key={idx} className="text-sm sm:text-[15px] text-[#4d363a] leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {/* Dynamic Sections */}
              {service.specialistArticle.sections.map((sec, secIdx) => (
                <div
                  key={secIdx}
                  className="rounded-2xl border border-[#ebdcc2] bg-white p-6 sm:p-8 space-y-5 shadow-xs"
                >
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#38070e] border-b border-[#ebdcc2] pb-3">
                    {sec.heading}
                  </h3>

                  {sec.content.map((p, pIdx) => (
                    <p key={pIdx} className="text-sm text-[#5c474b] leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {sec.features && sec.features.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {sec.features.map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-4 rounded-xl bg-[#faf6ee] border border-[#ebdcc2] space-y-1.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[#8b1827] text-sm font-bold">✦</span>
                            <h4 className="font-serif text-base sm:text-lg font-bold text-[#420813]">
                              {feat.title}
                            </h4>
                          </div>
                          <p className="text-xs text-[#634e52] leading-relaxed pl-5">
                            {feat.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Contact Callout Banner */}
              {service.specialistArticle.ctaHeading && (
                <div className="rounded-2xl bg-[#240409] text-[#f6eedc] p-6 sm:p-8 text-center space-y-4 shadow-lg border border-[#c59b27]/40">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#f6e27a]">
                    {service.specialistArticle.ctaHeading}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#f5ebd9]/90 max-w-2xl mx-auto leading-relaxed">
                    {service.specialistArticle.ctaText}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Link
                      href={`/book-appointment?service=${service.id}`}
                      className="px-6 py-3 rounded-full bg-[#fdfaf4] hover:bg-[#f6e27a] text-[#240409] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md"
                    >
                      Schedule Consultation
                    </Link>
                    <a
                      href="tel:+12146699699"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/60 hover:border-white text-white hover:bg-white/10 text-xs sm:text-sm transition-all"
                    >
                      <Phone className="w-4 h-4 text-[#f6e27a]" />
                      Call +1 214 669 9699
                    </a>
                    <a
                      href="https://wa.me/+12146699699"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. WHO THIS CONSULTATION IS FOR (SITUATIONS GRID)
      ───────────────────────────────────────────────────────────── */}
      <section className="site-container section-y">
        <div className="text-center max-w-3xl mx-auto space-y-3 header-gap">
          <span className="text-[#a07421] text-xs font-semibold tracking-[0.25em] uppercase flex items-center justify-center gap-2">
            <Heart className="w-3.5 h-3.5 text-[#8b1827]" />
            Seeker Situations
            <Heart className="w-3.5 h-3.5 text-[#8b1827]" />
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#38070e] tracking-tight">
            Key Life Questions Addressed
          </h2>
          <p className="text-xs sm:text-sm text-[#5d474b] max-w-xl mx-auto">
            These are among the most frequent life crossroads and pressing concerns
            seekers bring to our ancestral consultation desk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 w-full">
          {service.situations.map((item, index) => (
            <div
              key={index}
              className="p-5 sm:p-6 rounded-2xl bg-[#faf2e4] border border-[#ebd6b0] hover:border-[#b88e39] transition-all shadow-xs space-y-2 group"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-[#38070e] text-[#f6e27a] font-serif text-xs font-bold flex items-center justify-center shrink-0">
                  0{index + 1}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#420813] group-hover:text-[#8b1827] transition-colors">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#5c474b] leading-relaxed pl-10">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. THE VEDIC ASTROLOGICAL PERSPECTIVE
      ───────────────────────────────────────────────────────────── */}
      <section className="section-y bg-[#f5ede0] border-y border-[#ebdcc2]">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            {/* Left 7 cols: In-Depth Vedic Explanation */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[#a07421] text-xs font-semibold tracking-[0.25em] uppercase flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[#b88e39]" />
                Jyotish Shastra Foundation
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#38070e] tracking-tight">
                {service.astrologicalSignificance.title}
              </h2>
              <p className="text-sm text-[#5c474b] leading-relaxed">
                {service.astrologicalSignificance.explanation}
              </p>
              <div className="p-4 rounded-xl bg-white border border-[#ebd6b0] space-y-2">
                <h3 className="font-serif text-sm uppercase tracking-wider text-[#8b1827] font-bold">
                  The Ancestral Approach
                </h3>
                <p className="text-xs text-[#6e575b] leading-relaxed">
                  We look at the whole horoscope rather than treating one planetary position in isolation. Planetary transits, Dasha timing, and the Navamsha chart (D9) work as an interconnected system.
                </p>
              </div>
            </div>

            {/* Right 5 cols: Planetary Factors Card */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#ebd6b0] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#ebd6b0]">
                <Sparkles className="w-4 h-4 text-[#c59b27]" />
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#420813]">
                  Key Astrological Factors
                </h3>
              </div>
              <ul className="space-y-3">
                {service.astrologicalSignificance.planetaryFactors.map(
                  (factor, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#523d41]">
                      <span className="text-[#c59b27] font-bold mt-0.5">◆</span>
                      <span className="leading-relaxed">{factor}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. WHAT IS COVERED IN YOUR CONSULTATION
      ───────────────────────────────────────────────────────────── */}
      <section className="site-container section-y">
        <div className="text-center max-w-3xl mx-auto space-y-3 header-gap">
          <span className="text-[#a07421] text-xs font-semibold tracking-[0.25em] uppercase flex items-center justify-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
            Session Deliverables
            <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#38070e] tracking-tight">
            What Your Consultation Includes
          </h2>
          <p className="text-xs sm:text-sm text-[#5d474b] max-w-xl mx-auto">
            Every session is thorough, focused, and directly actionable. Here is
            what you will experience in your 30 to 45-minute private consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
          {service.consultationIncludes.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#ebdcc2] p-5 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#240409] text-[#f6e27a] font-serif text-xs font-bold mb-3 shadow-xs">
                  {idx + 1}
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#420813] mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5d474b] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. TRADITIONAL REMEDIES & SPIRITUAL SHANTI
      ───────────────────────────────────────────────────────────── */}
      <section className="section-y bg-[#faf2e4] border-y border-[#ebd6b0]">
        <div className="site-container">
          <div className="w-full space-y-6">
            <div className="text-center space-y-2 header-gap">
              <span className="text-[#a07421] text-xs font-semibold tracking-[0.25em] uppercase flex items-center justify-center gap-2">
                <Flame className="w-3.5 h-3.5 text-[#8b1827]" />
                Traditional Shastric Solutions
                <Flame className="w-3.5 h-3.5 text-[#8b1827]" />
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#38070e] tracking-tight">
                Authentic Vedic Remedies
              </h2>
              <p className="text-xs sm:text-sm text-[#5d474b] max-w-xl mx-auto">
                Remedies in Vedic astrology are spiritual disciplines designed to
                cleanse karmic static and invoke divine grace—never to spread fear.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {service.remedies.map((rem, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#ebd6b0] p-5 shadow-xs space-y-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#faf6ee] text-[#9e701e] flex items-center justify-center font-serif text-xs font-bold">
                    ✦
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#420813]">
                    {rem.title}
                  </h3>
                  <p className="text-xs text-[#5c474b] leading-relaxed">
                    {rem.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Sattvic Ethics Guarantee Callout */}
            <div className="p-4 rounded-xl bg-white/80 border border-[#c59b27]/40 flex items-start gap-3 text-xs text-[#5d474b]">
              <ShieldCheck className="w-4 h-4 text-[#9e701e] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Our Sacred Ethics Vow:</strong> At TalkAstrologer, remedies
                are prescribed strictly according to classical Vedic Shastras. We
                never employ fear-based tactics, manipulative rituals, or exorbitant
                commercial demands. All remedies are sattvic, peaceful, and optional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. SEEKER TESTIMONIAL & EXPERIENCE
      ───────────────────────────────────────────────────────────── */}
      <section className="site-container section-y">
        <div className="w-full">
          <div className="rounded-3xl bg-[#240409] text-[#f6eedc] p-7 sm:p-10 relative overflow-hidden shadow-xl">
            {/* Background Celestial Ornament */}
            <div className="absolute right-4 top-4 text-5xl font-serif text-[#d4af37]/15 select-none pointer-events-none">
              ❝
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-1.5 text-[#f6e27a]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs text-[#f5ebd9]/80 ml-2 font-medium">
                  Verified Seeker Experience
                </span>
              </div>

              <blockquote className="font-serif text-base sm:text-lg leading-relaxed text-[#fdfaf4] italic">
                &ldquo;{service.testimonial.quote}&rdquo;
              </blockquote>

              <div className="pt-2 border-t border-[#c59b27]/30 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-[#f6e27a]">
                    {service.testimonial.client}
                  </p>
                  <p className="text-[#f5ebd9]/70 text-[11px]">
                    {service.testimonial.location}
                  </p>
                </div>
                <span className="text-[11px] uppercase tracking-wider text-[#d4af37]/80">
                  {service.title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. FREQUENTLY ASKED QUESTIONS (FAQ)
      ───────────────────────────────────────────────────────────── */}
      <section className="section-y bg-[#faf6ee] border-t border-[#ebdcc2]">
        <div className="site-container">
          <div className="w-full space-y-6">
            <div className="text-center space-y-2 header-gap">
              <span className="text-[#a07421] text-xs font-semibold tracking-[0.25em] uppercase flex items-center justify-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-[#b88e39]" />
                Common Questions
                <HelpCircle className="w-3.5 h-3.5 text-[#b88e39]" />
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#38070e] tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {service.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-[#ebdcc2] p-5 shadow-xs space-y-2"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[#b88e39] font-bold text-sm shrink-0 mt-0.5">
                      Q:
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#3a0812]">
                      {faq.q}
                    </h3>
                  </div>
                  <div className="flex items-start gap-3 pl-6 text-xs sm:text-sm text-[#584448] leading-relaxed">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/faq"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8b1827] hover:underline"
              >
                <span>Have more questions? Browse our complete FAQ library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. RELATED SACRED SERVICES
      ───────────────────────────────────────────────────────────── */}
      <section className="site-container section-y">
        <div className="text-center max-w-3xl mx-auto space-y-3 header-gap">
          <span className="text-[#a07421] text-xs font-semibold tracking-[0.25em] uppercase flex items-center justify-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#c59b27]" />
            Complementary Consultations
            <Compass className="w-3.5 h-3.5 text-[#c59b27]" />
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#38070e] tracking-tight">
            Explore Related Services
          </h2>
          <p className="text-xs sm:text-sm text-[#5d474b]">
            Seekers who consult for {service.title} often find deep clarity in
            these interrelated Vedic disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {relatedServices.map((rel) => (
            <ImageToneCard
              key={rel.id}
              imageUrl={rel.imageUrl}
              imageAlt={rel.title}
              title={rel.title}
              description={rel.description}
              meta={rel.category}
              href={`/services/${rel.id}`}
              ctaLabel="Explore Guidance"
              iconName={rel.iconName}
            />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. GLOBAL BEGIN YOUR JOURNEY TO CLARITY BANNER
      ───────────────────────────────────────────────────────────── */}
      <section className="page-bottom bg-[#fdfaf4]">
        <div className="site-container">
          <div className="rounded-2xl bg-[#2d1814] py-12 px-6 sm:px-12 text-center text-white shadow-xl space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#fdfaf4]">
              Ready to Seek Guidance for {service.title}?
            </h2>
            <p className="text-xs sm:text-sm text-[#f5ebd9]/80 max-w-xl mx-auto leading-relaxed">
              Schedule your confidential consultation with Guruji today. Available
              via Phone, WhatsApp, and in-person in Frisco, Texas.
            </p>

            {/* 3 Buttons matching website theme */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href={`/book-appointment?service=${service.id}`}
                className="px-6 py-3 rounded-full bg-[#fdfaf4] hover:bg-[#f6e27a] text-[#2d1814] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md"
              >
                Book Appointment
              </Link>
              <a
                href="tel:+12146699699"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/60 hover:border-white text-white hover:bg-white/10 text-xs sm:text-sm tracking-wider uppercase transition-all"
              >
                <Phone className="w-4 h-4 text-[#f6e27a]" />
                Call Now
              </a>
              <a
                href="https://wa.me/+12146699699"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
