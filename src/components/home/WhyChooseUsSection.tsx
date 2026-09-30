import React from "react";
import { Compass, ShieldCheck, MessageCircle, Sparkles } from "lucide-react";

export default function WhyChooseUsSection() {
  const features = [
    {
      icon: Compass,
      title: "Six-Generation Mastery",
      description:
        "Six continuous generations of ancestral Vedic mastery in Parashara astrology offering genuine insight and deep clarity.",
    },
    {
      icon: ShieldCheck,
      title: "Personalized & Confidential",
      description:
        "100% confidential one-on-one sessions tailored directly to your horoscope, birth chart, and personal life journey.",
    },
    {
      icon: MessageCircle,
      title: "Positive & Fear-Free Guidance",
      description:
        "Supportive, uplifting guidance focused on clarity, emotional wellness, and actionable direction — never fear-based predictions.",
    },
  ];

  return (
    <section className="section-y bg-[#faf6ee] relative overflow-hidden border-t border-[#ebdcc2]">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#d4af37]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="site-container relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3 header-gap">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#38070e] tracking-tight">
            Why Clients Choose Us
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="w-10 h-px bg-[#c59b27]/40" />
            <span className="text-[#c59b27] text-xs">✦</span>
            <span className="w-10 h-px bg-[#c59b27]/40" />
          </div>
        </div>

        {/* 3 Columns strictly matching screenshot layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 grid-rows-gap">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-[#fbf5e8] border border-[#e6d5b8] rounded-2xl px-8 card-y text-center shadow-sm hover:-translate-y-1 hover:bg-[#38070e] hover:border-[#c59b27] hover:shadow-[0_18px_40px_rgba(36,4,9,0.28)] transition-all duration-300 flex flex-col items-center group"
              >
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-xl bg-[#faecd1] border border-[#d8be8d] flex items-center justify-center text-[#9c182d] mb-6 shadow-inner group-hover:scale-110 group-hover:bg-[#f6e27a]/10 group-hover:border-[#d4af37] group-hover:shadow-[0_0_16px_rgba(212,175,55,0.35)] transition-all duration-300">
                  <Icon className="w-7 h-7 text-[#8b1c2b] group-hover:text-[#f6e27a] transition-colors duration-300" />
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-bold text-[#38070e] group-hover:text-white mb-3 transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#665154] group-hover:text-white/85 leading-relaxed transition-colors duration-300">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
