import React from "react";
import HeroSection from "@/components/home/HeroSection";
import WelcomeSection from "@/components/home/WelcomeSection";
import ServicesSection from "@/components/home/ServicesSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaBannerSection from "@/components/home/CtaBannerSection";
import GlobalSanctuariesSection from "@/components/home/GlobalSanctuariesSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section strictly matching uploaded screenshot */}
      <HeroSection />

      {/* 2. Welcome to TalkAstrologer with arched portrait & Zodiac wheel */}
      <WelcomeSection />

      {/* 3. Astrology & Spiritual Services */}
      <ServicesSection />

      {/* 4. Why Clients Choose Us (3 feature cards) */}
      <WhyChooseUsSection />

      {/* 5. Voices of the Blessed (3 golden testimonial cards) */}
      <TestimonialsSection />

      {/* 6. Begin Your Journey to Clarity (CTA banner with 3 buttons) */}
      <CtaBannerSection />

      {/* 7. Our Global Sanctuaries (8 city locations) */}
      <GlobalSanctuariesSection />
    </div>
  );
}
