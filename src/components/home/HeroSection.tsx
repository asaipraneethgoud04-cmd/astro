import React from "react";
import Image from "next/image";
import { Phone, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#38070e] text-white page-top section-b min-h-[620px] lg:min-h-[calc(100svh-var(--chrome-top,0px))] flex items-center">
      <Image
        src="/images/home page hero section.png"
        alt=""
        fill
        priority
        unoptimized
        className="object-cover object-center pointer-events-none"
      />
      <div className="pointer-events-none absolute top-0 right-0 z-[1] h-[min(380px,58%)] w-[min(72vw,520px)]">
        <Image
          src="/images/hero-constellation-tr.png"
          alt=""
          fill
          unoptimized
          className="object-contain object-right-top"
        />
      </div>
      <div className="absolute inset-0 z-[2] bg-[#6B1E2B]/70 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 site-container w-full">
        <div className="max-w-3xl space-y-6">
          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="font-[family-name:var(--font-shivaraja)] text-[min(2.25rem,8.6vw)] sm:text-5xl md:text-6xl font-normal tracking-wide text-white leading-tight whitespace-nowrap drop-shadow-md">
              TalkAstrologer.com
            </h1>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-medium text-[#f6e27a] tracking-wide">
              Supportive Astrology Guidance & Positive Life Insight
            </h2>
          </div>

          {/* Description */}
          <p className="text-[#ecd9c6] text-sm sm:text-base leading-relaxed max-w-2xl font-light">
            Empowering your life journey through six generations of ancestral Vedic
            heritage. Gain emotional clarity, relationship harmony, career direction,
            and peace of mind through practical, motivational, and fear-free guidance.
          </p>

          {/* Category / Service Pills */}

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <a
              href="tel:+1214669699"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#fcfaf4] hover:bg-[#f6e27a] text-[#2c050d] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Phone className="w-4 h-4 text-[#2c050d]" />
              Speak to Astrologer Now
            </a>

            <a
              href="https://wa.me/+1214669699"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-[#f6e27a]/70 hover:border-[#f6e27a] text-white hover:text-[#f6e27a] bg-[#3a0812]/50 hover:bg-[#3a0812] font-semibold text-xs sm:text-sm tracking-wider uppercase backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Chat With Us
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
