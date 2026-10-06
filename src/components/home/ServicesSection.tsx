"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { servicesData } from "@/data/services";
import ImageToneCard from "@/components/ui/ImageToneCard";

export default function ServicesSection() {
  return (
    <section className="section-y bg-[#fdfaf4] relative" id="services">
      <div className="site-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 header-gap">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#aa8016] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#c59b27]" />
            Astrology & Spiritual Services
            <Sparkles className="w-3.5 h-3.5 text-[#c59b27]" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#38070e] tracking-tight">
            Our Sacred Services
          </h2>
          <p className="text-sm sm:text-base text-[#614b4f] leading-relaxed">
            Illuminating your life journey with sacred Vedic solutions tailored to your
            unique birth chart and planetary alignments.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="w-12 h-px bg-[#c59b27]/40" />
            <span className="text-[#c59b27] text-xs">◆</span>
            <span className="w-12 h-px bg-[#c59b27]/40" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-2.5 grid-rows-gap sm:gap-x-4 lg:grid-cols-3 lg:gap-x-6">
          {servicesData.slice(0, 6).map((service) => (
            <ImageToneCard
              key={service.id}
              imageUrl={service.imageUrl}
              imageAlt={service.title}
              title={service.title}
              description={service.description}
              meta={service.category}
              href={`/services/${service.id}`}
              ctaLabel="Explore Guidance"
              iconName={service.iconName}
            />
          ))}
        </div>

        <div className="content-gap flex justify-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#38070e] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(56,7,14,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#200408] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38070e]"
          >
            View all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
