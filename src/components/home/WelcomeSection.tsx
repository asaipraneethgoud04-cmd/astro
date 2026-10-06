import React from "react";
import Image from "next/image";

export default function WelcomeSection() {
  return (
    <section className="relative section-y bg-[#fdfbf7] overflow-hidden">
      {/* Background Zodiac Wheel using user asset - comfortably sized within section */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[480px] lg:w-[540px] max-h-[92%] aspect-square pointer-events-none opacity-15">
        <Image
          src="/images/home page about section bg.png"
          alt="Sacred Sun Zodiac Wheel"
          fill
          className="object-contain animate-spin-slow"
        />
      </div>

      <div className="relative z-10 site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Arched Lineage Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              {/* Outer Golden Glow Border */}
              <div className="absolute -inset-2 rounded-t-[150px] rounded-b-3xl bg-gradient-to-b from-[#e5b94c]/40 via-[#c59b27]/20 to-transparent blur-md" />

              {/* Main Arched Frame */}
              <div className="relative rounded-t-[140px] rounded-b-2xl border-4 border-[#c59b27] bg-[#38070e] p-3 shadow-2xl overflow-hidden aspect-[4/5] flex flex-col justify-end">
                {/* Decorative inner arch border */}
                <div className="absolute inset-2 rounded-t-[130px] rounded-b-xl border border-[#e5c158]/40 pointer-events-none z-10" />

                {/* Left Container Image */}
                <div className="absolute inset-0">
                  <Image
                    src="/images/home page about section.png"
                    alt="Vedic Astrology Sacred Heritage"
                    fill
                    priority
                    unoptimized
                    className="object-cover object-center"
                  />
                  {/* Subtle dark gradient overlay at bottom for badge legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#200408]/85 via-transparent to-transparent pointer-events-none z-[5]" />
                </div>

                {/* Bottom Badge Over Portrait */}
                <div className="relative z-10 bg-[#250409]/90 border border-[#c59b27]/50 rounded-xl p-3 text-center backdrop-blur-sm shadow-lg mb-2">
                  <p className="text-xs font-serif font-bold text-[#f6e27a] tracking-wider uppercase">
                    Six Generations of Vedic Heritage • Texas, USA
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Welcome Description & Lineage Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="@container space-y-2">
              <span className="font-serif text-3xl sm:text-4xl text-[#5a111c] block font-light">
                Welcome to
              </span>
              <h2 className="font-serif text-[min(2.75rem,9.5cqw)] sm:text-[min(3.75rem,9.5cqw)] lg:text-[min(4.5rem,9.5cqw)] font-extrabold text-[#38070e] leading-tight tracking-tight">
                TalkAstrologer
              </h2>
            </div>

            <div className="w-20 h-1 bg-gradient-to-r from-[#c59b27] to-transparent rounded-full" />

            <div className="space-y-4 text-base sm:text-lg text-[#4a3437] leading-relaxed">
              <p>
                Bringing more than <strong>30+ years of dedicated consultation experience</strong> alongside an unbroken <strong>six-generation ancestral Jyotish lineage originating in Bangalore, India</strong>, TalkAstrologer is your trusted destination for supportive astrology guidance and positive life insight in Texas and throughout the USA.
              </p>
              <p>
                Our approach begins with <em>listening carefully to your specific circumstances</em> rather than offering one-size-fits-all answers. By uniting traditional Parashara principles with practical, compassionate clarity, we help individuals, couples, and professionals gain emotional wellness, relationship harmony, career direction, and confidence.
              </p>
            </div>

            {/* Bullet Point with 6 generations badge */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#f6eee0] border border-[#d4af37]/60 shadow-xs">
                <span className="text-[#c59b27] font-bold text-sm">✦</span>
                <span className="font-serif font-bold text-[#38070e] text-xs sm:text-sm tracking-wide">
                  30+ Years of Practice • 6 Generations Ancestral Heritage
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#ebdcc2] shadow-xs text-xs text-[#523d41]">
                <span>Serving All 50 US States</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
