"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Phone, Menu, X, ChevronDown, Sparkles, Volume2, VolumeX } from "lucide-react";
import { navbarServicesColumns } from "@/data/services";

function CornerFiligree({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="none"
      className={`w-11 h-11 pointer-events-none absolute z-20 ${className || ""}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cornerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff2a8" />
          <stop offset="30%" stopColor="#e5c158" />
          <stop offset="70%" stopColor="#c59b27" />
          <stop offset="100%" stopColor="#916a12" />
        </linearGradient>
        <filter id="cornerSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#f6e27a" floodOpacity="0.5" />
        </filter>
      </defs>
      <g stroke="url(#cornerGoldGrad)" strokeLinecap="round" strokeLinejoin="round" filter="url(#cornerSoftGlow)">
        {/* Outer Notched Bracket */}
        <path d="M 3,64 L 3,24 C 3,14 6,10 10,6 C 14,3 24,3 64,3" strokeWidth="1.8" />
        {/* Stepped / Scalloped Inner Return */}
        <path d="M 3,20 C 8,20 12,18 16,14 C 18,10 20,8 20,3" strokeWidth="1.2" opacity="0.9" />
        {/* Secondary Hairline Inset Border */}
        <path d="M 7,54 L 7,26 C 7,20 10,16 16,10 C 20,7 26,7 54,7" strokeWidth="0.9" opacity="0.7" />
        {/* Diagonal Lotus Finial pointing to corner */}
        <path d="M 32,32 L 18,18" strokeWidth="1.5" />
        <path d="M 18,18 C 15,12 12,15 18,18 Z" fill="#f6e27a" fillOpacity="0.6" strokeWidth="1" />
        {/* Lotus Heart */}
        <path d="M 24,24 C 21,21 21,17 25,17 C 29,21 29,25 24,24 Z" fill="#f6e27a" fillOpacity="0.4" strokeWidth="0.9" />
        {/* Top Horizontal Tendril */}
        <path d="M 22,10 C 28,12 36,9 44,12 C 50,14 56,10 60,6" strokeWidth="1.1" />
        <path d="M 36,9 C 40,6 44,7 42,11" strokeWidth="0.9" />
        <path d="M 28,6 C 32,3 36,5 34,8" strokeWidth="0.8" />
        {/* Left Vertical Tendril */}
        <path d="M 10,22 C 12,28 9,36 12,44 C 14,50 10,56 6,60" strokeWidth="1.1" />
        <path d="M 9,36 C 6,40 7,44 11,42" strokeWidth="0.9" />
        <path d="M 6,28 C 3,32 5,36 8,34" strokeWidth="0.8" />
        {/* Inner Tendril Curl Loop */}
        <path d="M 17,26 C 22,30 28,30 32,26 C 32,20 28,16 26,17" strokeWidth="0.9" />
        <path d="M 26,17 C 30,22 30,28 26,32 C 20,32 16,28 17,26" strokeWidth="0.9" />
        {/* Tiny Luminous Pearls */}
        <circle cx="3" cy="24" r="1.2" fill="#fff2a8" stroke="none" />
        <circle cx="24" cy="3" r="1.2" fill="#fff2a8" stroke="none" />
        <circle cx="10" cy="10" r="1.2" fill="#fff2a8" stroke="none" />
        <circle cx="32" cy="32" r="1.4" fill="#fff2a8" stroke="none" />
        <circle cx="60" cy="6" r="1" fill="#fff2a8" stroke="none" />
        <circle cx="6" cy="60" r="1" fill="#fff2a8" stroke="none" />
      </g>
    </svg>
  );
}

export default function Navbar({ offsetTop = false }: { offsetTop?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle double-click (or two quick taps) on logo to preview
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (clickTimeoutRef.current) {
      // Second click within 280ms threshold -> Open preview modal
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setShowLogoModal(true);
    } else {
      // First click -> wait to verify if second click arrives
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        if (pathname === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          router.push("/");
        }
      }, 280);
    }
  };

  const handleLogoDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    setShowLogoModal(true);
  };

  // Keyboard escape & body scroll lock when modal is open
  useEffect(() => {
    if (showLogoModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setShowLogoModal(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [showLogoModal]);

  // Listen to open-logo-modal custom event
  useEffect(() => {
    const handleOpenModal = () => setShowLogoModal(true);
    window.addEventListener("open-logo-modal", handleOpenModal);
    return () => {
      window.removeEventListener("open-logo-modal", handleOpenModal);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Check if user previously explicitly muted
    const storedMuted = typeof window !== "undefined" ? localStorage.getItem("astro_music_user_muted") : null;
    const isExplicitlyMuted = storedMuted === "true";

    if (!audioRef.current && typeof window !== "undefined") {
      const audio = new Audio("/audio/ohm.mp3");
      audio.loop = true;
      audio.volume = 0.2;
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);

      if (!isExplicitlyMuted) {
        // Attempt autoplay as browser allows
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              // Autoplay policy prevented unmuted audio on load.
              // Start playing smoothly on the user's first interaction anywhere on the site.
              setIsPlaying(false);
              const startOnInteraction = () => {
                if (localStorage.getItem("astro_music_user_muted") !== "true") {
                  audio.play().then(() => setIsPlaying(true)).catch(() => { });
                }
                window.removeEventListener("pointerdown", startOnInteraction);
                window.removeEventListener("keydown", startOnInteraction);
                window.removeEventListener("touchstart", startOnInteraction);
              };
              window.addEventListener("pointerdown", startOnInteraction, { once: true });
              window.addEventListener("keydown", startOnInteraction, { once: true });
              window.addEventListener("touchstart", startOnInteraction, { once: true });
            });
        }
      }
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current && typeof window !== "undefined") {
      const audio = new Audio("/audio/ohm.mp3");
      audio.loop = true;
      audio.volume = 0.2;
      audioRef.current = audio;
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      localStorage.setItem("astro_music_user_muted", "true");
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((err) => console.log("Audio play error:", err));
      localStorage.setItem("astro_music_user_muted", "false");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services", hasDropdown: true },
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
      className={`fixed ${offsetTop ? "top-[calc(var(--pinned-bar-h)-1px)]" : "top-0"} left-0 right-0 z-50 transition-all duration-300 ${isTransparent
        ? "bg-transparent border-b border-transparent shadow-none"
        : "bg-[#240409]/95 backdrop-blur-md border-b border-[#c59b27]/30 shadow-lg"
        }`}
    >
      <div className="site-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            onClick={handleLogoClick}
            onDoubleClick={handleLogoDoubleClick}
            title="Click to go Home · Double-click to preview Sacred Logo"
            className="flex items-center gap-3 sm:gap-3.5 group cursor-pointer select-none"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[#d4af37] bg-[#240409] shadow-[0_0_15px_rgba(212,175,55,0.45)] transition-all group-hover:scale-105 group-hover:border-[#f6e27a] group-hover:shadow-[0_0_20px_rgba(246,226,122,0.6)] active:scale-95 md:h-11 md:w-11 lg:h-14 lg:w-14">
              <Image
                src="/images/logo.png"
                alt="Talk Astrologer Sacred Zodiac Logo"
                fill
                priority
                sizes="(max-width: 768px) 48px, 56px"
                className="object-cover object-center pointer-events-none"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-wide text-[#fcf9f2] drop-shadow-sm transition-colors group-hover:text-[#f6e27a] md:text-base lg:text-xl">
                Talk Astrologer
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#d4af37] md:text-[9px] md:tracking-[0.12em] lg:text-[11px] lg:tracking-[0.25em]">
                Answers Through Astrology
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 xl:gap-3">
            {navLinks.map((link) => {
              if (link.hasDropdown) {
                const isServicesActive = pathname.startsWith("/services");
                return (
                  <div
                    key={link.name}
                    ref={servicesDropdownRef}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setServicesOpen((prev) => !prev)}
                      className={`relative inline-flex items-center gap-1.5 whitespace-nowrap px-2 py-2 text-[13px] font-medium tracking-wide transition-all duration-200 lg:px-3 lg:text-sm cursor-pointer ${isServicesActive
                        ? "font-semibold text-[#f6e27a]"
                        : "text-[#ebd9c8] hover:text-[#f6e27a]"
                        }`}
                      aria-expanded={servicesOpen}
                      aria-haspopup="true"
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#d4af37] transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""
                          }`}
                      />
                      {isServicesActive && (
                        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#f6e27a] to-transparent lg:left-3 lg:right-3" />
                      )}
                    </button>

                    {/* 3-Column Mega Dropdown matching the uploaded design */}
                    {servicesOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                        {/* Dropdown Container Wrapper */}
                        <div className="relative">
                          {/* Top Ornate Temple Gable / Arrow with Filigree and Finial */}
                          <div className="absolute -top-[19px] left-1/2 -translate-x-1/2 w-[140px] h-[22px] pointer-events-none z-30">
                            <svg
                              viewBox="0 0 140 22"
                              className="w-full h-full overflow-visible"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <defs>
                                <linearGradient id="pedimentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#f6e27a" stopOpacity="0" />
                                  <stop offset="25%" stopColor="#f6e27a" stopOpacity="0.5" />
                                  <stop offset="50%" stopColor="#fff3a8" stopOpacity="0.95" />
                                  <stop offset="75%" stopColor="#f6e27a" stopOpacity="0.5" />
                                  <stop offset="100%" stopColor="#f6e27a" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="pedimentGold" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#c59b27" />
                                  <stop offset="25%" stopColor="#e5c158" />
                                  <stop offset="50%" stopColor="#fff1a4" />
                                  <stop offset="75%" stopColor="#e5c158" />
                                  <stop offset="100%" stopColor="#c59b27" />
                                </linearGradient>
                                <filter id="pedimentDropGlow" x="-20%" y="-20%" width="140%" height="140%">
                                  <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#f6e27a" floodOpacity="0.6" />
                                </filter>
                              </defs>

                              {/* Glowing accent line directly under 'Services' */}
                              <line
                                x1="22"
                                y1="1"
                                x2="118"
                                y2="1"
                                stroke="url(#pedimentGlow)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                filter="url(#pedimentDropGlow)"
                              />

                              {/* Seamless dark fill behind arrow to cover container top border */}
                              <path
                                d="M 0,20 L 24,20 L 70,5 L 116,20 L 140,20 L 140,24 L 0,24 Z"
                                fill="#240409"
                              />

                              {/* The Gold Arrow / Pediment Ridge */}
                              <path
                                d="M 0,20 L 24,20 L 70,5 L 116,20 L 140,20"
                                fill="none"
                                stroke="url(#pedimentGold)"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                              />

                              {/* Apex Finial Diamond Point */}
                              <polygon
                                points="70,1 73,5 70,9 67,5"
                                fill="#fff0a0"
                                filter="url(#pedimentDropGlow)"
                              />

                              {/* Filigree Ornament inside arrow */}
                              <path
                                d="M 70,9 C 67.5,12 66,14.5 67.5,16.5 C 68.5,17.5 71.5,17.5 72.5,16.5 C 74,14.5 72.5,12 70,9 Z"
                                fill="#f6e27a"
                                opacity="0.95"
                              />
                              <path
                                d="M 70,10.5 C 69,12.5 69,14 70,15.2 C 71,14 71,12.5 70,10.5 Z"
                                fill="#240409"
                              />
                              <path
                                d="M 67.5,15.5 C 64,14.5 60.5,16 56,18.5 C 60,19 64.5,17.8 67,16.8"
                                fill="none"
                                stroke="#e5c158"
                                strokeWidth="1.1"
                                strokeLinecap="round"
                              />
                              <path
                                d="M 72.5,15.5 C 76,14.5 79.5,16 84,18.5 C 80,19 75.5,17.8 73,16.8"
                                fill="none"
                                stroke="#e5c158"
                                strokeWidth="1.1"
                                strokeLinecap="round"
                              />
                              <path
                                d="M 65,17 C 59,17.5 53,19 46,20"
                                fill="none"
                                stroke="#c59b27"
                                strokeWidth="0.9"
                                strokeLinecap="round"
                              />
                              <path
                                d="M 75,17 C 81,17.5 87,19 94,20"
                                fill="none"
                                stroke="#c59b27"
                                strokeWidth="0.9"
                                strokeLinecap="round"
                              />
                              <circle cx="59" cy="16.5" r="0.8" fill="#f6e27a" />
                              <circle cx="81" cy="16.5" r="0.8" fill="#f6e27a" />
                            </svg>
                          </div>

                          {/* Main Container Box with Rich Gold Outline & 4 Identical Ornate Corners */}
                          <div className="w-[min(980px,calc(100vw-1.5rem))] bg-[#240409]/98 backdrop-blur-xl border border-[#c59b27] rounded-[24px] p-4 sm:p-5 lg:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(212,175,55,0.22)] ring-1 ring-[#f6e27a]/25 relative overflow-hidden">
                            {/* Sacred Moon Phases Background Layer (Angled & Tilted) */}
                            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
                              <div className="relative w-[130%] h-[160%] -rotate-[16deg] opacity-20 brightness-110 contrast-125 sepia-[0.35] pointer-events-none">
                                <Image
                                  src="/images/moon phases.png"
                                  alt="Sacred Moon Phases"
                                  fill
                                  loading="lazy"
                                  decoding="async"
                                  className="object-contain object-center"
                                />
                              </div>
                            </div>

                            {/* Inner Hairline Frame for Layered Luxury Outline */}
                            <div className="absolute inset-[6px] border border-[#c59b27]/30 rounded-[18px] pointer-events-none z-10" />

                            {/* 4 Identical Ornate Filigree Corners */}
                            <CornerFiligree className="top-1.5 left-1.5" />
                            <CornerFiligree className="top-1.5 right-1.5 -scale-x-100" />
                            <CornerFiligree className="bottom-1.5 left-1.5 -scale-y-100" />
                            <CornerFiligree className="bottom-1.5 right-1.5 -scale-100" />

                            {/* 3-Column Services Grid */}
                            <div className="relative grid grid-cols-3 gap-x-4 gap-y-1 z-20 px-2 py-1">
                              {/* Vertical Divider 1 (between Col 1 & 2) */}
                              <div className="absolute top-1 bottom-1 left-[33.33%] -translate-x-1/2 pointer-events-none flex flex-col items-center justify-center">
                                <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#c59b27]/35 to-transparent" />
                                <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#240409] border border-[#c59b27]/70 flex items-center justify-center shadow-sm">
                                  <span className="text-xs sm:text-sm text-[#f6e27a] font-bold leading-none">✦</span>
                                </div>
                              </div>

                              {/* Vertical Divider 2 (between Col 2 & 3) */}
                              <div className="absolute top-1 bottom-1 left-[66.66%] -translate-x-1/2 pointer-events-none flex flex-col items-center justify-center">
                                <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#c59b27]/35 to-transparent" />
                                <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#240409] border border-[#c59b27]/70 flex items-center justify-center shadow-sm">
                                  <span className="text-xs sm:text-sm text-[#f6e27a] font-bold leading-none">✦</span>
                                </div>
                              </div>

                              {/* Column 1 */}
                              <div className="space-y-1 pr-1.5">
                                {navbarServicesColumns.column1.map((item) => (
                                  <Link
                                    key={item.id}
                                    href={`/services/${item.id}`}
                                    onClick={() => setServicesOpen(false)}
                                    className="group/item flex items-center justify-between px-3 py-1.5 rounded-xl text-xs lg:text-[13px] text-[#f5ebd9] hover:text-[#f6e27a] hover:bg-[#3d0a14] border border-transparent hover:border-[#c59b27]/40 transition-all"
                                  >
                                    <div className="flex items-center gap-2.5 truncate">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27] group-hover/item:scale-125 group-hover/item:bg-[#f6e27a] transition-all shrink-0" />
                                      <span className="font-medium truncate">{item.title}</span>
                                    </div>
                                    <span className="text-[#c59b27]/50 group-hover/item:text-[#f6e27a] group-hover/item:translate-x-0.5 transition-all text-xs">
                                      ›
                                    </span>
                                  </Link>
                                ))}
                              </div>

                              {/* Column 2 */}
                              <div className="space-y-1 px-1.5">
                                {navbarServicesColumns.column2.map((item) => (
                                  <Link
                                    key={item.id}
                                    href={`/services/${item.id}`}
                                    onClick={() => setServicesOpen(false)}
                                    className="group/item flex items-center justify-between px-3 py-1.5 rounded-xl text-xs lg:text-[13px] text-[#f5ebd9] hover:text-[#f6e27a] hover:bg-[#3d0a14] border border-transparent hover:border-[#c59b27]/40 transition-all"
                                  >
                                    <div className="flex items-center gap-2.5 truncate">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27] group-hover/item:scale-125 group-hover/item:bg-[#f6e27a] transition-all shrink-0" />
                                      <span className="font-medium truncate">{item.title}</span>
                                    </div>
                                    <span className="text-[#c59b27]/50 group-hover/item:text-[#f6e27a] group-hover/item:translate-x-0.5 transition-all text-xs">
                                      ›
                                    </span>
                                  </Link>
                                ))}
                              </div>

                              {/* Column 3 */}
                              <div className="space-y-1 pl-1.5">
                                {navbarServicesColumns.column3.map((item) => (
                                  <Link
                                    key={item.id}
                                    href={`/services/${item.id}`}
                                    onClick={() => setServicesOpen(false)}
                                    className="group/item flex items-center justify-between px-3 py-1.5 rounded-xl text-xs lg:text-[13px] text-[#f5ebd9] hover:text-[#f6e27a] hover:bg-[#3d0a14] border border-transparent hover:border-[#c59b27]/40 transition-all"
                                  >
                                    <div className="flex items-center gap-2.5 truncate">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27] group-hover/item:scale-125 group-hover/item:bg-[#f6e27a] transition-all shrink-0" />
                                      <span className="font-medium truncate">{item.title}</span>
                                    </div>
                                    <span className="text-[#c59b27]/50 group-hover/item:text-[#f6e27a] group-hover/item:translate-x-0.5 transition-all text-xs">
                                      ›
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Dropdown Footer CTA */}
                            <div className="mt-3.5 pt-2.5 border-t border-[#c59b27]/25 flex items-center justify-between px-2 text-xs relative z-20">
                              {/* <span className="text-[#f5ebd9]/70 italic flex items-center gap-1.5 text-[11px] sm:text-xs">
                                <Sparkles className="w-3.5 h-3.5 text-[#f6e27a]" />
                                Ancestral Vedic Consultations in Frisco, TX & Worldwide
                              </span> */}
                              <Link
                                href="/services"
                                onClick={() => setServicesOpen(false)}
                                className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa8014] text-[#240409] font-serif font-bold text-[11px] sm:text-xs hover:brightness-110 shadow-xs transition-all flex items-center gap-1 mx-auto"
                              >
                                <span>View All Services</span>
                                <span>→</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative whitespace-nowrap px-2 py-2 text-[13px] font-medium tracking-wide transition-all duration-200 lg:px-3 lg:text-sm ${isActive
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

          {/* Desktop/Tablet Call & Sacred Mantra CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Sacred Mantra Audio Player Button */}
            <button
              type="button"
              onClick={toggleMusic}
              className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-full border transition-all duration-300 text-xs font-medium cursor-pointer ${isPlaying
                ? "border-[#c59b27] bg-gradient-to-r from-[#3a0812] to-[#4a0d18] text-[#f6e27a] shadow-[0_0_15px_rgba(212,175,55,0.35)]"
                : "border-[#c59b27]/40 bg-[#240409]/80 text-[#ebd9c8]/70 hover:border-[#c59b27] hover:text-[#f6e27a]"
                }`}
              aria-label={isPlaying ? "om Chanting" : "om Chanting"}
              title={isPlaying ? "om Chanting" : "om Chanting"}
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#f6e27a] animate-pulse" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#f6e27a] hidden lg:inline">
                    om Chanting
                  </span>
                  {/* Animated Equalizer Sound Bars */}
                  <span className="flex items-end gap-[2px] h-3 pb-0.5" aria-hidden="true">
                    <span className="w-[2px] bg-[#f6e27a] animate-[pulse_0.7s_ease-in-out_infinite] h-2 rounded-full" />
                    <span className="w-[2px] bg-[#f6e27a] animate-[pulse_0.5s_ease-in-out_infinite_0.15s] h-3 rounded-full" />
                    <span className="w-[2px] bg-[#f6e27a] animate-[pulse_0.8s_ease-in-out_infinite_0.3s] h-1.5 rounded-full" />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#ebd9c8]/70" />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#ebd9c8]/70 hidden lg:inline">
                    Mantra Muted
                  </span>
                </>
              )}
            </button>

            <a
              href="tel:+12146699699"
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-[#c59b27]/60 bg-gradient-to-r from-[#3a0812] to-[#4a0d18] text-[#f6e27a] hover:text-white hover:border-[#f6e27a] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300 text-sm font-medium"
            >
              <div className="w-6 h-6 rounded-full bg-[#c59b27]/20 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-[#f6e27a]" />
              </div>
              <span className="tracking-wider">+1 214 669 9699</span>
            </a>
          </div>

          {/* Mobile menu button and audio toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleMusic}
              className={`p-2 rounded-full border transition-all ${isPlaying
                ? "text-[#f6e27a] bg-[#3a0812] border-[#c59b27] shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                : "text-[#ebd9c8]/70 bg-[#240409] border-[#c59b27]/40"
                }`}
              aria-label={isPlaying ? "om Chanting" : "om Chanting"}
              title={isPlaying ? "om Chanting" : "om Chanting"}
            >
              {isPlaying ? (
                <Volume2 className="w-4 h-4 text-[#f6e27a] animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#ebd9c8]/70" />
              )}
            </button>

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
        <div className="md:hidden bg-[#240409] border-b border-[#c59b27]/40 px-4 pt-2 pb-6 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {navLinks.map((link) => {
            if (link.hasDropdown) {
              const isServicesActive = pathname.startsWith("/services");
              return (
                <div key={link.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex-1 px-3 py-2.5 rounded-md text-base font-medium ${isServicesActive
                        ? "bg-[#3d0a14] text-[#f6e27a] font-semibold border-l-4 border-[#c59b27]"
                        : "text-[#f0e4d7] hover:bg-[#32060e]"
                        }`}
                    >
                      {link.name}
                    </Link>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="p-2 text-[#d4af37] hover:text-[#f6e27a]"
                      aria-label="Expand services"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                  </div>
                  {mobileServicesOpen && (
                    <div className="relative my-2.5 overflow-hidden rounded-[22px] border border-[#c59b27] bg-[#240409]/98 p-3 sm:p-5 shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(212,175,55,0.22)] ring-1 ring-[#f6e27a]/25">
                      {/* Sacred Moon Phases Background Layer (Angled & Tilted) */}
                      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                        <div className="relative h-[180%] w-[150%] -rotate-[16deg] opacity-20 brightness-110 contrast-125 sepia-[0.35] pointer-events-none">
                          <Image
                            src="/images/moon phases.png"
                            alt="Sacred Moon Phases"
                            fill
                            loading="lazy"
                            decoding="async"
                            className="object-contain object-center"
                          />
                        </div>
                      </div>

                      {/* Inner Hairline Frame for Layered Luxury Outline */}
                      <div className="pointer-events-none absolute inset-[5px] z-10 rounded-[17px] border border-[#c59b27]/30" />

                      {/* 4 Identical Ornate Filigree Corners */}
                      <CornerFiligree className="top-1 left-1 !w-8 !h-8 sm:!w-10 sm:!h-10" />
                      <CornerFiligree className="top-1 right-1 !w-8 !h-8 sm:!w-10 sm:!h-10 -scale-x-100" />
                      <CornerFiligree className="bottom-1 left-1 !w-8 !h-8 sm:!w-10 sm:!h-10 -scale-y-100" />
                      <CornerFiligree className="bottom-1 right-1 !w-8 !h-8 sm:!w-10 sm:!h-10 -scale-100" />

                      {/* Card Header Banner with Celestial Sparkles */}
                      <div className="relative z-20 flex items-center justify-center gap-2 pb-2 mb-2.5 border-b border-[#c59b27]/25 text-center">
                        <Sparkles className="w-3.5 h-3.5 text-[#f6e27a]" />
                        <span className="font-serif text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#f6e27a]">
                          Sacred Vedic Consultations
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-[#f6e27a]" />
                      </div>

                      {/* Responsive Services Grid: 1 col on small phones, 2 cols on mobile/tablet */}
                      <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5 px-0.5 sm:px-1">
                        {[
                          ...navbarServicesColumns.column1,
                          ...navbarServicesColumns.column2,
                          ...navbarServicesColumns.column3,
                        ].map((item) => (
                          <Link
                            key={item.id}
                            href={`/services/${item.id}`}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileServicesOpen(false);
                            }}
                            className="group/item flex items-center justify-between rounded-xl border border-transparent px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-[13px] text-[#f5ebd9] transition-all hover:border-[#c59b27]/40 hover:bg-[#3d0a14] hover:text-[#f6e27a]"
                          >
                            <div className="flex items-center gap-2 min-w-0 truncate">
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c59b27] transition-all group-hover/item:bg-[#f6e27a] group-hover/item:scale-125" />
                              <span className="truncate font-medium">{item.title}</span>
                            </div>
                            <span className="text-xs text-[#c59b27]/50 transition-all group-hover/item:translate-x-0.5 group-hover/item:text-[#f6e27a]">
                              ›
                            </span>
                          </Link>
                        ))}
                      </div>

                      {/* Dropdown Card Footer CTA */}
                      <div className="relative z-20 mt-3 pt-2.5 border-t border-[#c59b27]/25 flex items-center justify-center">
                        <Link
                          href="/services"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileServicesOpen(false);
                          }}
                          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa8014] px-4 py-1.5 font-serif text-xs font-bold text-[#240409] shadow-xs transition-all hover:brightness-110"
                        >
                          <span>View All Services</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-base font-medium ${pathname === link.href
                  ? "bg-[#3d0a14] text-[#f6e27a] font-semibold border-l-4 border-[#c59b27]"
                  : "text-[#f0e4d7] hover:bg-[#32060e]"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
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

      {/* Sacred Logo Preview Modal (Triggered on Double-Click) */}
      {showLogoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Talk Astrologer Logo Preview"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setShowLogoModal(false)}
        >
          <div
            className="relative w-full max-w-md sm:max-w-lg rounded-3xl bg-gradient-to-b from-[#2d050d] via-[#1c0307] to-[#120104] border-2 border-[#d4af37]/70 p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(212,175,55,0.35)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ornate corner filigrees */}
            <CornerFiligree className="top-1 left-1" />
            <CornerFiligree className="top-1 right-1 -scale-x-100" />
            <CornerFiligree className="bottom-1 left-1 -scale-y-100" />
            <CornerFiligree className="bottom-1 right-1 -scale-x-100 -scale-y-100" />

            {/* Glowing backdrop halo */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)]" />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowLogoModal(false)}
              className="absolute top-4 right-4 z-30 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#3d0811]/90 border border-[#d4af37]/60 text-[#f6e27a] hover:bg-[#d4af37] hover:text-[#240409] hover:scale-105 transition-all shadow-md cursor-pointer"
              aria-label="Close Logo Preview"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3b0811] border border-[#d4af37]/50 text-[#f6e27a] text-xs font-semibold tracking-wider uppercase mb-5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#f6e27a]" />
                <span>Sacred Brand Emblem</span>
              </div>

              {/* High-Resolution Emblem Container */}
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full border-4 border-[#d4af37] bg-[#240409] shadow-[0_0_35px_rgba(212,175,55,0.55)] p-2 my-2 transition-transform hover:scale-105 duration-300">
                <div className="relative w-full h-full rounded-full overflow-hidden border border-[#f6e27a]/40 bg-[#170205]">
                  <Image
                    src="/images/logo.png"
                    alt="Talk Astrologer High Resolution Sacred Emblem"
                    fill
                    priority
                    sizes="(max-width: 640px) 240px, 280px"
                    className="object-cover object-center"
                  />
                </div>
              </div>

              {/* Brand Typography */}
              <h3 className="mt-5 font-serif text-2xl sm:text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#fff4b8] via-[#e8c85c] to-[#c59b27] drop-shadow-sm">
                Talk Astrologer
              </h3>
              <p className="mt-1 text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#d4af37] uppercase">
                Answers Through Astrology
              </p>

              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent my-4" />

              <p className="text-xs sm:text-sm text-[#ebd9c8]/90 max-w-sm leading-relaxed">
                Revered six-generation Jyotish emblem embodying celestial planetary alignment, divine peace, and auspicious cosmic wisdom.
              </p>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/images/logo.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa8014] text-[#240409] font-bold text-xs tracking-wider uppercase shadow-md hover:brightness-110 transition-all cursor-pointer"
                >
                  Open Full Image ↗
                </a>
                <button
                  type="button"
                  onClick={() => setShowLogoModal(false)}
                  className="px-5 py-2 rounded-full border border-[#d4af37]/60 bg-[#240409] text-[#f6e27a] font-semibold text-xs tracking-wider uppercase hover:bg-[#3d0811] transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>

              <p className="mt-4 text-[10px] text-[#d4af37]/70 italic">
                Tip: Double-click the logo anytime to preview this emblem.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
