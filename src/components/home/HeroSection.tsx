"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Phone, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const playVideo = (video: HTMLVideoElement | null) => {
      if (!video) return;
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(() => {
        // Safe fallback for strict browser autoplay policies
      });
    };

    playVideo(desktopVideoRef.current);
    playVideo(mobileVideoRef.current);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#38070e] text-white page-top section-b min-h-[620px] lg:min-h-[calc(100svh-var(--chrome-top,0px))] flex items-center">
      {/* 1st Layer (Bottom / Background): Responsive Hero Video */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Mobile Video (Vertical / Portrait optimized for < 768px - Increased Brightness) */}
        <video
          ref={mobileVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="block md:hidden h-full w-full object-cover object-center pointer-events-none brightness-155 contrast-110 saturate-105"
        >
          <source src="/images/hero-mobile-video.mp4" type="video/mp4" />
        </video>

        {/* Desktop Video (Widescreen optimized for >= 768px) */}
        <video
          ref={desktopVideoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="hidden md:block h-full w-full object-cover object-center pointer-events-none brightness-105 contrast-105"
        >
          <source src="/images/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Responsive Scrim: ultra-light on mobile so video remains clear and bright; horizontal gradient on desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#140104]/45 via-transparent to-[#140104]/25 md:bg-gradient-to-r md:from-[#1a0206]/75 md:via-[#1a0206]/25 md:to-transparent pointer-events-none" />
      </div>

      {/* 2nd Layer (Middle): Lord Shiva Image (Vibrant & Radiant on Mobile & Desktop) */}
      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center sm:justify-start overflow-hidden">
        <div className="relative h-[80%] sm:h-[90%] w-[90%] max-h-[700px] sm:max-h-[800px] max-w-[500px] sm:max-w-[680px] -ml-0 sm:ml-0 lg:ml-2 xl:ml-6 opacity-60 sm:opacity-65 lg:opacity-75 transition-all duration-300 mix-blend-screen sm:mix-blend-normal">
          <Image
            src="/images/shiv.webp"
            alt="Lord Shiva Sacred Presence"
            fill
            priority
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 680px"
            className="object-contain object-bottom sm:object-right select-none brightness-155 contrast-110 drop-shadow-[0_0_30px_rgba(246,226,122,0.35)] -translate-x-[25%] sm:translate-x-[60px] translate-y-[8%] sm:translate-y-[5%]"
          />
        </div>
      </div>

      {/* Subtle Constellation Accent */}
      <div className="pointer-events-none absolute top-0 right-0 z-[3] h-[min(380px,58%)] w-[min(72vw,520px)] opacity-50 sm:opacity-60">
        <Image
          src="/images/hero-constellation-tr.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 72vw, 520px"
          className="object-contain object-right-top"
        />
      </div>

      {/* 3rd Layer (Top): Text Content Container */}
      <div className="relative z-10 site-container w-full py-10 sm:py-16 lg:py-0">
        <div className="max-w-3xl space-y-5 sm:space-y-6">
          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="font-[family-name:var(--font-shivaraja)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-wide text-white leading-tight drop-shadow-[0_3px_16px_rgba(0,0,0,0.9)]">
              TalkAstrologer
            </h1>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-[38px] font-medium text-[#f6e27a] tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
              Supportive Astrology Guidance &amp; Positive Life Insight
            </h2>
          </div>

          {/* Description */}
          <p className="text-[#f5e7d8] text-sm sm:text-base leading-relaxed max-w-2xl font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            Empowering your life journey through six generations of ancestral Vedic
            heritage. Gain emotional clarity, relationship harmony, career direction,
            and peace of mind through practical, motivational, and fear-free guidance.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-2 sm:pt-4">
            <a
              href="tel:+1214669699"
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#fcfaf4] hover:bg-[#f6e27a] text-[#2c050d] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_4px_24px_rgba(0,0,0,0.55)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Phone className="w-4 h-4 text-[#2c050d] shrink-0" />
              <span>Speak to Astrologer Now · +1 214 669 9699</span>
            </a>

            <a
              href="https://wa.me/+1214669699"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full border border-[#f6e27a]/80 hover:border-[#f6e27a] text-white hover:text-[#f6e27a] bg-[#3a0812]/70 hover:bg-[#3a0812] font-semibold text-xs sm:text-sm tracking-wider uppercase backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            >
              Chat With Us
              <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
