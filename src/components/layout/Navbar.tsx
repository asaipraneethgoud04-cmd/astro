"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, Sparkles } from "lucide-react";

export default function Navbar({ offsetTop = false }: { offsetTop?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Book Appointment", href: "/book-appointment" },
    { name: "Contact Us", href: "/contact" },
  ];

  // Pages with a dedicated visual hero section at the top
  const hasHeroSection =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/faq" ||
    pathname === "/privacy-policy" ||
    pathname === "/terms" ||
    pathname === "/disclaimer";

  const isTransparent = hasHeroSection && !isScrolled && !mobileMenuOpen;

  return (
    <header
      className={`fixed ${offsetTop ? "top-10" : "top-0"} left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-b border-transparent shadow-none"
          : "bg-[#240409]/95 backdrop-blur-md border-b border-[#c59b27]/30 shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 sm:gap-3.5 group">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[#d4af37] bg-[#240409] shadow-[0_0_15px_rgba(212,175,55,0.45)] transition-all group-hover:scale-105 group-hover:border-[#f6e27a] group-hover:shadow-[0_0_20px_rgba(246,226,122,0.6)] md:h-11 md:w-11 lg:h-14 lg:w-14">
              <Image
                src="/images/logo.png"
                alt="Talk Astrologer Sacred Zodiac Logo"
                fill
                priority
                unoptimized
                className="object-cover object-center"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold uppercase tracking-[0.12em] text-[#fcf9f2] drop-shadow-sm transition-colors group-hover:text-[#f6e27a] md:text-base md:tracking-[0.08em] lg:text-xl lg:tracking-widest">
                Talk Astrologer
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#d4af37] md:text-[9px] md:tracking-[0.12em] lg:text-[11px] lg:tracking-[0.25em]">
                Vedic Cosmic Guidance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 xl:gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative whitespace-nowrap px-2 py-2 text-[13px] font-medium tracking-wide transition-all duration-200 lg:px-3 lg:text-sm ${
                    isActive
                      ? "font-semibold text-[#f6e27a]"
                      : "text-[#ebd9c8] hover:text-[#f6e27a]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#f6e27a] to-transparent lg:left-3 lg:right-3" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Direct Call / Contact CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+12146699699"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#c59b27]/60 bg-gradient-to-r from-[#3a0812] to-[#4a0d18] text-[#f6e27a] hover:text-white hover:border-[#f6e27a] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300 text-sm font-medium"
            >
              <div className="w-6 h-6 rounded-full bg-[#c59b27]/20 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-[#f6e27a]" />
              </div>
              <span className="tracking-wider">+1 214 669 9699</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="tel:+12146699699"
              className="p-2 text-[#f6e27a] rounded-full bg-[#3a0812] border border-[#c59b27]/40"
              aria-label="Call"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#ebd9c8] hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#240409] border-b border-[#c59b27]/40 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                pathname === link.href
                  ? "bg-[#3d0a14] text-[#f6e27a] font-semibold border-l-4 border-[#c59b27]"
                  : "text-[#f0e4d7] hover:bg-[#32060e]"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#c59b27]/20">
            <a
              href="tel:+12146699699"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa8016] text-[#240409] font-bold text-sm tracking-wider uppercase shadow-lg"
            >
              <Phone className="w-4 h-4" />
              Speak to Astrologer Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
