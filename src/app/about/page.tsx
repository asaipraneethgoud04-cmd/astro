import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Calendar,
  MessageSquare,
  MapPin,
  Globe,
  Heart,
  Briefcase,
  Home as HomeIcon,
  Shield,
  Lock,
  ScrollText,
  LayoutGrid,
  Languages,
  Sparkles,
  Compass,
  CheckCircle2,
  Users,
  Award,
} from "lucide-react";

export const metadata = {
  title: "About Us | TalkAstrologer.com - 22+ Years & 6 Generations of Ancestral Vedic Wisdom",
  description:
    "Discover TalkAstrologer.com. Combining 22+ years of experience with a six-generation ancestral Jyotish lineage from Bangalore, India. Compassionate, human-centered astrology across Texas, all 50 US states, and globally.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#faf6ee] text-[#2a1114]">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Strictly matching reference layout)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-[#f3e7d0] lg:flex lg:h-[max(560px,calc(100svh-var(--chrome-top,0px)))] lg:items-center lg:[--hero-art:clamp(420px,min(calc(100svh-var(--chrome-top,0px)-120px),40vw),600px)]">
        {/* Background Image: about page hero.png */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about page hero.png"
            alt="About Page Hero Background with Temple Bells and Diyas"
            fill
            priority
            unoptimized
            className="object-cover object-center opacity-70"
          />
        </div>

        {/* Subtle dark gradient overlay at top so transparent navbar text remains ultra clear */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#240409]/60 via-[#240409]/20 to-transparent z-[5] pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 flex h-auto w-full site-container site-container--narrow flex-col page-top lg:h-full lg:pt-24">
          <div className="grid h-auto grid-cols-1 items-center gap-2 lg:h-full lg:grid-cols-12 lg:gap-8">
            {/* Left Content (Horizontally Centered in its column) */}
            <div className="flex flex-col items-center space-y-4 px-2 text-center sm:px-6 lg:col-span-7">
              {/* Starburst / Sun Icon */}
              <div className="text-[#8b1827] flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#8b1827]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="2.2" fill="currentColor" />
                  <line x1="12" y1="2" x2="12" y2="5.5" />
                  <line x1="12" y1="18.5" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="5.5" y2="12" />
                  <line x1="18.5" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="4.93" x2="7.4" y2="7.4" />
                  <line x1="16.6" y1="16.6" x2="19.07" y2="19.07" />
                  <line x1="4.93" y1="19.07" x2="7.4" y2="16.6" />
                  <line x1="16.6" y1="7.4" x2="19.07" y2="4.93" />
                </svg>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[50px] font-extrabold text-[#450a12] leading-[1.18] tracking-tight">
                Guiding Light on Your Life&apos;s
                <br />
                Journey
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-[15px] text-[#5c4448] max-w-lg leading-relaxed font-normal">
                Discover the profound wisdom of traditional Jyotish astrology—bridging six generations of ancestral Indian heritage with compassionate, human-centered guidance for modern life.
              </p>
            </div>

            {/* Right Celestial Astrological Ring & Hand (Anchored to bottom with zero gap) */}
            <div className="relative flex h-[340px] w-full items-end justify-center sm:h-[420px] md:h-[480px] lg:col-span-5 lg:h-full">
              <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 sm:h-[380px] sm:w-[380px] md:h-[440px] md:w-[440px] lg:h-[calc(var(--hero-art)*1.03)] lg:w-[calc(var(--hero-art)*1.03)]">
                <div className="relative h-full w-full animate-spin-celestial">
                  <Image
                    src="/images/hero-ring-trimmed.png"
                    alt="Celestial Astrological Ring"
                    fill
                    unoptimized
                    className="object-contain drop-shadow-xl"
                    priority
                  />
                </div>
              </div>

              <div className="pointer-events-none relative z-10 h-full w-[min(72vw,250px)] sm:w-[280px] md:w-[310px] lg:h-(--hero-art) lg:w-[calc(var(--hero-art)*0.64)]">
                <Image
                  src="/images/hero-hand-trimmed.png"
                  alt="Vedic Palmistry Hand"
                  fill
                  unoptimized
                  className="object-contain object-bottom drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. ABOUT TALKASTROLOGER.COM — LISTENING FIRST & COMPASSIONATE GUIDANCE
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#faf6ee] section-t">
        <div className="site-container site-container--narrow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8b1827] block">
                  About TalkAstrologer.com
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#38070e] tracking-tight leading-[1.2]">
                  Traditional Indian Astrology Rooted in Compassionate Listening
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#523d41] leading-relaxed">
                <p>
                  <strong>TalkAstrologer.com</strong> provides traditional Indian astrology and spiritual guidance for people facing personal, relationship, family, career, financial, educational, and other significant life questions.
                </p>
                <p>
                  Our approach begins with <em>listening carefully to the circumstances behind a person’s question</em>, rather than giving everyone the same templated answer. Every life journey has its own unique texture, nuances, and timing.
                </p>
                <p>
                  We combine authentic <strong>Jyotish perspectives</strong> with a compassionate, confidential, and understandable style of consultation. Although our practice is deeply rooted in Indian astrological and spiritual traditions, our consultations are designed for people from diverse cultures, worldviews, and backgrounds.
                </p>
              </div>

              {/* 3 Core Highlights */}
              <div className="space-y-3.5 pt-2">
                {[
                  "Personalized Listening — Tailored to your specific life context, not generic forecasts",
                  "Universal & Respectful — Welcoming seekers from all cultures, traditions, and backgrounds",
                  "Confidential & Human-Centered — A safe sanctuary to discuss your deepest crossroads",
                ].map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#f1dfbe] border border-[#c59b27] flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#8b1827]" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[#38070e]">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Photo Frame / Stats Card */}
            <div className="lg:col-span-5 flex flex-col justify-center gap-5">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-[#e5d0ad] bg-[#2d050d]">
                <Image
                  src="/images/about page.png"
                  alt="Ancestral Vedic Study and Heritage"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a060d]/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-[#f6e27a] font-semibold block">
                    Heritage & Mastery
                  </span>
                  <span className="font-serif text-lg font-bold">
                    Preserving the Purity of Vedic Jyotish
                  </span>
                </div>
              </div>

              {/* Quick Pillars Grid */}
              <div className="grid grid-cols-2 items-stretch gap-2.5 sm:gap-3.5">
                {[
                  { value: "22+", label: "Years", detail: "Of Dedicated Practice" },
                  { value: "6", label: "Generations", detail: "Lineage from Bangalore, India" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex h-full flex-col items-center justify-start rounded-xl border border-[#e7d2af] bg-[#faeed6] px-3 py-4 text-center sm:px-4 sm:py-5"
                  >
                    <div className="font-serif text-3xl font-extrabold leading-none text-[#38070e] sm:text-4xl">
                      {stat.value}
                    </div>
                    <div className="mt-1.5 font-serif text-sm font-bold leading-tight text-[#38070e] sm:text-base">
                      {stat.label}
                    </div>
                    <div className="mt-1.5 flex min-h-[2.6em] items-start justify-center text-[11px] font-medium leading-snug text-[#6d5458] sm:text-xs">
                      {stat.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. WHO WE ARE & ANCESTRAL HERITAGE (With Hanging Temple Bell)
      ───────────────────────────────────────────────────────────── */}
      <section className="section-t bg-[#faf6ee]">
        <div className="site-container site-container--narrow">
          {/* Section Divider Header */}
          <div className="mx-auto max-w-3xl text-center header-gap">
            <h2 className="text-balance font-serif text-[1.7rem] font-extrabold leading-tight tracking-tight text-[#38070e] sm:text-3xl lg:text-4xl">
              Heritage Originating in Bangalore, India
            </h2>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-[#c59b27]/70 sm:w-20" />
              <span className="text-[10px] text-[#c59b27]">◆</span>
              <span className="h-px w-12 bg-[#c59b27]/70 sm:w-20" />
            </div>
          </div>

          {/* Large Card with Hanging Bell */}
          <div className="relative overflow-hidden rounded-2xl border border-[#e7d2af] bg-[#faeed6] p-5 shadow-sm sm:p-8 lg:p-16">
            {/* Hanging Temple Bell on the right (bell 1.png) */}
            <div className="pointer-events-none absolute right-2 top-0 h-28 w-14 sm:right-6 sm:h-36 sm:w-16 lg:right-12 lg:h-72 lg:w-32">
              <Image
                src="/images/bell 1.png"
                alt="Sacred Brass Temple Bell"
                fill
                className="object-contain object-top drop-shadow-md"
              />
            </div>

            {/* Sparkle Ornament beside the bell */}
            <div className="pointer-events-none absolute right-16 top-3 text-xl text-[#c59b27]/50 sm:right-24 sm:top-5 lg:right-44">
              ✦
            </div>

            {/* Text stays left of the bell and the floating call buttons */}
            <div className="relative z-10 space-y-4 pr-[4.75rem] text-left sm:space-y-5 sm:pr-28 lg:pr-44">
              <h3 className="font-serif text-xl font-bold leading-snug text-[#38070e] sm:text-2xl">
                An Unbroken Connection with Traditional Jyotish
              </h3>

              <p className="text-sm leading-relaxed text-[#4d363a] md:text-base">
                TalkAstrologer.com brings more than <strong>22 years of active consultation experience</strong> together with a revered <strong>six-generation ancestral connection</strong> originating in Bangalore, India. This heritage reflects a continuing, living dedication to Jyotish and related Indian spiritual traditions.
              </p>

              <p className="text-sm leading-relaxed text-[#4d363a] md:text-base">
                Passed from guru to disciple through continuous lineage practice, this wisdom allows our consultations to provide profound clarity without the modern commercial hype or unrealistic promises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. GLOBAL REACH & MULTILINGUAL CONSULTATIONS
      ───────────────────────────────────────────────────────────── */}
      <section className="section-y bg-[#faf6ee]">
        <div className="site-container site-container--narrow">
          <div className="text-center space-y-2 max-w-2xl mx-auto header-gap">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8b1827] block">
              Experience, Heritage & Global Reach
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#38070e] tracking-tight">
              Serving Seekers Across the USA & Worldwide
            </h2>
            <p className="text-xs sm:text-sm text-[#5c4448]">
              Distance is no barrier to cosmic insight. Our private phone, WhatsApp, and online consultations connect you directly with experienced ancestral practitioners.
            </p>
          </div>

          {/* 3 Global Reach Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 grid-rows-gap">
            {/* Card 1: All 50 US States */}
            <div className="bg-white rounded-2xl border border-[#ebdcc2] px-7 card-y shadow-xs space-y-4 hover:border-[#b88e39] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#faeed6] border border-[#d8be96] flex items-center justify-center text-[#8b1827]">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#38070e]">
                All 50 US States
              </h3>
              <p className="text-xs sm:text-sm text-[#543d41] leading-relaxed">
                Serving individuals and families across Texas (Dallas, Frisco, Houston, Austin, San Antonio) as well as major cities nationwide from New York to California.
              </p>
            </div>

            {/* Card 2: Worldwide Presence */}
            <div className="bg-white rounded-2xl border border-[#ebdcc2] px-7 card-y shadow-xs space-y-4 hover:border-[#b88e39] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#faeed6] border border-[#d8be96] flex items-center justify-center text-[#8b1827]">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#38070e]">
                International Seekers
              </h3>
              <p className="text-xs sm:text-sm text-[#543d41] leading-relaxed">
                Regularly consulting with clients in India, Europe, Australia, Vietnam, Botswana, Malaysia, and other parts of the world with flexible global time coordination.
              </p>
            </div>

            {/* Card 3: Multilingual Support */}
            <div className="bg-white rounded-2xl border border-[#ebdcc2] px-7 card-y shadow-xs space-y-4 hover:border-[#b88e39] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#faeed6] border border-[#d8be96] flex items-center justify-center text-[#8b1827]">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#38070e]">
                Multilingual Guidance
              </h3>
              <p className="text-xs sm:text-sm text-[#543d41] leading-relaxed">
                Consultation support can be offered in <strong>English</strong>, <strong>Hindi</strong>, and <strong>Telugu</strong> (subject to practitioner availability) for natural, comfortable communication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. OUR SPIRITUAL PHILOSOPHY — REFLECTION OVER FATALISM
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden section-y bg-[#fbf4e4] border-y border-[#e7d2af]">
        <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-[#c59b27]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[#8b1827]/5 blur-3xl" />

        <div className="relative site-container site-container--narrow">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8b1827] block">
              Our Guiding Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#38070e] tracking-tight leading-[1.15]">
              Spiritual Philosophy: Empowering, Respectful & Supportive
            </h2>
            <div className="flex items-center justify-center gap-2">
              <span className="w-12 h-px bg-[#c59b27]/50" />
              <span className="text-[#c59b27] text-xs">◆</span>
              <span className="w-12 h-px bg-[#c59b27]/50" />
            </div>
          </div>

          <div className="content-gap grid grid-cols-1 lg:grid-cols-12 gap-x-5 grid-rows-gap lg:gap-x-6 items-stretch">
            <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#2d1814] p-6 pr-[4.75rem] text-[#fdfaf4] shadow-lg sm:p-8 sm:pr-24 lg:col-span-5 lg:p-9">
              <div className="absolute -right-8 -top-10 font-serif text-[140px] leading-none text-[#f6e27a]/10 select-none">
                ॐ
              </div>
              <div className="relative space-y-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f6e27a]">
                  How we read a chart
                </p>
                <p className="font-serif text-xl leading-snug text-white sm:text-2xl lg:text-[28px]">
                  A birth chart is a sacred map, not a fixed verdict.
                </p>
                <p className="text-sm text-[#ecd9c6] leading-relaxed">
                  TalkAstrologer.com treats astrology as a traditional system of reflection. The chart is used to explore patterns, possibilities, challenges, and life phases — then explained in language you can sit with.
                </p>
              </div>
              <ul className="relative mt-8 space-y-3 text-sm text-[#f7e8d4]">
                {[
                  "Patterns and timing, discussed in context",
                  "Questions you bring, not a script of fate",
                  "Room to pause, ask again, and decide for yourself",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#f6e27a]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-5 grid-rows-gap">
              {[
                {
                  numeral: "I",
                  title: "No Fear-Based Predictions",
                  icon: Shield,
                  body: "The purpose is not to frighten you or to treat every outcome as already decided. Planetary patterns are explained with honesty, dignity, and care.",
                  practice:
                    "Difficult periods are named clearly, then framed as times for awareness and preparation.",
                },
                {
                  numeral: "II",
                  title: "Honoring Your Choices",
                  icon: Compass,
                  body: "Astrology can illuminate tendencies and timing. Your freedom, beliefs, choices, and responsibilities always remain in your hands.",
                  practice:
                    "Marriage, career, family, and relocation options are laid out so you can weigh them yourself.",
                },
                {
                  numeral: "III",
                  title: "Feeling Heard & Supported",
                  icon: Heart,
                  body: "Guidance should leave you grounded and equipped with practical direction, not smaller than when you arrived.",
                  practice:
                    "The session starts from your question and ends with points you can reflect on with a steadier mind.",
                },
                {
                  numeral: "IV",
                  title: "Discretion & Patience",
                  icon: Lock,
                  body: "Patience, strict confidentiality, empathy, and plain language are part of the reading itself.",
                  practice:
                    "What you share stays private, and explanations are given one step at a time until they make sense.",
                },
              ].map((pillar, index) => {
                const Icon = pillar.icon;
                const clearsButtons = index % 2 === 1;
                return (
                  <article
                    key={pillar.numeral}
                    className={`relative overflow-hidden rounded-2xl border border-[#e5d0ad] bg-white pl-5 card-y pr-[4.75rem] shadow-sm transition-all hover:border-[#c59b27] hover:shadow-md sm:pl-6 lg:pr-6 ${clearsButtons ? "sm:pr-20" : "sm:pr-6"
                      }`}
                  >
                    <span className="pointer-events-none absolute -right-1 -top-4 font-serif text-7xl text-[#38070e]/[0.06] select-none">
                      {pillar.numeral}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#faeed6] border border-[#e5d0ad] text-[#8b1827] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#aa8016]">
                        Principle {pillar.numeral}
                      </p>
                    </div>
                    <h3 className="mt-4 font-serif text-lg font-bold text-[#38070e] leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#543d41] leading-relaxed">
                      {pillar.body}
                    </p>
                    <p className="mt-4 pt-3 border-t border-[#f0e2cc] text-xs text-[#5c4448] leading-relaxed">
                      <span className="font-semibold text-[#8b1827]">In a consultation. </span>
                      {pillar.practice}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. OUR METHODOLOGY & SPECIALIZATIONS (Matching Reference Layout)
      ───────────────────────────────────────────────────────────── */}
      <section className="section-t bg-[#faf6ee]">
        <div className="site-container site-container--narrow">
          {/* Section Heading */}
          <div className="text-center space-y-2 header-gap">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#38070e] tracking-tight">
              Our Methodology & Specializations
            </h2>
            <p className="text-xs sm:text-sm text-[#5c4448] max-w-lg mx-auto">
              Addressing life&apos;s essential dimensions through ancient sciences tailored to modern reality.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-rows-gap">
            {/* Row 1: Holistic Analysis (Wide) + Relationship Compatibility */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6 grid-rows-gap">
              {/* Card 1: Holistic Analysis */}
              <div className="lg:col-span-7 bg-[#fbf4e4] border border-[#e5d0ad] rounded-2xl px-8 card-y sm:px-10 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-[#faeed6] border border-[#d8be96] flex items-center justify-center text-[#8b1827]">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#38070e]">
                    Holistic Birth Chart Analysis
                  </h3>
                  <p className="text-xs sm:text-sm text-[#573f43] leading-relaxed">
                    We combine macro-level astrological forecasting (Dasha cycles, planetary transits) with micro-level numerological and palmistry insights to provide a complete picture of your life blueprint, ensuring actionable and balanced guidance.
                  </p>
                </div>
              </div>

              {/* Card 2: Relationship Compatibility */}
              <div className="lg:col-span-5 bg-[#fbf4e4] border border-[#e5d0ad] rounded-2xl px-8 card-y sm:px-10 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#faeed6] border border-[#d8be96] flex items-center justify-center text-[#8b1827] mb-4 shadow-inner">
                  <Heart className="w-7 h-7 fill-[#8b1827] text-[#8b1827]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#38070e]">
                  Relationship Compatibility
                </h3>
                <p className="text-xs text-[#573f43] mt-2 max-w-xs">
                  Kundali matching, emotional understanding, and marriage harmony guidance.
                </p>
              </div>
            </div>

            {/* Row 2: 3 Cards (Career & Finance, Vastu Shastra, Health & Wellness) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 grid-rows-gap">
              {/* Card 3: Career & Finance (Dark Chocolate/Burgundy) */}
              <div className="bg-[#2d1814] text-[#f7e2a9] rounded-2xl px-8 card-y sm:px-10 shadow-md flex flex-col items-center justify-center text-center group">
                <div className="w-14 h-14 rounded-xl bg-[#3f241f] border border-[#c59b27]/40 flex items-center justify-center text-[#f6e27a] mb-5 shadow-inner group-hover:scale-105 transition-transform">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#fdfaf4]">
                  Career & Finance
                </h3>
                <p className="text-xs text-[#e8d5be] mt-2">
                  Job transitions, promotion timing, business growth, and financial stability insight.
                </p>
              </div>

              {/* Card 4: Vastu Shastra (Warm Gold/Cream) */}
              <div className="bg-[#faeed6] border border-[#e7d2af] rounded-2xl px-8 card-y sm:px-10 shadow-sm flex flex-col items-center justify-center text-center group">
                <div className="w-14 h-14 rounded-xl bg-[#f2e1c3] border border-[#d8be96] flex items-center justify-center text-[#8b1827] mb-5 shadow-inner group-hover:scale-105 transition-transform">
                  <HomeIcon className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#38070e]">
                  Vastu Shastra
                </h3>
                <p className="text-xs text-[#634b4f] mt-2">
                  Harmonizing living and work spaces with cosmic energy alignments.
                </p>
              </div>

              {/* Card 5: Health & Wellness (Clean White/Parchment) */}
              <div className="bg-white border border-[#e7d2af] rounded-2xl px-8 card-y sm:px-10 shadow-sm flex flex-col items-center justify-center text-center group">
                <div className="w-14 h-14 rounded-xl bg-[#fbf4e4] border border-[#d8be96] flex items-center justify-center text-[#8b1827] mb-5 shadow-inner group-hover:scale-105 transition-transform">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#38070e]">
                  Health & Wellness
                </h3>
                <p className="text-xs text-[#634b4f] mt-2">
                  Mental peace, stress reduction, and positive spiritual energy realignment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. BEGIN YOUR JOURNEY TO CLARITY (Call to Action Banner)
      ───────────────────────────────────────────────────────────── */}
      <section className="section-y bg-[#faf6ee]">
        <div className="site-container site-container--narrow">
          <div className="rounded-2xl bg-[#2d1814] py-12 px-6 sm:px-12 text-center text-white shadow-xl space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#fdfaf4]">
              Begin Your Journey to Clarity
            </h2>
            <p className="text-xs sm:text-sm text-[#ecd9c6] max-w-lg mx-auto">
              Connect with our consultation desk today. Available Monday through Sunday, 9:00 AM to 8:00 PM Central Time.
            </p>

            {/* 3 Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/book-appointment"
                className="px-6 py-3 rounded-full bg-[#fdfaf4] hover:bg-[#f6e27a] text-[#2d1814] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md"
              >
                Book Appointment
              </Link>
              <a
                href="tel:+12146699699"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/60 hover:border-white text-white hover:bg-white/10 text-xs sm:text-sm tracking-wider uppercase transition-all"
              >
                <Phone className="w-4 h-4 text-[#f6e27a]" />
                Call +1 214 669 9699
              </a>
              <a
                href="https://wa.me/12146699699"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. OUR GLOBAL SANCTUARIES & TEMPORARY OFFICE LOCATION
      ───────────────────────────────────────────────────────────── */}
      <section className="section-t page-bottom bg-[#faf6ee] border-t border-[#ebdcc2]">
        <div className="site-container site-container--narrow">
          {/* Heading */}
          <div className="text-center space-y-2 header-gap">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#38070e] tracking-tight">
              Our Sanctuaries & Consultations
            </h2>
            <p className="text-xs sm:text-sm text-[#735a5e]">
              Serving clients locally in Texas, nationwide across all 50 US states, and worldwide.
            </p>
          </div>

          {/* 3 Minimal Items */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 grid-rows-gap max-w-4xl mx-auto">
            {/* Item 1: Texas, USA */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#faeed6] border border-[#d8be96] flex items-center justify-center text-[#8b1827]">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#38070e]">
                Frisco, Texas, USA
              </h3>
              <p className="text-xs text-[#735a5e]">11572 Lenox Ln, Frisco, TX 75033</p>
              <span className="text-[10px] text-[#9e701e] bg-[#faf2de] px-2 py-0.5 rounded-full border border-[#e5cb9b]">
                Current Location (Temporary)
              </span>
            </div>

            {/* Item 2: Nationwide USA */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#faeed6] border border-[#d8be96] flex items-center justify-center text-[#8b1827]">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#38070e]">
                All 50 US States
              </h3>
              <p className="text-xs text-[#735a5e]">Private Phone & Online Consultations</p>
              <span className="text-[10px] text-[#9e701e] bg-[#faf2de] px-2 py-0.5 rounded-full border border-[#e5cb9b]">
                9:00 AM – 8:00 PM Central Time
              </span>
            </div>

            {/* Item 3: Worldwide */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#faeed6] border border-[#d8be96] flex items-center justify-center text-[#8b1827]">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#38070e]">
                Ancestral Roots
              </h3>
              <p className="text-xs text-[#735a5e]">Bangalore, India • Europe • Australia</p>
              <span className="text-[10px] text-[#9e701e] bg-[#faf2de] px-2 py-0.5 rounded-full border border-[#e5cb9b]">
                English • Hindi • Telugu
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
