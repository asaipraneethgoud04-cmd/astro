"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, ArrowRight, Phone, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { servicesData, serviceCategories, type ServiceItem } from "@/data/services";
import ImageToneCard from "@/components/ui/ImageToneCard";

const ITEMS_PER_PAGE = 12;

function ServiceCardItem({ service }: { service: ServiceItem }) {
  return (
    <ImageToneCard
      id={service.id}
      className="scroll-mt-24"
      imageUrl={service.imageUrl}
      imageAlt={service.title}
      title={service.title}
      description={service.description}
      meta={service.category}
      href={`/book-appointment?service=${service.id}`}
      ctaLabel="Book Appointment"
      iconName={service.iconName}
    />
  );
}

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Read page from URL query string — defaults to 1
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const categories = serviceCategories;

  // Helper: update the ?page= query param without a full navigation
  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const changeSearch = (value: string) => {
    setSearchTerm(value);
    if (currentPage !== 1) setPage(1);
  };

  const changeCategory = (category: string) => {
    setSelectedCategory(category);
    if (currentPage !== 1) setPage(1);
  };

  const filteredServices = useMemo(() => {
    return servicesData.filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedServices = useMemo(() => {
    return filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredServices, startIndex]);

  const handlePageChange = (page: number) => {
    setPage(page);
    const gridEl = document.getElementById("services-grid");
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfaf4] text-[#2a1114]">
      {/* ─────────────────────────────────────────────────────────────
          1. PAGE HEADER (Strictly matching screenshot)
      ───────────────────────────────────────────────────────────── */}
      <section className="page-top header-gap text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#38070e] tracking-tight">
          Our Sacred Services
        </h1>
        <p className="text-sm sm:text-base text-[#614b4f] leading-relaxed max-w-2xl mx-auto font-normal">
          Astrology & Spiritual Services — traditional guidance for relationships,
          career, family, and personal questions.
        </p>

        {/* Divider Dot / Diamond */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="w-12 h-px bg-[#c59b27]/40" />
          <span className="text-[#c59b27] text-xs">◆</span>
          <span className="w-12 h-px bg-[#c59b27]/40" />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. SEARCH & FILTER CONTROLS
      ───────────────────────────────────────────────────────────── */}
      <section className="site-container space-y-4 header-gap">
        {/* Search Bar Input strictly matching screenshot */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8b1827]">
            <Search className="w-4 h-4 text-[#8b1827]" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => changeSearch(e.target.value)}
            placeholder="Search Service Name..."
            className="w-full pl-11 pr-4 py-3 rounded-full border border-[#ebd6b4] bg-[#fbf5e8] text-sm text-[#38070e] placeholder-[#8c7478] focus:outline-none focus:ring-2 focus:ring-[#8b1827] focus:bg-white shadow-sm transition-all"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => changeCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${selectedCategory === cat
                ? "bg-[#38070e] text-[#f6e27a] font-semibold shadow-sm"
                : "bg-[#fbf5e8] text-[#5c474b] border border-[#ebd6b4] hover:border-[#8b1827]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SERVICE CARDS GRID
      ───────────────────────────────────────────────────────────── */}
      <section id="services-grid" className="site-container scroll-mt-28 section-b">
        {filteredServices.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-x-2.5 grid-rows-gap sm:gap-x-4 lg:grid-cols-3 lg:gap-x-6">
              {paginatedServices.map((service) => (
                <ServiceCardItem key={service.id} service={service} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 ? (
              <div className="content-gap flex flex-col items-center justify-center gap-4">
                <nav
                  aria-label="Services pagination"
                  className="inline-flex items-center gap-2 rounded-full border border-[#ebd6b4] bg-[#fbf5e8] p-1.5 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-semibold text-[#38070e] transition-all hover:bg-[#38070e] hover:text-[#f6e27a] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#38070e] cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const isActive = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer ${isActive
                            ? "bg-[#38070e] text-[#f6e27a] shadow-md border border-[#c59b27]"
                            : "text-[#5c474b] hover:bg-[#f3e7d0] hover:text-[#38070e]"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-semibold text-[#38070e] transition-all hover:bg-[#38070e] hover:text-[#f6e27a] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#38070e] cursor-pointer"
                    aria-label="Next Page"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>

                <p className="text-xs font-medium text-[#7a585f]">
                  Showing <span className="font-bold text-[#38070e]">{startIndex + 1}</span>–
                  <span className="font-bold text-[#38070e]">
                    {Math.min(startIndex + ITEMS_PER_PAGE, filteredServices.length)}
                  </span>{" "}
                  of <span className="font-bold text-[#38070e]">{filteredServices.length}</span> sacred services
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center py-16 bg-[#fbf5e8] rounded-2xl border border-[#ebd6b4] p-8 space-y-4">
            <p className="text-base text-[#5c474b]">
              No service found matching &ldquo;{searchTerm}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setPage(1);
              }}
              className="px-6 py-2.5 rounded-full bg-[#38070e] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. BEGIN YOUR JOURNEY TO CLARITY (CTA Banner matching screenshot)
      ───────────────────────────────────────────────────────────── */}
      <section className="page-bottom bg-[#fdfaf4]">
        <div className="site-container">
          <div className="rounded-2xl bg-[#2d1814] py-12 px-6 sm:px-12 text-center text-white shadow-xl space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#fdfaf4]">
              Begin Your Journey to Clarity
            </h2>

            {/* 3 Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/book-appointment"
                className="px-6 py-3 rounded-full bg-[#fdfaf4] hover:bg-[#f6e27a] text-[#2d1814] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md"
              >
                Book Appointment
              </Link>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/60 hover:border-white text-white hover:bg-white/10 text-xs sm:text-sm tracking-wider uppercase transition-all"
              >
                <Phone className="w-4 h-4 text-[#f6e27a]" />
                Call Now
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
