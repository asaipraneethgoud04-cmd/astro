"use client";

import React, { useState, useEffect } from "react";
import { Phone, ArrowUp } from "lucide-react";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2.5 sm:bottom-8 sm:right-10 lg:right-14 sm:gap-3.5">
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c59b27] bg-[#38070e] text-[#f6e27a] shadow-lg transition-all duration-300 hover:bg-[#200408] sm:h-10 sm:w-10"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Floating Call quick button */}
      <a
        href="tel:+12146699699"
        className="group relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#c59b27] bg-[#38070e] text-[#f6e27a] shadow-xl transition-all duration-300 hover:scale-110 sm:h-12 sm:w-12"
        aria-label="Call Astrologer"
      >
        <Phone className="w-5 h-5 animate-pulse" />
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded border border-[#c59b27]/40 bg-[#230409] px-2.5 py-1 font-serif text-xs text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          Speak to Astrologer
        </span>
      </a>

      {/* Floating Instagram Action */}
      <a
        href="https://www.instagram.com/talk_astrologer"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#c59b27] bg-[#38070e] text-[#f6e27a] shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#200408] hover:border-[#f6e27a] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] sm:h-12 sm:w-12"
        aria-label="Follow on Instagram"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded border border-[#c59b27]/40 bg-[#230409] px-2.5 py-1 font-serif text-xs text-[#f6e27a] opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          Follow on Instagram
        </span>
      </a>

      {/* Floating WhatsApp Action */}
      <a
        href="https://wa.me/12146699699"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 sm:h-13 sm:w-13"
        aria-label="WhatsApp Us"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded border border-[#c59b27]/40 bg-[#230409] px-2.5 py-1 font-serif text-xs text-[#f6e27a] opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
