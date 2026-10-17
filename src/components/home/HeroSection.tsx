import React from "react";
import Image from "next/image";
import { Phone, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#38070e] text-white page-top section-b min-h-[620px] lg:min-h-[calc(100svh-var(--chrome-top,0px))] flex items-center">
      {/* 1st Layer (Bottom / Background): Hero Video (High Intensity) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover object-center pointer-events-none brightness-105 contrast-105"
        >
          <source src="/images/hero%20section%20video.mp4" type="video/mp4" />
          <source src="/images/hero section video.mp4" type="video/mp4" />
        </video>
        {/* Soft subtle scrim strictly on the left to preserve text legibility while video stays bright */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0206]/60 via-[#1a0206]/20 to-transparent pointer-events-none" />
      </div>

      {/* 2nd Layer (Middle): Lord Shiva Image (Moved to Left Corner) */}
      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-start overflow-hidden">
        <div className="relative h-[90%] w-[90%] max-h-[800px] max-w-[680px] -ml-6 sm:ml-0 lg:ml-2 xl:ml-6 opacity-50 sm:opacity-60 lg:opacity-70 transition-all duration-300">
          <Image
            src="/images/shiva.png"
            alt="Lord Shiva Sacred Presence"
            fill
            priority
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 680px"
            className="object-contain object-right select-none drop-shadow-[0_0_25px_rgba(235,50,20,0.2)] translate-x-[60px]"
          />
        </div>
      </div>

      {/* Subtle Constellation Accent */}
      <div className="pointer-events-none absolute top-0 right-0 z-[3] h-[min(380px,58%)] w-[min(72vw,520px)] opacity-60">
        <Image
          src="/images/hero-constellation-tr.png"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 72vw, 520px"
          className="object-contain object-right-top"
        />
      </div>

      {/* 3rd Layer (Top): Text Content Container */}
      <div className="relative z-10 site-container w-full">
        <div className="max-w-3xl space-y-6">
          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="font-[family-name:var(--font-shivaraja)] text-[min(2.5rem,8.8vw)] sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-wide text-white leading-tight whitespace-nowrap drop-shadow-md">
              TalkAstrologer
            </h1>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[38px] font-medium text-[#f6e27a] tracking-wide">
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
              Speak to Astrologer Now<br />+1 214 669 9699
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
